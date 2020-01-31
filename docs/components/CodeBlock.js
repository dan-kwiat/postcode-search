import { useEffect, useRef } from 'react'
import copy from 'copy-to-clipboard'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
// TODO: Use the prism babel plugin:
// https://github.com/mAAdhaTTah/babel-plugin-prismjs

const CodeBlock = ({ codeString, language }) => {
  const el = useRef(null)

  useEffect(() => {
    Prism.highlightElement(el.current)
  }, [codeString, language])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, right: '7px' }}>
        <button
          ghost
          icon='copy'
          onClick={() => {copy(codeString.trim())}}
        >
          Copy
        </button>
      </div>
      <pre><code ref={el} className={`language-${language}`}>{codeString.trim()}</code></pre>
    </div>
  )
}

export default CodeBlock