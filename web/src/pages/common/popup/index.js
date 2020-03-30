/**
 * @file popup/index.js
 * @brief 공통 팝업
 * @use context.action.updatePopup('CHARGE')
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components

//contents
import Auth from 'pages/common/auth'
import Charge from 'pages/broadcast/content/tab/charge-popup'
import Terms from 'pages/common/terms'

//
export default props => {
  //state
  const [layout, setLayout] = useState('')
  //context
  const context = useContext(Context)
  //   레이어팝업컨텐츠
  const makePopupContents = () => {
    switch (context.popup_code[0]) {
      case 'LOGIN': //---------------------------------------로그인
        return <Auth {...props} />
      case 'CHARGE': //---------------------------------------충전
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <Charge {...props} />
          </>
        )
      case 'TERMS': //---------------------------------------이용약관
        return (
          <>
            <button
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              팝업닫기
            </button>
            <Terms {...props} />
          </>
        )
      default:
        return <div>팝업 컨텐츠가 정의되지않음</div>
    }
  }
  //useEffect
  useEffect(() => {
    context.popup_visible ? document.body.classList.add('popup-open') : document.body.classList.remove('popup-open')
  }, [context.popup_visible])

  useEffect(() => {
    if (context.popup_code[0] == 'TERMS') {
      setLayout('round terms')
    } else if (context.popup_code[0] == 'CHARGE') {
      setLayout('round charge')
    } else {
      setLayout('square')
    }
  }, [context.popup_code])

  //---------------------------------------------------------------------
  return (
    <Popup>
      {context.popup_visible && (
        <Container>
          <Wrap className={layout}>{makePopupContents()}</Wrap>
          <Background
            onClick={() => {
              context.action.updatePopupVisible(false)
            }}
          />
        </Container>
      )}
    </Popup>
  )
}

//---------------------------------------------------------------------
const Popup = styled.section``
const Container = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding-left: 25px;
  padding-right: 25px;
  align-items: center;
  justify-content: center;
  z-index: 100;

  & .logo {
    margin-top: 0;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    padding: 0;
  }
`
const Wrap = styled.div`
  position: relative;
  width: 520px;
  padding: 50px 40px;
  background: #fff;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    height: 100%;
    padding: 60px 5%;
  }

  &.round {
    width: 500px;
    padding: 30px 0;
    height: 80%;
    max-height: auto;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 100%;
      max-height: 80%;
    }
    &.charge {
      width: 340px;
      max-height: 90%;
      padding: 0;
      height: auto;
    }

    @media (max-width: ${WIDTH_MOBILE}) {
      &.charge {
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }
      &.terms {
        width: 90%;
      }
    }
  }

  & > button {
    display: inline-block;
    position: absolute;
    width: 36px;
    height: 36px;
    top: -35px;
    right: -12px;
    background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    text-indent: -9999px;
    cursor: pointer;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    &.charge,
    &.square {
      & > button {
        top: 18px;
        right: 8px;
        width: 30px;
        height: 30px;
        z-index: 10;
        &:before,
        &:after {
          position: absolute;
          top: 0;
          left: 15px;
          content: ' ';
          height: 30px;
          width: 1px;
          background-color: #959595;
        }
        &:before {
          transform: rotate(45deg);
        }
        &:after {
          transform: rotate(-45deg);
        }
      }
    }
  }
`
const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
`
