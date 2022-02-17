/**
 * @file /mypage/context/appAlarm.js
 * @brief 마이페이지 어플알람 2.5v
 **/
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import styled from 'styled-components'
//context
import Api from 'context/api'

// constant
import {BC_SETTING_TYPE} from '../../constant'

//icon
import alarmOn from '../ic_alarmtoggleon.svg'
import alarmOff from '../ic_alarmtoggleoff.svg'
import GuideIcon from '../../static/guide.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

let first = true
let isSelect = false

const AlarmArray = [
  {key: 'isMyStar', value: 0, text: '마이스타 방송 시작 알림', msg: '마이스타가 방송 시작 시<br>'},
  {key: 'isStarClip', value: 0, text: '마이스타 클립 등록 알림', msg: '마이스타가 클립 업로드 시<br>'},
  {key: 'isGift', value: 0, text: '마이스타 방송공지 등록 알림', msg: '마이스타가 방송공지 등록 시<br>'},
  {key: 'isMailbox', value: 0, text: '우체통 알림', msg: '우체통에 새로운 대회가 등록될 경우<br>'},
  {key: 'isMyClip', value: 0, text: '내 클립 알림', msg: '내 클립에 댓글, 좋아요, 선물 등록 시<br>'},
  {key: 'isFan', value: 0, text: '신규 팬 추가 알림', msg: '신규 팬이 추가되면 알림<br>'},
  {key: 'isComment', value: 0, text: '팬보드 신규 글 등록 알림', msg: '팬보드에 새로운 글이 등록되면 알림<br>'},
  {key: 'isReply', value: 0, text: '팬보드 댓글 등록 알림', msg: '팬보드 내 글에 댓글이 등록되면 알림<br>'},
  {key: 'isRadio', value: 0, text: '선물 도착 알림', msg: '달 선물 도착 시 알림<br>'},
  // {key: 'isLike', value: 0, text: '공지 및 이벤트 알림', msg: '공지 및 이벤트 알림 시'},
  {key: 'isPush', value: 0, text: '1:1 문의 답변 도착 알림', msg: '1:1 문의에 답변 도착 시 알림<br>'},
  {
    key: 'isReceive',
    value: 0,
    text: '알림받기 방송시작 알림',
    msg: '알림받기를 통한 방송시작<br>',
    callback: function () {},
    buttonText: '회원관리 바로가기'
  }
]
const msgOn = ' 푸시를 받습니다.'
const msgOff = ' 푸시를 받지 않습니다.'

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {setChangeContents, setInitialScreen} = props

  //state
  const [allBtnState, setAllBtnState] = useState([])
  const [isClickAll, setIsClickAll] = useState(false)
  const [allCheck, setAllCheck] = useState(0)
  const [myAlimType, setMyAlimType] = useState(-1)
  const [alarmArray, setAlarmArray] = useState(AlarmArray)

  // api

  async function fetchData() {
    const res = await Api.appNotify_list({
      params: {}
    })
    if (res.result === 'success') {
      setAlarmArray(
        alarmArray.map((v) => {
          v.value = res.data[v.key]
          if (v.key === 'isReceive') {
            v.callback = function () {
              setChangeContents(BC_SETTING_TYPE.PUSH_MEMBERS)
              setInitialScreen(false)
            }
          }

          return v
        })
      )
      setMyAlimType(res.data.alimType)
    } else if (res.result === 'fail') {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: res.message
      }))
    }
  }
  // 수정
  async function postAlarmData(arg) {
    if (arg !== undefined) {
      setAlarmArray(
        alarmArray.map((v) => {
          if (arg.key === v.key) {
            arg.value = arg.value === 0 ? 1 : 0
          }
          return v
        })
      )
    }
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
      setAllCheck(1)
      all = 1
    } else setAllCheck(0)

    const res = await Api.appNotify_modify({
      data: {
        isAll: all,
        alimType: myAlimType,
        ...AlarmObj
      }
    })
    let message
    if (res.result === 'success') {
      if (arg === undefined) {
        if (isSelect === true) {
          if (all === 1) {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: '모든 알림 푸시를 받습니다.'
            }))
          } else {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: '모든 알림 푸시를 받지 않습니다.'
            }))
          }
        } else {
          if (myAlimType === 'n') {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: '알림 모드가 무음으로 변경되었습니다.'
            }))
          } else if (myAlimType === 's') {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: '알림 모드가 소리로 변경되었습니다.'
            }))
          } else if (myAlimType === 'v') {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: '알림 모드가 진동으로 변경되었습니다.'
            }))
          }
        }
      } else {
        let resultData = AlarmArray.find((v) => {
          return v.key === arg.key
        })
        if (arg.value === 1) {
          message = resultData.msg + msgOn
        } else {
          message = resultData.msg + msgOff
        }

        dispatch(setGlobalCtxMessage({
          type: "toast",
          msg: message
        }))
      }
    } else if (res.result === 'fail') {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: res.message
      }))
    }
  }

  // select all
  const selectAll = () => {
    first = false
    isSelect = true
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
    postAlarmData()
  }
  const openPopup = (key) => {
    dispatch(setGlobalCtxUpdatePopup({popup: ['ALARM', key]}))
  }

  const openCallbackPopup = useCallback((key, callback, buttonText) => {
    dispatch(setGlobalCtxUpdatePopup({
      popup: ['ALARM', {
        key,
        callback,
        buttonText
      }]
    }))
  }, [])

  const makeContent = () => {
    return (
      <Content>
        <div className="soundSetting">
          <button
            onClick={() => {
              first = false
              isSelect = false
              setMyAlimType('n')
            }}
            className={myAlimType === 'n' ? 'active' : ''}>
            무음
          </button>
          <button
            className="active"
            onClick={() => {
              first = false
              isSelect = false
              setMyAlimType('s')
            }}
            className={myAlimType === 's' ? 'active' : ''}>
            소리
          </button>
          <button
            onClick={() => {
              first = false
              isSelect = false
              setMyAlimType('v')
            }}
            className={myAlimType === 'v' ? 'active' : ''}>
            진동
          </button>
        </div>
        <div className="alarmBox alarmBox--isTop">
          <strong>전체 알림 수신</strong>
          <button className={`btnAlarm ${allCheck === 1 ? 'on' : ''}`} onClick={() => selectAll()}></button>
        </div>
        {alarmArray.map((v) => {
          return (
            <div className="alarmBox" key={v.key}>
              <span
                className="guide"
                onClick={() => {
                  if (v.callback) {
                    openCallbackPopup(v.key, v.callback, v.buttonText)
                  } else {
                    openPopup(v.key)
                  }
                }}
              />
              <span className="title">{v.text}</span>
              <button
                className={`btnAlarm ${v.value === 1 ? 'on' : ''}`}
                onClick={() => {
                  first = false
                  isSelect = false
                  postAlarmData(v)
                }}>
                <span className="blind">{v.text}</span>
              </button>
            </div>
          )
        })}
      </Content>
    )
  }

  useEffect(() => {
    fetchData()
    return () => {
      first = true
    }
  }, [])
  useLayoutEffect(() => {
    if (Object.keys(alarmArray).every((k) => alarmArray[k].value === 1)) {
      setAllCheck(1)
    }
  }, [alarmArray])
  useEffect(() => {
    if (!first) {
      postAlarmData()
    }
  }, [myAlimType])

  return <>{allBtnState !== null && makeContent()}</>
}
// styled
const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 16px;
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
      &:nth-child(1) {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
      }
      &:nth-child(3) {
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
  .alarmBox {
    position: relative;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 9px 16px 9px 16px;
    margin-bottom: 4px;
    color: #616161;
    border-radius: 12px;
    background-color: #ffffff;
    &--isTop {
      margin-bottom: 12px;
      strong {
        color: #000;
        font-size: 18px;
      }
    }
    .guide {
      display: block;
      width: 32px;
      height: 32px;
      margin-right: 4px;
      background: url(${GuideIcon}) no-repeat center center;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      letter-spacing: -0.35px;
      line-height: 18px;
      color: #000;
    }
    .btnAlarm {
      position: absolute;
      top: 50%;
      right: 16px;
      width: 51px;
      height: 31px;
      background: url(${alarmOff}) no-repeat center center;
      transform: translateY(-50%);
      &.on {
        background: url(${alarmOn}) no-repeat center center;
      }
    }
  }
`
