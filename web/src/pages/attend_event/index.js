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

  useEffect(() => {
    async function fetchEventAttendCheck() {
      const {result, data} = await API.getEventAttendCheck()
      if (result === 'success') {
        const {isCheck} = data
        console.log('체크성공')
      } else {
        //실패
      }
    }
    fetchEventAttendCheck()
  }, [])

  useEffect(() => {
    async function fetchEventAttendInput() {
      const {result, data} = await API.postEventAttendInput({
        params: {
          phone: ''
        }
      })
      if (result === 'success') {
        const {isCheck} = data
        console.log('인풋성공')
      } else {
        //실패
      }
    }
    fetchEventAttendInput()
  }, [])

  useEffect(() => {
    async function fetchEventAttendWinList() {
      const {result, data} = await API.getEventAttendWinList()
      if (result === 'success') {
        const {list} = data
        console.log('당첨자리스트성공')
      } else {
        //실패
      }
    }
    fetchEventAttendWinList()
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
          <div className="img-pick">
            <p>방송(청취) 시간 30분이 되었다면?</p>

            <div className="img-pick-text"></div>

            <div className="img-pick-hand"></div>
          </div>
          <div className="img-title"></div>

          <button className={createCheckGift()} onClick={() => attendDateIn()}></button>

          <div className="giftcon-win-box">
            <label>기프티콘 당첨자</label>
            <div>
              <p className="time">11:11:11</p>
              <p className="nick-name">닉네임</p>
            </div>
          </div>
        </div>

        <div className="event-content-wrap">
          {/* <div className="top-title"></div> */}

          <div className="event-content">
            <div className="event-section">
              <label className="title-label">EVENT 1. 기프티콘</label>
              <p className="title-top">
                특별한 날 출석하면 기프티콘 쏜다!<span>주 7일 연속 출석에 성공한 날, 보람달이 뜨는 날 출석하면 자동 응모!</span>
              </p>

              <div className="gifticon-benefit">
                <div className="gifticon-benefit-item">
                  <p className="description">
                    매주 자동 추첨!
                    <br />
                    7일 연속 출석 청공한 날<span>스타벅스 아메리카노(10명)</span>
                  </p>
                </div>
                <div className="gifticon-benefit-item">
                  <p className="date">8월 4일</p>
                  <p className="description">
                    매일 보름달이 뜨는 날!<span>BHC 뿌링클 세트(3명)</span>
                  </p>
                </div>

                <div className="gifticon-benefit-input">
                  <p className="title">기프티콘 당첨자 연락처 입력</p>

                  <div className="input-box">
                    <input type="phone" placeholder="'-'를 빼고 휴대폰 번호를 입력해주세요" />
                    <button>저장</button>
                  </div>

                  <p className="note">※ 기프티콘 추첨일에 이미 당첨되어 접수된 휴대폰 번호는 중복으로 참여할 수 없습니다.</p>
                </div>
              </div>
            </div>

            <div className="event-section">
              <label className="title-label">EVENT 2. 매일 선물</label>
              <p className="title-top">
                날마다 출첵하고 선물 챙기자!
                <span>
                  매일 출석체크하면 달과 경험치(EXP) 100% 당첨!
                  <br />
                  7일동안 매일 출석했다면? 보너스 랜덤선물까지 또 받자!
                </span>
              </p>

              <div className="stamp-box">
                <AttendList dateList={dateList}></AttendList>
              </div>

              <div className={createBonusBox()}>
                <p className="title">BONUS RANDOM GIFT</p>

                <button className="btn-more" onClick={clickGiftButton}></button>
              </div>
            </div>
            {/* <div className="content-left-wrap">
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
             
            </div>*/}
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
            <li>본 이벤트는 청취 중에 참여할 수 없습니다. 청취 종료 후 출석체크를 선택해주세요.</li>
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
