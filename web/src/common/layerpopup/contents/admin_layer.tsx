import React, { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBroadcastAdminLayer,
  setGlobalCtxInBroadcast,
  setGlobalCtxShadowAdmin
} from "../../../redux/actions/globalCtx";

export default function LayerComponent(props: any) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const closePopup = () => {
    dispatch(setGlobalCtxBroadcastAdminLayer({
      ...globalState.broadcastAdminLayer, status: false,
      roomNo: "",
      nickNm: "",
    }));
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };
  //clip Link
  const broadCastLink = (type: string) => {
    if (type === "admin") {
      dispatch(setGlobalCtxShadowAdmin(1));
      closePopup();
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
      closePopup();
      if (globalState.inBroadcast) {
        window.location.href = `/broadcast/${globalState.broadcastAdminLayer.roomNo}`;
        setTimeout(() => {
          dispatch(setGlobalCtxInBroadcast(false));
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
    <Content>
      <div id="layerPopup" onClick={closePopupDim}>
        <div className="layerContainer">
          <div className="layerContent">
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
              <button className="btn btn_cancel" onClick={() => broadCastLink("normal")}>
                시청자 모드
              </button>
              <button className="btn btn_ok" onClick={() => broadCastLink("admin")}>
                관리자 모드
              </button>
            </div>
          </div>
          <button className="btnClose" onClick={closePopup}>
            닫기
          </button>
        </div>
      </div>
    </Content>
  );
}

const Content = styled.div`
  .adminContent {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    text-align: center;
  }
  .btnWrap {
    .darkgray {
      background-color: #757575;
      color:#fff;
    }
    .mainColor {
      background-color: #FF3C7B;
    }
  }
`;
