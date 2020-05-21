import React, {useContext, useState, useEffect} from 'react'

//layout
import Layout from 'pages/common/layout'
//components
import {Hybrid} from 'context/hybrid'
import styled from 'styled-components'
import qs from 'query-string'
import _ from 'lodash'
//
export default props => {
  //---------------------------------------------------------------------
  //state
  const [itemInfo, setItemInfo] = useState(qs.parse(location.search))

  const chargeConfirm = () => {
    if (itemInfo.hasOwnProperty('webview')) {
      Hybrid('ClosePayPopup')
      Hybrid('CloseLayerPopup')
    } else {
      window.location.href = '/store'
    }
  }

  useEffect(() => {
    // alert('결과페이지 진입')
  }, [])

  /**
   *
   * @returns
   */
  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <ChargeWrap>
        <h4>결제가 완료되었습니다.</h4>
        <button onClick={chargeConfirm}>확인</button>
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
