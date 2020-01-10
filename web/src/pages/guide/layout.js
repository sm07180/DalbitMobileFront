/**
 * @brief 가이드페이지 레이아웃
 * @author 손완휘
 */
import React from 'react'
import styled from 'styled-components'
//context
import {GuideProvider} from './store'
//component
import Menu from './layout-menu'
//

const Guide = props => {
  //initalize
  const {children} = props
  //---------------------------------------------------------------------
  return (
    <GuideProvider>
      <Contents>
        {/* 가이드에 관련된 메뉴들 */}
        <Menu />
        {/* 컨텐츠영역 */}
        <article>{children}</article>
      </Contents>
    </GuideProvider>
  )
}
export default Guide
//---------------------------------------------------------------------
const Contents = styled.main`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;

  article {
    padding: 20px 20px 20px 200px;
    box-sizing: border-box;
  }
  nav {
    position: absolute;
    left: 0;
    width: 200px;
    height: 100vh;
  }
`
