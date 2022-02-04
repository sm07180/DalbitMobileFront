import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// static
import CloseBtn from "../static/ic_close.svg";
import ic_toggle_off from "../static/toggle_off_s.svg";
import ic_toggle_on from "../static/toggle_on_s.svg";

export default (props) => {
  const { setPopup } = props;

  // reference
  const layerWrapRef = useRef();

  const wrapClick = (e) => {
    const target = e.target;
    if (target.id === "main-layer-popup") {
      closePopup();
    }
  };

  const wrapTouch = (e) => {
    e.preventDefault();
  };

  const closePopup = () => {
    setPopup(false);
  };

  return (
    <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">달 자동 교환 이란?</div>
          <img src={CloseBtn} className="close-btn" onClick={() => closePopup()} />
        </div>
        <div className="each-line">
          <p className="line-text">
            <img src={ic_toggle_on} />
            자동 교환 옵션을 설정(ON) 하시면
            <br /> 선물 받은 별이 달로 자동 교환됩니다.
          </p>
          <p className="line-text">
            별과 달의 환전 비율은 60%입니다.
            <br />
            10별 쌓일 때마다 6달로 자동교환됩니다.
          </p>
          <p className="line-text">
            별 → 달 자동 교환을 원치 않으시면 <br />
            언제든지 <img src={ic_toggle_off} />
            해제(OFF) 할 수 있습니다.
          </p>
          <p className="line-text strong">설정(ON)하시면 다음날 00시부터 작동됩니다.</p>
        </div>
      </div>
    </PopupWrap>
  );
};

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    width: calc(100% - 32px);
    max-width: 340px;
    padding: 20px;
    padding-top: 12px;
    border-radius: 12px;
    background-color: #fff;

    .line-text.strong {
      color: #ec455f;
      font-weight: bold;
    }
    .line-text {
      position: relative;
      padding-left: 11px;
      font-size: 14px;
      color: #000;
      line-height: 22px;
      img {
        height: 20px;
        padding: 2px 3px 0 0;
        vertical-align: top;
      }
      &::before {
        position: absolute;
        left: 0;
        top: 10px;
        display: block;
        width: 4px;
        height: 1px;
        background: #000;
        content: "";
      }
    }

    .line-text + .line-text {
      margin-top: 10px;
    }

    .title-wrap {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      height: 40px;
      color: #000;

      .text {
        width: 100%;
        font-weight: 600;
        font-size: 16px;
        text-align: center;
      }

      .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
    }

    .each-line {
      margin-top: 18px;
    }
  }
`;
