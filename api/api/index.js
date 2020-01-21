require('dotenv').config() // only do this if not production?
const esClient = require('../lib/elastic-client')
const log = require('../lib/logger')

// Autocomplete Postcode:
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  let variables
  try {
    variables = JSON.parse(req.query.variables)
  } catch(e) {
    log.error(e)
    return res.send({ errors: [
      `Failed to find valid JSON 'variables' in the query string`
    ]})
  }

  const { q, boostGeo } = variables
  if (!q || typeof q !== 'string') {
    return res.send({ errors: [
      `Failed to find valid query 'q' in the variables object`
    ]})
  }

  try {
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
            prefix : q.replace(/  +/g, ' ').toUpperCase(),
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
    }))
    res.send({ data })
  } catch(e) {
    log.error(e)
    res.send({ errors: [e.message || 'Failed to search postcodes'] })
  }
}
