const { graphql, buildSchema } = require('graphql')
const log = require('../lib/logger')
const esClient = require('../lib/elastic-client')

const MAX_QUERY_LENGTH = 10

const parseQuery = x => {
  return x.replace(/  +/g, ' ').toUpperCase().substring(0,MAX_QUERY_LENGTH)
}

const schema = buildSchema(`
  input GeoInput {
    lat: Float
    lon: Float
  }
  type AutocompleteSuggestion {
    id: String
    lsoa11: String
    lsoa11Name: String
  }
  type Query {
    autocomplete(q: String!, boostGeo: GeoInput): [AutocompleteSuggestion]
  }
`)

const root = {
  autocomplete: async ({ q, boostGeo }) => {
    const contexts = {
      status: ['active'],
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
            prefix: parseQuery(q),
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
    const data = result.suggest[suggestionName][0].options.map(x => ({
      id: x._source.pcds,
      lsoa11: x._source.lsoa11,
      lsoa11Name: x._source.lsoa11Name,
    }))

    return data
  },
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    const response = await graphql(
      schema,
      req.query.query,
      root,
      null,
      JSON.parse(req.query.variables || "{}")
    )
    res.send(response)
  } catch(e) {
    log.error(e)
    res.send({ errors: [e.message || 'Failed to search postcodes'] })
  }
}
