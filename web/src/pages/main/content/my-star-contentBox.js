import React from 'react'
import styled from 'styled-components'
import {WIDTH_PC_S, WIDTH_TABLET_S, WIDTH_MOBILE} from 'context/config'
export default props => {
  //const {url} = item
  return (
    <>
      <Wrap>{props.children}</Wrap>
    </>
  )
}

const Wrap = styled.div`
  height: 190px;
  margin-right: 20%;
  @media (max-width: 1480px) {
    margin-right: 0;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    height: 140px;
  }
`
