import PostcodeSearch from 'react-postcode'
import Link from 'next/link'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerContent
} from '@rmwc/drawer'


function ReactPostcodeDemo() {
  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', background: '#ddd', padding: '2rem', borderRadius: '1rem' }}>
      <h1>Postcode Search</h1>
      <div style={{ maxWidth: '250px', margin: '20px 0', }}>
        <PostcodeSearch
          onSelect={item => {
            console.log(item)
          }}
          outlined={false}
          apiUrl={process.env.API_URL}
        />
      </div>
      <Link href="/graphiql">
        <a>GraphiQL Playground</a>
      </Link>
    </div>
  )
}

export default ReactPostcodeDemo
