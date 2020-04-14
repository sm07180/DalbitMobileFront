/**
 * @title 알림사항
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

//context
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_MOBILE_S} from 'context/config'
import {Context} from 'context'
import Utility from 'components/lib/utility'
//room
import Room, {RoomJoin} from 'context/room'
// component
import Header from '../component/header.js'
import NoResult from 'components/ui/noResult'
//static
import NeedLoginImg from '../static/profile/need_login.png'

//icon
import userIco from 'pages/mypage/component/images/ic_user_normal.svg'
import moonIco from 'pages/mypage/component/images/ico_moon_s.svg'
import alarmIco from 'pages/mypage/component/images/ic_alarm.svg'

let currentPage = 1

export default props => {
  //---------------------------------------------------------------------
  //context
  const globalCtx = useContext(Context)
  const {profile} = globalCtx
  const {isLogin} = globalCtx.token
  const myMemNo = isLogin ? globalCtx.profile.memNo : null

  //useState
  const [fetch, setFetch] = useState(null)

  const [listState, setListState] = useState(-1)
  const [alertList, setAlertList] = useState(false)
  const [nextList, setNextList] = useState(false)
  const [moreState, setMoreState] = useState(false)

  //let
  let clicked = false

  //---------------------------------------------------------------------
  async function getAlertList(next) {
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.my_notification({
      params: {
        page: currentPage,
        records: 10
      }
    })
    if (res.result == 'success' && _.hasIn(res, 'data.list')) {
      if (res.data.list == false) {
        if (!next) {
          setAlertList(false)
          setListState(0)
        }
        setMoreState(false)
      } else {
        if (next) {
          setMoreState(true)
          setNextList(res.data.list)
        } else {
          setAlertList(res.data.list)
          getAlertList('next')
        }
        setListState(1)
      }
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  const showMoreList = () => {
    setAlertList(alertList.concat(nextList))
    getAlertList('next')
  }

  const createAlertList = () => {
    if (alertList == false) return null
    return (
      <>
        <ul className="alert-list">
          {alertList.map((item, index) => {
            const {notiType, contents, memNo, roomNo, regDt, regTs, profImg} = item
            const textArea = (
              <p>
                {contents} <span>{Utility.settingAlarmTime(regTs)}</span>
              </p>
            )
            switch (notiType) {
              case 1: //마이스타 방송알림
                return (
                  <li
                    key={index}
                    onClick={() => {
                      if (clicked) return
                      clicked = true
                      RoomJoin(roomNo + '', () => {
                        clicked = false
                      })
                    }}>
                    <figure style={{background: `url(${profImg.thumb80x80}) no-repeat center center/ cover`}}></figure>
                    {textArea}
                  </li>
                )
                break
              case 2: //달 알림//완료
                return (
                  <li
                    key={index}
                    onClick={() => {
                      props.history.push(`/mypage/${myMemNo}/wallet`)
                    }}>
                    <figure>
                      <img src={moonIco} />
                    </figure>
                    {textArea}
                  </li>
                )
                break
              case 3: // 팬 알림
                return (
                  <li
                    key={index}
                    onClick={() => {
                      props.history.push(`/mypage/${myMemNo}`)
                    }}>
                    <figure>
                      <img src={alarmIco} />
                    </figure>
                    {textArea}
                  </li>
                )
                break
              case 4: //팬보드 알림
                return (
                  <li
                    key={index}
                    onClick={() => {
                      props.history.push(`/mypage/${myMemNo}/fanboard`)
                    }}>
                    <figure>
                      <img src={alarmIco} />
                    </figure>
                    {textArea}
                  </li>
                )
                break
              case 5: // 공지 알림
                return (
                  <li
                    key={index}
                    onClick={() => {
                      props.history.push(`/customer/notice`)
                    }}>
                    <figure>
                      <img src={alarmIco} />
                    </figure>
                    {textArea}
                  </li>
                )
                break

              default:
                return (
                  <li key={index}>
                    <figure>
                      <img src={alarmIco} />
                    </figure>
                    {textArea}
                  </li>
                )
                break
            }
          })}
        </ul>
      </>
    )
  }

  const createAlertResult = () => {
    if (listState === -1) {
      return null
    } else if (listState === 0) {
      return <NoResult className="mobile" text="알람이 없습니다." />
    } else {
      return createAlertList()
    }
  }

  //---------------------------------------------------------------------

  //useEffect
  useEffect(() => {
    getAlertList()
    return () => {
      currentPage = 1
    }
  }, [])
  //---------------------------------------------------------------------

  return (
    <div>
      <Header>
        <div className="category-text">알림사항</div>
      </Header>
      <Content>
        {isLogin ? (
          <>
            {createAlertResult()}
            {moreState && (
              <div className="more-btn-wrap">
                <button
                  className="more-btn"
                  onClick={() => {
                    props.history.push(`/mypage/${myMemNo}/alert`)
                  }}>
                  더보기
                </button>
              </div>
            )}
            <Room />
          </>
        ) : (
          <div className="log-out">
            <Link to="/login">
              <img src={NeedLoginImg} />

              <button className="loginBtn">로그인</button>

              <div className="text">
                <span className="bold">로그인</span> 해주세요
              </div>
            </Link>
          </div>
        )}
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
      letter-spacing: -0.8px;

      .bold {
        color: #8556f6;
        font-weight: 800;
      }
    }

    .loginBtn {
      display: block;
      width: 288px;
      height: 50px;
      margin: 16px auto;
      background: #8556f6;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      border-radius: 10px;
      transform: skew(-0.03deg);
    }
  }

  .alert-list {
    li {
      display: flex;
      margin: 20px 0;
      figure {
        flex-basis: 36px;
        margin-right: 10px;
        height: 36px;
        line-height: 34px;
        border-radius: 50%;
        background: #f6f6f6;
        text-align: center;
        img {
          vertical-align: middle;
        }
      }
      p {
        color: #424242;
        font-size: 14px;
        line-height: 18px;
        font-weight:600;
        transform: skew(-0.03deg);
        span {
          display: block;
          color: #bdbdbd;
          font-size: 12px;
        }
      }
    }
  }
  .more-btn-wrap {
    position: relative;
    &:before {
      display: block;
      position: absolute;
      left: calc(50% - 63px);
      width: 126px;
      height: 48px;
      background: #fff;
      content: '';
      z-index: 1;
    }
    &:after {
      position: absolute;
      right: 0;
      top: 23px;
      width: 100%;
      height: 1px;
      background: #e0e0e0;
      content: '';
    }
  }
  .more-btn {
    display: block;
    position: relative;
    width: 113px;
    margin: 40px auto;
    /* padding-right: 28px; */
    border: 1px solid #e0e0e0;
    border-radius: 46px;
    background: #fff;
    color: #616161;
    font-size: 14px;
    line-height: 46px;
    z-index: 1;
    /* &:after {
      display: block;
      position: absolute;
      right: 24px;
      top: 11px;
      width: 12px;
      height: 12px;
      border-left: 2px solid ${COLOR_MAIN};
      border-top: 2px solid ${COLOR_MAIN};
      transform: rotate(-135deg);
      content: '';
    } */
  }
`
