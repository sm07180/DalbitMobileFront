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

export default props => {
  const context = useContext(Context)
  return (
    <Layout {...props}>
      <Content>
        <p>
          <button
            onClick={() => {
              window.location.href = '/app/test'
            }}>
            APP/TEST 이동
          </button>
        </p>

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
  button {
    display: inline-block;
    padding: 10px;
    margin: 10px;
    background: #000;
    color: #fff;
  }
  section {
    padding: 20px;
    word-break: break-all;
  }
`
