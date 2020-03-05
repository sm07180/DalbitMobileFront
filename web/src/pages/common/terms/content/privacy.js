/**
 * @file terms/content/privacy.js
 * @brief 개인정보 처리방침
 * @todo 컨텐츠 내용 업데이트
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

////---------------------------------------------------------------------
export default props => {
  //context
  const context = useContext(Context)

  //---------------------------------------------------------------------
  return (
    <Content>
      <h2>개인정보 처리방침</h2>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div``
