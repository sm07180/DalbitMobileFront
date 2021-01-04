import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import Swiper from 'react-id-swiper'

import API from 'context/api'
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'

import './roulette.scss'
import Notice from '../notice'
import PopRoulette from './popRoulette'

export default function RouletteTab() {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {popRoulette} = eventAttendState

  const [winList, setWinList] = useState()
  const [authState, setAuthState] = useState()

  const swiperParams = {
    loop: true,
    direction: 'vertical',
    slidesPerColumnFill: 'row',
    // resistanceRatio: 0,
    autoplay: {
      delay: 2500
    }
  }

  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // 20200218145519
    let month = date.substring(4, 6)
    let day = date.substring(6, 8)
    let time = `${date.substring(8, 10)}:${date.substring(10, 12)}`
    return `${month}월 ${day}일`
    // return `${month}월 ${day}일 ${time}`
  }

  async function fetchEventRouletteInfo() {
    const {result, data} = await API.getEventRouletteInfo()
    if (result === 'success') {
      eventAttendAction.setRouletteInfo(data.info)
    }
  }

  async function fetchEventRouletteCoupon() {
    const {result, data} = await API.getEventRouletteCoupon()
    if (result === 'success') {
      eventAttendAction.setCouponCnt(data.couponCnt)
      eventAttendAction.setEventCouponCnt(data.eventCouponCnt)
    }
  }

  async function fetchEventRouletteWin() {
    const {result, data} = await API.getEventRouletteWin({
      winType: 1
    })
    if (result === 'success') {
      setWinList(data.list)
    }
  }

  const startIn = () => {
    if (!token.isLogin) {
      globalCtx.action.alert({
        callback: () => {
          history.push({
            pathname: '/login',
            state: {
              state: 'event/attend_event/roulette'
            }
          })
        },
        msg: '로그인 후 참여해주세요.'
      })
    } else {
      if (globalCtx.selfAuth === false) {
        history.push('/selfauth?event=/event/attend_event/roulette')
      } else {
        if (eventAttendState.couponCnt !== 0 || eventAttendState.eventCouponCnt !== 0) {
          eventAttendAction.setPopRoulette(popRoulette ? false : true)
        } else if (eventAttendState.couponCnt === 0 && eventAttendState.eventCouponCnt === 0) {
          globalCtx.action.alert({
            msg: '응모권을 획득 후 참여해주세요!'
          })
        }
      }
    }
  }

  //----------------------------------
  useEffect(() => {
    fetchEventRouletteInfo()
    fetchEventRouletteWin()
    fetchEventRouletteCoupon()
  }, [eventAttendState.popGifticon])

  return (
    <div className="rouletteTab">
      <div className="topBanner">
        <img src="https://image.dalbitlive.com/event/attend/201230/event_img_02_1_1@2x.png" alt="룰렛을 돌려보아요!" />

        <div className="couponBox">
          <div className="basicItem">
            <p className="couponBox__count">
              <span className="couponBox__count--number">{eventAttendState.couponCnt}</span>
              <span>개</span>
            </p>
            <button type="button" className="historyButton" onClick={() => history.push('/event/my_coupon')}>
              <img src="https://image.dalbitlive.com/event/attend/201229/btn_coupon_history@2x.png" alt="응모권 지급 내역" />
            </button>
            <img src="https://image.dalbitlive.com/event/attend/201231/event_img_02_1_2@2x_01.jpg" alt="기본 룰렛 응모권" />
          </div>
          <div className="eventItem">
            <p className="couponBox__count eventCount">
              <span className="couponBox__count--number">{eventAttendState.eventCouponCnt}</span>
              <span>개</span>
            </p>

            <button type="button" className="roulleteButton" onClick={() => history.push('/event/my_history')}>
              <img src="https://image.dalbitlive.com/event/attend/201229/btn_roullete_history@2x.png" alt="나의 당첨이력 확인" />
            </button>

            <img src="https://image.dalbitlive.com/event/attend/201231/event_img_02_1_2@2x_02.jpg" alt="이벤트 응모권" />
          </div>
        </div>
      </div>
      <div className="giftWinner">
        <div className="giftWinnerWrap">
          <div
            className="giftWinnerBox"
            onClick={() => {
              history.push('/event/attend_event_gift')
            }}>
            <label>상품 당첨자</label>

            {winList ? (
              <Swiper {...swiperParams}>
                {winList.length > 0 &&
                  winList.map((item, index) => {
                    const {winDt, nickNm} = item

                    return (
                      <div className="gifticon-win-list" key={index}>
                        <p className="time">{dateFormatter(winDt)}</p>
                        <p className="nick-name">{nickNm}</p>
                      </div>
                    )
                  })}
              </Swiper>
            ) : (
              <div className="gifticon-win-list">당첨자 곧 등장 예정! 행운의 주인공은?</div>
            )}
          </div>
        </div>
      </div>
      <div className="rouletteBox" onClick={() => startIn()}>
        <img src={eventAttendState.rouletteInfo.bg_image_url} alt="룰렛 돌림판" />
        {/* <button type="button" onClick={() => startIn()}>
          <img src={eventAttendState.rouletteInfo.start_image_url} alt="룰렛 스타트" />
        </button> */}
      </div>
      <div>
        <Notice />
      </div>
      {popRoulette && <PopRoulette />}
    </div>
  )
}
