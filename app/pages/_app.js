import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import GithubIcon from '../components/GithubIcon'
import {
  Drawer,
  DrawerContent,
  DrawerAppContent,
} from '@rmwc/drawer'
import {
  List,
  ListItem
} from '@rmwc/list'
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarNavigationIcon,
  TopAppBarActionItem,
  TopAppBarFixedAdjust,
} from '@rmwc/top-app-bar'
import Prism from 'prismjs'
export { Prism } // required here because contains css

import 'graphiql/graphiql.min.css'
import 'react-postcode/dist/index.css'
import '@material/button/dist/mdc.button.css'
import '@material/chips/dist/mdc.chips.css'
import '@material/dialog/dist/mdc.dialog.css'
import '@rmwc/icon/icon.css'
import '@material/icon-button/dist/mdc.icon-button.css'
import '@material/drawer/dist/mdc.drawer.css'
import '@material/list/dist/mdc.list.css'
import '@material/top-app-bar/dist/mdc.top-app-bar.css'
import '@material/typography/dist/mdc.typography.css'
import '@rmwc/tooltip/tooltip.css'
import '../styles.css'

const NAV_LINKS = [
  {
    path: '/',
    label: 'Getting Started',
  },
  {
    path: '/schema',
    label: 'Schema',
  },
  {
    path: '/graphiql',
    label: 'GraphiQL Docs',
  },
  {
    path: '/react-postcode',
    label: 'React Component',
  },
]

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  useEffect(() => {
    // hack to trigger cold start on mounting
    fetch('/api').catch(e => {})
  }, [])
  return (
    <div>
      <Head>
        <link
          key='material-icons-font'
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <TopAppBar fixed>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarNavigationIcon icon="menu" onClick={() => setOpen(!open)} />
            <TopAppBarTitle><Link href='/'><a>GeoGQL</a></Link></TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection alignEnd>
            <TopAppBarActionItem
              aria-label="GitHub"
              tag="a"
              href="https://github.com/dan-kwiat/postcode-search"
              icon={<GithubIcon />}
              target="_blank"
            />
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust />
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <Drawer dismissible open={open} style={{ position: 'fixed' }}>
          <DrawerContent style={{ height: "calc(100vh - 12rem)" }}>
            <List>
              {NAV_LINKS.map(({ path, label }) => (
                <Link key={path} href={path}>
                  <ListItem activated={router.pathname === path}>
                    <a>{label}</a>
                  </ListItem>
                </Link>
              ))}
            </List>
          </DrawerContent>
          <a href="https://www.timetospare.com" target="_blank" className="drawer-footer">
            <div>
              <div>Made with <span role="img" aria-label="heart">❤️</span> in London</div>
              <img src="/tts_logo.png" alt="Time to Spare Logo" style={{ width: '75%' }} />
            </div>
          </a>
        </Drawer>
        <DrawerAppContent>
          <Component {...pageProps} />
        </DrawerAppContent>
      </div>
    </div>
  )
}
