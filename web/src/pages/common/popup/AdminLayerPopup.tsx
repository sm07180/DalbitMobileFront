import React, {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

import './adminLayerPopup.scss'
import {ReportPopup} from "./ReportPopup";
import API from "../../../context/api";
import {isDesktop} from "../../../lib/agent";
import {RoomJoin} from "../../../context/room";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBroadcastAdminLayer,
  setGlobalCtxInBroadcast,
  setGlobalCtxMessage,
  setGlobalCtxShadowAdmin
} from "../../../redux/actions/globalCtx";

const AdminLayerPopup = (props: any)=> {
  const [popup, setPopup] = useState(false);
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const popupClose = () => {
    dispatch(setGlobalCtxBroadcastAdminLayer({
      ...globalState.broadcastAdminLayer,
      status: false,
      roomNo: "",
      memNo: "",
      nickNm: "",
    }))
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
    if(isDesktop()){
      if (type === "admin") {
        dispatch(setGlobalCtxShadowAdmin(1));
        popupClose();
        if (globalState.inBroadcast) {
          window.location.href = `/broadcast/${globalState.broadcastAdminLayer.roomNo}`;
          setTimeout(() => {
            dispatch(setGlobalCtxInBroadcast(false));
          }, 10);
        } else {
          history.push(`/broadcast/${globalState.broadcastAdminLayer.roomNo}`);
        }
      } else {
        dispatch(setGlobalCtxShadowAdmin(0));
        popupClose();
        if (globalState.inBroadcast) {
          window.location.href = `/broadcast/${globalState.broadcastAdminLayer.roomNo}`;
          setTimeout(() => {
            dispatch(setGlobalCtxInBroadcast(false));
          }, 10);
        } else {
          history.push(`/broadcast/${globalState.broadcastAdminLayer.roomNo}`);
        }
      }
    }else{
      popupClose();
      if (type === "admin") {
        RoomJoin({roomNo: globalState.broadcastAdminLayer.roomNo, shadow: 1})
      }else{
        RoomJoin({roomNo: globalState.broadcastAdminLayer.roomNo, shadow: 0})
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
            <span className="sanctionBtn" onClick={sanctionPop}>????????????</span>
          </div>
          <div className="popContainer">
            <div className="adminContent">
              {globalState.broadcastAdminLayer.nickNm === "" ? (
                <h3>???????????? ?????????????????????????</h3>
              ) : (
                <h3>
                  <b>{globalState.broadcastAdminLayer.nickNm}</b> ?????? <br /> ???????????? ?????????????????????????
                </h3>
              )}
            </div>
            <div className="enterWrap">
              <button className="enterBtn normal" onClick={() => broadCastLink("normal")}>????????? ??????</button>
              <button className="enterBtn admin" onClick={() => broadCastLink("admin")}>????????? ??????</button>
              <button className="enterBtn destroy" onClick={async ()=>{
                let message1 = {
                  msg: `${globalState.broadcastAdminLayer.nickNm}??????????????? ?????????????????????????\n?????? ????????? ????????? ????????? ?????? ???????????????.`,
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
                  dispatch(setGlobalCtxMessage({type: "confirm", ...message1}))
              }}>????????? ????????????</button>
            </div>
          </div>
          <div className='closeWrap'>
            <button className='close'onClick={popupClose}>??????</button>
          </div>
        </div>
      </div>
      {  popup && <ReportPopup popup={setPopup}/> }
    </>

  );
};
export default  AdminLayerPopup
