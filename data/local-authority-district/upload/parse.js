const getGeoShape = geometry => {
  return {
    type: geometry.type.toLowerCase(),
    coordinates: geometry.coordinates,
  }
}

const parse = feature => {
  return {
    id: feature.properties.lad19cd,
    buc: {
      geojson: feature,
      geoshape: getGeoShape(feature.geometry),
    }
  }
}

module.exports = parse
