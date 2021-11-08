import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Utility from 'components/lib/utility'

import PopupNotice from './popupNotice'
import PopupDetails from './popupDetails'
import {Context} from "context";

const RAFFLE_INPUT_VALUE_MAX_SIZE = 5; // 응모권 입력 자리수

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
  const numberReg = /^[0-9]*$/;

  // 달 충전
  const chargeDal = () => {
    if(!context.token.isLogin) {
      history.push("/login");
      return;
    }

    history.push('/pay/store')
  }
  const numberValidation = useCallback(val => numberReg.test(val) && !isNaN(val), []);

  // 응모하기
  const goRaffle = useCallback(async (itemCode, index) => {
    if(!context.token.isLogin) {
      history.push("/login");
      return;
    }

    const inputCnt = parseInt(itemListRef.current[index].value);
    const isNumber = numberValidation(inputCnt);

    let alertMsg = '잠시후 다시 시도해주세요';
    if(!isNumber) {
      alertMsg = '숫자만 입력하세요'
    }else {
      const {message, data, code} = await Api.putEnterRaffleEvent({ fanGiftNo: itemCode, couponCnt: inputCnt });
      if(code !== '99999') {
        if(data.couponInsRes === 1) {
          alertMsg = `${inputCnt}회를 응모하였습니다`;
          setRaffleTotalSummaryInfo(data.summaryInfo);
          setRaffleItemInfo(data.itemInfo);
        }else if(data.couponInsRes === -2) {
          alertMsg = message;
        }
      }
    }

    context.action.alert({
      msg: alertMsg,
    })
  }, []);

  const getTotalEventInfo = useCallback(async () => {
    const {message, data} = await Api.getRaffleEventTotalInfo()
    if (message === 'SUCCESS') {
      setRaffleTotalSummaryInfo(data.summaryInfo)
      setRaffleItemInfo(data.itemInfo)
    }
  }, []);

  useEffect(() => {
    if(tabContent === 'total') {
      getTotalEventInfo()
    }
  }, [tabContent])

  return (
    <div id="total" style={{display: `${tabContent === 'total' ? 'block' : 'none'}`}}>
      <section className="section-1">
        <img src="https://image.dalbitlive.com/event/raffle/secImg-1.png" alt="" />
        <div className="ticket">
          <div className="number">
            <span>{Utility.addComma(raffleTotalSummaryInfo.coupon_cnt)}</span>개
          </div>
          <button onClick={chargeDal}>
            <img src="https://image.dalbitlive.com/event/raffle/secBtn-1.png" alt="달충전" />
          </button>
        </div>
        <div className="exWrap">
          <div className="exBox">
            <div className="title">
              <img
                src="https://image.dalbitlive.com/event/raffle/sectitle-1.png"
                width="76px"
                height="15px"
                alt="- 총 응모 현황 :"
              />
              {Utility.addComma(raffleTotalSummaryInfo.fan_week_use_coupon_cnt)} 회
            </div>
            <div className="title">
              <img
                src="https://image.dalbitlive.com/event/raffle/sectitle-2.png"
                width="101px"
                height="15px"
                alt="- 이번 회 응모 현황 :"
              />
              {Utility.addComma(raffleTotalSummaryInfo.fan_week_use_coupon_cnt)} 회
            </div>
          </div>
          <button onClick={() => setTabContent('round')}>
            <img src="https://image.dalbitlive.com/event/raffle/secBtn-2.png" alt="추첨 이벤트 보기" />
          </button>
        </div>
      </section>
      <section className="section-2">
        {raffleItemInfo.map((data, index) => {
          return (
            <div className="list" key={index}>
              <div className="top">
                <img src={data.fan_gift_file_name} className="items" alt={data.fan_gift_name} />
                <span className="status">
                  내 응모 횟수 : <span>{Utility.addComma(data.fan_use_coupon_cnt)}회</span>
                </span>
                <div className="number">
                  <img src={data.fan_gift_cnt_file_name} alt="" />
                </div>
              </div>
              <div className="bottom">
                <input type="number"
                       defaultValue={`${context.token.isLogin ? 1 : 0}`}
                       ref={(el) => (itemListRef.current[index] = el)}
                       onChange={e => {
                         const {target: {value}} = e;
                         if(value.length > RAFFLE_INPUT_VALUE_MAX_SIZE) {
                           const obj = itemListRef.current[index];
                           if(obj) {
                             obj.value = obj.value.substring(0, RAFFLE_INPUT_VALUE_MAX_SIZE);
                           }
                         }
                       }}
                />
                <img src="https://image.dalbitlive.com/event/raffle/gae.png" className="gae" alt="개" />
                <button>
                  <img
                    src="https://image.dalbitlive.com/event/raffle/listBtn.png"
                    alt="응모"
                    onClick={() => goRaffle(data.auto_no, index)}
                  />
                </button>
              </div>
            </div>
          )
        })}
      </section>
      <section className="section-3">
        <img
          src="https://image.dalbitlive.com/event/raffle/bottomImg.png"
          alt="가장 많이 응모한 단 1명에게 특정 DJ에게 스페셜DJ 가산점 10점을 부여할 수 있는 특별한 권한을 드립니다."
        />
      </section>
      <footer>
        <div className="fTop">
          <img src="https://image.dalbitlive.com/event/raffle/bottomTitle.png" height="16px" alt="꼭 읽어보세요" />
          <button onClick={() => setPopupNotice(true)}>
            <img src="https://image.dalbitlive.com/event/raffle/bottomBtn-1.png" height="22px" alt="유의사항" />
          </button>
          <button onClick={() => setPopupDetails(true)}>
            <img src="https://image.dalbitlive.com/event/raffle/bottomBtn-2.png" height="22px" alt="경품 자세히" />
          </button>
        </div>
      </footer>
      {popupNotice && <PopupNotice setPopupNotice={setPopupNotice} />}
      {popupDetails && <PopupDetails setPopupDetails={setPopupDetails} />}
    </div>
  )
}
