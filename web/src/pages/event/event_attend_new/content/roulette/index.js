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

  async function fetchEventRouletteCoupon() {
    const {result, data} = await API.getEventRouletteCoupon()
    if (result === 'success') {
      eventAttendAction.setCouponCnt(data.couponCnt)
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
        if (eventAttendState.couponCnt !== 0) {
          eventAttendAction.setPopRoulette(popRoulette ? false : true)
        } else {
          globalCtx.action.alert({
            msg: '응모권을 획득 후 참여해주세요!'
          })
        }
      }
    }
  }

  //----------------------------------
  useEffect(() => {
    fetchEventRouletteCoupon()
    fetchEventRouletteWin()
  }, [])

  return (
    <div className="rouletteTab">
      <div className="topBanner">
        <img src={`${IMG_SERVER}/event/attend/201019/event_img_02_1@2x.png`} alt="룰렛을 돌려보아요!" />

        <button type="button" className="" onClick={() => history.push('/event/attend_my_apply')}>
          <img src={`${IMG_SERVER}/event/attend/201019/btn_roullete_history@2x.png`} alt="룰렛 참여내역 확인" />
        </button>

        <div className="couponBox">
          <img src={`${IMG_SERVER}/event/attend/201019/event_ticket@2x.png`} alt="룰렛 응모 티켓수" />
          <p className="couponBox__cnt">
            <span className="couponBox__cnt--num">{eventAttendState.couponCnt}</span>
            <span>개</span>
          </p>
        </div>
      </div>

      <div className="giftWinnerWrap">
        <div
          className="giftWinnerBox"
          onClick={() => {
            history.push('/event/attend_event_gift')
          }}>
          <label>기프티콘 당첨</label>

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

      <div className="rouletteBox">
        <img src={`${IMG_SERVER}/event/attend/201019/roullete_img@2x.png`} alt="룰렛 돌림판" />
        <button type="button" onClick={() => startIn()}>
          <img src={`${IMG_SERVER}/event/attend/201019/btn_roullete_start@2x.png`} alt="룰렛 스타트" />
        </button>
      </div>
      <div>
        <Notice />
      </div>

      {popRoulette && <PopRoulette />}
    </div>
  )
}
