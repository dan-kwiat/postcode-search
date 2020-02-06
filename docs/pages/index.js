import { useState } from 'react'
import PostcodeSearch from 'react-postcode'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerContent
} from '@rmwc/drawer'
import CodeBlock from '../components/CodeBlock'
import { Chip, ChipSet } from '@rmwc/chip'
import { Typography } from '@rmwc/typography'

const requestCode = {
  js: `
// api-demo.js
let QUERY = \`{ postcodes { suggest(prefix: "SE23") { id } } }\`

fetch(\`${process.env.API_URL}?query=$\{QUERY}\`)
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
  shell: `
# api-demo.sh
QUERY='{ postcodes { suggest(prefix: "SE23") { id } } }'
curl -g "${process.env.API_URL}?query=$QUERY" | json_pp
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
  const [language, setLanguage] = useState('js')
  return (
    <div className='centered-content'>
      <Typography use='headline1' tag='h1'>
        Getting Started
      </Typography>
      <Typography use='body1'>
        Postcode GQL is a GraphQL API for searching UK postcodes.
        If you'd prefer a RESTful service we recommend using <a target='_blank' href='https://postcodes.io'>Postcodes.io</a>.
      </Typography>
      <Typography use='headline3' tag='h3'>
        Features:
      </Typography>
      <ul>
        <li><Typography use='headline6'>GraphQL specification</Typography></li>
        <li><Typography use='headline6'>Detailed geographical data</Typography></li>
        <li><Typography use='headline6'>National statistics data</Typography></li>
        <li><Typography use='headline6'>Fast autocomplete search with optional geo boosting</Typography></li>
        <li><Typography use='headline6'>Pre-built UI components</Typography></li>
      </ul>

      <ChipSet choice>
        <Chip
          selected={language === 'js'}
          onClick={() => setLanguage('js')}
          label="JavaScript"
          trailingIcon={null}
        />
        <Chip
          selected={language === 'shell'}
          onClick={() => setLanguage('shell')}
          label="Shell"
          trailingIcon={null}
        />
      </ChipSet>
      <CodeBlock
        language={language}
        codeString={requestCode[language]}
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
