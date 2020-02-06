import PostcodeSearch from 'react-postcode'
import CodeBlock from '../components/CodeBlock'
import { Typography } from '@rmwc/typography'

const demoCode = `
// postcode-demo.jsx
import PostcodeSearch from 'react-postcode'
import 'react-postcode/dist/index.css'

const ReactPostcodeDemo = () => {
  return (
    <PostcodeSearch
      onSelect={(postcode) => {
        console.log(postcode)
      }}
    />
  )
}
`

function ReactPostcodeDemo() {
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>{`<PostcodeSearch />`}</Typography>
      <div style={{ maxWidth: '250px', margin: '20px 0', }}>
        <PostcodeSearch
          onSelect={item => {
            console.log(item)
          }}
          outlined={false}
          apiUrl={process.env.API_URL}
        />
      </div>
      <CodeBlock
        language='jsx'
        codeString={demoCode}
      />
    </div>
  )
}

export default ReactPostcodeDemo
