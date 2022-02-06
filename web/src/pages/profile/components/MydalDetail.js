import React from 'react'

const MyInfo = (props) => {
  const {data} = props

  return (
    <>
      <div className="dalCount">{data}달</div>
      <div className="buttonWrap">
        <button>내 지갑</button>
        <button className='charge'>충전하기</button>
      </div>
    </>
  )
}

export default MyInfo
