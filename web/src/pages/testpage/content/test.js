import React from 'react'
import Lottie from './lottie.js'

export default props => {
  console.log('render sub')
  return (
    <div style={{marginTop: '50px', backgroundColor: 'skyblue', fontSize: '20px'}}>
      <div>sub component</div>
      <div>{JSON.stringify(props)}</div>
      <Lottie {...props} />
    </div>
  )
}
