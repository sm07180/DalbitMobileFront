// tab navigation
// api
import { GlobalContext } from "context";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./join.scss";
export default (props) => {
  let location = useLocation();
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  //clip Link
  const broadCastLink = (type: string) => {
    if (type === "admin") {
      globalAction.setShadowAdmin!(1);
      setTimeout(() => {
        history.push(`/broadcast/${location.state}`);
      }, 10);
    } else {
      globalAction.setShadowAdmin!(0);
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
