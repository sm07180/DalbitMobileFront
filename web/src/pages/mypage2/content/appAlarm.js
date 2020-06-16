/**
 * @file /mypage/context/appAlarm.js
 * @brief 마이페이지 어플알람
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Header from '../component/header.js'
//room
import Room, {RoomJoin} from 'context/room'

//component
import NoResult from 'components/ui/noResult'

//icon
import alarmOn from '../component/ic_alarmtoggleon.svg'
import alarmOff from '../component/ic_alarmtoggleoff.svg'

let currentPage = 1
let first = true

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)
  const myMemNo = context.profile.memNo
  //api.
  //조회
  async function fetchDataList() {
    const res = await Api.appNotify_list({
      params: {}
    })
    if (res.result === 'success') {
      setAllBtnState(res.data)
      //0000000000000000000console.log('성공')
      first = false
    } else if (res.result === 'fail') {
    }
  }

  //수정
  async function fetchData() {
    const res = await Api.appNotify_modify({
      data: {
        isAll: btn1,
        isMyStar: btn2,
        isGift: btn4,
        isFan: btn5,
        isComment: btn6,
        isRadio: btn7,
        isPush: btn8,
        isLike: btn3
      }
    })
    if (res.result === 'success') {
      // console.log('성공')
    } else if (res.result === 'fail') {
    }
  }
  //state
  const [allBtnState, setAllBtnState] = useState([])
  const [btn1, setBtn1] = useState(0)
  const [btn2, setBtn2] = useState(0)
  const [btn3, setBtn3] = useState(0)
  const [btn4, setBtn4] = useState(0)
  const [btn5, setBtn5] = useState(0)
  const [btn6, setBtn6] = useState(0)
  const [btn7, setBtn7] = useState(0)
  const [btn8, setBtn8] = useState(0)
  const ToggleBtn = (value, name) => {
    // console.log('수정')
    first = false
    if (value === 0) {
      name(1)
    } else {
      name(0)
    }
  }

  const Allcontroll = () => {
    first = false
    if (btn1 === 0) {
      setBtn1(1)
      setBtn2(1)
      setBtn3(1)
      setBtn4(1)
      setBtn5(1)
      setBtn6(1)
      setBtn7(1)
      setBtn8(1)
    } else if (btn1 === 1) {
      setBtn1(0)
      setBtn2(0)
      setBtn3(0)
      setBtn4(0)
      setBtn5(0)
      setBtn6(0)
      setBtn7(0)
      setBtn8(0)
    }
  }

  useEffect(() => {
    // console.log('1')
    if (btn2 === 1 && btn3 === 1 && btn4 === 1 && btn5 === 1 && btn6 === 1 && btn7 === 1 && btn8 === 1) {
      setBtn1(1)
    } else {
      setBtn1(0)
    }
  }, [btn2, btn3, btn4, btn5, btn6, btn7, btn8])

  useEffect(() => {
    //console.log('2')
    fetchDataList()
  }, [])

  useEffect(() => {
    // console.log('3')
    if (!first) fetchData()
  }, [btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8])

  useEffect(() => {
    setBtn1(allBtnState.all_ok)
    setBtn2(allBtnState.isMyStar)
    setBtn3(allBtnState.isLike)
    setBtn4(allBtnState.isGift)
    setBtn5(allBtnState.isFan)
    setBtn6(allBtnState.isComment)
    setBtn7(allBtnState.isRadio)
    setBtn8(allBtnState.isPush)
    first = true
  }, [allBtnState])

  // 게스트 기능 전 임시 함수

  const makeContent = () => {
    return (
      <Content>
        <div className="holeAlarm">
          <h2 className="on">전체 알림 수신</h2>
          <button className={btn1 === 1 ? 'on' : ''} onClick={() => Allcontroll()}></button>
        </div>
        <div>
          <h2>DJ 알림</h2>
          <p>팬으로 등록 된 DJ의 방송시작 및 정보 수신 알림</p>
          <button
            className={btn2 === 1 ? 'on' : ''}
            value="btn2"
            name="setBtn2"
            onClick={() => ToggleBtn(btn2, setBtn2)}></button>
        </div>

        <div>
          <h2>선물 알림</h2>
          <p>달 선물 수신 알림</p>
          <button
            className={btn4 === 1 ? 'on' : ''}
            value="btn4"
            name="setBtn4"
            onClick={() => ToggleBtn(btn4, setBtn4)}></button>
        </div>
        <div>
          <h2>팬 알림</h2>
          <p>새로운 팬 등록 수신 알림</p>
          <button
            className={btn5 === 1 ? 'on' : ''}
            value="btn5"
            name="setBtn5"
            onClick={() => ToggleBtn(btn5, setBtn5)}></button>
        </div>
        <div>
          <h2>댓글 알림</h2>
          <p>팬 보드 신규 글 등록 알림</p>
          <button
            className={btn6 === 1 ? 'on' : ''}
            value="btn6"
            name="setBtn6"
            onClick={() => ToggleBtn(btn6, setBtn6)}></button>
        </div>
        <div>
          <h2>좋아요 알림</h2>
          <p>등록 된 게시물의 좋아요 수신 알림</p>
          <button
            className={btn3 === 1 ? 'on' : ''}
            value="btn3"
            name="setBtn3"
            onClick={() => ToggleBtn(btn3, setBtn3)}></button>
        </div>
        <div>
          <h2>공지 알림</h2>
          <p>달빛 라이브 공지사항 수신 알림</p>
          <button
            className={btn7 === 1 ? 'on' : ''}
            value="btn7"
            name="setBtn7"
            onClick={() => ToggleBtn(btn7, setBtn7)}></button>
        </div>
        <div>
          <h2>Push 알림</h2>
          <p>서비스의 Push 메시지 수신 알림</p>
          <button
            className={btn8 === 1 ? 'on' : ''}
            value="btn8"
            name="setBtn8"
            onClick={() => ToggleBtn(btn8, setBtn8)}></button>
        </div>
      </Content>
    )
  }

  //-----------------------------------------------------------------------------
  return (
    <>
      <Header>
        <div className="category-text">PUSH 알림 설정</div>
      </Header>
      {allBtnState !== null && makeContent()}
    </>
  )
}

const Content = styled.div`
  display: flex;
  flex-direction: column;

  & div {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 44px;
    padding: 12px 0 12px 0;
    color: #616161;
    &.holeAlarm {
      h2 {
        font-size: 16px;
      }
    }
    h2 {
      font-size: 16px;
      color: #424242;
      font-weight: 600;
      transform: skew(-0.03deg);
      letter-spacing: -0.35px;
      &.on {
        font-weight: 600;
        color: #000;
        font-size: 18px;
      }
    }
    button {
      position: absolute;
      top: 50%;
      right: 0;
      width: 50px;
      height: 50px;
      background: url(${alarmOff}) no-repeat center center / cover;
      transform: translateY(-50%);
      &.on {
        background: url(${alarmOn}) no-repeat center center / cover;
      }
    }
    p {
      margin-top: 8px;
      color: #616161;
      font-size: 13px;
      line-height: 1.08;
      letter-spacing: -0.5px;
      text-align: left;
      transform: skew(-0.03deg);
    }
  }
`
