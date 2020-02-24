/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역 ,100% x 80px
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Hybrid} from 'context/hybrid'
import {Context} from 'context'
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//
export default props => {
  //context
  const context = useContext(Context)
  //data

  useEffect(() => {})
  const info = [
    {title: '라이브', url: '/live'},
    {title: '스토어', url: '/store'},
    {title: '이벤트', url: '/event'}
    // {title: '방송하기', url: '/broadcast-setting'}
  ]
  //makeMenu
  const makeNavi = () => {
    //라이브,스토어,이벤트 메뉴
    const navi = info.map((list, idx) => {
      const _title = info[idx].title
      const _url = info[idx].url
      return (
        <NavLink title={_title} key={idx} to={_url} exact activeClassName="on" onClick={event => {}}>
          <span>{_title}</span>
        </NavLink>
      )
    })
    //방송하기
    const broadCast = (
      /**
       * @todos 방송중일때 방송중으로 떠야함
       */

      <button
        key="broadcast"
        onClick={event => {
          event.preventDefault()
          //Hybird App이 아닐때
          if (context.customHeader.os === '3') {
            console.log(props)
            if (context && context.token && !context.token.isLogin) {
              context.action.updatePopup('LOGIN')
              //alert('로그인필요')
              //props.history.push('/login')
              return
            }
            props.history.push('/broadcast-setting')
          } else {
            Hybrid('RoomMake', '')
          }
        }}>
        <span>방송하기</span>
      </button>
    )
    return [navi, broadCast]
  }
  //---------------------------------------------------------------------
  return <Content className={`${props.type}`}>{makeNavi()}</Content>
}
//---------------------------------------------------------------------
const Content = styled.nav`
  display: block;
  position: relative;
  padding-top: 20px;
  text-align: center;
  a {
    display: inline-block;
    position: relative;
    margin: 0 12px;
    padding: 9px;
    color: #757575;
    font-size: 18px;
    letter-spacing: -0.45px;
    @media screen and (min-width: ${WIDTH_TABLET}) {
      &:not(:last-child):hover {
        color: ${COLOR_MAIN};
        font-weight: 600;
      }
      &:after {
        display: inline-block;
        position: absolute;
        left: calc(50% - 4px);
        top: 36px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${COLOR_POINT_Y};
        opacity: 0;
        transition: all 0.2s ease-in-out;
        content: '';
      }
      &:hover::after {
        top: 32px;
        opacity: 1;
      }
    }
  }
  button {
    padding: 9px 20px 9px 48px;
    border-radius: 40px;
    background: ${COLOR_MAIN} url(${IMG_SERVER}/svg/ico-cast-w.svg) no-repeat 9px 2px;
    color: #fff;
    @media (max-width: ${WIDTH_TABLET_S}) {
      padding: 8px 20px 8px 48px;
      border: 1px solid #9168f5;
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 9px 20px;
      border: 0;
      background: #fff;
      color: ${COLOR_MAIN};
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      padding: 6px 15px;
    }
  }
  a:last-child:after {
    display: none;
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
  /* 테블렛 사이즈 */
  @media screen and (max-width: ${WIDTH_TABLET}) {
    a {
      margin: 0 5px;
    }
  }
  /* 테블렛 s 사이즈 */
  @media (max-width: ${WIDTH_TABLET_S}) {
    padding-top: 74px;
    a {
      margin: 0 20px;
      color: #fff;
      font-weight: 600;
    }
  }
  /* 모바일사이즈 */
  @media screen and (max-width: ${WIDTH_MOBILE}) {
    /* 스크롤 */
    &.scroll {
      display: none;
    }
  }
  /* 모바일 s사이즈 */
  @media screen and (max-width: ${WIDTH_MOBILE_S}) {
    padding-top: 70px;
    a {
      padding: 6px;
      font-size: 16px;
      transform: skew(-0.03deg);
    }
  }
  /* 모바일 메인 nav 간격 조정, 520이하부터 일정한 간격으로 떨어지게 */
  @media (max-width: 520px) {
    display: flex;
    justify-content: space-around;
    a {
      margin: 0;
      padding: 6px;
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
