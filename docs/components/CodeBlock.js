import { useState, useEffect, useRef } from 'react'
import copy from 'copy-to-clipboard'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
// TODO: Use the prism babel plugin:
// https://github.com/mAAdhaTTah/babel-plugin-prismjs
import { IconButton } from '@rmwc/icon-button'
import { Snackbar } from '@rmwc/snackbar'

const CodeBlock = ({ codeString, language }) => {
  const [snackOpen, setSnackOpen] = useState(false)
  const el = useRef(null)

  useEffect(() => {
    Prism.highlightElement(el.current)
  }, [codeString, language])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
        <IconButton
          icon="file_copy"
          label="Copy code"
          onClick={() => {
            copy(codeString.trim())
            setSnackOpen(true)
          }}
          style={{ color: 'rgba(255,255,255,.7)' }}
        />
      </div>
      <Snackbar
        open={snackOpen}
        onClose={e => setSnackOpen(false)}
        message="Code copied to clipboard"
        timeout={3000}
      />
      <pre>
        <code ref={el} className={`language-${language}`}>
          {codeString.trim()}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock