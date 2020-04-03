/**
 * @file /mypage/context/alert.js
 * @brief 마이페이지 알람
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //state

  //-----------------------------------------------------------------------------
  //function

  //-----------------------------------------------------------------------------
  return <Content>알림</Content>
}

const Content = styled.div`
  padding-top: 40px;
`
