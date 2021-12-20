import React, {useEffect, useRef, useContext} from 'react'
import styled from 'styled-components'

import {useHistory} from 'react-router-dom'
import {AttendContext} from '../../attend_ctx'

export default (props) => {
  const {setPopup} = props
  const history = useHistory()
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {summaryList, statusList, dateList} = eventAttendState

  // reference
  const layerWrapRef = useRef()

  const closePopup = () => {
    setPopup(false)
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const dalExp = () => {
    let gift

    if (statusList.the_day === '0' || statusList.the_day === '1' || statusList.the_day === '2' || statusList.the_day === '3') {
      gift = '2달+10EXP'
    } else if (statusList.the_day === '4') {
      gift = '2달+15EXP'
    } else {
      gift = '4달+15EXP'
    }
    return gift
  }

  //-------------------------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const layerWrapNode = layerWrapRef.current
    layerWrapNode.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <PopupWrap id="attend-layer-popup" ref={layerWrapRef} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <button
          className="btn-close"
          onClick={() => {
            closePopup()
          }}>
          <img src="https://image.dalbitlive.com/svg/ic_close_w.svg" />
        </button>
        <div className="attendAlertBox">
          <div className="attendAlertBox__image">
            <img src="https://image.dalbitlive.com/event/attend/201019/exp_img@2x.png" alt="경험치" />
          </div>
          <p className="attendAlertBox__title">
            출석체크 성공!
            <br />
            <span>{dalExp()} 지급!</span>
          </p>
          <p className="attendAlertBox__subTitle">[내 지갑]을 확인하세요!</p>
          <button type="button" onClick={closePopup}>
            확인
          </button>

          {eventAttendState.ios === 'Y' ? (
            ''
          ) : (
            <div
              className="goRoulette"
              onClick={() => {
                history.push('/event/attend_event/roulette')
                setPopup(false)
                eventAttendAction.setTab('roulette')
              }}>
              <img src="https://image.dalbitlive.com/event/attend/201028/roulette.gif" width="22px" />
              <span>룰렛 응모하기</span>
            </div>
          )}
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
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 36px 16px 25px 16px;
    border-radius: 12px;
    background-color: #fff;
    box-sizing: border-box;

    .attendAlertBox {
      &__image {
        text-align: center;
        img {
          max-width: 140px;
        }
      }

      &__title {
        padding: 16px 0;
        font-size: 20px;
        line-height: 28px;
        font-weight: 800;

        span {
          color: #632beb;
        }
      }

      button {
        width: 100%;
        height: 44px;
        margin-top: 24px;
        border-radius: 12px;
        background-color: #632beb;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
      }

      .goRoulette {
        margin-top: 20px;
        span {
          display: inline-block;
          margin-left: 6px;
          font-size: 18px;
          font-weight: 600;
          text-decoration: underline;
          color: #632beb;
        }
      }
    }

    .btn-close {
      position: absolute;
      right: 0;
      top: -42px;
      width: 36px;
      height: 36px;

      img {
        width: 100%;
      }
    }
  }
`
