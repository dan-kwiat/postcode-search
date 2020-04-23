require('dotenv').config()
import { Client } from '@elastic/elasticsearch'
import { graphql, buildSchema } from 'graphql'
import bunyan from 'bunyan'
import schema from '../../lib/schema'

const MAX_QUERY_LENGTH = 10

const {
  ELASTIC_HOST,
  ELASTIC_USERNAME,
  ELASTIC_PASSWORD,
  ELASTIC_INDEX_POSTCODE,
  ELASTIC_INDEX_LOCAL_AUTHORITY,
} = process.env

const client = new Client({
  node: ELASTIC_HOST,
  auth: {
    username: ELASTIC_USERNAME,
    password: ELASTIC_PASSWORD
  }
})

const log = bunyan.createLogger({ name: 'main' })

const parsePrefixQuery = x => {
  return x.trimStart().substring(0, MAX_QUERY_LENGTH).replace(/  +/g, ' ').toUpperCase()
}

const parseMatchQuery = x => {
  return x.trim().substring(0, MAX_QUERY_LENGTH).replace(/[\W_]+/g, '').toUpperCase()
}

const postcode = {
  get: async ({ value }) => {
    if (!ELASTIC_INDEX_POSTCODE) {
      throw 'ELASTIC_INDEX_POSTCODE is undefined'
    }
    const result = await client.search({
      index: ELASTIC_INDEX_POSTCODE,
      from: 0,
      size: 1,
      body: {
        query: {
          term: {
            match_terms: {
              value: parseMatchQuery(value),
            }
          }
        }
      },
    }, {
      ignore: [404],
      maxRetries: 3
    })
    try {
      return result.body.hits.hits[0]._source
    } catch(e) {
      return null // should we return null or throw error?
    }
  },
  suggest: async ({ active, boostGeo, prefix }) => {
    if (!ELASTIC_INDEX_POSTCODE) {
      throw 'ELASTIC_INDEX_POSTCODE is undefined'
    }
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
    const result = await client.search({
      index: ELASTIC_INDEX_POSTCODE,
      from: 0,
      size: 10,
      body: {
        suggest: {
          postcode_suggestion: {
            prefix: parsePrefixQuery(prefix),
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
    const data = result.body.suggest.postcode_suggestion[0].options.map(x => x._source)
    return data
  },
}

const localAuthority = {
  get: async ({ point, precision }) => {
    if (!ELASTIC_INDEX_POSTCODE) {
      throw 'ELASTIC_INDEX_LOCAL_AUTHORITY is undefined'
    }
    if (!point) return null
    let result
    const precisionLower = precision.toLowerCase()
    try {
      result = await client.search({
        index: ELASTIC_INDEX_LOCAL_AUTHORITY,
        from: 0,
        size: 1,
        body: {
          query: {
            bool: {
              must: { match_all: {} },
              filter: {
                geo_shape: {
                  [`${precisionLower}.geoshape`]: {
                    relation: 'intersects',
                    shape: {
                      type: 'point',
                      coordinates: [point.lon, point.lat]
                    }
                  }
                }
              }
            }
          }
        },
      }, {
        ignore: [404],
        maxRetries: 3
      })
    } catch(e) {
      throw `Error querying Elasticsearch: ${e.message}`
    }
    try {
      const doc = result.body.hits.hits[0]._source
      return {
        id: doc.id,
        geoJSON: doc[precisionLower].geojson,
      }
    } catch(e) {
      console.log(e)
      return null // should we return null or throw error?
    }
  }
}

const root = {
  postcode,
  localAuthority,
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  // res.setHeader('Access-Control-Allow-Headers', '*')
  // set Cache-Control header?
  try {
    const response = await graphql(
      buildSchema(schema),
      req.query.query,
      root,
      null,
      JSON.parse(req.query.variables || "{}"),
      req.query.operationName,
    )
    res.end(JSON.stringify(response))
  } catch(e) {
    log.error(e)
    res.statusCode = 400
    res.end(JSON.stringify({ errors: [e.message || 'Failed to search postcodes'] }))
  }
}
