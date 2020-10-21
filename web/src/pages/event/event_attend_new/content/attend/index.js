import React, {useEffect, useContext} from 'react'
import API from 'context/api'
import {Context} from 'context'
import {AttendContext} from '../../attend_ctx'
import {useHistory} from 'react-router-dom'

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
        if (status.the_day === '0' || status.the_day === '2') {
          globalCtx.action.alert({
            msg: `<div class="attend-alert-box" ><p class="title">출석체크 성공!<br />1달+10EXP 지급!</p><p class="sub-title">[내 지갑]을 확인하세요!</p></div>`
          })
        } else if (status.the_day === '1' || status.the_day === '3') {
          globalCtx.action.alert({
            msg: `<div class="attend-alert-box" ><p class="title">출석체크 성공!<br />2달+10EXP 지급!</p><p class="sub-title">[내 지갑]을 확인하세요!</p></div>`
          })
        } else {
          globalCtx.action.alert({
            msg: `<div class="attend-alert-box" ><p class="title">출석체크 성공!<br />3달+15EXP 지급!</p><p class="sub-title">[내 지갑]을 확인하세요!</p></div>`
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
                  state: 'attend_event'
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
        <button type="button" onClick={() => attendDateIn()}>
          {statusList.check_gift === '1' ? <>출석체크 하기 버튼</> : <>출석체크 완료 버튼</>}
        </button>
      </div>

      <div>
        매일 출석체크 현황
        <dl>
          <dt>출석체크</dt>
          <dd>{summaryList.attendanceDays}</dd>
          <dt>받은 달</dt>
          <dd>{summaryList.dalCnt}</dd>
          <dt>경험치(EXP)</dt>
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
