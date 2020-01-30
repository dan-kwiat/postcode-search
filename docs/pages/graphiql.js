import GraphiQL from 'graphiql'
import fetch from 'isomorphic-fetch'
import defaultQuery from '../graphql/default-graphiql'

function graphQLFetcher(params) {
  const query = encodeURIComponent(params.query)
  const variables = JSON.stringify(params.variables || {})
  const operationName = params.operationName || ''

  return fetch(`${process.env.API_URL}?query=${query}&variables=${variables}&operationName=${operationName}`)
    .then(response => response.json())
}

function Playground() {
  return (
    <div id="graphiql" style={{ height: '100vh' }}>
      <GraphiQL
        defaultQuery={defaultQuery}
        fetcher={graphQLFetcher}
      />
    </div>
  )
}

export default Playground
