const { validateLatLon } = require('../lib/geo')
const log = require('../lib/logger')

function postcodeDocParser (jsonObj) {
  try {
    const geo = validateLatLon(jsonObj.lat, jsonObj.long)
    return {
      _id: jsonObj.pcd,
      doc: {
        ...jsonObj,
        // todo: make suggest an array to give the stripped postcode a lower weight?
        suggest: {
          input: [jsonObj.pcds, jsonObj.pcds.replace(/ /g, '')],
          contexts: {
            status: jsonObj.doterm ? ['inactive'] : ['active'],
            location: !jsonObj.doterm && geo ? [geo] : [],
          },
          weight: 1
        }
      }
    }
  } catch(e) {
    log.error('Failed to parse postcode object: ')
    log.error(jsonObj)
    return {
      _id: null,
      doc: null,
    }
  }
}

module.exports = postcodeDocParser
