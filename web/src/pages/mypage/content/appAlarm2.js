/**
 * @file /mypage/context/appAlarm.js
 * @brief 마이페이지 어플알람 2.5v
 **/
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import Api from 'context/api'
import Header from '../component/header.js'
//room
//component
//icon
import alarmOn from '../component/ic_alarmtoggleon.svg'
import alarmOff from '../component/ic_alarmtoggleoff.svg'
import GuideIcon from '../static/guide.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

let currentPage = 1
let first = true

const AlarmArray = [
  {key: 'isMyStar', value: 0, text: '마이스타 방송 시작 알림'},
  {key: 'isStarClip', value: 0, text: '마이스타 클립 등록 알림'},
  {key: 'isGift', value: 0, text: '마이스타 방송공지 등록 알림'},
  {key: 'isMyClip', value: 0, text: '내 클립 알림'},
  {key: 'isFan', value: 0, text: '신규 팬 추가 알림'},
  {key: 'isComment', value: 0, text: '팬보드 신규 글 등록 알림'},
  {key: 'isReply', value: 0, text: '팬보드 댓글 등록 알림'},
  {key: 'isRadio', value: 0, text: '선물 도착 알림'},
  // {key: 'isLike', value: 0, text: '공지 및 이벤트 알림'},
  {key: 'isPush', value: 0, text: '1:1 문의 답변 도착 알림'}
]

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const myMemNo = globalState.profile.memNo

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

  //func toggle btn
  const ToggleBtn = (value, name) => {
    first = false
    if (value === 0) {
      name(1)
    } else {
      name(0)
    }
  }
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
    dispatch(setGlobalCtxUpdatePopup({popup: ['ALARM', key]}))
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
  //--------------------------------------
  useEffect(() => {
    fetchDataList()
    return () => {
      first = true
    }
  }, [])
  //------------------------------------------

  //------------------------------------------

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
        {/*
        <div>
          <span className="guide" />
          <div>
            <h2>DJ 방송 알림</h2>
            <p>내가 스타로 등록한 DJ의 방송 알림</p>
          </div>
          <button
            className={btn2 === 1 ? 'on' : ''}
            value="btn2"
            name="setBtn2"
            onClick={() => ToggleBtn(btn2, setBtn2)}></button>
        </div>

        <div>
          <h2>DJ 방송공지 알림</h2>
          <p>스타로 등록한 DJ의 신규 방송공지 등록 알림</p>
          <button
            className={btn3 === 1 ? 'on' : ''}
            value="btn3"
            name="setBtn3"
            onClick={() => ToggleBtn(btn3, setBtn3)}></button>
        </div>
        <div>
          <h2>팬 알림</h2>
          <p>새로운 팬이 추가된 경우 알림</p>
          <button
            className={btn4 === 1 ? 'on' : ''}
            value="btn4"
            name="setBtn4"
            onClick={() => ToggleBtn(btn4, setBtn4)}></button>
        </div>
        <div>
          <h2>팬보드 알림</h2>
          <p>나의 팬보드에 새로운 글 등록 시 알림</p>
          <button
            className={btn5 === 1 ? 'on' : ''}
            value="btn5"
            name="setBtn5"
            onClick={() => ToggleBtn(btn5, setBtn5)}></button>
        </div>
        <div>
          <h2>선물 알림</h2>
          <p>선물을 받았을 때 알림</p>
          <button
            className={btn6 === 1 ? 'on' : ''}
            value="btn6"
            name="setBtn6"
            onClick={() => ToggleBtn(btn6, setBtn6)}></button>
        </div>
        <div>
          <h2>1:1문의 답변 알림</h2>
          <p>1:1문의에 답변이 등록된 경우 알림</p>
          <button
            className={btn7 === 1 ? 'on' : ''}
            value="btn7"
            name="setBtn7"
            onClick={() => ToggleBtn(btn7, setBtn7)}></button>
        </div>
        <div>
          <h2>서비스 알림</h2>
          <p>기타 서비스 이용 관련 알림</p>
          <button
            className={btn8 === 1 ? 'on' : ''}
            value="btn8"
            name="setBtn8"
            onClick={() => ToggleBtn(btn8, setBtn8)}></button>
        </div> */}
      </Content>
    )
  }
  //-----------------------------------------------------------------------------
  return (
    <>
      <Header title="Push 알림 설정" />
      {allBtnState !== null && makeContent()}
    </>
  )
}
// styled
const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: #eeeeee;
  padding: 10px 16px 0 16px;
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
        border-color: #FF3C7B;
        z-index: 5;
        font-weight: 800;
        color: #FF3C7B;
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
