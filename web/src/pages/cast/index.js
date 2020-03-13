/**
 * @file /cast/index.js
 * @brief 캐스트 페이지
 */
import React, {useEffect, useMemo, useContext, useRef} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
import Utility from 'components/lib/utility'

export default props => {
  //context
  const context = useContext(Context)
  //useMemo
  const nativePlayerInfoCookie = useMemo(() => {
    const _cookie = decodeURIComponent(Utility.getCookie('native-player-info'))
    if (_cookie === '' || _cookie === null || _cookie === undefined) {
      return '쿠키정보없음'
    }
    return _cookie
  })

  //---------------------------------------------------------------------
  //---------------------------------------------------------------------

  return (
    <Layout {...props}>
      <Content>
        <nav>
          <button
            onClick={() => {
              window.location.href = '/app/test'
            }}>
            APP/TEST 이동
          </button>
        </nav>
        <h1>native-player-info 쿠키</h1>
        <section>{JSON.stringify(nativePlayerInfoCookie, null, 1)}</section>
        <h1>CustomHeader</h1>
        <section>{JSON.stringify(context.customHeader, null, 1)}</section>
        <h1>token</h1>
        <section>{JSON.stringify(context.token, null, 1)}</section>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
  nav {
    margin-bottom: 40px;
  }
  button {
    display: inline-block;
    padding: 10px;
    margin: 10px;
    background: #000;
    color: #fff;
  }
  h1 {
    display: block;
    font-size: 18px;
  }
  section {
    padding: 20px;
    font-size: 16px;
    word-break: break-all;
    border-bottom: 1px solid #ccc;
  }
`
