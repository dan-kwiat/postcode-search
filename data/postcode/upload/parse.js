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
    const matchTerms = [jsonObj.pcds, jsonObj.pcds.replace(/ /g, '')]
    const doc = {
      id: jsonObj.pcds,
      match_terms: matchTerms,
      active: jsonObj.doterm ? false : true,
      // todo: make suggest an array to give the stripped postcode a lower weight?
      suggest: {
        input: matchTerms,
        contexts: {
          status: jsonObj.doterm ? ['inactive'] : ['active'],
          location: !jsonObj.doterm && geo ? [geo] : [],
        },
        weight: 1
      },
      // todo: make dates actual dates
      dates: {
        "dointr": jsonObj.dointr,
        "doterm": jsonObj.doterm,
      },
      stats: {
        "imd": jsonObj.imd,
      },
      coordinates: {
        "lat": jsonObj.lat,
        "lon": jsonObj.long, // warning diff name
        "easting": jsonObj.oseast1m, // warning diff name
        "northing": jsonObj.osnrth1m, // warning diff name
      },
      codes: {
        "osgrdind": jsonObj.osgrdind,
        "usertype": jsonObj.usertype,
        "pcd": jsonObj.pcd,
        "pcd2": jsonObj.pcd2,
        "pcds": jsonObj.pcds,
        "oa11": jsonObj.oa11,
        "cty": jsonObj.cty,
        "ced": jsonObj.ced,
        "laua": jsonObj.laua,
        "ward": jsonObj.ward,
        "hlthau": jsonObj.hlthau,
        "nhser": jsonObj.nhser,
        "ctry": jsonObj.ctry,
        "rgn": jsonObj.rgn,
        "pcon": jsonObj.pcon,
        "eer": jsonObj.eer,
        "teclec": jsonObj.teclec,
        "ttwa": jsonObj.ttwa,
        "pct": jsonObj.pct,
        "nuts": jsonObj.nuts,
        "park": jsonObj.park,
        "lsoa11": jsonObj.lsoa11,
        "msoa11": jsonObj.msoa11,
        "wz11": jsonObj.wz11,
        "ccg": jsonObj.ccg,
        "bua11": jsonObj.bua11,
        "buasd11": jsonObj.buasd11,
        "lep1": jsonObj.lep1,
        "lep2": jsonObj.lep2,
        "pfa": jsonObj.pfa,
        "calncv": jsonObj.calncv,
        "stp": jsonObj.stp,
        "ru11ind": jsonObj.ru11ind,
        "oac11": jsonObj.oac11,
      },
      names: { // rename without Name suffix
        "ccg": ccgs[jsonObj.ccg],
        "cty": ctys[jsonObj.cty],
        "eer": eers[jsonObj.eer],
        "laua": lauas[jsonObj.laua],
        "lsoa11": lsoas[jsonObj.lsoa11],
        "msoa11": msoas[jsonObj.msoa11],
        "ward": wards[jsonObj.ward],
        "ttwa": ttwas[jsonObj.ttwa],
        "pcon": pcons[jsonObj.pcon],
        "ru11ind": rus[jsonObj.ru11ind],
      },
    }
    return doc

    // {
    //   _id: jsonObj.pcd,
    //   doc,
    // }
  } catch(e) {
    log.error('Failed to parse postcode object: ')
    log.error(jsonObj)
    return null
    // return {
    //   _id: null,
    //   doc: null,
    // }
  }
}

module.exports = postcodeDocParser
