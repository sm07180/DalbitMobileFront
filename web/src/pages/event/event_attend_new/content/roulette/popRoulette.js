import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import styled, {keyframes} from 'styled-components'
import API from 'context/api'
import {IMG_SERVER} from 'context/config'

//ctx
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'

import {GIFT_ROTATION_TYPE} from '../../constant'

import PopGifticon from './popGifticon'

let timeout

export default () => {
  const globalCtx = useContext(Context)
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  // const {itemNo} = eventAttendState

  const rouletteRef = useRef(null)

  const [roatting, setRoatting] = useState(false) // 룰렛 돌리기
  const [rotation, setRotation] = useState(0) //룰렛 각도

  const rouletteEffect = () => {
    const deg = 1800 - `${rotation}`
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
      eventAttendAction.setItemNo(data.itemNo)
      eventAttendAction.setInputEndDate(data.inputEndDate)
      eventAttendAction.setCouponCnt(data.couponCnt)
      eventAttendAction.setWinIdx(data.winIdx)
    } else {
      // 실패
    }
  }

  //----------------

  useEffect(() => {
    fetchEventRouletteStart()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    setRoatting(true)

    timeout = setTimeout(() => {
      if (itemNo !== 0) {
        eventAttendAction.setPopGifticon(true)
        eventAttendAction.setCouponCnt(eventAttendState.couponCnt - 1)
      } else {
        //실패
      }
      setRoatting(false)

      setTimeout(() => {
        eventAttendAction.setPopGifticon(false)
        eventAttendAction.setPopRoulette(false)
      }, 300000)
    }, 4000)

    if (itemNo === GIFT_ROTATION_TYPE.GIFT_STARBUCKS) {
      setRotation(22.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.ONE_DAL) {
      setRotation(67.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.GIFT_CONVENIENCE) {
      setRotation(112.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.GIFT_CHOCO) {
      setRotation(157.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.GIFT_VOUCHER) {
      setRotation(202.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.THREE_DAL) {
      setRotation(247.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.GIFT_CHICKEN) {
      setRotation(292.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.FAILD) {
      setRotation(337.5)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [itemNo])

  return (
    <div className="popupWrap">
      <div className="popupContent">
        <RoulettePanelBlock className="roulettePanelBlock" rotation={rotation}>
          <img
            src={`${IMG_SERVER}/event/attend/201019/roullete_img2@2x.png`}
            ref={rouletteRef}
            className={`roulettePanel ${roatting ? 'start' : ''}`}
            alt="룰렛 돌림판"
          />

          <img src={`${IMG_SERVER}/event/attend/201019/roullete_pointer@2x.png`} className="roulettePin" alt="룰렛 핀" />
        </RoulettePanelBlock>
      </div>

      {eventAttendState.popGifticon && <PopGifticon />}
    </div>
  )
}
