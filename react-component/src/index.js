import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import FilterSuggest, { HelperText, Input, TextField } from 'filter-suggest'
import SearchSVG from './search.svg'

const DEBOUNCE_TIME = 100
const MAX_QUERY_LENGTH = 10

const applyDebounced = debounce((f, x) => f(x), DEBOUNCE_TIME)

const QUERY = `
  query REACT_POSTCODE(
    $prefix: String!
    $boostGeo: GeoInput
  ) {
    postcodes {
      suggest(
        prefix: $prefix
        boostGeo: $boostGeo
      ) {
        id
        names {
          ward
        }
      }
    }
  }
`

const getData = (apiUrl, apiKey, variables) => {
  return fetch(`${apiUrl}?query=${QUERY}&variables=${JSON.stringify(variables)}`).then(x => x.json())
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
  const [data, setData] = useState(null)
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
        prefix: debouncedInputValue,
        // boostGeo: {
        //   lat: 52,
        //   lon: 0,
        // },
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
      setData(null)
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
            empty: data ? (data.postcodes.suggest.length === 0) : true,
            searchTerm: debouncedInputValue,
          })
        }
        inputValue={inputValue}
        items={data ? data.postcodes.suggest.map(mapItem) : []}
        label={label}
        leadingIcon={<SearchSVG />}
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
  apiUrl: 'https://postcode-search.now.sh/api',
  label: 'Postcode',
  mapItem: ({
    id,
    names,
  }) => ({
    id,
    icon: null,
    primary: id,
    secondary: names.ward,
  }),
}

export default PostcodeSearch

export {
  HelperText,
  Input,
  TextField
}
