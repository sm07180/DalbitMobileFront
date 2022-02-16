import React, { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { GlobalContext } from "context";

const AdminLayerPopup = (props: any)=> {
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  const closePopup = () => {
    globalAction.setBroadcastAdminLayer!((prevState) => ({
      ...prevState,
      status: false,
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
      globalAction.setShadowAdmin!(1);
      closePopup();
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
      closePopup();
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
};
export default  AdminLayerPopup

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
    }
    .mainColor {
      background-color: #632beb;
    }
  }
`;
