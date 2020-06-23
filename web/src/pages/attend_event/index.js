import {Context} from 'context'
import API from 'context/api'
import React, {useContext, useEffect, useState} from 'react'

// component
import Layout from 'pages/common/layout'
import './attend_event.scss'
import AttendList from './attend_list'
import {Link, useHistory} from 'react-router-dom'
import LayerPopup from './layer_popup'

// static
import btnClose from './static/ico_close.svg'
import iconGift from './static/icn_gift.svg'
import iconStamp from './static/icn_stamp.svg'
import iconMoon from './static/icn_moon.svg'

export default (props) => {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  const [summaryList, setSummaryList] = useState({
    attendanceDays: 0,
    totalExp: 0,
    dalCnt: 0
  })
  const [statusList, setStatusList] = useState([])
  const [dateList, setDateList] = useState([])
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

  useEffect(() => {
    async function fetchEventAttendDate() {
      const {result, data} = await API.postEventAttend()
      if (result === 'success') {
        const {status, dateList, summary} = data
        setSummaryList(summary)
        setStatusList(status)
        setDateList(dateList)
      } else {
        //실패
      }
    }
    fetchEventAttendDate()
  }, [])

  const attendDateIn = () => {
    async function fetchEventAttendDateIn() {
      const {result, data, message} = await API.postEventAttendIn()
      if (result === 'success') {
        const {status, dateList, summary} = data
        setSummaryList(summary)
        setStatusList(status)
        setDateList(dateList)

        globalCtx.action.alert({
          msg: message
        })
      } else {
        if (!token.isLogin) {
          globalCtx.action.alert({
            callback: () => {
              // window.location.href = '/login'
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

  const createCheckGift = () => {
    const {check_gift} = statusList

    let checkGiftName

    if (check_gift === '0') {
      checkGiftName = `btn-check complete`
    } else {
      checkGiftName = `btn-check`
    }
    return checkGiftName
  }

  const createBonusBox = () => {
    const {bonus} = statusList
    let bonusName

    if (bonus === '0') {
      bonusName = `bonus-box`
    } else if (bonus === '1') {
      bonusName = `bonus-box more`
    } else if (bonus === '2') {
      bonusName = `bonus-box complete`
    } else {
      bonusName = `bonus-box`
    }

    return bonusName
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

  return (
    <Layout {...props} status="no_gnb">
      <div id="attend-event">
        <div className="event-main">
          <Link to="/">
            <button className="btn-back">
              <img src={btnClose} />
            </button>
          </Link>

          <div className="img-leaves"></div>
          <div className="img-bottle-moon"></div>
          <div className="img-big-rabbit"></div>
          <div className="img-title"></div>

          <button className={createCheckGift()} onClick={() => attendDateIn()}></button>
        </div>

        <div className="event-content-wrap">
          <div className="top-title"></div>

          <div className="event-content">
            <div className="content-left-wrap">
              <div className="detail-text-title"></div>
              <div className="detail-text-content"></div>

              <div className="detail-info-box">
                <label className="label">
                  <img src={iconStamp} />
                  출석체크:
                </label>
                <p className="value">
                  <span>{summaryList.attendanceDays}</span> 개
                </p>

                <label className="label">
                  <img src={iconGift} />
                  경험치:
                </label>
                <p className="value">
                  <span>{summaryList.totalExp}</span> EXP
                </p>

                <label className="label">
                  <img src={iconMoon} />
                  받은 달:
                </label>
                <p className="value">
                  <span>{summaryList.dalCnt}</span> 개
                </p>
              </div>

              <div className="detail-text-title bonus"></div>
              <div className="detail-text-content bonus"></div>
            </div>
            <div className="content-right-wrap">
              <div className="stamp-box">
                <AttendList dateList={dateList}></AttendList>
              </div>

              <div className={createBonusBox()}>
                <p className="title">BONUS RANDOM GIFT</p>

                <button className="btn-more" onClick={clickGiftButton}></button>
              </div>
            </div>
          </div>
        </div>

        <div className="event-notice">
          <p className="title">이벤트 유의사항</p>

          <ul>
            <li>
              본 이벤트는 00시 기준 종료된 방송 또는 청취 진행시간의 합이 30분 이상일 때 참여할 수 있습니다.
              <br />
              예시) 23:40-00:10의 경우 전일 출석 이벤트는 참여할 수 없으며, 오늘 출석 이벤트는 참여할 수 있습니다.
            </li>
            <li>본 이벤트는 한 대의 기기당 1일 1회 한 개의 계정만 참여할 수 있습니다.</li>
            <li>출석체크 선물 내역은 일주일 단위로 초기화 됩니다</li>
            <li>달 선물은 [마이페이지 &gt; 내지갑]으로 자동 지급됩니다.</li>
            <li>보너스 랜덤 선물은 경험치(50, 70, 100, 200, 300, 500 중 지급)와 달(0~10개 중 지급)로 구성되어 있습니다.</li>
            <li>
              보너스 랜덤 선물은 일주일을 모두 출석 체크한 대상에게 지급되며 생성된 ‘더 줘!’ 버튼을 선택시 선물 받기가 완료됩니다.{' '}
            </li>
            <li>‘더 줘!’ 버튼은 일요일과 월요일에만 선택이 가능합니다.</li>
            <li>본 이벤트는 사전 고지 없이 변경 및 종료될 수 있습니다.</li>
          </ul>
        </div>
      </div>

      {popup && <LayerPopup setPopup={setPopup} statusList={statusList}></LayerPopup>}
    </Layout>
  )
}
