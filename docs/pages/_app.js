import 'graphiql/graphiql.min.css'
import 'react-postcode/dist/index.css'
import '@material/drawer/dist/mdc.drawer.css'
import '@material/icon-button/dist/mdc.icon-button.css'
import '@material/list/dist/mdc.list.css'
import '@material/top-app-bar/dist/mdc.top-app-bar.css'
import '../styles.css'
import GithubIcon from '../components/GithubIcon'

import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  Drawer,
  DrawerContent
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

const NAV_LINKS = [
  {
    path: '/',
    label: 'Overview',
  },
  {
    path: '/react-postcode',
    label: 'React Component',
  },
  {
    path: '/graphiql',
    label: 'GraphiQL Playground',
  }
]

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <div style={{ height: '100vh' }}>
      <Head>
        <link
          key='material-icons-font'
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <TopAppBar>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarNavigationIcon icon="menu" />
            <TopAppBarTitle>Postcode Search</TopAppBarTitle>
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
      <div style={{ position: 'absolute', top: 64, left: 0, bottom: 0 }}>
        <Drawer>
          <DrawerContent>
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
        </Drawer>
      </div>
      <div style={{ position: 'absolute', left: 255, right: 0, top: 64, bottom: 0 }}>
        <Component {...pageProps} />
      </div>
    </div>
  )
}