require('dotenv').config()
const streamCsv = require('./lib/csv-stream')
const log = require('./lib/logger')
const getProgressBar = require('./lib/progress')
const { bulkPromise, createIndex } = require('./lib/elastic')
const { validateLatLon } = require('./lib/geo')

const NUM_DOCS_ESTIMATE = 2636605

function bulkIndexOps ({ indexName, docs }) {
  return docs.reduce((agg, doc) => {
    const _id = doc.pcd
    if (!_id) {
      log.error('Bulk op is missing _id property')
      log.error(doc)
      return agg
    }
    const geo = validateLatLon(doc.lat, doc.long)
    // todo: make suggest an array to give the stripped postcode a lower weight?
    doc.suggest = {
      input: [doc.pcds, doc.pcds.replace(/ /g, '')],
      contexts: {
        status: doc.doterm ? ['inactive'] : ['active'],
        location: !doc.doterm && geo ? [geo] : [],
      },
      weight: 1
    }
    return [
      ...agg,
      {
        index: {
          _id,
          _index: indexName,
          _type: '_doc',
          retry_on_conflict: 2,
        }
      },
      doc,
    ]
  }, [])
}

async function indexDocuments({ filePath, batchSize, indexName }) {
  try {
    const progressBar = getProgressBar('Indexing Documents')
    progressBar.start(NUM_DOCS_ESTIMATE, 0)

    if (!filePath || !batchSize) {
      throw new Error('Missing environment variable')
    }

    const totalCount = await streamCsv(
      filePath,
      batchSize,
      (docs, counter) => {
        progressBar.update(counter)
        const ops = bulkIndexOps({ indexName, docs })
        return bulkPromise(ops)
      }
    )

    progressBar.update(totalCount)
    progressBar.stop()
    log.info(`Successfully indexed ${totalCount} documents`)
  } catch(e) {
    log.error(`Failed to index documents`)
    throw e
  }
}

async function esIndex() {
  try {
    await createIndex({
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
    })
    await indexDocuments({
      indexName: process.env.ELASTIC_POSTCODES_INDEX,
      filePath: process.env.NSPL_CSV,
      batchSize: process.env.ELASTIC_BULK_BATCH_SIZE,
    })
  } catch(e) {
    log.error(e)
    process.exit(1)
  }
}

esIndex()
