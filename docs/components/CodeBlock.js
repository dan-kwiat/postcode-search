import { useEffect, useRef } from 'react'
import copy from 'copy-to-clipboard'
import { Icon } from '@rmwc/icon'
import { IconButton } from '@rmwc/icon-button'
import { Tooltip } from '@rmwc/tooltip'
import { Prism } from '../pages/_app.js'

const CodeBlock = ({ codeString, language }) => {
  const el = useRef(null)

  useEffect(() => {
    Prism.highlightElement(el.current)
  }, [codeString, language])

  const trimmedCode = codeString.trim()

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
        <Tooltip
          content={
            <div style={{ display: 'flex' }}>
              <div>Copied</div>
              <Icon
                icon={{ icon: 'check', size: 'xsmall' }}
                style={{ marginLeft: '0.2rem' }}
              />
            </div>
          }
          activateOn="click"
          align="left"
        >
          <IconButton
            icon="file_copy"
            label="Copy code"
            onClick={() => {
              copy(trimmedCode)
            }}
            style={{ color: 'rgba(255,255,255,.7)' }}
          />
        </Tooltip>
      </div>
      <pre>
        <code ref={el} className={`language-${language}`}>
          {trimmedCode}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock