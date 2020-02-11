import { useState } from 'react'
import CodeBlock from './CodeBlock'
import { Chip, ChipSet } from '@rmwc/chip'

function MultiCodeBlock({ samples }) {
  const [language, setLanguage] = useState(samples[0].language)

  const codeString = samples.reduce((agg, x) => {
    return x.language === language ? x.codeString : agg
  }, '')

  const maxLines = samples.reduce((agg, x) => Math.max(
    agg,
    x.codeString.split('\n').length
  ), 0)

  return (
    <section style={{ margin: '1rem 0' }}>
      <ChipSet choice style={{ paddingBottom: 0 }}>
        {samples.map((x) => (
          <Chip
            selected={x.language === language}
            onClick={() => setLanguage(x.language)}
            label={x.label}
          />
        ))}
      </ChipSet>
      <div style={{ height: `${maxLines*1.5}em`, maxHeight: 'calc(80vh)' }}>
        <CodeBlock
          language={language}
          codeString={codeString}
        />
      </div>
    </section>
  )
}

export default MultiCodeBlock
