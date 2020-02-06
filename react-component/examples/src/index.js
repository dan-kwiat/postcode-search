import React from 'react'
import { render } from 'react-dom'
import PostcodeSearch from '../../src'
import '../../src/index.css'

const App = () => (
  <div style={{ maxWidth: 200, margin: '100 auto', }}>
    <PostcodeSearch
      onSelect={item => {
        console.log(item)
      }}
      onFetch={(gqlData, error) => {
        if (error) {
          console.log('UNEXPECTED ERR: ', error)
          return
        }
        console.log('GQL DATA: ', gqlData)
      }}
      outlined={true}
    />
  </div>
)

render(<App />, document.getElementById("root"))
