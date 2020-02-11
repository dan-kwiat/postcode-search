import { useState } from 'react'
import Link from 'next/link'
import CodeBlock from '../components/CodeBlock'
import { Chip, ChipSet } from '@rmwc/chip'
import { Typography } from '@rmwc/typography'
import schema from '../graphql/schema'
import jsonExample from '../graphql/schema-example.json'

const schemaCode = {
  json: JSON.stringify(jsonExample, null, 2),
  graphql: schema
}

function Schema() {
  const [language, setLanguage] = useState('graphql')
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>
        GraphQL Schema
      </Typography>
      <Typography use='body1'>
        Here's the full GraphQL schema. Try the <Link href='/graphiql'><a>GraphiQL Docs</a></Link> for an interactive view.
      </Typography>
      <section style={{ margin: '1rem 0' }}>
        <ChipSet choice style={{ paddingBottom: 0 }}>
          <Chip
            selected={language === 'graphql'}
            onClick={() => setLanguage('graphql')}
            label="GraphGL"
          />
          <Chip
            selected={language === 'json'}
            onClick={() => setLanguage('json')}
            label="JSON Example"
          />
        </ChipSet>
        <div style={{ height: '600px', maxHeight: 'calc(80vh)' }}>
          <CodeBlock
            language={language}
            codeString={schemaCode[language]}
          />
        </div>
      </section>
    </div>
  )
}

export default Schema
