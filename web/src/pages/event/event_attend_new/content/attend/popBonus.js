import React, {useEffect, useRef, useContext} from 'react'

import {AttendContext} from '../../attend_ctx'
import styled from 'styled-components'
import Lottie from 'react-lottie'
// component
import {IMG_SERVER} from 'context/config'

export default (props) => {
  const {setPopup} = props
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {statusList, dateList} = eventAttendState

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

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  return (
    <PopupWrap id="attend-layer-popup" ref={layerWrapRef} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="lottie-box">
          <Lottie
            options={{
              loop: true,
              autoPlay: true,
              path: `${IMG_SERVER}/event/attend/200617/fansupport1.json`
            }}
          />
        </div>

        <div className="saving-info-box">
          <div className="saving-info-item">
            <span className="exp">EXP</span> <span className="exp color">+{statusList.exp}</span> 냠냠!
          </div>
          <div className="saving-info-item">
            <span className="dal">달 {statusList.dal}</span> <span>냠냠!</span>
          </div>
        </div>

        <button
          className="btn-close"
          onClick={() => {
            closePopup()
          }}>
          <img src="https://image.dallalive.com/images/api/ico_layer_close.svg" />
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
    padding: 20px 0;
    padding-top: 12px;
    border-radius: 12px;
    color: #fff;

    .saving-info-box {
      width: 200px;
      margin: 0 auto 10px auto;
      padding: 17px 23px;
      border-radius: 12px;
      border: solid 3px #000000;
      background-color: #5c40d3;
      text-align: left;

      .saving-info-item {
        font-size: 14px;

        .exp {
          font-size: 18px;
          font-weight: 600;

          &.color {
            color: #ff5ad8;
          }
        }

        .dal {
          font-size: 18px;
          font-weight: 600;
          color: #ffcc00;
        }
      }

      .saving-info-item + .saving-info-item {
        margin-top: 10px;
      }
    }

    .lottie-box {
      width: 200px;
      height: 200px;
      margin: 0 auto;
    }

    .btn-close {
      position: absolute;
      right: 20%;
      top: 5%;
      width: 24px;
      height: 24px;

      img {
        width: 100%;
      }
    }
  }
`
