import React from 'react'

export default props => {
  return (
    <div style={{marginTop: '50px', backgroundColor: 'skyblue', fontSize: '20px'}}>
      <div>sub component</div>
      <div>{JSON.stringify(props)}</div>
    </div>
  )
}
