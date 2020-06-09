import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Checkbox from './Checkbox'
import Utility from 'components/lib/utility'
import {IMG_SERVER} from 'context/config'

// static
import CloseBtn from '../static/ic_close.svg'
import popupImg from '../static/popup_20200604.png'

let prevAlign = null
let prevGender = null

export default props => {
  const {setPopup} = props

  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopup(false)
  }

  const wrapClick = e => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = e => {
    e.preventDefault()
  }

  const setPopupCookie = (c_name, value) => {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + 1)
    exdate.setHours(0)
    exdate.setMinutes(0)
    exdate.setSeconds(0)

    const encodedValue = encodeURIComponent(value)
    const c_value = encodedValue + '; expires=' + exdate.getTime()
    document.cookie = c_name + '=' + c_value + '; path=/; secure; domain=.dalbitlive.com'
  }

  const applyClick = () => {
    setPopupCookie('popup_notice200609', 'y')
    setPopup(false)
  }

  const [state, setState] = useState({})

  return (
    <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick}>
      <div className="img-wrap">
        <img src={`${IMG_SERVER}/images/api/popup_20200609.png`} />

        <button
          className="link"
          onClick={() => {
            window.location.href = '/event_page'
          }}>
          자세히보기
        </button>
        <button
          className="apply"
          onClick={() => {
            applyClick()
          }}>
          오늘하루보지않기
        </button>
        <button
          className="close"
          onClick={() => {
            closePopup()
          }}>
          닫기
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

  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    width: calc(100% - 32px);
    max-width: 360px;
    padding: 20px;
    padding-top: 12px;
    border-radius: 12px;
    background-color: #fff;

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
      }
    }

    .each-line {
      margin-top: 24px;

      .text {
        overflow: auto;
        max-height: 300px;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 10px;
      }

      .tab-wrap {
        display: flex;
        flex-direction: row;

        .tab {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          color: #000;

          width: 33.3334%;
          padding: 7px 0;
          margin: 0 2px;
          box-sizing: border-box;
          text-align: center;

          &.active {
            border-color: transparent;
            background-color: #632beb;
            color: #fff;
          }

          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
        }
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

  .img-wrap {
    position: relative;
    width: 284px;
    height: 404px;
    img {
      width: 280px;
    }
    button {
      position: absolute;
      font-size: 0;
      /* border: 1px solid #000; */
    }
    .close {
      right: 20px;
      top: 25px;
      width: 32px;
      height: 32px;
    }
    .link {
      width: 271px;
      height: 283px;
      bottom: 70px;
      left: 4px;
    }
    .apply {
      width: 150px;
      height: 31px;
      bottom: 21px;
      left: 61px;
    }
  }
`
