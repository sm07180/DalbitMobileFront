import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import styled, {keyframes} from 'styled-components'
import API from 'context/api'

//ctx
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'

import {GIFT_CON_TYPE, GIFT_ROTATION_TYPE} from '../../constant'

//image
import rouletteImg from '../../static/roul.png'

export default () => {
  const globalCtx = useContext(Context)
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)

  const rouletteRef = useRef(null)

  const [roulette, setRoulette] = useState(0) //당첨될 값
  const [roatting, setRoatting] = useState(false) // 룰렛 돌리기
  const [temp, setTemp] = useState(5) //1~8
  const [rotation, setRotation] = useState(0) //룰렛 각도

  const closePopup = () => {
    eventAttendAction.setPopRoulette(false)
  }

  const rouletteEffect = () => {
    const deg = 3600 - `${rotation}`
    return keyframes`
    to {
      transform: rotate(${deg}deg);
    }`
  }

  const RoulettePanelBlock = styled.div`
    text-align: center;
    margin: 60px 0px;
    position: relative;
    outline: none;
    overflow: hidden;

    img {
      width: 90%;
      margin: 0 auto;
      -ms-user-select: none;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }

    img.start {
      animation-name: ${(props) => rouletteEffect(props)};
      animation-duration: 3.5s;
      animation-timing-function: ease;
      animation-direction: normal;
      animation-fill-mode: forwards;
    }
  `

  async function fetchEventRouletteStart() {
    const {result, data} = await API.getEventRouletteStart()
    if (result === 'success') {
      console.log('성공')

      if (giftCon === GIFT_CON_TYPE.NORMAL);
    } else {
      // 실패
    }
  }

  //----------------
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    setRoatting(true)

    setTimeout(() => {
      setRoulette(2)
      setRoatting(false)
    }, 4000)

    if (temp === GIFT_ROTATION_TYPE.FAILD) {
      setRotation(22.5)
    } else if (temp === GIFT_ROTATION_TYPE.ONE_DAL) {
      setRotation(67.5)
    } else if (temp === GIFT_ROTATION_TYPE.THREE_DAL) {
      setRotation(112.5)
    } else if (temp === GIFT_ROTATION_TYPE.GIFT_A) {
      setRotation(157.5)
    } else if (temp === GIFT_ROTATION_TYPE.GIFT_B) {
      setRotation(202.5)
    } else if (temp === GIFT_ROTATION_TYPE.GIFT_C) {
      setRotation(247.5)
    } else if (temp === GIFT_ROTATION_TYPE.GIFT_D) {
      setRotation(292.5)
    } else if (temp === GIFT_ROTATION_TYPE.GIFT_E) {
      setRotation(337.5)
    }
  }, [])

  useEffect(() => {
    if (roulette === 1) {
      globalCtx.action.alert({
        msg: `<div class="attend-alert-box" ><p class="title">1번 당첨</p><p class="sub-title">다음 주에는 일주일을<br />모두 출석해서 기프티콘<br />당첨 기회를 받으세요!</p></div>`,
        callback: () => {
          eventAttendAction.setPopRoulette(false)
        }
      })
    } else if (roulette === 2) {
      globalCtx.action.alert({
        msg: `<div class="attend-alert-box" ><p class="title">2번 당첨</p><p class="sub-title">다음 주에는 일주일을<br />모두 출석해서 기프티콘<br />당첨 기회를 받으세요!</p></div>`,
        callback: () => {
          eventAttendAction.setPopRoulette(false)
        }
      })
    }
  }, [roulette])

  useEffect(() => {
    fetchEventRouletteStart()
  }, [])

  return (
    <div className="popupWrap">
      <div className="popupContent">
        룰렛팝업
        <button
          type="button"
          onClick={() => {
            closePopup()
          }}>
          닫아버렷
        </button>
        <RoulettePanelBlock rotation={rotation}>
          <img src={rouletteImg} ref={rouletteRef} className={`${roatting ? 'start' : ''}`} />
        </RoulettePanelBlock>
      </div>
    </div>
  )
}
