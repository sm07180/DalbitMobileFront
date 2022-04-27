import React, {useEffect, useContext, useState} from 'react'
import API from 'context/api'
import {AttendContext} from '../../attend_ctx'
import {IMG_SERVER} from 'context/config'

import BonusPop from './popBonus'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {summaryList, statusList, dateList} = eventAttendState
  const [popup, setPopup] = useState(false)
  const {eventDate} = props;

  const dispatch = useDispatch();

  const createCheckIn = (check_ok) => {
    if (check_ok === 1) {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/220221/stamp_success.png`} />
        </>
      )
    } else if (check_ok === 2) {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/220221/stamp_today.png`} />
        </>
      )
    } else {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/220221/stamp_default.png`} />
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
      const {result, data, message} = await API.postEventAttendGift()
      if (result === 'success') {
        const {status, summary} = data
        eventAttendAction.setSummaryList(summary)
        eventAttendAction.setStatusList(status)
        eventAttendAction.setDateList(dateList)
        setPopup(popup ? false : true)
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: message
        }))
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

    const text = ['EXP10+1달', 'EXP10+1달', 'EXP10+1달', 'EXP10+1달', 'EXP15+1달', 'EXP15+2달', 'EXP15+2달']
    const eventText = ['EXP10+2달', 'EXP10+2달', 'EXP10+2달', 'EXP10+2달', 'EXP15+2달', 'EXP15+2달', 'EXP15+2달']

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
                    <img src={`${IMG_SERVER}/event/attend/210226/stamp_img_moon@2x.png`} alt="달 이미지" />
                  </li>
                )
              }

              return (
                <li className={class_name} key={`event-date-${index}`}>
                  {createCheckIn(check_ok)}

                  <p className="stampBoxItem__date">
                    {check_ok === 1 ? '출석성공' : check_ok === 0 ? '출석실패' : `${date_pair[index]}`}
                  </p>

                  <p className="stampBoxItem__exp">{eventDate.nowDate > eventDate.endDate ? text[index] : eventText[index]}</p>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="bonus_box">
          {statusList.bonus === '2' ? (
            <img src={`${IMG_SERVER}/event/attend/210226/event_img_01_4_on@2x.png`} alt="보너스 지급 완료" />
          ) : (
            <img src={`${IMG_SERVER}/event/attend/210226/event_img_01_4@2x.png`} alt="출석체크 혜택 보너스" />
          )}

          {statusList.bonus === '0' ? (
            <button className="btn notouch">
              <img src={`${IMG_SERVER}/event/attend/210226/btn_bonus_gift_disabled@2x.png`} alt="보너스 선물받기 받을수없음" />
            </button>
          ) : statusList.bonus === '1' ? (
            <button className="btn" onClick={() => clickGiftButton()}>
              <img src={`${IMG_SERVER}/event/attend/210226/btn_bonus_gift@2x.png`} alt="보너스 선물받기 받을수있음" />
            </button>
          ) : statusList.bonus === '2' ? (
            <ul className="point_box">
              <li>
                경험치 (EXP) : <p>{summaryList.totalExp}</p> <span className="bonus"> +{statusList.exp}</span>
              </li>
              <li>
                받은 달 : <p>{summaryList.dalCnt}</p> <span className="bonus"> +{statusList.dal}</span>
              </li>
            </ul>
          ) : (
            <></>
          )}
        </div>

        {popup && <BonusPop setPopup={setPopup}></BonusPop>}
      </>
    )
  }

  return creatList()
}
