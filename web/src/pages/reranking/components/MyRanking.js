import React from 'react'

// global components

const MyRanking = (props) => {
  const {data} = props

  return (
    <ul className='rankBox'>
      <li>
        <p className='rankCategory'>DJ</p>
        <p className='rankData'>{data.dj !== 0 ? data.dj : "-"}</p>
      </li>
      <li>
        <p className='rankCategory'>FAN</p>
        <p className='rankData'>{data.fan !== 0 ? data.fan : "-"}</p>
      </li>
      <li>
        <p className='rankCategory'>LOVER</p>
        <p className='rankData'>{data.lover !== 0 ? data.lover : "-"}</p>
      </li>
    </ul>
  )
}

export default MyRanking
