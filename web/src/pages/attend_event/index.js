import React, {useContext, useEffect, useState} from 'react'

import {IMG_SERVER} from 'context/config'
import API from 'context/api'
import {Context} from 'context'
import Utility from 'components/lib/utility'
// component
import Layout from 'pages/common/layout'
import './attend_event.scss'
import AttendList from './attend_list'
import {Link, useHistory} from 'react-router-dom'
import WinList from './attend_win_list'

// static
import btnClose from './static/ico_close.svg'

let intervalId = null

export default (props) => {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const [phone, setPhone] = useState('')
  const [btnState, setBtnState] = useState({
    phone: false
  })
  const [summaryList, setSummaryList] = useState({
    attendanceDays: 0,
    totalExp: 0,
    dalCnt: 0
  })
  const [statusList, setStatusList] = useState([])
  const [dateList, setDateList] = useState({})
  const [lunarDate, setLunarDate] = useState('')
  const [winList, setWinList] = useState({
    winDt: '',
    memNo: '',
    nickNm: '',
    profImg: ''
  })

  useEffect(() => {
    async function fetchEventAttendDate() {
      const {result, data} = await API.postEventAttend()
      if (result === 'success') {
        const {status, dateList, summary} = data
        setSummaryList(summary)
        setStatusList(status)
        setDateList(dateList)
      } else {
        //실패\
        setStatusList({bonus: '0'})
        setDateList([{0: {}}])
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
    async function fetchEventAttendWinList() {
      const {result, data, message} = await API.getEventAttendWinList()
      if (result === 'success') {
        const {list} = data

        setWinList(list)
      } else {
        globalCtx.action.alert({
          msg: message
        })
      }
    }
    fetchEventAttendWinList()
  }, [])

  useEffect(() => {
    async function fetchEventAttendLunarDate() {
      const {result, data} = await API.getEventAttendLunarDate()
      if (result === 'success') {
        const {lunarDt} = data
        setLunarDate(lunarDt)
      } else {
        //실패
      }
    }
    fetchEventAttendLunarDate()
  }, [])

  const attendDateIn = () => {
    async function fetchEventAttendDateIn() {
      const {result, data, message} = await API.postEventAttendIn()
      if (result === 'success') {
        const {status, dateList, summary} = data
        setSummaryList(summary)
        setStatusList(status)
        setDateList(dateList)

        if (status.gifticon_check === '1') {
          intervalFormatter(status.input_enddate)
          if (status.gifticon_win === '1') {
            globalCtx.action.alert({
              msg: `<div class="attend-alert-box"><p class="title">축하합니다!</p><p class="sub-title">매일 선물과 <span>스타벅스 아메리카노</span> 당첨!</p><div class="gift-img"><img src="https://image.dalbitlive.com/event/attend/200804/img_coffee@2x.png"></div><p class="sub-title">이벤트 페이지 중간에서<br />휴대폰 번호를 입력해주세요.</p></div>`,
              buttonMsg: `휴대폰 번호 입력하기`
            })
          } else if (status.gifticon_win === '2') {
            globalCtx.action.alert({
              msg: `<div class="attend-alert-box" ><p class="title">축하합니다!</p><p class="sub-title">매일 선물과 <span>BHC 뿌링클 세트</span> 당첨!</p><div class="gift-img"><img src="https://image.dalbitlive.com/event/attend/200804/img_chicken_pop@2x.png"></div><p class="sub-title">이벤트 페이지 중간에서<br />휴대폰 번호를 입력해주세요.</p></div>`,
              buttonMsg: `휴대폰 번호 입력하기`
            })
          } else {
            globalCtx.action.alert({
              msg: `<div class="attend-alert-box" ><p class="title">매일 출석체크 선물 지급 완료!</p><p class="sub-title">기프티콘은 넘나 아쉬운 것..</p></div>`
            })
          }
        } else {
          globalCtx.action.alert({
            msg: message
          })
        }
      } else {
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

  const inputHandle = (e) => {
    const {name, value} = e.target
    const nmValue = value.replace(/[^0-9]/g, '')
    switch (name) {
      case 'phone':
        if (value.toString().length < 12) setPhone(nmValue)
        break
      default:
        break
    }
  }

  function reducer(state, action) {
    const {name, value} = action
    //휴대폰번호
    if (name === 'phone' && value.length === 11) {
      setBtnState({
        ...btnState,
        phone: true
      })
    } else {
      setBtnState({
        ...btnState,
        phone: false
      })
    }

    return {
      ...state,
      [name]: value
    }
  }

  const clickSaveButton = () => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    if (!phone) {
      return globalCtx.action.alert({
        msg: `핸드폰 번호는 필수입력 값입니다.`
      })
    }
    if (!rgEx.test(phone)) {
      return globalCtx.action.alert({
        msg: `올바른 핸드폰 번호가 아닙니다.`
      })
    }

    async function fetchEventAttendInput() {
      const {result, message} = await API.postEventAttendInput({
        phone: phone
      })
      if (result === 'success') {
        // const {isCheck} = data

        globalCtx.action.alert({
          msg: `<div class="attend-alert-box" ><p class="title">다시 한 번 축하드립니다!</p><p class="sub-title">평일 기준 7일 이내 입력하신 번호로
          기프티콘을 전송해드립니다.</p></div>`
        })
      } else {
        globalCtx.action.alert({
          msg: message
        })
      }
    }
    fetchEventAttendInput()
  }

  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // 20200218145519
    let month = date.substring(4, 6)
    let day = date.substring(6, 8)
    let time = `${date.substring(8, 10)}:${date.substring(10, 12)}`
    return `${month}월 ${day}일 ${time}`
  }

  const [timeText, setTimeText] = useState('')
  const intervalFormatter = (date) => {
    if (!date) return null
    console.log(date)
    // let time = date.replace(/\s/gi, '').substring(13, 18)

    let time = +new Date(date)
    let now = +new Date()
    let test = (time - now) / 1000

    intervalId = setInterval(() => {
      console.log(typeof test)
      const text = `${Utility.leadingZeros(Math.floor(test / 60), 2)}:${Utility.leadingZeros(Math.floor(test % 60), 2)}`
      test--

      setTimeText(text)

      if (test < 0) {
        clearInterval(intervalId)
      }
    }, 1000)
  }

  useEffect(() => {
    intervalFormatter()
  }, [])

  const {title} = props.match.params
  if (title === 'winList') return <WinList winList={winList} />

  return (
    <Layout {...props} status="no_gnb">
      <div id="attend-event">
        <div className="event-main">
          <img src={`${IMG_SERVER}/event/attend/200804/img_top@2x.png`} className="img-top" />
          <Link to="/">
            <button className="btn-back">
              <img src={btnClose} />
            </button>
          </Link>

          <button className={createCheckGift()} onClick={() => attendDateIn()}></button>
        </div>

        <div className="gifticon-win-wrap" onClick={() => props.history.push('/attend_event/winList')}>
          <div className="gifticon-win-box">
            <label>기프티콘 당첨자</label>
            <div className="gifticon-win-list">
              {winList.length > 0 && <p className="time">{dateFormatter(winList[0].winDt)}</p>}
              {winList.length > 0 && <p className="nick-name">{winList[0].nickNm}</p>}
            </div>
          </div>
        </div>

        <div className="event-content-wrap">
          <div className="event-content">
            <div className="event-section">
              <label className="title-label">
                <img src={`${IMG_SERVER}/event/attend/200804/img_tt_event1@2x.png`} />
              </label>
              <p className="title-top">
                <img src={`${IMG_SERVER}/event/attend/200804/img_tt_event1_title@2x.png`} />
              </p>

              <div className="gifticon-benefit">
                <div className="gifticon-benefit-item">
                  <div className="gifti-img-coffee">
                    <img src={`${IMG_SERVER}/event/attend/200804/img_coffee@2x.png`} />
                  </div>

                  <p className="description">
                    매주 자동 추첨!
                    <br />
                    7일 연속 출석 성공한 날<span>스타벅스 아메리카노(10명)</span>
                  </p>
                </div>
                <div className="gifticon-benefit-item">
                  <div className="gifti-img-chicken">
                    <img src={`${IMG_SERVER}/event/attend/200804/img_chicken@2x.png`} />
                  </div>
                  <p className="luna-date">{lunarDate}</p>
                  <p className="description">
                    매일 보름달이 뜨는 날!<span>BHC 뿌링클 세트(3명)</span>
                  </p>
                </div>

                {statusList.phone_input === '0' ? (
                  ''
                ) : (
                  <div className="gifticon-benefit-input">
                    <p className="title">
                      기프티콘 당첨자 연락처 입력 <span className="time">{timeText}</span>
                    </p>

                    <div className="input-box">
                      <input
                        type="tel"
                        placeholder="'-'를 빼고 휴대폰 번호를 입력해주세요"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={inputHandle}
                      />
                      <button onClick={clickSaveButton}>저장</button>
                    </div>

                    <p className="note">※ 기프티콘 추첨일에 이미 당첨되어 접수된 휴대폰 번호는 중복으로 참여할 수 없습니다.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="event-section">
              <label className="title-label">
                <img src={`${IMG_SERVER}/event/attend/200804/img_tt_event2@2x.png`} />
              </label>
              <p className="title-top">
                <img src={`${IMG_SERVER}/event/attend/200804/img_tt_event2_title@2x.png`} />
              </p>

              <div className="stamp-box">
                <AttendList
                  dateList={dateList}
                  summaryList={summaryList}
                  statusList={statusList}
                  setStatusList={setStatusList}
                  setSummaryList={setSummaryList}></AttendList>
              </div>
            </div>
          </div>
        </div>

        <div className="event-notice">
          <p className="title">이벤트 유의사항</p>

          <ul>
            <li>
              출석 버튼은 00시 기준 종료된 방송 또는 청취 시간의 합이 30분 이 상일 때 선택할 수 있습니다.
              <br />
              예시) 23:40-00:10의 경우 전일 출석 이벤트는 참여할 수 없으며, 오늘 출석 이벤트는 참여할 수 있습니다.
            </li>
            <li>출석 버튼은 한 대의 기기당 1일 1회 한 개의 계정만 선택할 수 있습 니다.</li>
            <li>출석 버튼은 청취 중에 선택할 수 없습니다. 청취 종료 후 출석 버튼 을 선택해주세요.</li>
            <li>출석체크 매일 선물 내역은 일주일 단위로 초기화 됩니다.</li>
            <li>달 선물은 [마이페이지 &gt; 내지갑]으로 자동 지급됩니다.</li>
            <li>보너스 랜덤 선물은 경험치(50, 70, 100, 200, 300, 500 중 지급)와 달(0~10개 중 지급)로 구성되어 있습니다.</li>
            <li>
              보너스 랜덤 선물은 일주일을 모두 출석 체크한 대상에게 지급되며 생성된 [보너스 선물 받기] 버튼을 선택 시 선물 받기가
              완료됩니다.
            </li>
            <li>[보너스 선물 받기] 버튼은 일요일과 월요일에만 선택이 가능합니다.</li>
            <li>기프티콘은 평일 기준 7일 이내 입력한 휴대폰 번호로 보내드립니다.</li>
            <li>보름달이 뜨는 날은 음력 15일 기준입니다.</li>
            <li>기프티콘이 당첨되더라도 휴대폰 번호를 15분 동안 입력하지 않으 면 지급받을 수 없습니다.</li>
            <li>
              · 기프티콘 추첨일에 이미 당첨되어 접수 완료된 휴대폰 번호는 중복 저장할 수 없습니다.
              <br />
              예시) A계정 당첨 시 [01012341234] 저장 이후 당일 B계정 당첨 시 [01012341234] 저장 불가
            </li>
            <li>음력 15일이 일요일인 경우, 주 7일 출석 시 치킨뿐만 아니라 커피 기프티콘 추첨 대상자에도 포함됩니다.</li>
            <li>본 이벤트는 사전 고지 없이 변경 및 종료될 수 있습니다.</li>
          </ul>
        </div>
      </div>

      {/* {popup && <LayerPopup setPopup={setPopup} statusList={statusList}></LayerPopup>} */}
    </Layout>
  )
}
