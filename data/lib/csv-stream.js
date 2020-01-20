const fs = require('fs')
const readline = require('readline')

const arrToJson = (header, arr) => {
  return header.reduce((agg, x, i) => ({
    ...agg,
    [x]: arr[i],
  }), {})
}

const dequote = x => {
  if (x === '""') {
    return null
  }
  if (x[0] === '"' && x[x.length-1] === '"') {
    return x.substring(1, x.length-1)
  }
  const num = parseFloat(x)
  return isNaN(num) ? x : num
}

const streamCsv = (file, batchSize, batchHandler) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: null,
    terminal: false
  })
  let counter = 0
  let items = []
  let header

  return new Promise((resolve, reject) => {
    rl.on('line', x => {
      counter++
      const arr = x.split(',').map(dequote) // this crude parsing should be ok for NSPL csv
      if (counter === 1) {
        header = arr
        return
      }
      items.push(arrToJson(header, arr))
      if (counter % batchSize === 0) {
        rl.pause()
        batchHandler(items, counter)
        .then(() => {
          items = []
          rl.resume()
        })
        .catch(reject)
      }
    })

    rl.on('close', () => {
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
