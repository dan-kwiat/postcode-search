const postcodeFields = `
{
  id
  active
  stats {
    imd
  }
  coordinates {
    lat
    lon
    easting
    northing
  }
  codes {
    osgrdind
    usertype
    pcd
    pcd2
    pcds
    oa11
    cty
    ced
    laua
    ward
    hlthau
    nhser
    ctry
    rgn
    pcon
    eer
    teclec
    ttwa
    pct
    nuts
    park
    lsoa11
    msoa11
    wz11
    ccg
    bua11
    buasd11
    lep1
    lep2
    pfa
    calncv
    stp
    ru11ind
    oac11
  }
  names {
    ccg
    cty
    eer
    laua
    lsoa11
    msoa11
    ward
    ttwa
    pcon
    ru11ind
  }
}`

const fullQuery = `{
  postcode {
    get(value: "SW1A 0AA") ${postcodeFields}
    suggest(prefix: "SW1A 0AA") ${postcodeFields}
  }
  localAuthority {
    get(
      point: {
        lat: 51.5085336,
        lon: -0.1254484
      }
    ) {
      id
      geoJSON {
        type
        properties {
          objectid
          lad19cd
          lad19nm
          lad19nmw
          bng_e
          bng_n
          long
          lat
          st_areashape
          st_lengthshape
        }
        geometry {
          type
          coordinates
        }
      }
    }
  }
}`

export default fullQuery
