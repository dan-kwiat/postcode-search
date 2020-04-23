import { useState } from 'react'
import PropTypes from 'prop-types'
import CodeBlock from './CodeBlock'
import { Chip, ChipSet } from '@rmwc/chip'

const maxLines = samples => samples.reduce((agg, x) => Math.max(
  agg,
  x.codeString.trim().split('\n').length
), 0)

function MultiCodeBlock({ samples, rows }) {
  const [language, setLanguage] = useState(samples[0].language)

  const codeString = samples.reduce((agg, x) => {
    return x.language === language ? x.codeString : agg
  }, '')

  return (
    <section style={{ margin: '1rem 0' }}>
      <ChipSet choice style={{ paddingBottom: 0 }}>
        {samples.map(x => (
          <Chip
            key={x.language}
            selected={x.language === language}
            onClick={() => setLanguage(x.language)}
            label={x.label || x.language}
          />
        ))}
      </ChipSet>
      <CodeBlock
        language={language}
        codeString={codeString}
        rows={rows || maxLines(samples)}
      />
    </section>
  )
}
MultiCodeBlock.propTypes = {
  rows: PropTypes.number,
  samples: PropTypes.arrayOf(PropTypes.shape({
    codeString: PropTypes.string.isRequired,
    label: PropTypes.string,
    language: PropTypes.string.isRequired,
  }))
}

export default MultiCodeBlock
