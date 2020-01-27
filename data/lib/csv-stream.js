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

    const csvStream = readStream.pipe(csv({
      mapHeaders: ({ header }) => header.trim() // deals with zero-width char bug in object keys
    }))
    csvStream.on('data', jsonObj => {
      counter++
      items.push(jsonObj)

      if (counter % batchSize === 0) {
        readStream.pause()
        batchHandler(
          items.splice(0, batchSize),
          counter
        )
        .then(() => {
          readStream.resume()
        })
        .catch(reject)
      }
    })
    csvStream.on('end', () => {
      if (items.length > 0) {
        batchHandler(items, counter)
        .then(() => {
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
