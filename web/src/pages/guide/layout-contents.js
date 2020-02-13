/**
 * @title 가이드페이지-메뉴구성
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//components
import {Context} from './store'
//pages
import StyleButton from './content/style-button'
import StyleWebRtcTest from './content/style-WebRtcTest'
import StyleChart from './content/style-chart'
import GuideResponsive from './content/guide-responsive'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //---------------------------------------------------------------------
  //makeContents
  const makeContents = () => {
    switch (store.menuCode) {
      case 'guide-responsive':
        return <GuideResponsive />
      case 'style-button':
        return <StyleButton />
      case 'style-WebRtcTest':
        return <StyleWebRtcTest />
      case 'style-chart':
        return <StyleChart />

      default:
        return <StyleWebRtcTest />
    }
  }
  //---------------------------------------------------------------------
  return <Contents>{makeContents()}</Contents>
}
//---------------------------------------------------------------------
const Contents = styled.section`
  display: block;
  padding: 10px;
  box-sizing: border-box;
`
