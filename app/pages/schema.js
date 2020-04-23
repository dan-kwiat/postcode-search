import Link from 'next/link'
import MultiCodeBlock from '../components/MultiCodeBlock'
import { Typography } from '@rmwc/typography'
import schema from '../lib/schema'
import graphQLFetcher from '../lib/graphql-fetcher'
import QUERY from '../lib/query-examples/full'

const PUBLIC_URL = 'https://geo-gql.now.sh'

function Schema({ response }) {
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>
        Schema
      </Typography>
      <Typography use='body1'>
        Here's the full GraphQL schema. Try the <Link href='/graphiql'><a>GraphiQL Docs</a></Link> for an interactive view.
      </Typography>
      <MultiCodeBlock
        rows={20}
        samples={[
          { language: 'graphql', label: 'GraphQL', codeString: schema },
          { language: 'json', label: 'JSON Response Example', codeString: JSON.stringify(response, null, 2) },
        ]}
      />
    </div>
  )
}

export async function getStaticProps() {
  const response = await graphQLFetcher({
    query: QUERY,
    baseUrl: PUBLIC_URL,
  })

  return {
    props: {
      response,
    }
  }
}

export default Schema
