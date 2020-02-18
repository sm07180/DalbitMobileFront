/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components

//contents
import Auth from 'pages/common/auth'
import POPCAST from 'components/ui/pop-mic'
import Present from 'pages/broadcast/content/present-popup'
import LiveClickEvent from 'components/ui/eventbox'
//
export default props => {
  //
  const context = useContext(Context)
  //   레이어팝업컨텐츠
  const makePopupContents = () => {
    console.log(context.popup_code)
    switch (context.popup_code) {
      case 'LOGIN': //---------------------------------------로그인
        return <Auth {...props} />
      case 'CAST': //----------------------------------------캐스트
        return <POPCAST {...props} />
      case 'SEND_PRESENT': //----------------------------------------방송-몰래 선물보내기
        return <Present {...props} />
      case 'LiveClickEvent': //----------------------------------------라이브청취자 클릭이벤트
        return <LiveClickEvent {...props} />
    }
  }

  useEffect(() => {
    context.popup_visible ? document.body.classList.add('popup-open') : document.body.classList.remove('popup-open')
  }, [context.popup_visible])

  //---------------------------------------------------------------------
  return (
    <Popup>
      {context.popup_code === 'LOGIN' && context.popup_visible && (
        <Container>
          <Wrap>{makePopupContents()}</Wrap>
          <Background
            onClick={() => {
              context.action.updatePopupVisible(false)
            }}
          />
        </Container>
      )}
      {context.popup_code === 'CAST' && context.popup_visible && (
        <Container>
          <Wrap>{makePopupContents()}</Wrap>
          <Background />
        </Container>
      )}
      {context.popup_code === 'SEND_PRESENT' && context.popup_visible && (
        <>
          <Background
            onClick={() => {
              context.action.updatePopupVisible(false)
            }}
          />
          <Container>{makePopupContents()}</Container>
        </>
      )}
      {context.popup_code === 'LiveClickEvent' && context.popup_visible && (
        <>
          <EventBackground
            onClick={() => {
              context.action.updatePopupVisible(false)
            }}
          />
          <EventContainer>{makePopupContents()}</EventContainer>
        </>
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
  width: 500px;
  padding: 50px 40px;
  background: #fff;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 90%;
    padding: 40px 5%;
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

const EventContainer = styled.div``
const EventBackground = styled.div``
