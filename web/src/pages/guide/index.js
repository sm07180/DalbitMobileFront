/**
 * @title 가이드페이지
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//pages
import Guide from '../common/layout/guide'
// import Guide from ' pages/common/layout/guide.js'

export default () => {
  return (
    <Guide>
      <Wrap>dd</Wrap>
      <h1>sss </h1>
    </Guide>
  )
}

const Wrap = styled.div`
  background: blue;
`
