import React, {useContext} from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
//context
import {isHybrid, Hybrid} from 'context/hybrid'
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S} from 'context/config'
//component
import Gnb from './gnb-layout'
import {BroadValidation} from 'pages/common/header/navi'

export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  //data
  const info = [
    {title: '라이브', url: '/live'},
    // {title: '캐스트', url: '/cast'},
    //{title: '랭킹', url: '/ranking'},
    {title: '스토어', url: '/store'},
    //{title: '이벤트', url: '/event'},
    {title: '고객센터', url: '/customer/'}
    //{title: '설정', url: '/store?설정'}
  ]
  const makeNavi = () => {
    return info.map((list, idx) => {
      const _title = info[idx].title
      const _url = info[idx].url
      return (
        <NavLink title={_title} key={idx} to={_url} exact activeClassName="on">
          <LinkLi
            onClick={event => {
              if (_url == '/cast' || _url == '/ranking' || _url == '/event' || _url == '/customer' || _url == '/store?설정') {
                event.preventDefault()
                context.action.alert({
                  msg: '서비스 준비중입니다.'
                })
              } else {
                context.action.updateGnbVisible(false)
              }
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
                BroadValidation()
                context.action.updateGnbVisible(false)
              }}>
              <h2>{context.cast_state ? '방송중' : '방송하기'}</h2>
            </StartBtn>
            {makeNavi()}
            {!isHybrid() && (
              <button
                className="mobile"
                onClick={() => {
                  context.action.alert({
                    //콜백처리
                    callback: () => {},
                    msg: `서비스 준비중입니다.`
                  })
                }}>
                달빛라디오 앱 설치하기
              </button>
            )}
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
