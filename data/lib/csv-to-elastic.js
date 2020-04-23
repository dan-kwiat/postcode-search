const processCsv = require('./csv-batch-stream')
const log = require('./logger')
const getProgressBar = require('./progress')
const { bulkIndex } = require('./elastic')

async function csvToElastic({
  filePath,
  batchSize,
  index,
  docParser,
  numRowsEstimate,
}) {
  try {
    const progressBar = getProgressBar('Indexing Documents')
    progressBar.start(numRowsEstimate, 0)

    if (!filePath) {
      throw new Error('Missing CSV file path')
    }

    if (!batchSize) {
      throw new Error('Missing bulk index batch size')
    }

    const batchHandler = (docs, counter) => {
      progressBar.update(counter)
      const parsedDocs = docs.map(docParser)
      return bulkIndex({ index, docs })
    }

    const totalCount = await processCsv({ filePath, batchSize, batchHandler })

    progressBar.update(totalCount)
    progressBar.stop()
    log.info(`Successfully indexed ${totalCount} documents`)
  } catch(e) {
    log.error(`Failed to index documents`)
    throw e
  }
}

module.exports = csvToElastic
