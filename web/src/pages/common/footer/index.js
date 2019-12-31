/**
 * @title footer
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//pages
//---------------------------------------------------------------------
export default () => {
  return (
    <Footer>
      <Menu>
        <a href="#">회사소개</a>
        <a href="#">회사소개</a>
        <a href="#">회사소개</a>
        <a href="#">회사소개</a>
        <a href="#">회사소개</a>
        <a href="#">회사소개</a>
        <a href="#">회사소개</a>
      </Menu>
      <div className="link"></div>
  </Footer>
  )
}

//---------------------------------------------------------------------
const Footer = styled.footer`
  

`
const Menu = styled.div`
 a{
   display:inline-block;
   margin-left:10px;
   padding:5px;
   color:#111;
   fonts-size:14px;
 }

`