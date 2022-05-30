import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'

export default function LayerDetail({setLayerGift, content}) {
  const closePopup = () => {
    setLayerGift(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <PopupWrap id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer">
        <h3>경품 상세소개</h3>
        <div className="layerContent" dangerouslySetInnerHTML={{__html: content}}></div>
        <button className="btnClose" onClick={closePopup}></button>
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
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;

  .btnClose {
    position: absolute;
    top: -40px;
    right: 0px;
    width: 32px;
    height: 32px;
    text-indent: -9999px;
    background: url(https://image.dallalive.com/svg/close_w_l.svg) no-repeat 0 0;
  }

  .layerContainer {
    position: relative;
    // width: 100%;
    min-width: 320px;
    max-width: 360px;
    padding: 0 16px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    h3 {
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: $bold;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    .layerContent {
      padding: 16px 0 32px;
      background: #fff;
      border-radius: 16px;
    }
  }
`
