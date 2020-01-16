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
        <li>
          <span>대표이사</span>박진
        </li>
        <li>
          <span>사업자등록번호</span>409-81-49209
        </li>
        <li>
          <span>통신판매업 신고번호</span>제2004-30호
        </li>
      </Info>
      <Info>
        <li>
          <span>주소</span>서울특별시 강남구 테헤란로83길 18(삼성동) 8층
        </li>
        <li>
          <span>연락처</span>연락처
        </li>
        <li>
          <span>제휴/이벤트</span>inforex @inforex.com
        </li>
      </Info>
      <Logo>INFOREX LOGO</Logo>
      <Copyright>Copyrightⓒ2020 by (주)인포렉스. All rights reserved.</Copyright>
    </Footer>
  )
}

//---------------------------------------------------------------------
const Footer = styled.footer`
  display: block;
  padding-bottom: 200px;
  text-align: center;
`
const Info = styled.ul`
  font-size: 12px;

  li {
    display: inline-block;
    font-size: 14px;
    line-height: 28px;
    color: #757575;
    span {
      padding-right: 10px;
      color: #bdbdbd;
    }
  }
  li + li {
    margin-left: 20px;
  }
`
const Menu = styled.div`
  margin-bottom: 80px;
  border-top: 1px solid #8556f6;
  border-bottom: 1px solid #e0e0e0;
  padding: 18px 0;
  a {
    display: inline-block;
    margin-right: 10px;
    padding: 5px;
    color: #8556f6;
    font-size: 14px;
  }
`

const Logo = styled.div`
  margin: 70px 0 20px 0;
`
const Copyright = styled.p`
  color: #bdbdbd;
  font-size: 14px;
`
