import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Swiper from 'react-id-swiper'

import API from 'context/api'
import {AttendContext} from '../../attend_ctx'

import './roulette.scss'
import Notice from '../notice'
import PopRoulette from './popRoulette'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function RouletteTab() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {token} = globalState
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {popRoulette, authCheckYn} = eventAttendState

  const [winList, setWinList] = useState()

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
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
          history.push({
            pathname: '/login',
            state: {
              state: 'event/attend_event/roulette'
            }
          })
        },
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.'
      }))
    } else {
      if (globalState.selfAuth === false) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '본인인증 후 참여해주세요.',

          callback: () => {
            history.push('/selfauth?event=/event/attend_event/roulette')
          }
        }))
      } else {
        if (eventAttendState.couponCnt !== 0 || eventAttendState.eventCouponCnt !== 0) {
          eventAttendAction.setPopRoulette(popRoulette ? false : true)
        } else if (eventAttendState.couponCnt === 0 && eventAttendState.eventCouponCnt === 0) {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: '응모권을 획득 후 참여해주세요!'
          }))
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
        <img src="https://image.dallalive.com/event/attend/210205/event_img_02_1_1@3x.png" alt="룰렛을 돌려보아요!" />

        <div className="couponBox">
          <div className="couponCount">
            <p className="couponBox__count">
              <span className="number">{eventAttendState.couponCnt}</span>
              <span className="text">개</span>
            </p>
            <img src="https://image.dallalive.com/event/attend/210309/event_img_02_1_2@2x_01.jpg" alt="기본 룰렛 응모권" />
          </div>

          <div className="couponCount">
            <p className="couponBox__count">
              <span className="number">{eventAttendState.eventCouponCnt}</span>
              <span className="text">개</span>
            </p>
            <img src="https://image.dallalive.com/event/attend/210309/event_img_02_1_2@2x_02.jpg" alt="이벤트 응모권" />
          </div>
        </div>

        <div className="buttonBox">
          <button type="button" onClick={() => history.push('/event/my_coupon')}>
            <img src="https://image.dallalive.com/event/attend/201229/btn_coupon_history@2x.png" alt="응모권 지급 내역" />
          </button>

          <button type="button" onClick={() => history.push('/event/my_history')}>
            <img src="https://image.dallalive.com/event/attend/201229/btn_roullete_history@2x.png" alt="나의 당첨이력 확인" />
          </button>
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
      <div className="rouletteBox">
        <img src={`${eventAttendState.rouletteInfo.pin_image_url}`} className="rouletPin" alt="룰렛 핀" />

        <div>
          {popRoulette && (
            <div className="rouletteMoive">
              <PopRoulette />
            </div>
          )}
          <img
            src={`${eventAttendState.rouletteInfo.image_url}`}
            onClick={() => startIn()}
            alt="룰렛 판"
            className="roulettePanel"
          />
        </div>
      </div>
      <Notice />
    </div>
  )
}
