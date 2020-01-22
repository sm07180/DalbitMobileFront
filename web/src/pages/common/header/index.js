/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext} from 'react'
import {NavLink} from 'react-router-dom'
import styled from 'styled-components'

//context
import {Context} from 'Context'
//components
import {COLOR_WHITE} from 'Context/color'
import {IMG_SERVER, WIDTH_TABLET} from 'Context/config'
import Profile from './profile'
//
export default () => {
  const context = useContext(Context)
  const info = [
    {title: '라이브', url: '/'},
    {title: '캐스트', url: '/'},
    {title: '랭킹', url: '/'},
    {title: '스토어', url: '/'},
    {title: '방송하기', url: '/'}
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
    <Header>
      <Logo>
        <a href="/">
          <img src={`${IMG_SERVER}/images/api/ic_logo_normal.png`} />
        </a>
      </Logo>
      <CommonMenu>{makeNavigation()}</CommonMenu>
      <UtilMenu>
        <Search
          onClick={() => {
            context.action.updateGnbVisible(true)
          }}>
          검색
        </Search>
        <Login
          onClick={() => {
            if (!context.login_state) {
              context.action.updatePopup('LOGIN')
            } else {
              const result = confirm('로그아웃 하시겠습니까?')
              if (result) {
                alert('정상적으로 로그아웃 되었습니다.')
                context.action.updateLogin(false)
              }
            }
          }}>
          {context.login_state ? '로그아웃' : '로그인'}
        </Login>
        {/* 프로필 */}
        {/* <Profile /> */}
        <Menu
          onClick={() => {
            context.action.updateGnbVisible(true)
          }}>
          메뉴
        </Menu>
      </UtilMenu>
    </Header>
  )
}
//---------------------------------------------------------------------
const Header = styled.header`
  /* mobile media query */
  @media (max-width: ${WIDTH_TABLET}) {
    background: #ff0000;
  }
  /* pc media query */
  position: fixed;
  display: flex;
  width: 100%;
  height: 90px;
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
  align-items: center;
  background: ${COLOR_WHITE};
  z-index: 10;
`

const Logo = styled.h1`
  flex: 1;
  font-size: 24px;
  img {
    margin-top: -10px;
  }
`

const CommonMenu = styled.div`
  flex: 4;
  text-align: center;
  a {
    margin: 0 20px;
  }
`

const UtilMenu = styled.div`
  flex: 1;
  text-align: right;

  button {
    font-size: 16px;
  }

  button + button {
    margin-left: 10px;
  }
`

const Search = styled.button``
const Login = styled.button``
const Menu = styled.button``
