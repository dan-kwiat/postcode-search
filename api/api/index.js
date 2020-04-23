const { graphql } = require('graphql')
const log = require('../lib/logger')
const esClient = require('../lib/elastic-client')
const schema = require('./schema')

const MAX_QUERY_LENGTH = 10

const parseQuery = x => {
  return x.trimStart().substring(0, MAX_QUERY_LENGTH).replace(/  +/g, ' ').toUpperCase()
}

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
