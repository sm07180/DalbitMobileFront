import React from 'react'

// global components

const MyRanking = (props) => {
  const {data} = props

  return (
    <ul className='rankBox'>
      <li>
        <p className='rankCategory'>DJ</p>
        <p className='rankData'>{data.myRank !== 0 ? data.myRank : "-"}</p>
      </li>
      <li>
        <p className='rankCategory'>FAN</p>
        <p className='rankData'>{data.myRank !== 0 ? data.myRank : "-"}</p>
      </li>
      <li>
        <p className='rankCategory'>LOVER</p>
        <p className='rankData'>{data.myRank !== 0 ? data.myRank : "-"}</p>
      </li>
    </ul>
  )
}

export default MyRanking
