import React, {useEffect, useContext, useState} from 'react'
import API from 'context/api'
import {AttendContext} from '../../attend_ctx'
import {IMG_SERVER} from 'context/config'

import BonusPop from './popBonus'

export default () => {
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {summaryList, statusList, dateList} = eventAttendState
  const [popup, setPopup] = useState(false)

  const createCheckIn = (check_ok) => {
    if (check_ok === 1) {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/201019/stamp_success_img@2x.png`} />
        </>
      )
    } else if (check_ok === 2) {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/201019/stamp_today@2x.png`} />
        </>
      )
    } else {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/201019/stamp_fail_img@2x.png`} />
        </>
      )
    }
  }

  const createBonus = () => {
    if (statusList.bonus === '0') {
      return ''
    } else if (statusList.bonus === '1') {
      return (
        <div className="bonusBox">
          <button onClick={clickGiftButton}>
            <img src={`${IMG_SERVER}/event/attend/201019/btn_bonus@2x.png`} alt="보너스 선물 받기" />
          </button>
        </div>
      )
    } else {
      return (
        <div className="bonusBox">
          <img src={`${IMG_SERVER}/event/attend/201019/box_text@2x.png`} alt="보너스 지급 내역" />

          <dl>
            <dt>보너스 달:</dt>
            <dd>{statusList.dal}</dd>
            <dt>경험치(EXP):</dt>
            <dd>{statusList.exp}</dd>
          </dl>
        </div>
      )
    }
  }

  const clickGiftButton = () => {
    async function fetchEventAttendGift() {
      const {result, data} = await API.postEventAttendGift()
      if (result === 'success') {
        const {status, summary} = data
        eventAttendAction.setSummaryList(summary)
        eventAttendAction.setStatusList(status)
        eventAttendAction.setDateList(dateList)
        setPopup(popup ? false : true)
      } else {
        //실패
      }
    }
    fetchEventAttendGift()
  }

  const creatList = () => {
    if (!dateList.length) return null

    const data = dateList
    const baseCount = 8

    let result = [...data].concat(Array(baseCount - data.length).fill(null))

    const date_pair = {
      0: '월요일',
      1: '화요일',
      2: '수요일',
      3: '목요일',
      4: '금요일',
      5: '토요일',
      6: '일요일'
    }

    const text = ['EXP10+1달', 'EXP10+2달', 'EXP10+1달', 'EXP10+2달', 'EXP15+3달', 'EXP15+3달', 'EXP15+3달']

    return (
      <>
        <div className="stampBoxWrap">
          <ul className="stampBox">
            {result.map((item, index) => {
              let class_name = ''
              let check_ok = ''

              if (item !== null) check_ok = item.check_ok

              if (item !== null) {
                class_name = `stampBoxItem ${check_ok === 1 ? 'success' : check_ok === 0 ? 'fail' : 'today'}`
              } else if (item === null) {
                class_name = 'stampBoxItem'
              }

              if (index === 7) {
                return (
                  <li key={`event-date-${index}`} className="stampBoxItem pointBox">
                    {statusList.bonus === '0' ? (
                      <img src={`${IMG_SERVER}/event/attend/201019/stamp_bonus@2x.png`} />
                    ) : (
                      <img src={`${IMG_SERVER}/event/attend/201019/stamp_bonus_after@2x.png`} />
                    )}
                  </li>
                )
              }

              return (
                <li className={class_name} key={`event-date-${index}`}>
                  {createCheckIn(check_ok)}

                  <p className="stampBoxItem__date">
                    {check_ok === 1 ? '출석성공' : check_ok === 0 ? '출석실패' : `${date_pair[index]}`}
                  </p>

                  <p className="stampBoxItem__exp">{text[index]}</p>
                </li>
              )
            })}
          </ul>
        </div>

        <div>{createBonus()}</div>

        {popup && <BonusPop setPopup={setPopup}></BonusPop>}
      </>
    )
  }

  return creatList()
}
