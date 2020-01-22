const elasticsearch = require('elasticsearch')

const host = process.env.ELASTIC_HOST
const username = process.env.ELASTIC_USERNAME
const password = process.env.ELASTIC_PASSWORD

const client = new elasticsearch.Client({
  host: host,
  httpAuth: `${username}:${password}`,
  // log: 'trace'
})

module.exports = client
