// tab navigation
// api
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./join.scss";
import {useDispatch} from "react-redux";
import {setGlobalCtxShadowAdmin} from "../../../../redux/actions/globalCtx";
export default (props) => {
  let location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  //clip Link
  const broadCastLink = (type: string) => {
    if (type === "admin") {
      dispatch(setGlobalCtxShadowAdmin(1));
      setTimeout(() => {
        history.push(`/broadcast/${location.state}`);
      }, 10);
    } else {
      dispatch(setGlobalCtxShadowAdmin(0));
      setTimeout(() => {
        console.log(location.state);
        console.log("ac");
        history.push(`/broadcast/${location.state}`);
      }, 10);
    }
  };

  return (
    <div id="broadcast-modal" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => history.goBack()} className="cancel"></button>
      <h2>관리자 모드로 입장 하시겠습니까?</h2>
      <div className="adminBtn">
        <button onClick={() => broadCastLink("normal")}>시청자 모드</button>
        <button onClick={() => broadCastLink("admin")}>관리자 모드</button>
      </div>
    </div>
  );
};
