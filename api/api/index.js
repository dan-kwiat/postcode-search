const { graphql, buildSchema } = require('graphql')
const log = require('../lib/logger')
const esClient = require('../lib/elastic-client')

const MAX_QUERY_LENGTH = 10

const parseQuery = x => {
  return x.trimStart().substring(0, MAX_QUERY_LENGTH).replace(/  +/g, ' ').toUpperCase()
}

const schema = buildSchema(`
  input GeoInput {
    lat: Float
    lon: Float
  }
  type Stats {
    imd: Int
  }
  type GeoCoordinates {
    lat: Float
    lon: Float
    easting: Float
    northing: Float
  }
  type GeoCodes {
    osgrdind: String
    usertype: String
    pcd: String
    pcd2: String
    pcds: String
    oa11: String
    cty: String
    ced: String
    laua: String
    ward: String
    hlthau: String
    nhser: String
    ctry: String
    rgn: String
    pcon: String
    eer: String
    teclec: String
    ttwa: String
    pct: String
    nuts: String
    park: String
    lsoa11: String
    msoa11: String
    wz11: String
    ccg: String
    bua11: String
    buasd11: String
    lep1: String
    lep2: String
    pfa: String
    calncv: String
    stp: String
    ru11ind: String
    oac11: String
  }
  type GeoNames {
    ccg: String
    cty: String
    eer: String
    laua: String
    lsoa11: String
    msoa11: String
    ward: String
    ttwa: String
    pcon: String
    ru11ind: String
  }
  type Postcode {
    id: String
    active: Boolean
    stats: Stats,
    coordinates: GeoCoordinates,
    codes: GeoCodes,
    names: GeoNames,
  }
  type PostcodesQuery {
    get(value: String!): Postcode
    suggest(
      active: Boolean = true
      boostGeo: GeoInput
      prefix: String!
    ): [Postcode]
  }
  type Query {
    postcodes: PostcodesQuery
  }
`)

const root = {
  postcodes: {
    get: async ({ value }) => {
      const result = await esClient.search({
        index: process.env.ELASTIC_INDEX,
        from: 0,
        size: 1,
        body: {
          query: {
            term: {
              match_terms: {
                value: value.trim().substring(0, MAX_QUERY_LENGTH).replace(/  +/g, ' ').toUpperCase(),
              }
            }
          }
        },
      }, {
        ignore: [404],
        maxRetries: 3
      })
      try {
        return result.hits.hits[0]._source
      } catch(e) {
        return null // should we return null or throw error?
      }
    },
    suggest: async ({ active, boostGeo, prefix }) => {
      const contexts = {
        status: [active ? 'active' : 'inactive']
      }
      if (boostGeo) {
        contexts.location = {
          ...boostGeo,
          boost: 2,
          precision: 6,
        }
      }
      const suggestionName = 'postcode_suggestion'
      const result = await esClient.search({
        index: process.env.ELASTIC_INDEX,
        from: 0,
        size: 10,
        body: {
          suggest: {
            [suggestionName]: {
              prefix: parseQuery(prefix),
              completion : {
                field : 'suggest',
                size: 10,
                contexts
              },
            },
          },
        },
      }, {
        ignore: [404],
        maxRetries: 3
      })
      const data = result.suggest[suggestionName][0].options.map(x => x._source)
      return data
    },
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // res.setHeader('Access-Control-Allow-Headers', '*')
  // set Cache-Control header?
  try {
    const response = await graphql(
      schema,
      req.query.query,
      root,
      null,
      JSON.parse(req.query.variables || "{}"),
      req.query.operationName,
    )
    res.send(response)
  } catch(e) {
    log.error(e)
    res.send({ errors: [e.message || 'Failed to search postcodes'] })
  }
}
