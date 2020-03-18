import React, {useState, useEffect, useContext} from 'react'
import TempComponent from './content/test.js'

export default props => {
  const [obj, setObj] = useState({a: 1})

  // setTimeout(() => {
  //   console.log('time out')
  //   obj.a = 2
  // }, 500)

  console.log('return')

  return (
    <div style={{display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div>{JSON.stringify(obj)}</div>
      {/* <div style={{marginTop: '20px', cursor: 'pointer'}} onClick={() => setObj({...obj})}> */}
      <div style={{marginTop: '20px', cursor: 'pointer'}} onClick={() => setObj({...obj})}>
        click
      </div>
      <div>
        {/* <TempComponent {...obj} /> */}
        <TempComponent a={obj.a} />
      </div>
    </div>
  )
}
