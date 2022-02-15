import React, {useContext} from 'react'

import './navigation.scss'
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setIsRefresh} from "redux/actions/common";
import {GlobalContext} from "context";

const Navigation = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const context = useContext(GlobalContext);
  const { globalState, globalAction } = context;
  const { baseData} = globalState;
  return (
    <>
    <div id="navigation">
      <nav className="bottomGnb">
        <div className="navi" onClick={() => {
          dispatch(setIsRefresh(true));
          history.push('/')
        }} />
        <div className="navi" onClick={() => history.push('/clip')} />
        <div className="navi" onClick={() => {
          if (baseData.isLogin === true) {
            window.scrollTo(0, 0);
            return globalAction.setBroadClipDim(true);
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
