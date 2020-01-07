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
        <a href="/guide">회사 소개</a>
        <a href="#">서비스 소개</a>
        <a href="#">인재채용</a>
        <a href="#">개인정보 처리방침</a>
        <a href="#">서비스 이용약관</a>
        <a href="#">청소년 보호정책</a>
        <a href="#">운영정책</a>
      </Menu>
      <Info>
        <strong>대표이사: 박희천 </strong>사업자등록번호: 000-00-00000|통신판매업 신고번호: 제 2018-서울강남-00000호 <br></br>
        주소: 서울특별시 강남구 강남대로 408 연락처: 1661-8726 제휴/이벤트: inforex@inforex.com
      </Info>
    </Footer>
  )
}

//---------------------------------------------------------------------
const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  display: block;
  padding: 10px;
  background: #ccc;
  box-sizing: border-box;
`
const Info = styled.p`
  display: block;
  font-size: 12px;
`
const Menu = styled.div`
  a {
    display: inline-block;
    margin-right: 10px;
    padding: 5px;
    color: #111;
    fonts-size: 14px;
  }
`
