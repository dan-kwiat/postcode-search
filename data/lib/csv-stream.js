const fs = require('fs')
const csv = require('csv-parser')

const streamCsv = ({
  filePath,
  batchSize,
  batchHandler
}) => (
  new Promise((resolve, reject) => {
    let counter = 0
    let items = []

    const readStream = fs.createReadStream(filePath)
    readStream.on('error', reject)

    const csvStream = readStream.pipe(csv())
    csvStream.on('data', jsonObj => {
      counter++
      items.push(jsonObj)
      if (counter % batchSize === 0) {
        readStream.pause()
        batchHandler(items, counter)
        .then(() => {
          items = []
          readStream.resume()
        })
        .catch(reject)
      }
    })
    csvStream.on('end', () => {
      if (counter % batchSize !== 0) {
        batchHandler(items, counter)
        .then(() => {
          items = []
          resolve(counter)
        })
        .catch(reject)
      } else {
        resolve(counter)
      }
    })
    csvStream.on('error', reject)
  })
)

module.exports = streamCsv
