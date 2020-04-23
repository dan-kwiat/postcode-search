import PostcodeSearch from 'react-postcode'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerContent
} from '@rmwc/drawer'
import CodeBlock from '../components/CodeBlock'
import MultiCodeBlock from '../components/MultiCodeBlock'
import { Typography } from '@rmwc/typography'

const API_URL = 'https://geo-gql.now.sh/api'

const requestCode = {
  js: `
// api-demo.js
const fetch = require('isomorphic-unfetch')
const API_URL = '${API_URL}'
const QUERY = '{ postcodes { suggest(prefix: "SE23") { id } } }'

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
API_URL = '${API_URL}'
QUERY = '{ postcodes { suggest(prefix: "SE23") { id } } }'

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
API_URL='${API_URL}'
QUERY='{ postcodes { suggest(prefix: "SE23") { id } } }'
curl -g "$API_URL?query=$QUERY" | json_pp
  `,
}

const responseCode = `
{
  "data": {
    "postcodes": {
      "suggest":[
        { "id": "SE23 1AA" },
        { "id": "SE23 1AD" },
        { "id": "SE23 1AE" },
        { "id": "SE23 1AF" },
        { "id": "SE23 1AG" },
        { "id": "SE23 1AH" },
        { "id": "SE23 1AL" },
        { "id": "SE23 1AN" },
        { "id": "SE23 1AR" },
        { "id": "SE23 1AS" }
      ]
    }
  }
}
`

function HomePage() {
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>
        Getting Started
      </Typography>
      <Typography use='body1'>
        Postcode GQL is a GraphQL API for searching UK postcodes.
        If you'd prefer a RESTful service we recommend using <a target='_blank' href='https://postcodes.io'>Postcodes.io</a>.
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
        codeString={responseCode}
      />
    </div>
  )
}

export default HomePage
