import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Lottie from 'react-lottie'
// component
import {IMG_SERVER} from 'context/config'

import PopupDetails from './popupDetails'
import PopupReport from './popupReport'
import {Context} from 'context'

export default (props) => {
  const context = useContext(Context)
  const {tabContent, setTabContent} = props
  const [noticeTab, setNoticeTab] = useState(false)
  const [popupDetails, setPopupDetails] = useState(false)
  const [popupReport, setPopupReport] = useState(false)
  const [raffleTotalSummaryInfo, setRaffleTotalSummaryInfo] = useState({
    coupon_cnt: 0, // 내 응모권 수
    fan_use_coupon_cnt: 0, // 총 응모 현황
    fan_week_use_coupon_cnt: 0 // 이번 회 응모 현황
  })
  const [raffleItemInfo, setRaffleItemInfo] = useState([])

  const history = useHistory()
  const itemListRef = useRef([])
  const numberReg = /^[0-9]*$/

  const numberValidation = useCallback((val) => numberReg.test(val) && !isNaN(val), [])

  // 응모하기
  const goRaffle = useCallback(async (itemCode, index) => {
    if (!context.token.isLogin) {
      history.push('/login')
      return
    }

    const inputCnt = parseInt(itemListRef.current[index].value)
    const isNumber = numberValidation(inputCnt)

    let alertMsg = '잠시후 다시 시도해주세요'
    if (!isNumber) {
      alertMsg = '숫자만 입력하세요'
    } else {
      const {message, data, code} = await Api.putEnterRaffleEvent({fanGiftNo: itemCode, couponCnt: inputCnt})
      if (code !== '99999') {
        if (data.couponInsRes === -3) {
          alert('이벤트가 종료되었습니다')
          window.location.replace('/')
          return
        } else if (data.couponInsRes === 1) {
          alertMsg = `${inputCnt}회를 응모하였습니다`
          setRaffleTotalSummaryInfo(data.summaryInfo)
          setRaffleItemInfo(data.itemInfo)
          itemListRef.current[index].value = 1
        } else if (data.couponInsRes === -2) {
          alertMsg = message
        }
      }
    }

    context.action.alert({
      msg: alertMsg
    })
  }, [])

  const getTotalEventInfo = useCallback(async () => {
    const {message, data} = await Api.getRaffleEventTotalInfo()
    if (message === 'SUCCESS') {
      setRaffleTotalSummaryInfo(data.summaryInfo)
      setRaffleItemInfo(data.itemInfo)
    }
  }, [])

  useEffect(() => {
    if (tabContent === 'collect') {
      getTotalEventInfo()
    }
  }, [tabContent])

  return (
    <>
      <div id="collect" style={{display: `${tabContent === 'collect' ? 'block' : 'none'}`}}>
        <section className="content">
          <img src="https://image.dalbitlive.com/event/kanbu/kanbuBottomImg.png" className="bg" />
          <div className="title">
            <img src="https://image.dalbitlive.com/event/kanbu/bottomTitle.png" alt="구슬 현황" />
          </div>
          <button className="subTitle" onClick={() => setPopupDetails(true)}>
            <img src="https://image.dalbitlive.com/event/kanbu/bottomBtn.png" alt="구슬 얻는 법" />
          </button>
          <div className="status">
            <div className="statusWrap">
              <div className="marbleWrap">
                <div className="report">
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-1.png" />
                    <span>10</span>
                  </div>
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-2.png" />
                    <span>10</span>
                  </div>
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-3.png" />
                    <span>100</span>
                  </div>
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-4.png" />
                    <span>10</span>
                  </div>
                  <button onClick={() => setPopupReport(true)}>
                    <img src="https://image.dalbitlive.com/event/kanbu/btnReport.png" alt="구슬 리포트" />
                  </button>
                </div>
                <div className="pocket">
                  <div className="list">
                    {/* <img src="https://image.dalbitlive.com/event/kanbu/marblePocket-1.png" /> */}
                    <Lottie
                      options={{
                        loop: true,
                        autoPlay: true,
                        path: `${IMG_SERVER}/event/kanbu/marblePocket-1-lottie.json`
                      }}
                    />
                    <span>456</span>
                  </div>
                  <button>
                    <img src="https://image.dalbitlive.com/event/kanbu/btnPocket.png" alt="구슬 주머니" />
                  </button>
                </div>
              </div>
              <div className="score">총 20,879점</div>
            </div>
          </div>
        </section>
        <section className={`notice ${noticeTab === false ? 'off' : 'on'}`} onClick={() => setNoticeTab(noticeTab)}>
          {noticeTab === false ? (
            <img src="https://image.dalbitlive.com/event/kanbu/kanbuNoticeImg-on.png" />
          ) : (
            <img src="https://image.dalbitlive.com/event/kanbu/kanbuNoticeImg-off.png" />
          )}
        </section>
        <section className="rank">
          <img src="https://image.dalbitlive.com/event/kanbu/wrapperTop.png" />
          <div className="rankList my">
            <div className="number">
              <span className="tit">내 순위</span>
              <span className="num">32</span>
            </div>
            <div className="rankBox">
              <div className="rankItem">
                <em className="badge">lv 65</em>
                <span className="userNick">해나잉뎅</span>
                <span className="userId">maiwcl88</span>
              </div>
              <div className="rankItem">
                <em className="badge">lv 65</em>
                <span className="userNick">해나잉뎅</span>
                <span className="userId">maiwcl88</span>
              </div>
            </div>
            <div className="score">
              <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
              <span>2,181</span>
            </div>
          </div>
          <div className="rankWrap">
            <div className="rankList">
              <div className="number medal-1">
                <img src="https://image.dalbitlive.com/event/kanbu/rankMedal-1.png" />
              </div>
              <div className="rankBox">
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <div className="rankList">
              <div className="number medal-2">
                <img src="https://image.dalbitlive.com/event/kanbu/rankMedal-2.png" />
              </div>
              <div className="rankBox">
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <div className="rankList">
              <div className="number medal-3">
                <img src="https://image.dalbitlive.com/event/kanbu/rankMedal-3.png" />
              </div>
              <div className="rankBox">
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      {popupDetails && <PopupDetails setPopupDetails={setPopupDetails} />}
      {popupReport && <PopupReport setPopupReport={setPopupReport} />}
    </>
  )
}
