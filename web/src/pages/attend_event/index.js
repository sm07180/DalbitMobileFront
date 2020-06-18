import {Context} from 'context'
import API from 'context/api'
import React, {useContext, useEffect, useState} from 'react'

// component
import Layout from 'pages/common/layout'
import './attend_event.scss'
import AttendList from './attend_list'
import {Link, useHistory} from 'react-router-dom'

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

  useEffect(() => {
    async function fetchEventAttendDate() {
      const {result, data} = await API.postEventAttend()
      if (result === 'success') {
        const {status, dateList, summary} = data
        setSummaryList(summary)
        setStatusList(status)
        setDateList(dateList)
      }
    }
    fetchEventAttendDate()

    async function fetchEventAttendGift() {
      const {result, data} = await API.postEventAttendGift()
      if (result === 'success') {
        const {} = data
      }
    }
    fetchEventAttendGift()
  }, [])

  const attendDateIn = () => {
    // if (token.isLogin) {
    //   console.log('로그인')
    // } else {
    //   console.log('로그아웃')
    // }
    async function fetchEventAttendDateIn() {
      const {result, data, message} = await API.postEventAttendIn()
      if (result === 'success') {
        const {status, dateList, summary} = data
        setSummaryList(summary)
        setStatusList(status)
        setDateList(dateList)

        console.log(summary)
      } else {
        globalCtx.action.alert({
          msg: message
        })
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

    console.log(bonus)

    if (bonus === '0') {
      bonusName = `bonus-box`
    } else if (bonus === '1') {
      bonusName = `bonus-box more`
    } else {
      bonusName = `bonus-box`
    }

    return bonusName
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

                <button className="btn-more"></button>
              </div>
            </div>
          </div>
        </div>

        <div className="event-notice">
          <p className="title">이벤트 유의사항</p>

          <ul>
            <li>
              본 이벤트는 하루 동안 청취시간 또는 방송시간(종료된 방송방 기준)의 누적된 합이 30분 이상인 대상에 한하여 1일 1회
              참여가 가능합니다.
            </li>
            <li>매일 선물 테이블을 요일별 달성 시 해당 선물이 지급됩니다.</li>
            <li>매일 선물 테이블은 일주일 주기로 초기화됩니다.</li>
            <li>달 선물은 [마이페이지 &gt; 내지갑]으로 자동 지급됩니다.</li>
            <li>
              보너스 랜덤 선물은 일주일을 모두 출석 체크한 대상에게 지급되며 생성된 ‘더 줘!’ 버튼을 선택시 선물 받기가 완료됩니다.{' '}
            </li>
            <li>‘더 줘!’ 버튼은 일요일과 월요일에만 선택이 가능합니다.</li>
            <li>본 이벤트는 당사 정책에 따라 사전 고지 없이 변경 및 종료될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
