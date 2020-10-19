import React, {useEffect, useContext, useState} from 'react'
import {AttendContext} from '../../attend_ctx'
import {IMG_SERVER} from 'context/config'

export default () => {
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {summaryList, statusList, dateList} = eventAttendState

  const createCheckIn = (check_ok) => {
    if (check_ok === 0) {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/200804/stamp_fail@2x.png`} />
        </>
      )
    } else if (check_ok === 1) {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/200804/stamp_success@2x.png`} />
        </>
      )
    } else {
      return (
        <>
          <img src={`${IMG_SERVER}/event/attend/200804/stamp_gray@2x.png`} />
        </>
      )
    }
  }

  const createBonus = () => {
    if (statusList.bonus === '0') {
      return <>보너스 해당없음</>
    } else if (statusList.bonus === '0') {
      return <>보너스 받을 수 있음</>
    } else {
      return <>보너스 받았음</>
    }
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
              if (statusList.bonus === '0') {
                return (
                  <div key={`event-date-${index}`} className="pointBox basic">
                    스탬프실패
                  </div>
                )
              } else {
                return (
                  <div key={`event-date-${index}`} className="point-box complete">
                    스탬프성공
                  </div>
                )
              }
            }

            return (
              <li className={class_name} key={`event-date-${index}`}>
                <div className="stamp-box-item-wrap">
                  <div className="stamp-area">
                    {createCheckIn(check_ok)}

                    {item !== null && item.is_today && (
                      <span className="today-icon">
                        <img src={`${IMG_SERVER}/event/attend/200804/label_today@2x.png`} />
                      </span>
                    )}
                  </div>
                  <p className="stamp-date">{date_pair[index]}</p>

                  <p className="stamp-exp">
                    {check_ok === 1 ? <>{text[index]} 획득!</> : check_ok === 0 ? <>출석체크 실패!</> : <>{text[index]}</>}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        <div>{createBonus()}</div>

        {/* {popup && <LayerPopup setPopup={setPopup} statusList={statusList} setStatusList={setStatusList}></LayerPopup>} */}
      </>
    )
  }

  return creatList()
}
