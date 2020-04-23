require('dotenv').config()
const fs = require('fs')
const log = require('../../lib/logger')
const { client, bulkIndex } = require('../../lib/elastic')
const mappings = require('./mappings')
const settings = require('./settings')
const parse = require('./parse')

const {
  ELASTIC_LAD_INDEX,
  LAD_BUC_GEOJSON,
} = process.env


async function f() {
  try {
    log.info(`Creating index '${ELASTIC_LAD_INDEX}'`)
    await client.indices.create({
      index: ELASTIC_LAD_INDEX,
      body: { mappings, settings }
    })

    log.info(`Parsing docs`)
    const geoJSONString = await fs.promises.readFile(LAD_BUC_GEOJSON, 'utf8')
    const geoJSON = JSON.parse(geoJSONString)
    const docs = geoJSON.features.map(parse)

    const invalidDocs = docs.filter(x => !x || !x.id)
    if (invalidDocs.length > 0) {
      throw 'Parser returned invalid docs'
    }

    log.info(`Indexing ${docs.length} docs`)
    await bulkIndex({
      index: ELASTIC_LAD_INDEX,
      docs: docs,
    })

    log.info(`Finished successfully`)
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

f()
