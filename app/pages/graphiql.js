import GraphiQL from 'graphiql'
import defaultQuery from '../lib/query-examples/graphiql'
import graphQLFetcher from '../lib/graphql-fetcher'

function Playground() {
  return (
    <div id="graphiql" style={{ height: 'calc(100vh - 4rem)' }}>
      <GraphiQL
        defaultQuery={defaultQuery}
        fetcher={graphQLFetcher}
      />
    </div>
  )
}

export default Playground
