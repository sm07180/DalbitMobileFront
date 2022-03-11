import React, { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GlobalContext } from "context";

import './adminLayerPopup.scss'

const AdminLayerPopup = (props: any)=> {
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  const popupClose = () => {
    globalAction.setBroadcastAdminLayer!((prevState) => ({
      ...prevState,
      status: false,
      roomNo: "",
      nickNm: "",
    }));
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPop") {
      popupClose();
    }
  };
  //clip Link
  const broadCastLink = (type: string) => {
    if (type === "admin") {
      globalAction.setShadowAdmin!(1);
      popupClose();
      if (globalState.inBroadcast) {
        window.location.href = `/broadcast/${globalState.broadcastAdminLayer.roomNo}`;
        setTimeout(() => {
          globalAction.setInBroadcast!(false);
        }, 10);
      } else {
        history.push(`/broadcast/${globalState.broadcastAdminLayer.roomNo}`);
      }
    } else {
      globalAction.setShadowAdmin!(0);
      popupClose();
      if (globalState.inBroadcast) {
        window.location.href = `/broadcast/${globalState.broadcastAdminLayer.roomNo}`;
        setTimeout(() => {
          globalAction.setInBroadcast!(false);
        }, 10);
      } else {
        history.push(`/broadcast/${globalState.broadcastAdminLayer.roomNo}`);
      }
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div id="layerPop" onClick={closePopupDim}>
      <div className="popLayer">
        <div className="sanctionWrap">
          <span className="sanctionBtn">제재하기</span>
          <span className="destroyBtn">방송방 삭제하기</span>
        </div>
        <div className="popContainer">
          <div className="adminContent">
            {globalState.broadcastAdminLayer.nickNm === "" ? (
              <h3>관리자로 입장하시겠습니까?</h3>
            ) : (
              <h3>
                <b>{globalState.broadcastAdminLayer.nickNm}</b> 님의 <br /> 방송방에 입장하시겠습니까?
              </h3>
            )}
          </div>
          <div className="btnWrap">
            <button className="enterBtn normal" onClick={() => broadCastLink("normal")}>시청자 모드</button>
            <button className="enterBtn admin" onClick={() => broadCastLink("admin")}>관리자 모드</button>
          </div>
        </div>
        <div className='closeWrap'>
          <button className='close'onClick={popupClose}>닫기</button>
        </div>
      </div>
    </div>      
  );
};
export default  AdminLayerPopup
