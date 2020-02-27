/**
 * @file popup/index.js
 * @brief 로그인 팝업
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components

//contents
import Auth from 'pages/common/auth'
import Terms from 'pages/common/terms'

//
export default props => {
  //context
  const context = useContext(Context)
  //   레이어팝업컨텐츠
  const makePopupContents = () => {
    switch (context.popup_code[0]) {
      case 'LOGIN': //---------------------------------------로그인
        return <Auth {...props} />
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

  //---------------------------------------------------------------------
  return (
    <Popup>
      {context.popup_visible && (
        <Container>
          <Wrap className={context.popup_code[0] == 'TERMS' ? 'round' : 'square'}>{makePopupContents()}</Wrap>
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
  align-items: center;
  justify-content: center;
  z-index: 100;

  & .logo {
    margin-top: 0;
  }
`
const Wrap = styled.div`
  position: relative;
  width: 500px;
  padding: 50px 40px;
  background: #fff;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 90%;
    padding: 40px 5%;
  }

  &.round {
    width: 450px;
    padding: 30px 0;
    height: 80%;
    max-height: auto;
    border-radius: 10px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 100%;
      max-height: 80%;
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
