import React, {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Context, GlobalContext} from "context";

import './adminLayerPopup.scss'
import {ReportPopup} from "./ReportPopup";
import API from "../../../context/api";

const AdminLayerPopup = (props: any)=> {
  const [popup, setPopup] = useState(false);
  const context = useContext(Context);
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  const popupClose = () => {
    globalAction.setBroadcastAdminLayer!((prevState) => ({
      ...prevState,
      status: false,
      roomNo: "",
      memNo: "",
      nickNm: "",
    }));
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPop") {
      popupClose();
    }
  };

  const sanctionPop = () => {
    setPopup(true);
  }

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
    <>
      <div id="layerAdminPop" onClick={closePopupDim}>
        <div className="popLayer">
          <div className="management">
            <span className="sanctionBtn" onClick={sanctionPop}>제재하기</span>
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
            <div className="enterWrap">
              <button className="enterBtn normal" onClick={() => broadCastLink("normal")}>시청자 모드</button>
              <button className="enterBtn admin" onClick={() => broadCastLink("admin")}>관리자 모드</button>
              <button className="enterBtn destroy" onClick={async ()=>{
                let message1 = {
                  msg: `${globalState.broadcastAdminLayer.nickNm}님의방송을 삭제하시겠습니까?\n방송 삭제시 연결된 회원은 전체 종료됩니다.`,
                  callback: async () => {
                    const form = new FormData()
                    form.append("memLogin" , "1");
                    form.append("room_no" , globalState.broadcastAdminLayer.roomNo);
                    form.append("mem_no" , globalState.broadcastAdminLayer.memNo);
                    form.append("start_date" , '');
                    await API.adminBroadcastForceExit(form);
                    popupClose();
                  }
                };
                  context.action.confirm(message1)
              }}>방송방 삭제하기</button>
            </div>
          </div>
          <div className='closeWrap'>
            <button className='close'onClick={popupClose}>닫기</button>
          </div>
        </div>
      </div>
      {  popup && <ReportPopup popup={setPopup}/> }
    </>
         
  );
};
export default  AdminLayerPopup
