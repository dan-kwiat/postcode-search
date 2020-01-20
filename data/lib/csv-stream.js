const fs = require('fs')
const readline = require('readline')
const stream = require('stream')
const { parse } = require('csv-string')

const arrToJson = (header, arr) => {
  return header.reduce((agg, x, i) => ({
    ...agg,
    [x]: arr[i],
  }), {})
}

const createCsvStream = file => {
  const outstream = new stream.Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      callback(null, chunk);
    }
  })
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: null,
    terminal: false
  })
  let i = 0
  let header
  rl.on('line', x => {
    const arr = parse(x, ',', '"')[0]
    if (i === 0) {
      header = arr
    } else {
      outstream.write(arrToJson(header, arr))
    }
    i++
  })
  rl.on('close', () => {
    outstream.end()
  })
  return outstream
}

module.exports = createCsvStream
