import React, {useEffect} from 'react'
import styled from 'styled-components'
import {IMG_SERVER} from 'context/config'

export default function anniversaryEventPresentPop({setPresentPop, rcvDalCnt}) {
  const closePopup = () => {
    setPresentPop(false)
  }
  const closePopupDim = (e) => {
    closePopup()
  }
  const addStopPropagation = (e) => {
    e.stopPropagation()
  }
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <LayerPopup onClick={closePopupDim}>
      <div className="layerContainer" onClick={addStopPropagation}>
        <h3>축하합니다!</h3>
        <div className="layerContent">
          <img src={`${IMG_SERVER}/event/anniversary/moonBox.png`} className="layerContent__img" />
          <div className="layerContent__subTitle">{rcvDalCnt}달이 지급되었습니다.</div>
          <div className="layerContent__text">달빛라이브 많이 사랑해주세요~♥</div>
        </div>
        <button className="bottomClose" onClick={closePopup}>
          확인
        </button>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </LayerPopup>
  )
}

const LayerPopup = styled.div`
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
    background: url('${IMG_SERVER}/svg/close_w_l.svg') no-repeat 0 0;
  }
  .bottomClose{
    width:100%; height:44px;
    margin-bottom:16px;
    border-radius:12px;
    background:#FF3C7B;
    font-size:18px font-weight:700; color:#fff;
  }

  .layerContainer {
    display:flex; flex-direction:column; align-items:center;
    position: relative;
    min-width: 300px;
    padding: 0 16px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    & > h3,
    .layerTitle {
      width:100%;
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    .layerContent {
        display:flex; flex-direction:column; align-items:center;
      padding: 16px 0;
      background: #fff;
      border-radius: 16px;
        &__img{
            width:228px; height:200px;
        }
        &__subTitle{
            width:100%;
            font-size:20px; font-weight:700; color:#632DED;
            text-align:center;

        }
        &__text{
            width:100%;
            font-size:16px; font-weight:500; color:#000000;
            text-align:center;
        }
    }
  }
`
