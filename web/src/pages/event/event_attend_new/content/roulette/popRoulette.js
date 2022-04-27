import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import styled, {keyframes} from 'styled-components'
import API from 'context/api'
import {IMG_SERVER} from 'context/config'

//ctx
import {AttendContext} from '../../attend_ctx'

import {GIFT_CON_TYPE, GIFT_ROTATION_TYPE} from '../../constant'

import PopGifticon from './popGifticon'

let timeout

export default () => {
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
    img {
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
      eventAttendAction.setEventCouponCnt(data.eventCouponCnt)
      eventAttendAction.setWinIdx(data.winIdx)
      eventAttendAction.setWinPhone(data.phone)
      eventAttendAction.setImageUrl(data.imageUrl)
      eventAttendAction.setItemWinMsg(data.itemWinMsg)
    } else {
      // 실패
    }
  }

  //----------------

  useEffect(() => {
    fetchEventRouletteStart()
  }, [])

  useEffect(() => {
    setRoatting(true)

    timeout = setTimeout(() => {
      if (itemNo !== 0) {
        eventAttendAction.setPopGifticon(true)
        eventAttendAction.setCouponCnt(eventAttendState.couponCnt)
        eventAttendAction.setEventCouponCnt(eventAttendState.eventCouponCnt)
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
      // 상품 A
      itemNo === GIFT_ROTATION_TYPE.GIFT_DOCTORYOU ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BANANAMILK ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_VITA500 ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_CHOCO ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_SNEAKERS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_SONGE
    ) {
      setRotation(22.5)
    } else if (itemNo === GIFT_ROTATION_TYPE.ONE_DAL) {
      setRotation(67.5)
    } else if (
      // 상품 B
      itemNo === GIFT_ROTATION_TYPE.GIFT_MINUTEMAID ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BINCH ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_HERSHEYSICEBAR ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_CONVENIENCE ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_PARIS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BARISTA
    ) {
      setRotation(112.5)
    } else if (
      // 상품 C
      itemNo === GIFT_ROTATION_TYPE.GIFT_STARBUCKS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_EDIYA ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BASKIN ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_DUNKINMUNCHKINS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_STARBUCKSAMERICANO ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_STARBUCKSLATTE
    ) {
      setRotation(157.5)
    } else if (
      // 상품 D
      itemNo === GIFT_ROTATION_TYPE.GIFT_VOUCHER ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_MOMS ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BURGERKING ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_WHITEGARLICKBURGER ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BASKINROBBINSPINT ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_MOMSTOUCHUNBELIEVABLE
    ) {
      setRotation(202.5)
    } else if (
      itemNo === GIFT_ROTATION_TYPE.HUNDRED_DAL ||
      itemNo === GIFT_ROTATION_TYPE.HUNDRED_DAL_2 ||
      itemNo === GIFT_ROTATION_TYPE.HUNDRED_DAL_3 ||
      itemNo === GIFT_ROTATION_TYPE.HUNDRED_DAL_4 ||
      itemNo === GIFT_ROTATION_TYPE.HUNDRED_DAL_5 ||
      itemNo === GIFT_ROTATION_TYPE.HUNDRED_DAL_6
    ) {
      setRotation(247.5)
    } else if (
      // 상품E
      itemNo === GIFT_ROTATION_TYPE.GIFT_CHICKEN ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_BASKINBOX ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_DOMINO ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_PARISBAGUETTECAKE ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_DOMINOPIZZA ||
      itemNo === GIFT_ROTATION_TYPE.GIFT_GOOBNEFULLMOON
    ) {
      setRotation(292.5)
    } else if (
      itemNo === GIFT_ROTATION_TYPE.FAILD ||
      itemNo === GIFT_ROTATION_TYPE.EXP1 ||
      itemNo === GIFT_ROTATION_TYPE.EXP3 ||
      itemNo === GIFT_ROTATION_TYPE.EXP5 ||
      itemNo === GIFT_ROTATION_TYPE.EXP10
    ) {
      setRotation(337.5)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [itemNo])

  return (
    <>
      <RoulettePanelBlock className="roulettePanelBlock" rotation={rotation}>
        {roatting && <div className="noTouchLayer">룰렛 도는동안 전체 가리는 레이아웃 fixed</div>}
        <img
          src={eventAttendState.rouletteInfo.image_url}
          ref={rouletteRef}
          className={`roulettePanel ${roatting ? 'start' : ''}`}
          alt="룰렛 돌림판"
        />

        <img src={eventAttendState.rouletteInfo.pin_image_url} className="roulettePin" alt="룰렛 핀" />
      </RoulettePanelBlock>

      {eventAttendState.popGifticon && <PopGifticon />}
    </>
  )
}
