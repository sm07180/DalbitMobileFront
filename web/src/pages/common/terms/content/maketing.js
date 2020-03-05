/**
 * @file terms/content/maketing.js
 * @brief 마케팅 수신 동의약관
 * @todo 내용 추후 업데이트
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
      <h2>마케팅 수신 동의약관</h2>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div``
