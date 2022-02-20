import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'
// component
import {IMG_SERVER} from 'context/config'

export default (props) => {
  const {setPopup, statusList, setStatusList} = props

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

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'attend-layer-popup') {
      closePopup()
    }
  }

  const setPopupCookie = (c_name, value) => {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + 1)
    exdate.setHours(0)
    exdate.setMinutes(0)
    exdate.setSeconds(0)

    const encodedValue = encodeURIComponent(value)
    const c_value = encodedValue + '; expires=' + exdate.toUTCString()
    document.cookie = c_name + '=' + c_value + '; path=/; secure; domain=.dalbitlive.com'
  }

  const applyClick = () => {
    setPopupCookie('attend-layer-popup', 'y')

    setPopup(false)
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  return (
    <PopupWrap id="attend-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
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

        <p
          className="today-text"
          onClick={() => {
            applyClick()
          }}>
          다시 보지 않음 <img src={`${IMG_SERVER}/images/api/ico_layer_checkbox.svg`} />
        </p>

        <button
          className="btn-close"
          onClick={() => {
            closePopup()
          }}>
          <img src="https://image.dalbitlive.com/images/api/ico_layer_close.svg" />
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

    .today-text {
      text-shadow: 1.8px 2.4px 6px rgba(0, 0, 0, 0.53);
      font-size: 12px;
      font-weight: 600;

      img {
        width: 15px;
        height: 14px;
      }
    }

    .btn-close {
      position: absolute;
      right: 20%;
      top: 27%;
      width: 24px;
      height: 24px;

      img {
        width: 100%;
      }
    }
  }
`
