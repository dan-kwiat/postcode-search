import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import FilterSuggest, { HelperText, Input, TextField } from 'filter-suggest'
import svgSearch from './search.svg'
import './index.css'

const DEBOUNCE_TIME = 100
const MAX_QUERY_LENGTH = 10

const applyDebounced = debounce((f, x) => f(x), DEBOUNCE_TIME)

const getData = (apiUrl, apiKey, variables) => {
  return fetch(`${apiUrl}?variables=${JSON.stringify(variables)}`).then(x => x.json())
}

const errorMessage = ({ error, empty, loading, searchTerm }) => {
  if (error) {
    return 'Oops something went wrong, please try again'
  }
  if (empty && searchTerm.length > 0 && !loading) {
    return `Sorry we can't find anything matching '${searchTerm}'`
  }
  return null
}

const PostcodeSearch = ({
  apiKey,
  apiUrl,
  className,
  label,
  mapItem,
  menuClassName,
  onBlur,
  onFocus,
  onSelect,
  outlined,
  style,
  textFieldClassName,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [debouncedInputValue, setDebouncedInputValue] = useState('')
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onInputValueChange = x => {
    const value = x ? x.toUpperCase().substring(0,MAX_QUERY_LENGTH) : ''
    setInputValue(value)
    applyDebounced(setDebouncedInputValue, value)
  }

  useEffect(() => {
    let stale = false
    if (debouncedInputValue) {
      const variables = {
        q: debouncedInputValue,
        // boostGeo: {
        //   lat: 51.567361,
        //   lon: -0.070315,
        // },
        active: true
      }
      setLoading(true)
      getData(apiUrl, apiKey, variables)
        .then(({ data, errors }) => {
          if (stale) return
          if (errors) {
            // setData(null)
            return setError(errors[0].message) // graphql error
          }
          setError(null)
          setData(data)
        })
        .catch(error => {
          if (stale) return
          // setData(null)
          setError((error && error.message) || 'Unknown error') // probably network error
        })
        .then(() => {
          if (stale) return
          setLoading(false)
        })
    } else {
      setError(null)
      setData([])
    }
    return () => { stale = true }
  }, [apiUrl, apiKey, debouncedInputValue])

  return (
    <div className={className} style={style}>
      <FilterSuggest
        errorMessage={
          errorMessage({
            error,
            loading,
            empty: data.length === 0,
            searchTerm: debouncedInputValue,
          })
        }
        inputValue={inputValue}
        items={data.map(mapItem)}
        label={label}
        leadingIcon={<img width={24} height={24} src={svgSearch} />}
        loading={loading}
        menuClassName={menuClassName}
        onBlur={onBlur}
        onFocus={onFocus}
        onInputValueChange={onInputValueChange}
        onSelect={onSelect}
        outlined={outlined}
        textFieldClassName={textFieldClassName}
      />
    </div>
  )
}
PostcodeSearch.propTypes = {
  apiKey: PropTypes.string,
  apiUrl: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  mapItem: PropTypes.func,
  menuClassName: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  outlined: PropTypes.bool,
  style: PropTypes.object,
  textFieldClassName: PropTypes.string,
}
PostcodeSearch.defaultProps = {
  apiUrl: 'http://localhost:3000/api',
  label: 'Postcode',
  mapItem: ({ id, lsoa11 }) => ({
    id,
    icon: null,
    primary: id,
    secondary: lsoa11,
  }),
}

export default PostcodeSearch

export {
  HelperText,
  Input,
  TextField
}
