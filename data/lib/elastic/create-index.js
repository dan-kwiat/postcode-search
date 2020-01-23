const log = require('../logger')
const client = require('./client')
const mappings = require('./mappings')

async function createIndex({ indexName }) {
  try {
    await client.indices.create({
      index: indexName,
      body: {
        settings: {},
        mappings,
      }
    })
    log.info(`Successfully created index '${indexName}'`)
  } catch(e) {
    log.error(`Failed to create index '${indexName}'`)
    throw e
  }
}

module.exports = createIndex