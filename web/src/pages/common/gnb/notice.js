import React, {useState, useEffect, useContext} from 'react'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_MOBILE_S, WIDTH_TABLET_S} from 'context/config'
import styled from 'styled-components'
import Api from 'context/api'

//component
import {Context} from 'context'
import Gnb from './gnb-layout'

export default props => {
  //---------------------------------------------------------------------
  const context = new useContext(Context)
  const [notice, setNotice] = useState([])
  const [result, setResult] = useState() //1 : 알림이 없습니다 //2 : 로그인이 필요합니다

  //---------------------------------------------------------------------
  //map
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

  async function fetchData(obj) {
    const res = await Api.my_notification({
      params: {
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      if (res.data == undefined) {
        setResult(1)
      } else {
        setNotice(res.data.list)
      }
    } else if (res.result === 'fail' && res.code === '-1') {
      setResult(2)
    } else {
      console.log('오류', res)
    }
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Gnb>
        <NoticeWrap>
          <Nheader>
            <ICON></ICON>
            <Title>알림사항</Title>
          </Nheader>
          <CONTENT>
            {arrayNotice && result == 2 ? (
              <p
                className="result login"
                onClick={() => {
                  context.action.updatePopup('LOGIN')
                }}>
                로그인이 필요합니다.
              </p>
            ) : (
              <p className="result">알림이 없습니다.</p>
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

  .result {
    font-size: 16px;
    color: #555;
    transform: skew(-0.03deg);

    &.login {
      cursor: pointer;
    }
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
