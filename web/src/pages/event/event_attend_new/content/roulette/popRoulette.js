import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import styled, {keyframes} from 'styled-components'
import API from 'context/api'
import {IMG_SERVER} from 'context/config'

//ctx
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'

import {GIFT_CON_TYPE, GIFT_ROTATION_TYPE} from '../../constant'

import PopGifticon from './popGifticon'

let timeout

export default () => {
  const globalCtx = useContext(Context)
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {itemNo} = eventAttendState

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
      margin: 0 auto;
      -ms-user-select: none;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }

    img.start {
      animation-name: ${(props) => rouletteEffect(props)};
      animation-duration: 4.5s;
      animation-timing-function: ease;
      animation-direction: normal;
      animation-fill-mode: forwards;
    }
  `

  async function fetchEventRouletteStart() {
    const {result, data} = await API.getEventRouletteStart()
    if (result === 'success') {
      eventAttendAction.setStart(data)
      eventAttendAction.setItemNo(data.itemNo)
      eventAttendAction.setCouponCnt(data.couponCnt)
      eventAttendAction.setWinIdx(data.winIdx)
      eventAttendAction.setWinPhone(data.phone)
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
        console.log('실패')
      }
      setRoatting(false)

      setTimeout(() => {
        eventAttendAction.setPopGifticon(false)
        eventAttendAction.setPopRoulette(false)
      }, 300000)
    }, 5000)

    if (
      itemNo === GIFT_ROTATION_TYPE.GIFT_STARBUCKS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_EDIYA ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BASKIN
    ) {
      setRotation(22.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.ONE_DAL) {
      setRotation(67.5)
    } else if (
      itemNo === GIFT_ROTATION_TYPE.GIFT_CONVENIENCE ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_PARIS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BARISTA
    ) {
      setRotation(112.5)
    } else if (
      itemNo === GIFT_ROTATION_TYPE.GIFT_CHOCO ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_SNEAKERS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_SONGE
    ) {
      setRotation(157.5)
    } else if (
      itemNo === GIFT_ROTATION_TYPE.GIFT_VOUCHER ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_MOMS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BURGERKING
    ) {
      setRotation(202.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.THREE_DAL) {
      setRotation(247.5)
    } else if (
      itemNo === GIFT_ROTATION_TYPE.GIFT_CHICKEN ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BASKINBOX ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_DOMINO
    ) {
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
            src={eventAttendState.rouletteInfo.image_url}
            ref={rouletteRef}
            className={`roulettePanel ${roatting ? 'start' : ''}`}
            alt="룰렛 돌림판"
          />

          <img src={eventAttendState.rouletteInfo.pin_image_url} className="roulettePin" alt="룰렛 핀" />
        </RoulettePanelBlock>
      </div>

      {eventAttendState.popGifticon && <PopGifticon />}
    </div>
  )
}
