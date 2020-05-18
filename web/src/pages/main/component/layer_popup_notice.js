import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Checkbox from './Checkbox'
import Utility from 'components/lib/utility'

// static
import CloseBtn from '../static/ic_close.svg'

let prevAlign = null
let prevGender = null

export default (props) => {
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

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const applyClick = () => {
    if (state.click1) {
      console.log('state.click1', state.click1)
      Utility.setCookie('popup_notice', 'Y', 1)
      sessionStorage.setItem('popup_notice', 'n')
    }
    setPopup(false)
  }

  const [state, setState] = useState({})

  return (
    <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap">
        <div className="each-line">
          <p className="text">
            안녕하세요! 달빛라이브입니다. <br />
            <br />
            금일 오후2시부터 약 30분동안 미디어서버 업데이트 작업이 진행됩니다. 해당시간 동안은 방에 참여 또는 생성할 수 없습니다.
            <br />
            <br />
            베타기간 발견된 문제를 해결해 더 안정적인 서비스를 위한 작업이니만큼 불편하시더라도 잠시만 기다려주시기를 부탁드립니다
            <br />
            <br />
            조만간 정식 오픈 관련해서 일정을 공지하도록 하겠습니다. 오늘도 최선을 다하겠습니다.
            <br />
            <br />
            고맙습니다. <br />
            <br />- 달빛라이브 운영자 올림
          </p>

          <Checkbox title="오늘하루 열지 않음" fnChange={(v) => setState({click1: v})} checked={state.click1} />
        </div>
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
        height: 300px;
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
`
