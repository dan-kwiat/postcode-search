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
    const ccgs = await csvToDict({
      filePath: process.env.NSPL_CCGS_CSV,
      keyColumn: 'CCG19CD',
      valueColumn: 'CCG19NM',
    })
    const lsoas = await csvToDict({
      filePath: process.env.NSPL_LSOAS_CSV,
      keyColumn: 'LSOA11CD',
      valueColumn: 'LSOA11NM',
    })
    const msoas = await csvToDict({
      filePath: process.env.NSPL_MSOAS_CSV,
      keyColumn: 'MSOA11CD',
      valueColumn: 'MSOA11NM',
    })
    const wards = await csvToDict({
      filePath: process.env.NSPL_WARDS_CSV,
      keyColumn: 'WD19CD',
      valueColumn: 'WD19NM',
    })
    await csvToElastic({
      filePath: process.env.NSPL_POSTCODES_CSV,
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
      batchSize: process.env.ELASTIC_BULK_BATCH_SIZE,
      docParser: postcodeDocParser({ ccgs, lsoas, msoas, wards }),
      numRowsEstimate: NUM_POSTCODES_ESTIMATE,
    })
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

esIndex()
