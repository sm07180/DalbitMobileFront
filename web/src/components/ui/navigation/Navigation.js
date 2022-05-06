import React, {useContext} from 'react'

import './navigation.scss'
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setIsRefresh} from "redux/actions/common";
import {isHybrid} from "context/hybrid";
import {setGlobalCtxBroadClipDim, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

const Navigation = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { baseData} = globalState;
  return (
    <>
    <div id="navigation">
      <nav className="bottomGnb">
        <div className="navi" onClick={() => {
          if(location.pathname === '/') {
            dispatch(setIsRefresh(true))
          }else {
            history.push('/')
          }
        }} />
        <div className="navi" onClick={() => history.push('/clip')} />
        <div className="navi" onClick={() => {
          if (baseData.isLogin === true) {
            if(isHybrid()) {
              window.scrollTo(0, 0);
              return dispatch(setGlobalCtxBroadClipDim(true));
            }else {
              dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 1]}))
            }
          } else {
            return history.push("/login");
          }
        } }/>
        <div className="navi" onClick={() => history.push('/search')} />
        <div className="navi" onClick={() => history.push(`/mypage`)} />
      </nav>
    </div>
    </>
  )
}

export default Navigation
