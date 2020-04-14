/**
 * @file /mypage/context/alert.js
 * @brief 마이페이지 알람
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Utility from 'components/lib/utility'
import Header from '../component/header.js'
//room
import Room, {RoomJoin} from 'context/room'

//component
import NoResult from 'components/ui/noResult'

//icon
import userIco from '../component/images/ic_user_normal.svg'
import moonIco from '../component/images/ico_moon_s.svg'
import alarmIco from '../component/images/ic_alarm.svg'

let currentPage = 1

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)
  const myMemNo = context.profile.memNo

  //state
  const [listState, setListState] = useState(-1)
  const [alertList, setAlertList] = useState(false)
  const [nextList, setNextList] = useState(false)
  const [moreState, setMoreState] = useState(false)

  //let
  let clicked = false

  //-----------------------------------------------------------------------------
  //async
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

  //function
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
                      props.history.push(`/menu/profile`)
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

  useEffect(() => {
    getAlertList()
    return () => {
      currentPage = 1
    }
  }, [])

  //-----------------------------------------------------------------------------
  return (
    <>
      <Header>
        <div className="category-text">알림</div>
      </Header>
      <Content>
        {/* <TitleWrap style={{paddingBottom: '25px'}}>
          <TitleText>알림</TitleText>
        </TitleWrap> */}
        {createAlertResult()}
        {moreState && (
          <div className="more-btn-wrap">
            <button
              className="more-btn"
              onClick={() => {
                showMoreList()
              }}>
              더보기
            </button>
          </div>
        )}
        <Room />
      </Content>
    </>
  )
}

const Content = styled.div`
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
        padding-top: 2px;
        color: #424242;
        font-size: 14px;
        line-height: 20px;
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
    padding-right: 28px;
    border: 1px solid #e0e0e0;
    border-radius: 46px;
    background: #fff;
    color: #616161;
    font-size: 14px;
    line-height: 46px;
    z-index: 1;
    &:after {
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
    }
  }
`
const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  border-bottom: 1px solid #8556f6;
  padding-bottom: 25px;
`
const TitleText = styled.div`
  color: #8556f6;
  font-size: 20px;
  letter-spacing: -0.5px;
  font-weight: 600;
`
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`
