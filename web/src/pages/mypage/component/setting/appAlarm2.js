/**
 * @file /mypage/context/appAlarm.js
 * @brief 마이페이지 어플알람 2.5v
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import Api from 'context/api'

import Header from '../header.js'
//icon
import alarmOn from '../ic_alarmtoggleon.svg'
import alarmOff from '../ic_alarmtoggleoff.svg'
import GuideIcon from '../../static/guide.svg'
let first = true

const AlarmArray = [
  {key: 'isMyStar', value: 0, text: '마이스타 방송 시작 알림'},
  {key: 'isGift', value: 0, text: '마이스타 방송공지 등록 알림'},
  {key: 'isFan', value: 0, text: '신규 팬 추가 알림'},
  {key: 'isComment', value: 0, text: '팬보드 신규 글 등록 알림'},
  {key: 'isReply', value: 0, text: '팬보드 댓글 등록 알림'},
  {key: 'isRadio', value: 0, text: '선물 도착 알림'},
  // {key: 'isLike', value: 0, text: '공지 및 이벤트 알림'},
  {key: 'isPush', value: 0, text: '1:1 문의 답변 도착 알림'}
]

export default (props) => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)
  //api.
  async function fetchDataList() {
    const res = await Api.appNotify_list({
      params: {}
    })
    if (res.result === 'success') {
      setAlarmArray(
        alarmArray.map((v) => {
          v.value = res.data[v.key]
          return v
        })
      )

      setMyAlimType(res.data.alimType)
      // first = false
    } else if (res.result === 'fail') {
    }
  }

  //수정
  async function fetchData() {
    const AlarmObj = Object.fromEntries(
      Array.from(alarmArray, (x) => {
        return [x.key, x.value]
      })
    )
    let all = 0
    if (
      alarmArray.every((v) => {
        return v.value === 1
      })
    ) {
      all = 1
    }
    const res = await Api.appNotify_modify({
      data: {
        isAll: all,
        alimType: myAlimType,
        ...AlarmObj
      }
    })
    if (res.result === 'success') {
      // console.log(res)
    } else if (res.result === 'fail') {
    }
  }

  //state
  const [allBtnState, setAllBtnState] = useState([])
  const [allCheck, setAllCheck] = useState(0)

  const [myAlimType, setMyAlimType] = useState(-1)

  const [alarmArray, setAlarmArray] = useState(AlarmArray)
  // all toggle
  const Allcontroll = () => {
    first = false
    if (allCheck === 0) {
      setAllCheck(1)
      setAlarmArray(
        alarmArray.map((v) => {
          v.value = 1
          return v
        })
      )
    } else if (allCheck === 1) {
      setAllCheck(0)
      setAlarmArray(
        alarmArray.map((v) => {
          v.value = 0
          return v
        })
      )
    }
  }

  const openPopup = (key) => {
    context.action.updatePopup('ALARM', key)
  }

  //---------------------------------------
  useEffect(() => {
    if (
      alarmArray.every((v) => {
        return v.value === 1
      })
    )
      setAllCheck(1)
    else setAllCheck(0)

    if (!first) {
      fetchData()
    }
  }, [alarmArray, myAlimType])

  useEffect(() => {
    fetchDataList()
    return () => {
      first = true
    }
  }, [])

  // render func

  const makeContent = () => {
    return (
      <Content>
        <article className="soundSetting">
          <button
            onClick={() => {
              first = false
              setMyAlimType('n')
            }}
            className={myAlimType === 'n' ? 'active' : ''}>
            무음
          </button>
          <button
            className="active"
            onClick={() => {
              first = false
              setMyAlimType('s')
            }}
            className={myAlimType === 's' ? 'active' : ''}>
            소리
          </button>
          <button
            onClick={() => {
              first = false
              setMyAlimType('v')
            }}
            className={myAlimType === 'v' ? 'active' : ''}>
            진동
          </button>
        </article>
        <div className="holeAlarm">
          <h2 className="on">전체 알림 수신</h2>
          <button className={allCheck === 1 ? 'on' : ''} onClick={() => Allcontroll()}></button>
        </div>
        {alarmArray.map((v) => {
          return (
            <div key={v.key}>
              <span
                className="guide"
                onClick={() => {
                  openPopup(v.key)
                }}
              />
              <h2>{v.text}</h2>
              <button
                className={v.value === 1 ? 'on' : ''}
                onClick={() => {
                  first = false
                  setAlarmArray(
                    alarmArray.map((v1) => {
                      if (v.key === v1.key) {
                        v.value = v.value === 0 ? 1 : 0
                      }
                      return v1
                    })
                  )
                }}></button>
            </div>
          )
        })}
      </Content>
    )
  }
  //-----------------------------------------------------------------------------
  return <>{allBtnState !== null && makeContent()}</>
}
// styled
const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: #eeeeee;

  box-sizing: border-box;
  .soundSetting {
    display: flex;
    margin-bottom: 12px;
    button {
      width: 33.3333%;
      height: 44px;
      background-color: #f5f5f5;
      margin-left: -1px;
      border: 1px solid #e0e0e0;
      z-index: 3;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: #bdbdbd;
      :nth-child(1) {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
      }
      :nth-child(3) {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
      }
      &.active {
        border-color: #632beb;
        z-index: 5;
        font-weight: 800;
        color: #632beb;
        background-color: #fff;
      }
    }
  }
  & > div {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 44px;
    padding: 9px 16px 9px 16px;
    margin-bottom: 4px;
    color: #616161;
    border-radius: 12px;
    background-color: #ffffff;
    &.holeAlarm {
      margin-bottom: 12px;
      height: 44px;
      h2 {
        font-size: 18px;
      }
    }

    span.guide {
      display: block;
      width: 32px;
      height: 32px;
      margin-right: 4px;
      background: url(${GuideIcon}) no-repeat center center;
    }

    h2 {
      font-size: 16px;
      color: #000;
      font-weight: 800;
      transform: skew(-0.03deg);
      letter-spacing: -0.35px;
      line-height: 18px;
      &.on {
        font-weight: 800;
        color: #000;
        font-size: 18px;
      }
    }
    button {
      position: absolute;
      top: 50%;
      right: 16px;
      width: 51px;
      height: 31px;
      background: url(${alarmOff}) no-repeat center center / 100%;
      transform: translateY(-50%);
      &.on {
        background: url(${alarmOn}) no-repeat center center / 100%;
      }
    }
    p {
      width: 100%;
      padding-right: 55px;
      margin-top: 4px;
      color: #616161;
      font-size: 12px;
      line-height: 1.33;
      letter-spacing: -0.45px;
      text-align: left;
      transform: skew(-0.03deg);
    }
  }
`
