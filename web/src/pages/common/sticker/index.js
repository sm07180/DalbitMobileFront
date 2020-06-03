/**
 * @file popup/index.js
 * @brief 공통 팝업
 * @use context.action.updatePopup('CHARGE')
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
//components

//contents

//
export default (props) => {
  //state
  const [layout, setLayout] = useState('')
  //context
  const context = useContext(Context)
  //   레이어팝업컨텐츠

  //useEffect

  useEffect(() => {
    console.log('context.sticker ' + context.sticker)
  }, [context.sticker])

  //---------------------------------------------------------------------
  return (
    <Content>
      <p>{context.stickerMsg.title}</p>
      <a
        href="#"
        onClick={() => {
          context.action.updateSticker(false)
        }}>
        닫기
      </a>
    </Content>
  )
}

//---------------------------------------------------------------------

const Content = styled.div`
  display: block;
  position: relative;
  margin-top: 49px;
  padding: 10px;
  background: #e1e1e1;
  p {
    font-size: 16px;
    text-align: center;
  }
  a {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`
