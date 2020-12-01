import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

// static
import CloseBtn from '../../menu/static/close_w_l.svg'
import ic_toggle_off from '../static/toggle_off_s.svg'
import ic_toggle_on from '../static/toggle_on_s.svg'
// context
import {COLOR_MAIN, COLOR_WHITE} from 'context/color'
import {WIDTH_MOBILE_S} from 'context/config'

export default (props) => {
  const {setPopup} = props

  // reference
  const layerWrapRef = useRef()

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const closePopup = () => {
    setPopup(false)
  }

  return (
    <div id="mainLayerPopup" ref={layerWrapRef} onClick={closePopup}>
      <div className="popup popup-exp">
        <div className="popup__wrap">
          <div className="popbox active">
            <div className="popup__box popup__text">
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                <div className="popup__title">
                  <h3 className="h3-tit">달 자동 교환 이란?</h3>
                  <button className="close-btn" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="닫기" />
                  </button>
                </div>
                <div className="inner">
                  <p className="line-text">
                    <img src={ic_toggle_on} />
                    자동 교환 옵션을 설정(ON) 하시면
                    <br /> 선물 받은 별이 달로 자동 교환됩니다.
                  </p>
                  <p className="line-text">
                    별과 달의 환전 비율은 60%입니다.
                    <br />
                    10별 쌓일 때마다 6달로 자동교환됩니다.
                  </p>
                  <p className="line-text">
                    별 → 달 자동 교환을 원치 않으시면 <br />
                    언제든지 <img src={ic_toggle_off} />
                    해제(OFF) 할 수 있습니다.
                  </p>
                  <p className="line-text red">설정(ON)하시면 다음날 00시부터 작동됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    max-width: 578px;
    border-radius: 12px;
    background-color: ${COLOR_WHITE};
    text-align: center;
    .title-wrap {
      position: relative;
      border-bottom: 1px solid #e0e0e0;
      .h3-tit {
        padding: 13px 13px;
        font-weight: 600;
        font-size: 16px;
      }
      .close-btn {
        position: absolute;
        top: 6px;
        right: 7px;
      }
    }
    .contents-box {
      padding: 13px 17px 35px;

      .line-text {
        position: relative;
        padding-left: 11px;
        font-size: 14px;
        color: #000;
        line-height: 22px;
        img {
          height: 20px;
          padding: 2px 3px 0 0;
          vertical-align: top;
        }
        &::before {
          position: absolute;
          left: 0;
          top: 10px;
          display: block;
          width: 4px;
          height: 1px;
          background: #000;
          content: '';
        }
        &.red {
          color: #ec455f;
          font-weight: bold;
        }
      }

      .line-text + .line-text {
        margin-top: 10px;
      }

      li {
        padding-top: 16px;
        &:first-child {
          padding-top: 0;
        }
        .ico-box {
          display: flex;
          justify-content: center;
          align-content: center;
          align-items: flex-start;
          span {
            display: block;
            width: 50%;
            padding: 0 5px;
            em {
              display: inline-block;
              min-width: 94px;
              min-height: 28px;
              padding: 6px 8px 4px;
              text-align: center;
              border-radius: 10px;
              font-size: 14px;
              line-height: 1.2;
              font-weight: 600;
              font-style: normal;
            }
            &.txt {
              text-align: right;
              em {
                color: ${COLOR_MAIN};
                background: #f5f5f5;
              }
            }
          }
        }
        .msg {
          display: block;
          padding-top: 8px;
          font-size: 12px;
          color: #424242;
          font-style: normal;
          font-weight: 600;
        }
      }
    }
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    .content-wrap {
      height: 88%;
    }
    .contents-box {
      height: 88%;
      overflow-y: auto;
      ul {
        height: 100%;
      }
    }
  }
`
