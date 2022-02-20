import React, {useEffect} from 'react'
import { useHistory } from 'react-router-dom'

const MyMenu = (props) => {
  const {data} = props
  const history = useHistory()
  const golink = (path, value) => {
    history.push({pathname: path, value: value});
  }

  return (
    <>
      <div className="btnList">
        {data.map((list,index) => {
          return (
            <button key={index} onClick={()=>{golink(list.path, true)}}>{list.menuNm}</button>
          )
        })}
      </div>
    </>
  )
}

export default MyMenu
