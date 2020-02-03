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
import StyleLottie from './content/style-lottie'
import StyleChat from './content/style-chatTest'
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
      case 'style-lottie':
        return <StyleLottie />
      case 'style-chatTest':
        return <StyleChat />
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
