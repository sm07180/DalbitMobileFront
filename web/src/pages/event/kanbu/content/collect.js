import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'

// import PopupNotice from './popupNotice'
// import PopupDetails from './popupDetails'
import {Context} from 'context'

const RAFFLE_INPUT_VALUE_MAX_SIZE = 5 // 응모권 입력 자리수

export default (props) => {
  const context = useContext(Context)
  const {tabContent, setTabContent} = props
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupDetails, setPopupDetails] = useState(false)
  const [raffleTotalSummaryInfo, setRaffleTotalSummaryInfo] = useState({
    coupon_cnt: 0, // 내 응모권 수
    fan_use_coupon_cnt: 0, // 총 응모 현황
    fan_week_use_coupon_cnt: 0 // 이번 회 응모 현황
  })
  const [raffleItemInfo, setRaffleItemInfo] = useState([])

  const history = useHistory()
  const itemListRef = useRef([])
  const numberReg = /^[0-9]*$/

  // 달 충전
  const chargeDal = () => {
    if (!context.token.isLogin) {
      history.push('/login')
      return
    }

    history.push('/pay/store')
  }
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
    if (tabContent === 'total') {
      getTotalEventInfo()
    }
  }, [tabContent])

  return (
    <div id="collect" style={{display: `${tabContent === 'total' ? 'block' : 'none'}`}}>
      <img src="https://image.dalbitlive.com/event/kanbu/kanbuBottomImg.png" className="bg" />
      <div className="title">
        <img src="https://image.dalbitlive.com/event/kanbu/bottomTitle.png" alt="구슬 현황" />
      </div>
      <div className="subTitle">
        <img src="https://image.dalbitlive.com/event/kanbu/bottomBtn.png" alt="구슬 얻는 법" />
      </div>
      <section className="rank">
        <img src="https://image.dalbitlive.com/event/kanbu/wrapperTop.png" />
        <div className="rankWrap">
          <div className="rankList my">
            <div className="number">
              <span className="tit">내 순위</span>
              <span className="num">32</span>
            </div>
            <div className="rankbox">
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
              <img src="" />
              <span>2,181</span>
            </div>
          </div>
          <div className="rankList">
            <div className="number"></div>
            <div className="rankbox">
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
              <img src="" />
              <span>2,181</span>
            </div>
          </div>
        </div>
      </section>
      {popupNotice && <PopupNotice setPopupNotice={setPopupNotice} />}
      {popupDetails && <PopupDetails setPopupDetails={setPopupDetails} />}
    </div>
  )
}
