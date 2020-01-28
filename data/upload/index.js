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
    const lauas = await csvToDict({
      filePath: process.env.NSPL_LAUAS_CSV,
      keyColumn: 'LAD19CD',
      valueColumn: 'LAD19NM',
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
    const ttwas = await csvToDict({
      filePath: process.env.NSPL_TTWAS_CSV,
      keyColumn: 'TTWA11CD',
      valueColumn: 'TTWA11NM',
    })
    const pcons = await csvToDict({
      filePath: process.env.NSPL_PCONS_CSV,
      keyColumn: 'PCON14CD',
      valueColumn: 'PCON14NM',
    })
    const rus = await csvToDict({
      filePath: process.env.NSPL_RUS_CSV,
      keyColumn: 'RU11IND',
      valueColumn: 'RU11NM',
    })
    const ctys = await csvToDict({
      filePath: process.env.NSPL_CTYS_CSV,
      keyColumn: 'CTY10CD',
      valueColumn: 'CTY10NM',
    })
    const eers = await csvToDict({
      filePath: process.env.NSPL_EERS_CSV,
      keyColumn: 'EER10CD',
      valueColumn: 'EER10NM',
    })
    const docParser = postcodeDocParser({
      ccgs,
      ctys,
      eers,
      lauas,
      lsoas,
      msoas,
      pcons,
      rus,
      ttwas,
      wards,
    })
    await csvToElastic({
      docParser,
      batchSize: process.env.ELASTIC_BULK_BATCH_SIZE,
      filePath: process.env.NSPL_POSTCODES_CSV,
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
      numRowsEstimate: NUM_POSTCODES_ESTIMATE,
    })
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

esIndex()
