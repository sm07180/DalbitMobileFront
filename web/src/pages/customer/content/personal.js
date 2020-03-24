/**
 * @file notice.js
 * @brief 공지사항탭 컨텐츠
 *
 */
import React, {useState, useRef} from 'react'
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN} from 'context/color'

//context
//component

export default props => {
  return (
    <Content>
      <dl>
        <dt>문의 유형 선택</dt>
        <dd>222</dd>
      </dl>
    </Content>
  )
}
//style
//----------------------------------------------------------------------------
//style
//----------------------------------------------------------------------------
const Content = styled.div`
  margin-top: 25px;
  border-top: 1px solid ${COLOR_MAIN};
  & dl {
    width: 100%;
  }
`
