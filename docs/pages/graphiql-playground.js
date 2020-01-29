import GraphiQL from 'graphiql'
import fetch from 'isomorphic-fetch'

const API_URL = 'https://postcode-search.now.sh/api'

function graphQLFetcher(params) {
  const query = encodeURIComponent(params.query)
  const variables = JSON.stringify(params.variables || {})
  const operationName = params.operationName || ''

  return fetch(`${API_URL}?query=${query}&variables=${variables}&operationName=${operationName}`)
    .then(response => response.json())
}

function Playground() {
  return (
    <div id="graphiql" style={{ height: '100vh' }}>
      <GraphiQL fetcher={graphQLFetcher} />
    </div>
  )
}

export default Playground
