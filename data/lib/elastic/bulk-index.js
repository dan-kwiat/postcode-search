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

const bulkIndexOps = ({ indexName, docs, docParser }) => {
  return docs.reduce((agg, rawDoc) => {
    const { _id, doc } = docParser(rawDoc)
    return _id ? [
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
    ] : agg
  }, [])
}

const bulkIndex = ({ indexName, docs, docParser }) => {
  const ops = bulkIndexOps({ indexName, docs, docParser })
  return bulkPromise(ops)
}

module.exports = bulkIndex
