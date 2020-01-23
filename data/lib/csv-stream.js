const fs = require('fs')
const csv = require('csv-parser')

const streamCsv = (file, batchSize, batchHandler) => {

  const readStream = fs.createReadStream(file)
  const csvStream = readStream.pipe(csv())

  let counter = 0
  let items = []

  return new Promise((resolve, reject) => {
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
    // handle error event?
  })
}

module.exports = streamCsv
