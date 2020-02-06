import Link from 'next/link'
import CodeBlock from '../components/CodeBlock'
import { Typography } from '@rmwc/typography'

const schema = `
input GeoInput {
  lat: Float
  lon: Float
}
type Stats {
  imd: Int
}
type GeoCoordinates {
  lat: Float
  lon: Float
  easting: Float
  northing: Float
}
type GeoCodes {
  osgrdind: String
  usertype: String
  pcd: String
  pcd2: String
  pcds: String
  oa11: String
  cty: String
  ced: String
  laua: String
  ward: String
  hlthau: String
  nhser: String
  ctry: String
  rgn: String
  pcon: String
  eer: String
  teclec: String
  ttwa: String
  pct: String
  nuts: String
  park: String
  lsoa11: String
  msoa11: String
  wz11: String
  ccg: String
  bua11: String
  buasd11: String
  lep1: String
  lep2: String
  pfa: String
  calncv: String
  stp: String
  ru11ind: String
  oac11: String
}
type GeoNames {
  ccg: String
  cty: String
  eer: String
  laua: String
  lsoa11: String
  msoa11: String
  ward: String
  ttwa: String
  pcon: String
  ru11ind: String
}
type Postcode {
  id: String
  active: Boolean
  stats: Stats,
  coordinates: GeoCoordinates,
  codes: GeoCodes,
  names: GeoNames,
}
type PostcodesQuery {
  get(value: String!): Postcode
  suggest(
    active: Boolean = true
    boostGeo: GeoInput
    prefix: String!
  ): [Postcode]
}
type Query {
  postcodes: PostcodesQuery
}
`

function Schema() {
  return (
    <div className='centered-content'>
      <Typography use='headline2' tag='h1'>
        GraphQL Schema
      </Typography>
      <Typography use='body1'>
        Here's the full GraphQL schema. Try the <Link href='/graphiql'>GraphiQL Docs</Link> for an interactive view.
      </Typography>
      <CodeBlock
        language='graphql'
        codeString={schema}
      />
    </div>
  )
}

export default Schema
