/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역 ,100% x 80px
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Context} from 'Context'
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'Context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_MOBILE, WIDTH_TABLET} from 'Context/config'
//components
import Logo from './logo'
import Navi from './navi'
import creatIcon from 'Components/ui/icon'
import Profile from './profile'

//
export default props => {
  //context
  const context = useContext(Context)
  //const
  const type = props.type == 'main' ? 'main' : 'sub'
  //---------------------------------------------------------------------
  return (
    <Header className={type}>
      {/* 상단로고 */}
      <Logo />
      {/* 네비게이션 */}
      <Navi type={type} />

      <UtilMenu>
        <Search
          onClick={() => {
            context.action.updateGnbVisible(true)
          }}>
          {creatIcon('search')}
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
          {context.login_state ? '로그아웃' : creatIcon('profile')}
        </Login>
        {/* 프로필 */}
        {/* <Profile /> */}
        <Menu
          onClick={() => {
            context.action.updateGnbVisible(true)
          }}>
          {creatIcon('menu')}
        </Menu>
      </UtilMenu>
    </Header>
  )
}
//---------------------------------------------------------------------
const Header = styled.header`
  /* mobile media query */
  @media (max-width: ${WIDTH_TABLET}) {
    /* background: #ff0000; */
  }
  /* pc media query */
  position: fixed;
  display: block;
  width: 100%;
  height: 80px;
  align-items: center;
  z-index: 10;

  &.sub {
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
  }
  &.sub a {
    color: #555;
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
