import React, {useState, useEffect} from 'react'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_MOBILE_S, WIDTH_TABLET_S} from 'context/config'
import styled from 'styled-components'

//component
import Gnb from './gnb-layout'

export default props => {
  //---------------------------------------------------------------------
  const [notice, setNotice] = useState(props.NoticeInfo)
  const arrayNotice = notice.map((item, index) => {
    const {id, title, url} = item
    return (
      <InfoWrap key={index}>
        <IMG bg={url}></IMG>
        <TALK>
          {title}
          <span>13시간 전</span>
        </TALK>
      </InfoWrap>
    )
  })
  return (
    <>
      <Gnb>
        <NoticeWrap>
          <Nheader>
            <ICON></ICON>
            <Title>알림사항</Title>
          </Nheader>
          <CONTENT>{arrayNotice}</CONTENT>
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
  height: 56px;
  padding: 10px;
  box-sizing: border-box;
  background: ${COLOR_MAIN};
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
  background: url('https://devimage.dalbitcast.com/images/api/ic_alarm.png') no-repeat center center / cover;
`
const Title = styled.h2`
  float: left;
  margin-left: 8px;
  color: #fff;
  font-size: 20px;
  line-height: 36px;
  letter-spacing: -0.5px;
  text-align: left;
`
const CONTENT = styled.div`
  width: 100%;
  height: calc(100vh - 56px);
  padding: 24px 20px 0 20px;
  border-left: 1px solid #eee;
  box-sizing: border-box;
  background-color: white;
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: calc(100vh - 56px);
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    height: calc(100vh - 64px);
  }
`
const InfoWrap = styled.div`
  overflow: hidden;
  width: 100%;
  margin-bottom: 16px;
`
const IMG = styled.div`
  float: left;
  width: 36px;
  height: 36px;
  margin: 1px 10px 0 0;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const TALK = styled.h4`
  float: left;
  color: #757575;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
  span {
    display: block;
    color: #dbdbdb;
    font-size: 12px;
  }
`
