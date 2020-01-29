import PostcodeSearch from 'react-postcode'
import Link from 'next/link'

function HomePage() {
  return (
    <div style={{ height: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '100px auto', background: '#ddd', padding: '2rem', borderRadius: '1rem' }}>
        <div style={{ maxWidth: 200, margin: '100 auto', }}>
          <PostcodeSearch
            onSelect={item => {
              console.log(item)
            }}
            outlined={false}
          />
        </div>
        <Link href="/graphiql-playground">
          <a>GraphiQL Playground</a>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
