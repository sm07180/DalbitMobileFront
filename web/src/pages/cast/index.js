/**
 * @file /cast/index.js
 * @brief 캐스트 페이지
 */
import React, {useEffect, useState, useContext, useRef} from 'react'
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
  const context = useContext(Context)
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
        <h1>기능단위테스트</h1>
        <section>
          <button
            onClick={() => {
              const _info = JSON.parse(Utility.getCookie('native-info'))
              if (_info === '' || _info === undefined) {
                alert('쿠키없음')
              } else {
                alert(JSON.stringify(_info, null, 1))
              }
            }}>
            native-info
          </button>
        </section>
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
