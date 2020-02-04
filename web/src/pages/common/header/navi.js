/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역 ,100% x 80px
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
//
export default props => {
  //context
  const context = useContext(Context)
  //data
  const info = [
    {title: '라이브', url: '/live'},
    {title: '스토어', url: '/store'},
    {title: '이벤트', url: '/event'},
    {title: '방송하기', url: '/broadcast'},
    {title: '(로그인)', url: '/login'}
  ]
  //makeMenu
  const makeNavi = () => {
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
  return <Content className={`${props.type}`}>{makeNavi()}</Content>
}
//---------------------------------------------------------------------
const Content = styled.nav`
  display: block;
  position: relative;
  padding-top: 30px;
  text-align: center;
  a {
    display: inline-block;
    padding: 0 13px;
    color: #111;
  }
  /* 서브페이지 */
  &.sub {
    a {
    }
  }
  /* 메인페이지 & 스크롤 */
  &.scroll {
    a {
    }
  }
  /* 모바일사이즈 */
  @media screen and (max-width: ${WIDTH_MOBILE}) {
    padding-top: 88px;
    /* 스크롤 */
    &.scroll {
      display: none;
    }
  }
  @media screen and (min-width: ${WIDTH_PC}) {
    a:hover {
      font-weight: bold;
    }
    a:hover:after {
      bottom: -12px;
      opacity: 1;
    }
  }
`
