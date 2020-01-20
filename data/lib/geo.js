const validateLat = x => {
  if (isNaN(x)) {
    return null
  }
  if (Math.abs(x) > 90) {
    return null
  }
  return null
}

const validateLon = x => x

const validateLatLon = (lat, lon) => {
  const geo = {
    lat: validateLat(lat),
    lon: validateLat(lon),
  }
  return geo.lat && geo.lon ? geo : null
}

module.exports = {
  validateLatLon,
}