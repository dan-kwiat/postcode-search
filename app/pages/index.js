import CodeBlock from '../components/CodeBlock'
import MultiCodeBlock from '../components/MultiCodeBlock'
import { Typography } from '@rmwc/typography'
import graphQLFetcher from '../lib/graphql-fetcher'
import QUERY from '../lib/query-examples/basic'
import QUERY_MALFORMED from '../lib/query-examples/malformed'

const PUBLIC_URL = 'https://geo-gql.now.sh'

const requestCode = {
  js: `
// api-demo.js
const fetch = require('isomorphic-unfetch')
const API_URL = '${PUBLIC_URL}/api'
const QUERY = '${QUERY}'

fetch(\`$\{API_URL}?query=$\{QUERY}\`)
  .then(res => res.json())
  .then(({ data, errors }) => {
    if (errors) {
      console.log('QUERY ERRORS: ', errors)
      return
    }
    console.log('DATA: ', data)
  })
  .catch(err => {
    console.log('UNEXPECTED ERROR: ', err)
  })
  `,
  python: `
# api-demo.py
import requests
API_URL = '${PUBLIC_URL}/api'
QUERY = '${QUERY}'

try:
    res = requests.get(API_URL, params={ 'query': QUERY })
    payload = res.json()
    if 'errors' in payload:
        print('QUERY ERRORS: ', payload['errors'])
    else:
        print('DATA: ', payload['data'])
except Exception as e:
    print("UNEXPECTED ERROR: ", e)
  `,
  shell: `
# api-demo.sh
API_URL='${PUBLIC_URL}/api'
QUERY='${QUERY}'
curl -g "$API_URL?query=$QUERY" | json_pp
  `,
}


function HomePage({ goodResponse, badResponse }) {
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>
        Getting Started
      </Typography>
      <Typography use='body1'>
        GeoGQL is a GraphQL API for searching UK postcodes and other geographical data.
      </Typography>
      <Typography use='headline4' tag='h3'>
        Features:
      </Typography>
      <ul>
        <li><Typography use='headline6'>GraphQL specification</Typography></li>
        <li><Typography use='headline6'>Detailed geographical data</Typography></li>
        <li><Typography use='headline6'>National statistics data</Typography></li>
        <li><Typography use='headline6'>Fast autocomplete search with optional geo boosting</Typography></li>
        <li><Typography use='headline6'>Pre-built UI components</Typography></li>
      </ul>
      <MultiCodeBlock
        samples={[
          { language: 'js', label: 'JavaScript', codeString: requestCode['js'] },
          { language: 'python', label: 'Python', codeString: requestCode['python'] },
          { language: 'shell', label: 'Shell', codeString: requestCode['shell'] },
        ]}
      />
      <p>
        A successful response has a <code>data</code> property which takes the same shape as the sent query.
      </p>
      <CodeBlock
        language='json'
        codeString={JSON.stringify(goodResponse, null, 2)}
      />
      <p>
        If the query was malformed, the response has an <code>errors</code> property (but still has status code <code>200</code>).
      </p>
      <CodeBlock
        language='json'
        codeString={JSON.stringify(badResponse, null, 2)}
      />
    </div>
  )
}

export async function getStaticProps() {
  const goodResponse = await graphQLFetcher({
    query: QUERY,
    baseUrl: PUBLIC_URL,
  })
  const badResponse = await graphQLFetcher({
    query: QUERY_MALFORMED,
    baseUrl: PUBLIC_URL,
  })

  return {
    props: {
      goodResponse,
      badResponse,
    }
  }
}

export default HomePage
