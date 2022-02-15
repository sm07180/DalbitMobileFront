import React from 'react'
import { useHistory } from 'react-router-dom'

const MyInfo = (props) => {
  const {data} = props
  const history = useHistory()

  return (
    <>
      <div className="btnList">
        {data.map((list,index) => {
          return (
            <button key={index} onClick={()=> history.push(list.path)}>{list.menuNm}</button>
          )
        })}
      </div>
    </>
  )
}

export default MyInfo
