const client = require('./client')

// Elasticsearch _id is set to doc.id (if present, otherwise ES generates an _id)
const bulkIndex = async ({ index, docs }) => {
  const body = docs.reduce((agg, doc) => [
    ...agg,
    {
      index: {
        _id: doc.id,
        _index: index,
        _type: '_doc',
      }
    },
    doc
  ], [])

  const { body: bulkResponse } = await client.bulk({ refresh: true, body })

  if (bulkResponse.errors) {
    const erroredDocuments = []
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        })
      }
    })
    throw JSON.stringify(erroredDocuments)
  }

  return
}

module.exports = bulkIndex
