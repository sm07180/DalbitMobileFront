import React, {useContext, useState, useEffect} from 'react'

//layout
import Layout from 'pages/common/layout'
//components
import {Hybrid} from 'context/hybrid'
import styled from 'styled-components'

import _ from 'lodash'
//
export default props => {
  //---------------------------------------------------------------------
  //state

  useEffect(() => {
    // alert('결과페이지 진입')
    //console.log(props.location.state.result)
  }, [])

  const authClick = () => {
    if (props.location.state.result === 'success') {
      if (props.location.state.returntype === 'store') {
        window.location.href = '/store?webview=new'
      } else if (props.location.state.returntype === 'room') {
        window.location.href = '/pay?webview=new'
      }
    }
  }

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <ChargeWrap>
        <h4>본인 인증이 완료되었습니다.</h4>
        <button
          onClick={() => {
            authClick()
          }}>
          확인
        </button>
      </ChargeWrap>
    </Layout>
  )
}
//---------------------------------------------------------------------

const ChargeWrap = styled.div`
  margin: 30px auto 70px auto;
  h4 {
    padding-top: 40px;
    color: #555;
    font-size: 20px;
    font-weight: 600;
    line-height: 34px;
    text-align: center;
  }

  button {
    display: block;
    max-width: 328px;
    width: 100%;
    margin: 40px auto 30px auto;
    border-radius: 5px;
    background: #632beb;
    color: #fff;
    line-height: 48px;
  }
`
