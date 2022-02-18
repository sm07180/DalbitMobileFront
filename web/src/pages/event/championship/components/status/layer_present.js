import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'

import {IMG_SERVER} from 'context/config'

export default function LayerPresent({setLayerPresent}) {
  const closePopup = () => {
    setLayerPresent(false)
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
    <PopupWrap id="layerPopup" className="championship" onClick={closePopupDim}>
      {/* <div className="layerContainer">
        <h3>깜짝 선물 보기</h3>
        <p>
          깜짝 선물은 <br /> 3주차에 공개됩니다
        </p>
        <div className="btnWrap">
          <button className="btn" onClick={closePopup}>
            확인
          </button>
        </div>
        <button className="btnBack popup" onClick={closePopup}>
          <img src={`${IMG_SERVER}/svg/close_w_l.svg`} alt="close" />
        </button>
      </div> */}

      <div className="layerContainer imgSection">
        <div className="bgBox">
          <img src={`${IMG_SERVER}/event/championship/20210223/bg_present.png`} alt="깜짝 선물 이미지" />
        </div>
        <button className="btnBack imgPopup" onClick={closePopup}>
          <img src={`${IMG_SERVER}/svg/close_w_l.svg`} alt="close" />
        </button>
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
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;

  .layerContainer {
    position: relative;
    min-width: 320px;
    max-width: 360px;
    min-height: 230px;
    padding: 0 16px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    &.imgSection {
      background-color: transparent;
    }

    h3 {
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: bold;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    > p {
      padding: 5% 0;
      font-size: 22px;
      font-weight: 500;
      line-height: 30px;
      color: #FF3C7B;
      text-align: center;
    }

    .bgBox {
      height: 480px;
      overflow-y: auto;
      border-radius: 20px;
    }
  }
`
