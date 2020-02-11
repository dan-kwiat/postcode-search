import Link from 'next/link'
import MultiCodeBlock from '../components/MultiCodeBlock'
import { Typography } from '@rmwc/typography'
import schema from '../graphql/schema'
import jsonExample from '../graphql/schema-example.json'

function Schema() {
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>
        GraphQL Schema
      </Typography>
      <Typography use='body1'>
        Here's the full GraphQL schema. Try the <Link href='/graphiql'><a>GraphiQL Docs</a></Link> for an interactive view.
      </Typography>
      <MultiCodeBlock
        samples={[
          { language: 'graphql', label: 'GraphQL', codeString: schema },
          { language: 'json', label: 'JSON Example', codeString: JSON.stringify(jsonExample, null, 2) },
        ]}
      />
    </div>
  )
}

export default Schema
