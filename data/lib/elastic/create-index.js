const log = require('../logger')
const client = require('./client')
const mappings = require('./mappings')

const INDEX_NAME = process.env.ELASTIC_INDEX

async function createIndex() {
  try {
    await client.indices.create({
      index: INDEX_NAME,
      body: {
        settings: {},
        mappings,
      }
    })
    log.info(`Successfully created index '${INDEX_NAME}'`)
  } catch(e) {
    log.error(`Failed to create index '${INDEX_NAME}'`)
    throw e
  }
}

module.exports = createIndex