import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Link, NavLink} from 'react-router-dom'

//context
import {Hybrid} from 'context/hybrid'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//component
import Gnb from './gnb-layout'

export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  //data
  const info = [
    {title: '라이브', url: '/live'},
    {title: '캐스트', url: '/cast'},
    {title: '랭킹', url: '/ranking'},
    {title: '스토어', url: '/store'},
    {title: '이벤트', url: '/event'},
    {title: '고객센터', url: '/store?고객센터'},
    {title: '설정', url: '/store?설정'}
  ]
  const makeNavi = () => {
    return info.map((list, idx) => {
      const _title = info[idx].title
      const _url = info[idx].url
      return (
        <NavLink title={_title} key={idx} to={_url} exact activeClassName="on">
          <LinkLi
            onClick={() => {
              context.action.updateGnbVisible(false)
            }}>
            <span>{_title}</span>
          </LinkLi>
        </NavLink>
      )
    })
  }

  return (
    <>
      <Gnb>
        <NoticeWrap>
          <Nheader>
            <ICON></ICON>
            <Title>전체메뉴</Title>
          </Nheader>

          <CONTENT className={`${props.type}`}>
            <StartBtn
              key="broadcast"
              onClick={event => {
                event.preventDefault()
                //Hybird App이 아닐때
                if (!context.cast_state) {
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
                }
                context.action.updateGnbVisible(false)
              }}>
              <h2>{context.cast_state ? '방송중' : '방송하기'}</h2>
            </StartBtn>
            {makeNavi()}
            <button
              className="mobile"
              onClick={() => {
                context.action.alert({
                  //콜백처리
                  callback: () => {},
                  msg: `현재 준비중입니다.`
                })
              }}>
              달빛라디오 앱 설치하기
            </button>
          </CONTENT>
        </NoticeWrap>
      </Gnb>
    </>
  )
}

//---------------------------------------------------------------------
//styled
const NoticeWrap = styled.div`
  width: 100%;
  height: 100%;
  background: ${COLOR_MAIN};
`
const Nheader = styled.div`
  width: 100%;
  height: 56px;
  padding: 10px;
  box-sizing: border-box;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
`
const ICON = styled.div`
  float: left;
  width: 36px;
  height: 36px;
  margin-right: 10px;
  background: url(${IMG_SERVER}/images/api/ic_menu_normal.png) no-repeat center center / cover;
`
const Title = styled.h2`
  float: left;
  color: #fff;
  font-size: 20px;
  line-height: 36px;
  letter-spacing: -0.5px;
  text-align: left;
`
const CONTENT = styled.div`
  width: 100%;
  height: calc(100vh -80px);
  padding: 10px 20px 40px 20px;
  box-sizing: border-box;
  /* background-color: white; */

  button.mobile {
    display: none;
    position: absolute;
    bottom: 0;
    width: calc(100% - 40px);
    margin-bottom: 20px;
    padding: 16px 16px 16px 55px;
    border: 1px solid #fff;
    border-radius: 50px;
    color: #fff;
    font-size: 16px;
    background: url(${IMG_SERVER}/images/api/btn_logo@3x.png) no-repeat 10% 14px;
    background-size: 20px;
    text-align: left;

    &:after {
      display: block;
      position: absolute;
      right: 20px;
      top: 11px;
      width: 24px;
      height: 24px;
      background: url(${IMG_SERVER}/images/api/ico_down@3x.png) no-repeat center center/ cover;
      content: '';
    }

    @media (max-width: ${WIDTH_TABLET_S}) {
      display: block;
    }
  }
`
const StartBtn = styled.button`
  width: 100%;
  height: 80px;
  margin-bottom: 30px;
  border-radius: 20px;
  background: #fff url(${IMG_SERVER}/images/api/ch_img_gnb_menu.png) no-repeat 82% center;
  background-size: 80px;
  h2 {
    padding: 5px 0 0 40px;
    color: ${COLOR_MAIN};
    font-size: 24px;
    text-align: left;
  }
`
const LinkLi = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #9168f5;
  & span {
    display: block;
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
  }
  &:after {
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/ic_arrow_right_color_s.png) no-repeat center center / cover;
    transform: translateY(-50%);
    content: '';
  }
`
