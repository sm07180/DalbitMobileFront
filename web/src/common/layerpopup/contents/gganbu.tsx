import React, { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxExitMarbleInfo} from "../../../redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { exitMarbleInfo } = globalState;
  const history = useHistory();
  const closePopup = () => {
    dispatch(setGlobalCtxExitMarbleInfo({
      ...exitMarbleInfo,
      showState: false,
    }));
  };
  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <PopupWrap id="popupWrap" onClick={closePopupDim}>
      <div className="broadcastCntPopWrap">
        <h1 className="title">깐부게임 보상</h1>
        <div className="textWrap">
          {exitMarbleInfo.marbleCnt >= 0 && (
            <>
              <h2>구슬 지급</h2>
              <p>
                방송 {exitMarbleInfo.isBjYn === "y" ? "누적" : "청취"}{" "}
                {exitMarbleInfo.marbleCnt}
                시간 달성하여
                <br />
                구슬 {exitMarbleInfo.marbleCnt}개가 지급되었습니다.
              </p>
              <div className="marbleStatus">
                <img src="https://image.dalbitlive.com/event/gganbu/marble-red.png" />
                {exitMarbleInfo.rMarbleCnt}
                <img src="https://image.dalbitlive.com/event/gganbu/marble-yellow.png" />
                {exitMarbleInfo.yMarbleCnt}
                <img src="https://image.dalbitlive.com/event/gganbu/marble-blue.png" />
                {exitMarbleInfo.bMarbleCnt}
                <img src="https://image.dalbitlive.com/event/gganbu/marble-purple.png" />
                {exitMarbleInfo.vMarbleCnt}
              </div>
            </>
          )}
          {exitMarbleInfo.pocketCnt >= 0 && (
            <>
              <h2>구슬 주머니 지급</h2>
              <p>
                달 {exitMarbleInfo.pocketCnt}만개 선물 받으신 보상으로
                <br />
                구슬 주머니 {exitMarbleInfo.pocketCnt}개가 지급되었습니다.
              </p>
              <div className="pocketStatus">
                <img src="https://image.dalbitlive.com/event/gganbu/iconScore.png" />
                {exitMarbleInfo.rMarbleCnt}
              </div>
              <button className="contextClose" onClick={closePopup}>
                확인
              </button>
            </>
          )}
        </div>
      </div>
    </PopupWrap>
  );
};

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  z-index: 60;
  .broadcastCntPopWrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 0;
    border-radius: 15px;
    background-color: #fff;
    .title {
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      letter-spacing: -1px;
      color: #000000;
      box-sizing: border-box;
    }
    .textWrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      h2 {
        margin: 16px 0 8px;
        font-size: 16px;
        font-weight: 700;
        color: #FF3C7B;
      }
      p {
        margin-bottom: 8px;
        font-size: 16px;
        text-align: center;
        letter-spacing: -1px;
      }
      .marbleStatus {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        img {
          width: 12px;
          height: 12px;
          margin-left: 15px;
          margin-right: 8px;
        }
      }
      .pocketStatus {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
    .contextClose {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 44px;
      margin-top: 30px;
      border-radius: 12px;
      background-color: #FF3C7B;
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      cursor: pointer;
    }
  }
`;
