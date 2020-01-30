import PostcodeSearch from 'react-postcode'
import Link from 'next/link'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerContent
} from '@rmwc/drawer'


function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', background: '#ddd', padding: '2rem', borderRadius: '1rem' }}>
      <h1>Postcode Search</h1>
    </div>
  )
}

export default HomePage
