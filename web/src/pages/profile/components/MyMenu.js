import React from 'react'

const MyInfo = (props) => {
  const {data} = props

  return (
    <>
      <div className="btnList">
        {data.map((list,index) => {
          return (
            <button key={index}>{list.menuNm}</button>
          )
        })}
      </div>
    </>
  )
}

export default MyInfo
