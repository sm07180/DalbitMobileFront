import React, {useState, useEffect} from 'react'
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
        <TALK>{title}</TALK>
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
  height: 80px;
  padding: 16px 10px 16px 10px;
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
    padding: 10px 10px 10px 10px;
  }
`
const ICON = styled.div`
  float: left;
  width: 48px;
  height: 48px;
  margin-right: 10px;
  background: url('https://devimage.dalbitcast.com/images/api/ic_alarm.png') no-repeat center center / cover;
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
  height: calc(100vh - 80px);
  padding: 24px 20px 0 20px;
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
  width: 100%;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 6px;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
`
const IMG = styled.div`
  float: left;
  width: 36px;
  height: 36px;
  margin-bottom: 6px;
  margin-right: 9px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const TALK = styled.h4`
  float: left;
  color: #757575;
  font-size: 14px;
  line-height: 36px;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
