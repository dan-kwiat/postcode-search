require('dotenv').config()
const streamCsv = require('../lib/csv-stream')
const log = require('../lib/logger')
const getProgressBar = require('../lib/progress')
const { bulkIndex, createIndex } = require('../lib/elastic')
const postcodeDocParser = require('./postcode-doc-parser')
const postcodeMappings = require('./postcode-mappings')

const NUM_POSTCODES_ESTIMATE = 2636604
const NUM_LSOAS_ESTIMATE = 42621

async function csvToElastic({ filePath, batchSize, indexName, docParser }) {
  try {
    const progressBar = getProgressBar('Indexing Documents')
    progressBar.start(NUM_POSTCODES_ESTIMATE, 0)

    if (!filePath) {
      throw new Error('Missing CSV file path')
    }

    if (!batchSize) {
      throw new Error('Missing bulk index batch size')
    }

    const batchHandler = (docs, counter) => {
      progressBar.update(counter)
      return bulkIndex({ indexName, docs, docParser })
    }

    const totalCount = await streamCsv({ filePath, batchSize, batchHandler })

    progressBar.update(totalCount)
    progressBar.stop()
    log.info(`Successfully indexed ${totalCount} documents`)
  } catch(e) {
    log.error(`Failed to index documents`)
    throw e
  }
}

async function csvToDict({ filePath, batchSize }) {
  try {
    const progressBar = getProgressBar('CSV to dictionary')
    progressBar.start(NUM_LSOAS_ESTIMATE, 0)

    if (!filePath) {
      throw new Error('Missing CSV file path')
    }

    if (!batchSize) {
      throw new Error('Missing bulk index batch size')
    }

    let lsoas = {}
    const batchHandler = (docs, counter) => {
      progressBar.update(counter)
      docs.forEach((x, index) => {
        lsoas[x['LSOA11CD']] = x['LSOA11NM']
      })
      return Promise.resolve()
    }

    // pausing stream is not necessary but yolo
    const totalCount = await streamCsv({ filePath, batchSize, batchHandler })

    progressBar.update(totalCount)
    progressBar.stop()
    log.info(`Successfully loaded ${totalCount} rows to dict`)
    return lsoas
  } catch(e) {
    log.error(`Failed to load rows to dict`)
    throw e
  }
}

async function esIndex() {
  try {
    await createIndex({
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
      settings: {},
      mappings: postcodeMappings,
    })
    // const lsoas = await csvToDict({
    //   filePath: process.env.NSPL_LSOAS_CSV,
    //   batchSize: 1000,//process.env.ELASTIC_BULK_BATCH_SIZE,
    // })
    // log.info('values length', Object.values(lsoas).length)
    await csvToElastic({
      filePath: process.env.NSPL_POSTCODES_CSV,
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
      batchSize: process.env.ELASTIC_BULK_BATCH_SIZE,
      docParser: postcodeDocParser,
    })
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

esIndex()
