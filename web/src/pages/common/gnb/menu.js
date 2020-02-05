import React, {useState, useEffect, useContext} from 'react'
import {WIDTH_MOBILE_S, WIDTH_TABLET_S} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
//component
import Gnb from './gnb-layout'
import {Link, NavLink} from 'react-router-dom'
export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  //data
  const info = [
    {title: '라이브', url: '/live'},
    {title: '캐스트', url: '/store?캐스트'},
    {title: '스토어', url: '/store'},
    {title: '이벤트', url: '/event'},
    {title: '랭킹', url: '/store?랭킹'},
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
            <LiveStart>
              <StartBtn></StartBtn>
              <StartIcon>
                <span></span>
                <h2>방송하기</h2>
              </StartIcon>
            </LiveStart>
            {makeNavi()}
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
`
const Nheader = styled.div`
  width: 100%;
  height: 80px;
  padding: 16px 20px 16px 20px;
  box-sizing: border-box;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 64px;
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    height: 56px;
    padding: 10px 10px 16px 10px;
  }
`
const ICON = styled.div`
  float: left;
  width: 48px;
  height: 48px;
  margin-right: 10px;
  background: url('https://devimage.dalbitcast.com/images/api/ic_menu_normal.png') no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE_S}) {
    width: 36px;
    height: 36px;
  }
`
const Title = styled.h2`
  float: left;
  color: #fff;
  font-size: 20px;
  line-height: 48px;
  letter-spacing: -0.5px;
  text-align: left;
  @media (max-width: ${WIDTH_MOBILE_S}) {
    line-height: 36px;
  }
`
const CONTENT = styled.div`
  width: 100%;
  height: calc(100vh -80px);
  padding: 10px 20px 0 20px;
  box-sizing: border-box;
  /* background-color: white; */
`
const LiveStart = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
  cursor: pointer;
`
const StartBtn = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background-color: #fff;
`
const StartIcon = styled.div`
  width: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  & span {
    float: left;
    width: 36px;
    height: 36px;
    background: url('https://devimage.dalbitcast.com/images/api/ico-cast-w.png') no-repeat center center/ cover;
  }
  & h2 {
    float: left;
    width: 64px;
    color: #8556f6;
    font-size: 18px;
    font-weight: 600;
    line-height: 36px;
    letter-spacing: -0.45px;
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
    background: url('http://www.hwangsh.com/img/ic_arrow_right_color_s.png') no-repeat center center / cover;
    transform: translateY(-50%);
    content: '';
  }
`
