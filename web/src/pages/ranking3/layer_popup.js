import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'

import {COLOR_MAIN} from 'context/color'

export default props => {
  // reference
  const [tabType, setTabType] = useState('today') // event, comment
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

  return (
    <PopupWrap id="rank-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="title-wrap">
          <h4>랭킹 산정 방식</h4>
          <img src="" className="close-btn" onClick={() => closePopup()} />
        </div>

        <div className="tab-wrap">
          <div className={`tab ${tabType === 'today' ? 'active' : ''}`} onClick={() => setTabType('today')}>
            오늘
          </div>
          <div className={`tab ${tabType === 'daily' ? 'active' : ''}`} onClick={() => setTabType('daily')}>
            일간
          </div>
          <div className={`tab ${tabType === 'week' ? 'active' : ''}`} onClick={() => setTabType('week')}>
            주간
          </div>
          <div className={`tab ${tabType === 'month' ? 'active' : ''}`} onClick={() => setTabType('month')}>
            월간
          </div>
        </div>

        {tabType === 'today' && (
          <>
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
          </>
        )}

        {tabType === 'daily' && (
          <>
            <h5>DJ</h5>
            <p>
              <strong>누적 청취자(20%) + 방송시간(30%)</strong>
              <br />
            </p>
            <h5>FAN</h5>
            <p>
              <strong>보낸 달(60%) + 청취시간(40%)</strong>
              <br />
            </p>
          </>
        )}

        {tabType === 'week' && (
          <>
            <h5>DJ</h5>
            <p>
              <strong>누적 청취자(20%) ddd+ 방송시간(30%)</strong>
              <br />
            </p>
            <h5>FAN</h5>
            <p>
              <strong>보낸 달(60%) + 청취시간(40%)</strong>
              <br />
            </p>
          </>
        )}

        {tabType === 'month' && (
          <>
            <h5>DJ</h5>
            <p>
              <strong>누적 청취자(20%) + 방송시간(30%)</strong>
              <br />
            </p>
            <h5>FAN</h5>
            <p>
              <strong>보낸 달(60%) + 청취시간(40%)aaa</strong>
              <br />
            </p>
          </>
        )}
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
