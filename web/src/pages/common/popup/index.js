/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'Context'
//components

//contents
import Auth from 'Pages/common/auth'
//
export default () => {
  //
  const context = useContext(Context)
  //   레이어팝업컨텐츠
  const makePopupContents = () => {
    console.log(context.popup_code)
    switch (context.popup_code) {
      case 'LOGIN':
        return <Auth />
    }
  }
  //---------------------------------------------------------------------
  return (
    <Popup>
      {context.popup_visible && (
        <>
          <Background
            onClick={() => {
              context.action.updatePopupVisible(false)
            }}
          />
          <Container>{makePopupContents()}</Container>
        </>
      )}
    </Popup>
  )
}

//---------------------------------------------------------------------
const Popup = styled.section`
  /* mobile media query */

  /* pc media query */
`
const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
`
const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.8);
`
