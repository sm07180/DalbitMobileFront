/**
 * @title 가이드페이지
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//pages
import Guide from '../common/layout/guide'
//
import Ajax from './content/guide-ajax'

export default () => {
  //makeContents
  const makeContents = () => {
    switch (code) {
      case 'guide':
        break
      default:
        return <Ajax />
    }
  }
  return <Guide>{makeContents()}</Guide>
}
//---------------------------------------------------------------------
const Wrap = styled.div`
  background: blue;
`
