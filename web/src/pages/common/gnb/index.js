/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Context} from 'Context'
//components
import {DEVICE_MOBILE} from 'Context/config'

//
export default () => {
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context)
  const info = [
    {title: '홈', url: '/'},
    {title: '스타일가이드', url: '/guide'},
    {title: '로그인', url: '/login'},
    {title: '회원가입', url: '/user'},
    {title: '라이브방송', url: '/live'},
    {title: '마이페이지', url: '/mypage'},
    {title: '* APP', url: '/app'}
  ]
  //makeMenu
  const makeNavigation = () => {
    return info.map((list, idx) => {
      const _title = info[idx].title
      const _url = info[idx].url
      return (
        <NavLink title={_title} key={idx} to={_url} exact activeClassName="on">
          <span>{_title}</span>
        </NavLink>
      )
    })
  }
  //---------------------------------------------------------------------
  return (
    <Gnb>
      {/* 네비게이션 동적으로생성 */}
      {makeNavigation()}
    </Gnb>
  )
}
//---------------------------------------------------------------------
const Gnb = styled.nav`
  /* pc media query */
  position: fixed;
  width: 200px;
  top: 50px;
  left: 0;
  padding: 10px 20px;
  height: calc(100% - 50px);
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  a {
    display: block;
    padding: 10px 20px;
  }
  /* mobile media query */
  @media (max-width: ${DEVICE_MOBILE}) {
    display: none;
  }
`
