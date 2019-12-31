/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//component
import Navi from '@/pages/guide/content/navi'

const Guide = props => {
  //initalize
  const {children} = props
  //---------------------------------------------------------------------
  return (
    <Contents>
      {/* 가이드에 관련된 메뉴들 */}
      <Navi />
      <article>{children}</article>
    </Contents>
  )
}
export default Guide
//---------------------------------------------------------------------
const Contents = styled.main`
  width: 100%;
  box-sizing: border-box;
  article {
    padding-left: 200px;
    box-sizing: border-box;
  }
  nav {
    position: absolute;
    left: 0;
    width: 200px;
    height: 100vh;
  }
`
