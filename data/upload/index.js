require('dotenv').config()
const csvToDict = require('../lib/csv-to-dict')
const csvToElastic = require('../lib/csv-to-elastic')
const log = require('../lib/logger')
const { createIndex } = require('../lib/elastic')
const postcodeDocParser = require('./postcode-doc-parser')
const postcodeMappings = require('./postcode-mappings')

const NUM_POSTCODES_ESTIMATE = 2636604

async function esIndex() {
  try {
    await createIndex({
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
      settings: {},
      mappings: postcodeMappings,
    })
    const lsoas = await csvToDict({
      filePath: process.env.NSPL_LSOAS_CSV,
      keyColumn: 'LSOA11CD',
      valueColumn: 'LSOA11NM',
    })
    await csvToElastic({
      filePath: process.env.NSPL_POSTCODES_CSV,
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
      batchSize: process.env.ELASTIC_BULK_BATCH_SIZE,
      docParser: postcodeDocParser(lsoas),
      numRowsEstimate: NUM_POSTCODES_ESTIMATE,
    })
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

esIndex()
