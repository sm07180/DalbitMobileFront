/**
 * @file logo.js
 * @brief Header영역의 좌측 로고
 * @todo 반응형으로 처리되어야함
 */

import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_TABLET} from 'Context/config'
//components
//
export default () => {
  //const
  const url = `${IMG_SERVER}/images/api/ic_logo_normal.png`
  //---------------------------------------------------------------------
  return (
    <Content className="logo">
      <Link to="/">
        <img src={url} />
      </Link>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  position: fixed;
  top: 16px;
  left: 24px;
  width: 20%;
  box-sizing: border-box;
  a {
    display: inline-block;
    max-width: 184px;
    min-width: 128px;
    img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
`
