import React, {useContext, useState, useCallback, useEffect} from 'react'

import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import PopupNotice from './content/popupNotice'
import PopupDetails from './content/popupDetails'

import './style.scss'
import {Context} from "context";
import Utility from "components/lib/utility";

const GET_ITEM_CONDITION_HOUR = 50; // 50시간
const GET_ITEM_CONDITION = GET_ITEM_CONDITION_HOUR * 3600; // 50시간 -> 초

export default () => {
  const history = useHistory()
  const context = useContext(Context)
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupDetails, setPopupDetails] = useState(false)
  const [djEventUserInfo, setDjEventUserInfo] = useState({
    memNo: '',
    play_time: 0,
    rcv_dal_cnt: 0,
    playTimeToFullTime: '0시간 0분',
    rcv_bonus_gold: 0,
    rcv_booster: 0,
  })
  const [canReceivePresent, setCanReceivePresent] = useState({
    myPresentName: "",
    myBroadTimeConditionYn: "",
  });

  const goBack = () => history.goBack();

  // 부스터 아이템 지급 관련
  const param = {
    itemType: 1, // itemType: 1: 부스터
    itemState: 1, // itemState: 1: 지급, 2: 사용, 3: 차감
    itemCnt: 20, // itemCnt: 아이템 개수
    opName: '11월 이벤트 부스터 지급' // opName: 처리내용
  };
  const insBooster = async () => {
    let alertMsg = '';
    const {data} = await Api.eventItemIns(param);
    if(data === 1) {
      setDjEventUserInfo({...djEventUserInfo, rcv_booster: 20});
      alertMsg = '부스터 20개가 지급되었습니다.';
    }else {
      alertMsg = '잠시 후 다시 시도해주세요.';
    }

    context.action.alert({
      msg: alertMsg,
    })
  }

  const receiveBoosterItem = () => {
    if(!context.token.isLogin) {
      history.push("/login");
      return;
    }

    if(djEventUserInfo.play_time >= GET_ITEM_CONDITION) {
      if(djEventUserInfo.rcv_booster === 0) {
        insBooster();
      }else {
        context.action.alert({
          msg: '이미 지급받으셨습니다.',
        })
      }
    }else {
      context.action.alert({
        msg: `${GET_ITEM_CONDITION_HOUR}시간을 달성해야 부스터를 받을 수 있습니다.`,
      })
    }
  };

  const getDjRaffleInfo = useCallback(async () => {
    const {data, code} = await Api.getRaffleEventDjInfo();
    if(code === '00000') {
      setCanReceivePresent({myPresentName: data.myPresentName, myBroadTimeConditionYn: data.myBroadTimeConditionYn })
      setDjEventUserInfo({...data.djEventUserInfo, playTimeToFullTime: Utility.secondToHM(data.djEventUserInfo.play_time)});
    }
  }, []);

  useEffect(() => {
    if(context.token.isLogin) {
      getDjRaffleInfo();
    }
  }, []);

  return (
    <div id="raffleDj">
      <button className="close" onClick={goBack}>
        <img src="https://image.dalbitlive.com/event/raffle/close.png" alt="닫기" />
      </button>
      <div className="top">
        <img
          src="https://image.dalbitlive.com/event/raffle/topImgDj.png"
          alt="DJ님!! 이게 머선129? 방송에서 선물을 받으면 추가 적립! 많이 받으면 보너스 선물까지!"
        />
        <div className="date">
          <img src="https://image.dalbitlive.com/event/raffle/date-dj.png" alt="총 이벤트 기간 11/10 ~ 12/7, 발표 12/8" />
        </div>
      </div>
      <section className="section-1">
        <img
          src="https://image.dalbitlive.com/event/raffle/djSection-1.png"
          alt="이벤트 1, 5% 추가 적립, 방송에서 받은 선물(별)의 5%를 추가 적립해 드립니다."
        />
      </section>
      <section className="section-2">
        <img
          src="https://image.dalbitlive.com/event/raffle/djSection-2.png"
          alt="이벤트 2, 방송시간 50시간 달성, 달성 시 부스터 20개를 드립니다."
        />
        <div className="time">
          <img src="https://image.dalbitlive.com/event/raffle/event-time.png" alt="방송시간:" />
          <span className="inline">{djEventUserInfo.playTimeToFullTime}</span>
          <button>
            <img src="https://image.dalbitlive.com/event/raffle/event2-btn.png"
                 alt="선물 받기"
                 onClick={receiveBoosterItem}
            />
          </button>
        </div>
      </section>
      <section className="section-3">
        <img
          src="https://image.dalbitlive.com/event/raffle/djSection-3.png"
          alt="이벤트 3, 추가 보너스 이벤트, 이벤트 기간 총 받은 선물 수에 따라 보너스 선물을 드립니다."
        />
        <div className="gift">
          <div className="giftList">
            <img src="https://image.dalbitlive.com/event/raffle/evnet3-txt1.png" alt="" />
            <span>{Utility.addComma(djEventUserInfo.rcv_dal_cnt)}개</span>
          </div>
          <div className="giftList">
            <img src="https://image.dalbitlive.com/event/raffle/evnet3-txt2.png" alt="" />
            {canReceivePresent.myPresentName ?
              <span style={{color: `${canReceivePresent.myBroadTimeConditionYn === "y" ? '#ff4874' : '#4879ff'}`}}>
                  {canReceivePresent.myPresentName}
                </span>
              : <span style={{color: 'gray'}}>아직 받을 수 있는 선물이 없습니다.</span>
            }
          </div>
        </div>
      </section>
      <section className="section-4">
        <img
          src="https://image.dalbitlive.com/event/raffle/djSection-4.png"
          alt="이벤트 3, 추가 보너스 이벤트, 이벤트 기간 총 받은 선물 수에 따라 보너스 선물을 드립니다."
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
      {popupNotice === true && <PopupNotice setPopupNotice={setPopupNotice} />}
      {popupDetails === true && <PopupDetails setPopupDetails={setPopupDetails} />}
    </div>
  )
}
