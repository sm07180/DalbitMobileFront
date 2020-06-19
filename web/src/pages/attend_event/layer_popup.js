import {COLOR_MAIN} from 'context/color'
import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'

export default (props) => {
  const {setPopup, statusList} = props
  console.log(statusList)

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
        <div>애니메이션</div>

        <div className="saving-info-box">
          <div className="saving-info-item">
            <span className="exp">EXP</span> <span className="exp color">+{statusList.exp}</span> 냠냠!
          </div>
          <div className="saving-info-item">
            <span className="dal">달 {statusList.dal}</span> <span>냠냠!</span>
          </div>
        </div>

        <p className="today-text">
          오늘 하루 보지 않기 <img src="https://image.dalbitlive.com/images/api/ico_layer_checkbox.svg" />
        </p>

        <button className="btn-close">
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
      top: 10%;
      width: 24px;
      height: 24px;

      img {
        width: 100%;
      }
    }
  }
`
