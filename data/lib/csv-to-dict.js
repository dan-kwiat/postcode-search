const fs = require('fs')
const csv = require('csv-parser')

const csvToDict = ({
  filePath,
  keyColumn,
  valueColumn,
}) => (
  new Promise((resolve, reject) => {
    const dict = {}

    const readStream = fs.createReadStream(filePath)
    readStream.on('error', reject)

    const csvStream = readStream.pipe(csv({
      mapHeaders: ({ header }) => header.trim() // deals with zero-width char bug in object keys
    }))
    csvStream.on('data', jsonObj => {
      dict[jsonObj[keyColumn]] = jsonObj[valueColumn]
    })
    csvStream.on('end', () => {
      resolve(dict)
    })
    csvStream.on('error', reject)
  })
)

module.exports = csvToDict
