import React, {useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import {useDispatch} from "react-redux";
import {setNoticeTab} from "redux/actions/notice";

const MyMenu = (props) => {
  const {data} = props
  const history = useHistory()
  const dispatch = useDispatch();

  const golink = (path) => {
    if(path.includes('notice')) {
      dispatch(setNoticeTab("공지사항"));
    }
    history.push(path);
  }

  return (
    <>
      <div className="btnList">
        {data.map((list,index) => {
          return (
            <button key={index} onClick={()=>{golink(list.path)}}>{list.menuNm}</button>
          )
        })}
      </div>
    </>
  )
}

export default MyMenu
