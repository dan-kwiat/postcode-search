const { validateLatLon } = require('../lib/geo')
const log = require('../lib/logger')

const postcodeDocParser = ({
  ccgs,
  ctys,
  eers,
  lauas,
  lsoas,
  msoas,
  pcons,
  rus,
  ttwas,
  wards,
}) => jsonObj => {
  try {
    const geo = validateLatLon(jsonObj.lat, jsonObj.long)
    const doc = {
      ...jsonObj,
      // todo: make suggest an array to give the stripped postcode a lower weight?
      suggest: {
        input: [jsonObj.pcds, jsonObj.pcds.replace(/ /g, '')],
        contexts: {
          status: jsonObj.doterm ? ['inactive'] : ['active'],
          location: !jsonObj.doterm && geo ? [geo] : [],
        },
        weight: 1
      },
      ccgName: ccgs[jsonObj.ccg],
      ctyName: ctys[jsonObj.cty],
      eerName: eers[jsonObj.eer],
      lauaName: lauas[jsonObj.laua],
      lsoa11Name: lsoas[jsonObj.lsoa11],
      msoa11Name: msoas[jsonObj.msoa11],
      wardName: wards[jsonObj.ward],
      ttwaName: ttwas[jsonObj.ttwa],
      pconName: pcons[jsonObj.pcon],
      ru11indName: rus[jsonObj.ru11ind],
    }
    return {
      _id: jsonObj.pcd,
      doc,
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
