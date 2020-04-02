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
      setFetch(res.data.list)
    } else if (res.result === 'fail') {
      //에러메시지
      globalCtx.action.alert({
        title: res.messageKey,
        msg: res.message
      })
    }
  }
  //makeContents
  const makeContents = () => {
    if (fetch === null) return '알림이 없습니다.'
    return fetch.map((item, index) => {
      const {id, contents, url} = item
      return (
        <InfoWrap key={index}>
          <TALK>{contents}</TALK>
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
            <Link to="/mlogin">
              <img src={NeedLoginImg} />
              <div className="text">
                <span className="bold">로그인</span> 해주세요
              </div>
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
        font-weight: bold;
      }
    }
  }
`
const InfoWrap = styled.div`
  overflow: hidden;
  width: 100%;
  margin-bottom: 16px;
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
