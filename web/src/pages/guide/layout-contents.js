/**
 * @title 가이드페이지-메뉴구성
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//components
import {Context} from './store'
//pages
import StyleButton from './content/style-button'
import StyleTab from './content/style-tab'
import StyleChart from './content/style-chart'
import StyleLottie from './content/style-lottie'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //---------------------------------------------------------------------
  //makeContents
  const makeContents = () => {
    switch (store.menuCode) {
      case 'style-button':
        return <StyleButton />
      case 'style-tab':
        return <StyleTab />
      case 'style-chart':
        return <StyleChart />
      case 'style-lottie':
        return <StyleLottie />
      default:
        return <StyleTab />
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
