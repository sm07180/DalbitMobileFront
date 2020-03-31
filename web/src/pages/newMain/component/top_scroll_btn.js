import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'

import {Context} from 'context'

// static
import TopScrollIcon from '../static/ic_circle_top.svg'

export default props => {
  const globalCtx = useContext(Context)
  const {logoChange} = globalCtx

  const scrollToTop = () => {
    if (logoChange && window.scrollY) {
      window.scrollTo(0, 0)
    }
  }

  return <TopScrollBtn onClick={scrollToTop} logoChange={logoChange} />
}

const TopScrollBtn = styled.button`
  display: ${props => (props.logoChange ? 'block' : 'none')};
  position: fixed;
  bottom: 30px;
  right: 10px;
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${TopScrollIcon});
`
