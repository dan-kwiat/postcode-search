import PostcodeSearch from 'react-postcode'

function ReactPostcodeDemo() {
  return (
    <div className='centered-content'>
      <h1>{`<PostcodeSearch />`}</h1>
      <div style={{ maxWidth: '250px', margin: '20px 0', }}>
        <PostcodeSearch
          onSelect={item => {
            console.log(item)
          }}
          outlined={false}
          apiUrl={process.env.API_URL}
        />
      </div>
    </div>
  )
}

export default ReactPostcodeDemo
