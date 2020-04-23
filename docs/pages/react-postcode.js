import { useState } from 'react'
import PostcodeSearch from 'react-postcode'
import CodeBlock from '../components/CodeBlock'
import { Typography } from '@rmwc/typography'
import { SimpleDialog } from '@rmwc/dialog'

const demoCode = `
// postcode-demo.jsx
import PostcodeSearch from 'react-postcode'
import 'react-postcode/dist/index.css'

const ReactPostcodeDemo = () => {
  return (
    <PostcodeSearch
      onFetch={(postcode) => {
        console.log(postcode)
        // perform action e.g. open dialog, zoom map..
      }}
    />
  )
}
`

const ReactPostcodeDemo = () => {
  const [open, setOpen] = useState(false)
  const [postcode, setPostcode] = useState(null)
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>{`<PostcodeSearch />`}</Typography>
      <div style={{ maxWidth: '250px', margin: '20px 0' }}>
        <PostcodeSearch
          onSelect={() => {}}
          onFetch={(postcode, err) => {
            setPostcode(postcode)
            setOpen(true)
          }}
          outlined={false}
          apiUrl='/api'
        />
        <SimpleDialog
          title="Selected Postcode"
          open={open}
          onClose={() => setOpen(false)}
          acceptLabel={null}
          cancelLabel="Close"
        >
          <CodeBlock
            language='json'
            codeString={JSON.stringify(postcode, null, 2)}
            rows={15}
          />
        </SimpleDialog>
      </div>
      <CodeBlock
        language='jsx'
        codeString={demoCode}
      />
    </div>
  )
}

export default ReactPostcodeDemo
