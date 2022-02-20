import {COLOR_MAIN} from 'context/color'
import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import CloseBtn from './static/ic_close.svg'

export default (props) => {
  const {setPopup} = props

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

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'rank-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  return (
    <PopupWrap id="rank-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="title-wrap">
          <h4>랭킹 산정 방식</h4>
          <img src={CloseBtn} className="close-btn" onClick={() => closePopup()} />
        </div>

        <div className="tab-wrap">
          <button className={`tab ${tabType === 'today' ? 'active' : ''}`} onClick={() => setTabType('today')}>
            오늘
          </button>
          <button className={`tab ${tabType === 'daily' ? 'active' : ''}`} onClick={() => setTabType('daily')}>
            전일
          </button>
          <button className={`tab ${tabType === 'week' ? 'active' : ''}`} onClick={() => setTabType('week')}>
            주간
          </button>
          {/* <button className={`tab ${tabType === 'month' ? 'active' : ''}`} onClick={() => setTabType('month')}>
            월간
          </button> */}
        </div>

        {tabType === 'today' && (
          <>
            <h5>DJ</h5>
            <p>
              <strong>
                오늘 받은 선물(30%) + 오늘 받은 좋아요(20%)
                <br />+ 오늘 누적 청취자(20%) + 오늘 방송시간(30%)
              </strong>
              <br />
            </p>
            <h5>FAN</h5>
            <p>
              <strong>오늘 보낸 선물(60%) + 오늘 청취시간(40%)</strong>
              <br />
            </p>

            <p className="desc">
              오늘의 랭킹은 종료된 방송방 기준
              <br />
              매일 00:00부터 23:59:59까지 데이터로 집계되며
              <br />
              매일 정시마다 오늘의 랭킹이 갱신됩니다. <br />※ 부스터로 인한 좋아요 제외
            </p>
          </>
        )}

        {tabType === 'daily' && (
          <>
            <h5>DJ</h5>
            <p>
              <strong>
                전일 받은 선물(30%) + 전일 받은 좋아요(20%)
                <br />+ 전일 누적 청취자(20%) + 전일 방송시간(30%)
              </strong>
              <br />
            </p>
            <h5>FAN</h5>
            <p>
              <strong>전일 보낸 선물(60%) + 전일 청취시간(40%)</strong>
              <br />
            </p>

            <p className="desc">
              전일 랭킹은 종료된 방송방 기준
              <br />
              매일 00:00부터 23:59:59까지 데이터로 집계되며
              <br />
              매일 00:00에 전일 랭킹이 갱신됩니다.
              <br />※ 부스터로 인한 좋아요 제외
            </p>
          </>
        )}

        {tabType === 'week' && (
          <>
            <h5>DJ</h5>
            <p>
              <strong>
                전주 받은 선물(30%) + 전주 받은 좋아요(20%)
                <br />+ 전주 누적 청취자(20%) + 전주 방송시간(30%)
              </strong>
              <br />
            </p>
            <h5>FAN</h5>
            <p>
              <strong>전주 보낸 선물(60%) + 전주 청취시간(40%)</strong>
              <br />
            </p>

            <p className="desc">
              주간 랭킹은 종료된 방송방 기준
              <br />
              매주 월요일부터 일요일까지 데이터로 집계되며
              <br />
              매주 월요일 05:00에 주간 랭킹이 갱신됩니다.
              <br />※ 부스터로 인한 좋아요 제외
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
    padding: 20px 0;
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
      padding: 0 16px;
      color: #000;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      letter-spacing: -0.5px;

      &.desc {
        padding-top: 24px;
        color: #757575;
      }
    }

    .title-wrap {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      height: 40px;

      h4 {
        width: 100%;
        font-size: 16px;
        line-height: 18px;
        text-align: center;
      }

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

    .tab-wrap {
      background-color: #f5f5f5;
      text-align: center;

      .tab {
        margin: 0 8px;
        height: 36px;
        font-size: 14px;
        color: #000;
        border-bottom: 1px solid #f5f5f5;

        &.active {
          border-color: #FF3C7B;
          color: #FF3C7B;
        }
      }
    }

    .btn-wrap {
      margin-top: 20px;

      .apply-btn {
        display: block;
        width: 100%;
        border-radius: 12px;
        background-color: #FF3C7B;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        padding: 12px 0;
      }
    }
  }
`
