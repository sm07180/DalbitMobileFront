/**
 * @title 알림사항
 * @todos 디자인에 맞게, 프로필이미지 및 시간체크기능필요
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

//context
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_MOBILE_S} from 'context/config'
import {Context} from 'context'
// component
import Header from '../component/header.js'
//static
import NeedLoginImg from '../static/profile/need_login.png'

export default props => {
  //---------------------------------------------------------------------
  //context
  const globalCtx = useContext(Context)
  const {profile} = globalCtx
  const {isLogin} = globalCtx.token

  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  async function fetchData(obj) {
    const res = await Api.my_notification({
      params: {
        page: 1,
        records: 10
      }
    })
    console.log(res)
    if (res.result === 'success') {
      console.log(res.data)
      setFetch(res.data.list)
    } else if (res.result === 'fail') {
      //에러메시지
      globalCtx.action.alert({
        title: res.messageKey,
        msg: res.message
      })
    }
  }
  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} `
  }
  //makeContents
  const makeContents = () => {
    if (fetch === null) return '알림이 없습니다.'
    return fetch.map((item, index) => {
      const {id, contents, url, regDt} = item
      return (
        <InfoWrap key={index}>
          <div className="imgwrap"></div>
          <div>
            <TALK>{contents}</TALK>
            <Time>{timeFormat(regDt)}</Time>
          </div>
        </InfoWrap>
      )
    })
  }
  //---------------------------------------------------------------------

  //useEffect
  useEffect(() => {
    fetchData()
  }, [])
  //---------------------------------------------------------------------

  return (
    <div>
      <Header>
        <div className="category-text">알림사항</div>
      </Header>
      <Content>
        {!isLogin && (
          <div className="log-out">
            <Link to="/login">
              <img src={NeedLoginImg} />
              <div className="text">
                <span className="bold">로그인</span> 해주세요
              </div>
            </Link>
            <Link to="/login">
              <button className="loginBtn">로그인</button>
            </Link>
          </div>
        )}

        {makeContents()}
      </Content>
    </div>
  )
}
//---------------------------------------------------------------------
//styled
const Content = styled.div`
  display: block;
  margin-top: 30px;
  .loginBtn {
    display: block;
    width: 120px;
    height: 40px;
    margin: 30px auto;
    border: 2px solid #8556f6;
    color: #424242;
    border-radius: 10px;
    transform: skew(-0.03deg);
  }
  .log-out {
    padding-top: 30px;
    box-sizing: border-box;

    img {
      display: block;
      margin: 0 auto;
      width: 100px;
    }
    .text {
      margin-top: 10px;
      color: #424242;
      font-size: 20px;
      text-align: center;
      .bold {
        color: #8556f6;
        font-weight: 800;
      }
    }
  }
`

const Time = styled.div`
  margin-top: 3px;
  font-size: 12px;
  letter-spacing: -0.3px;
  text-align: left;
  color: #bdbdbd;
  transform: skew(-0.03deg);
`
const InfoWrap = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  margin-bottom: 16px;

  .imgwrap {
    width: 36px;
    height: 36px;
    margin-right: 10px;
    background-color: blue;
    border-radius: 50%;
    background: url('https://image.dalbitcast.com/images/profile/main2.jpg') no-repeat center center / cover;
  }
`
const TALK = styled.h4`
  float: left;
  color: #424242;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
  span {
    display: block;
    color: #dbdbdb;
    font-size: 12px;
  }
`
