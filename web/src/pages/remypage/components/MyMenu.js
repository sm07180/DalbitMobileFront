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
      <div className="myMenuWrap">
        {data.map((list,index) => {
          return (
            <div className={`myMenuList`} key={index} onClick={()=>{golink(list.path)}}>
              <span className={`myMenuName ${list.isNew ? "new" : ""}`}>{list.menuNm}</span>
              {index === 1 &&
                <span className="teamInfo">팀에 가입해보세요! <i></i></span>
              }
              <span className='rightArrow'></span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MyMenu
