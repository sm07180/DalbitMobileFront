import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// static
import CloseBtn from '../static/ic_close.svg'

export default props => {
  return (
    <PopupWrap className="main-layer-popup">
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">상세조건</div>
          <img src={CloseBtn} className="close-btn" />
        </div>

        <div className="align-tab">
          <div className="text">정렬기준</div>
        </div>
        <div className="dj-type">
          <div className="text">DJ 타입 선택</div>
        </div>
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    width: calc(100% - 32px);
    /* height: 330px; */
    border-radius: 12px;
    background-color: #fff;

    .title-wrap {
      .text {
        font-weight: 600;
        font-size: 16px;
        text-align: center;
      }
    }
  }
`
