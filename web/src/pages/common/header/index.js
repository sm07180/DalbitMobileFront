/**
 * @title footer
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//pages

export default () => {
  return (
    <Header>
      <a href="#" className="logo">
        CREAM RADIO
      </a>
    </Header>
  )
}

const Header = styled.header`
  background: #eee;
  height: 50px;
  box-sizing: border-box;
  .logo {
    display: inline-block;
    padding: 10px 20px;
  }
`
