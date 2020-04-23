import fetch from 'isomorphic-fetch'

function graphQLFetcher({ query, variables, operationName, baseUrl }) {
  const b = baseUrl || ''
  const q = encodeURIComponent(query)
  const v = JSON.stringify(variables || {})
  const o = operationName || ''

  return fetch(`${b}/api?query=${q}&variables=${v}&operationName=${o}`)
    .then(response => response.json())
}

export default graphQLFetcher