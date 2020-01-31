import PostcodeSearch from 'react-postcode'
import CodeBlock from '../components/CodeBlock'

const demoCode = `
import PostcodeSearch from 'react-postcode'
import 'react-postcode/dist/index.css'

function ReactPostcodeDemo() {
  return (
    <PostcodeSearch
      onSelect={item => {
        console.log(item)
      }}
      outlined={false}
    />
  )
}
`

function ReactPostcodeDemo() {
  return (
    <div className='centered-content'>
      <h1>{`<PostcodeSearch />`}</h1>
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
