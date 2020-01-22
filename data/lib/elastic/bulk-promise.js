const client = require('./client')

const bulkPromise = ops => {
  if (ops.length === 0) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    client.bulk(
      { body: ops },
      (err, res) => {
        if (err) {
          return reject(err)
        }
        if (res.errors) {
          const errItems = res.items.filter(x => x.index && x.index.error).map(x => x.index.error) // assume ops were type 'update'
          return reject(errItems)
        }
        return resolve(res)
      }
    )
  })
}

module.exports = bulkPromise
