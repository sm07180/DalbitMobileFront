//context
import React, {useEffect, useState} from 'react'
import {IMG_SERVER} from 'context/config'

import API from 'context/api'

import LayerPopup from './layer_popup'

export default (props) => {
  const {dateList, summaryList, statusList, setStatusList, setSummaryList} = props
  const [popup, setPopup] = useState(false)

  useEffect(() => {
    if (popup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/rank/#layer')
      }
    } else if (!popup) {
      if (window.location.hash === '#layer') {
        window.history.back()
      }
    }
  }, [popup])

  if (!dateList.length) return null

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

  const clickGiftButton = () => {
    async function fetchEventAttendGift() {
      const {result, data} = await API.postEventAttendGift()
      if (result === 'success') {
        const {status, summary} = data
        setSummaryList(summary)
        setStatusList(status)
        setPopup(popup ? false : true)
      } else {
        //실패
      }
    }
    fetchEventAttendGift()
  }

  const creatList = () => {
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

    const text = ['EXP10+1달', 'EXP10+2달', 'EXP10+1달', 'EXP10+2달', 'EXP15+2달', 'EXP15+2달', 'EXP15+2달']

    return (
      <>
        <ul className="stamp-box-list">
          {result.map((item, index) => {
            let class_name = ''
            let check_ok = ''

            if (item !== null) check_ok = item.check_ok

            if (item !== null) {
              class_name = `stamp-box-item ${check_ok === 1 ? 'success' : check_ok === 0 ? 'fail' : 'today'}`
            } else if (item === null) {
              class_name = 'stamp-box-item'
            }

            if (index === 7) {
              if (statusList.bonus === '0') {
                return (
                  <div key={`event-date-${index}`} className="point-box basic">
                    <div className="title-label">
                      <img src={`${IMG_SERVER}/event/attend/200804/label_bonus@2x.png`} />
                    </div>
                    <div className="title">
                      <img src={`${IMG_SERVER}/event/attend/200804/txt_bonus_gift@2x.png`} />
                    </div>
                    <div className="detail-info">
                      <label className="label attend">
                        출석체크: <span>{summaryList.attendanceDays}</span>
                      </label>
                      <label className="label">
                        경험치: <span>{summaryList.totalExp}</span>
                      </label>{' '}
                      <label className="label">
                        받은 달: <span>{summaryList.dalCnt}</span>
                      </label>
                    </div>
                  </div>
                )
              } else if (statusList.bonus === '1') {
                return <div key={`event-date-${index}`} onClick={clickGiftButton} className="point-box more"></div>
              } else {
                return (
                  <div key={`event-date-${index}`} className="point-box complete">
                    <div className="detail-info">
                      <label className="label">
                        경험치(EXP):{' '}
                        <span>
                          {summaryList.totalExp} {statusList && <i>+ {statusList.exp}</i>}
                        </span>
                      </label>{' '}
                      <label className="label">
                        받은 달:{' '}
                        <span>
                          {summaryList.dalCnt} {statusList && <i>+ {statusList.dal}</i>}
                        </span>
                      </label>
                    </div>
                  </div>
                )
              }
            }

            return (
              <li className={class_name} key={`event-date-${index}`}>
                <div className="stamp-box-item-wrap">
                  <p className="stamp-date">{date_pair[index]}</p>
                  <div className="stamp-area">
                    {createCheckIn(check_ok)}
                    <span className="today-icon">
                      <img src={`${IMG_SERVER}/event/attend/200804/label_today@2x.png`} />
                    </span>
                  </div>

                  <p className="stamp-exp">
                    {check_ok === 1 ? <>{text[index]} 획득!</> : check_ok === 0 ? <>출석체크 실패!</> : <>{text[index]}</>}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        {popup && <LayerPopup setPopup={setPopup} statusList={statusList} setStatusList={setStatusList}></LayerPopup>}
      </>
    )
  }

  return creatList()
}
