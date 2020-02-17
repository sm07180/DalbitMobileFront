import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Navi from './navibar'

export default props => {
  return (
    <Container>
      <Navi title={'선물'} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  flex-direction: column;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 360px;
  }
`
