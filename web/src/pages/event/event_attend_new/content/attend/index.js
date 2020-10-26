import React, {useEffect, useContext} from 'react'
import API from 'context/api'
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'

import './attend.scss'
import AttendList from './attend_list'
import Notice from '../notice'

export default function AttendTab() {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {summaryList, statusList, dateList} = eventAttendState

  async function fetchEventAttendDate() {
    const {result, data} = await API.postEventAttend()
    if (result === 'success') {
      const {status, dateList, summary} = data
      eventAttendAction.setSummaryList(summary)
      eventAttendAction.setStatusList(status)
      eventAttendAction.setDateList(dateList)
    } else {
      //실패
      eventAttendAction.setStatusList({bonus: '0'})
      eventAttendAction.setDateList([{0: {}}])
    }
  }

  let isAttendClick = false
  const attendDateIn = () => {
    // 부정클릭 방지
    if (isAttendClick) {
      return false
    }
    isAttendClick = true

    async function fetchEventAttendDateIn() {
      const {result, data, message} = await API.postEventAttendIn()
      if (result === 'success') {
        const {status, dateList, summary} = data
        eventAttendAction.setSummaryList(summary)
        eventAttendAction.setStatusList(status)
        eventAttendAction.setDateList(dateList)

        // 성공
        if (statusList.the_day === '0' || statusList.the_day === '2') {
          globalCtx.action.alert({
            msg: `<div class="attendAlertBox"><div class="attendAlertBox__image"><img src="https://image.dalbitlive.com/event/attend/201019/exp_img@2x.png" alt="경험치" /></div><p class="attendAlertBox__title">출석체크 성공!<br /><span>1달+10EXP 지급!</span></p><p class="attendAlertBox__subTitle">[내 지갑]을 확인하세요!</p></div>`
          })
        } else if (statusList.the_day === '1' || statusList.the_day === '3') {
          globalCtx.action.alert({
            msg: `<div class="attendAlertBox"><div class="attendAlertBox__image"><img src="https://image.dalbitlive.com/event/attend/201019/exp_img@2x.png" alt="경험치" /></div><p class="attendAlertBox__title">출석체크 성공!<br /><span>2달+10EXP 지급!</span></p><p class="attendAlertBox__subTitle">[내 지갑]을 확인하세요!</p></div>`
          })
        } else {
          globalCtx.action.alert({
            msg: `<div class="attendAlertBox"><div class="attendAlertBox__image"><img src="https://image.dalbitlive.com/event/attend/201019/exp_img@2x.png" alt="경험치" /></div><p class="attendAlertBox__title">출석체크 성공!<br /><span>3달+15EXP 지급!</span></p><p class="attendAlertBox__subTitle">[내 지갑]을 확인하세요!</p></div>`
          })
        }
      } else {
        // 실패
        if (!token.isLogin) {
          globalCtx.action.alert({
            callback: () => {
              history.push({
                pathname: '/login',
                state: {
                  state: 'event/attend_event'
                }
              })
            },

            msg: message
          })
        } else {
          globalCtx.action.alert({
            msg: message
          })
        }
      }
    }
    fetchEventAttendDateIn()
  }

  //------------------
  useEffect(() => {
    fetchEventAttendDate()
  }, [])

  return (
    <div className="attendTab">
      <div className="topBanner">
        <img src={`${IMG_SERVER}/event/attend/201019/event_img_01_1@2x.png`} />

        {statusList.check_gift === '1' ? (
          <button type="button" className="attend" onClick={() => attendDateIn()}>
            <img src={`${IMG_SERVER}/event/attend/201019/btn_check@2x.png`} alt="출석체크 하기" />
          </button>
        ) : (
          <button type="button" className="attend">
            <img src={`${IMG_SERVER}/event/attend/201019/btn_check_disabled@2x.png`} alt="출석체크 완료" />
          </button>
        )}
      </div>

      <div className="attendStatebox">
        <img src={`${IMG_SERVER}/event/attend/201019/event_img_01_2@2x.png`} alt="출석체크 현황" />
        <dl className="attendStateList">
          <dt>출석체크 :</dt>
          <dd>{summaryList.attendanceDays}</dd>
          <dt>받은 달 :</dt>
          <dd>{summaryList.dalCnt}</dd>
          <dt>경험치(EXP) :</dt>
          <dd>{summaryList.totalExp}</dd>
        </dl>
      </div>

      <div>
        <AttendList />
      </div>

      <div>
        <Notice />
      </div>
    </div>
  )
}
