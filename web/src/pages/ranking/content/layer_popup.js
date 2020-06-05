import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

// static
import CloseBtn from '../static/ic_close.svg'
import {COLOR_MAIN} from 'context/color'

export default props => {
  const {setPopup} = props

  const typePop = props.dateType
  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const layerWrapNode = layerWrapRef.current
    layerWrapNode.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopup(false)
  }

  const wrapClick = e => {
    const target = e.target
    if (target.id === 'rank-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = e => {
    e.preventDefault()
  }

  const applyClick = () => {
    setPopup(false)
  }

  return (
    <PopupWrap id="rank-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="title-wrap">
          {typePop === 1 && <div className="text">일간 랭킹 산정 방식</div>}
          {typePop === 2 && <div className="text">주간 랭킹 산정 방식</div>}
          {typePop === 3 && <div className="text">월간 랭킹 산정 방식</div>}
          <img src={CloseBtn} className="close-btn" onClick={() => closePopup()} />
        </div>
        <h5>DJ</h5>
        <p>
          <strong>
            받은 별(30%) + 좋아요(20%) +<br />
            누적 청취자(20%) + 방송시간(30%)
          </strong>
          <br />
        </p>
        <h5>FAN</h5>
        <p>
          <strong>보낸 달(60%) + 청취시간(40%)</strong>
          <br />
        </p>
        <br />
        {typePop === 1 && (
          <p>데이터 집계는 매일 00:00부터 23:59:59까지 종료된 방송방 기준으로 집계되며 매일 05:00 전일 데이터가 반영됩니다.</p>
        )}
        {typePop === 2 && (
          <p>
            데이터 집계는 매주 월요일부터 일요일까지 종료된 방송방 기준으로 집계되며 매주 월요일 05:00 전주 데이터가 반영됩니다.
          </p>
        )}
        {typePop === 3 && (
          <p>데이터 집계는 매월 1일부터 마지막 일까지 종료된 방송방 기준으로 집계되며 매월 1일 05:00 전월 데이터가 반영됩니다.</p>
        )}
        <div className="btn-wrap">
          <button className="apply-btn" onClick={applyClick}>
            확인
          </button>
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
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 20px;
    padding-top: 12px;
    border-radius: 12px;
    background-color: #fff;

    h5 {
      margin: 16px 0 12px 0;
      color: ${COLOR_MAIN};
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }

    p {
      color: #000;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
    }

    .title-wrap {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      height: 40px;

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
        left: inherit;
      }
    }

    .btn-wrap {
      margin-top: 20px;

      .apply-btn {
        display: block;
        width: 100%;
        border-radius: 12px;
        background-color: #632beb;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        padding: 12px 0;
      }
    }
  }
`
