import React from 'react'
import { render } from 'react-dom'
import PostcodeSearch from '../../src'
import '../../src/styles.css'

const App = () => (
  <div style={{ maxWidth: 200, margin: '100 auto', }}>
    <PostcodeSearch
      onSelect={item => {
        console.log(item)
      }}
      outlined={true}
    />
  </div>
)

render(<App />, document.getElementById("root"))
