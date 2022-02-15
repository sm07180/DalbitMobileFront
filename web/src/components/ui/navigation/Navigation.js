import React from 'react'

import './navigation.scss'
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setIsRefresh} from "redux/actions/common";

const Navigation = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <>
    <div id="navigation">
      <nav className="bottomGnb">
        <div className="navi" onClick={() => {
          dispatch(setIsRefresh(true));
          history.push('/')
        }} />
        <div className="navi" onClick={() => history.push('/clip')} />
        <div className="navi"></div>
        <div className="navi" onClick={() => history.push('/search')} />
        <div className="navi" onClick={() => history.push(`/mypage`)} />
      </nav>
    </div>
    </>
  )
}

export default Navigation
