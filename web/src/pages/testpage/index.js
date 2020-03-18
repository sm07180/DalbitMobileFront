import React, {useState, useEffect, useContext} from 'react'
import TempComponent from './content/test.js'
import {IMG_SERVER} from 'context/config'

const path = `${IMG_SERVER}/ani/lottie/chat-present.json`
const objValue = {a: 1, subObj: {b: 1}, path: path}

export default props => {
  console.log('init')
  const [obj, setObj] = useState(objValue)

  setTimeout(() => {
    console.log('time out')

    // obj.a = 2
    // obj.subObj.b = 2

    objValue.a = 3
    objValue.subObj.b = 3
  }, 500)

  console.log('compare 1', objValue === obj)
  console.log('compare 2', objValue.subObj === obj.subObj)

  console.log('return')

  return (
    <div style={{display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div>{JSON.stringify(obj)}</div>
      <div style={{marginTop: '20px', cursor: 'pointer'}} onClick={() => setObj({...obj})}>
        {/* <div style={{marginTop: '20px', cursor: 'pointer'}} onClick={() => setObj({a: 2})}> */}
        {/* <div style={{marginTop: '20px', cursor: 'pointer'}} onClick={() => setObj(objValue)}> */}
        {/* <div style={{marginTop: '20px', cursor: 'pointer'}} onClick={() => setObj({...obj, subObj: {...obj.subObj}})}> */}
        {/* <div style={{marginTop: '20px', cursor: 'pointer'}} onClick={() => setObj({...obj, subObj: {b: 2}})}> */}
        click
      </div>
      <div>
        {/* <TempComponent {...obj} /> */}
        {/* <TempComponent subObj={obj.subObj} path={obj.path} autoPlay={true} /> */}
        <TempComponent {...obj} autoPlay={true} />
      </div>
    </div>
  )
}
