import React, {useEffect, useState, useRef, useContext, useMemo} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {authReq} from 'pages/self_auth'
import moment from 'moment'
import qs from 'query-string'

import Api from 'context/api'

import Header from 'components/ui/header/Header'
import Tabmenu from '../components/tabmenu/Tabmenu'
import TabmenuBtn from '../components/tabmenu/TabmenuBtn'
import PopupChoice from './content/popupChoice'

import './style.scss'
import PopupItems from "pages/event/welcome/content/popupItems";
import {Hybrid, isHybrid} from "context/hybrid";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const EventWelcome = () => {
  const history = useHistory()
  const {webview} = qs.parse(location.search)
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [stepItemInfo, setStepItemInfo] = useState([])
  const [clearItemInfo, setClearItemInfo] = useState([])
  const [noticeText, setNoticeText] = useState('off')
  const [eventAuth, setEventAuth] = useState({check: false, adultYn: '', phoneNo:''})
  const [tabContent, setTabContent] = useState({name: 'Lisen', quality: 'n', userQuality: 'n', djQuality: 'n'}) // Lisen, Dj

  const [choicePopInfo, setChoicePopInfo] = useState({open: false, stepNo: 0, list: []})
  const [resultItemPopInfo, setResultItemPopInfo] = useState({ open: false, giftInfo : {} }); // 아이템 보상 결과 팝업

  // 뒤로가기 이벤트
  const backEvent = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
  };

  const colorInfo = useMemo(() => {
    let bgColor = '';
    let btnColor = '';
    const currentMonth = parseInt(moment().format('MM'));
    switch (currentMonth) {
      case 12:
      case 1:
      case 2:
        bgColor = '#4184FF';
        btnColor = '#14389D';
        break;
      case 3:
      case 4:
      case 5:
        bgColor = '#FF7F97';
        btnColor = '#E93667';
        break;
      case 6:
      case 7:
      case 8:
        bgColor = '#25A5FF';
        btnColor = '#005088';
        break;
      case 9:
      case 10:
      case 11:
        bgColor = '#FF9A38';
        btnColor = '#FF6600';
        break;
    }

    return {
      bgUrl: currentMonth,
      bgColor,
      btnColor
    }
  }, []);

  // 조회 API
  // 0. 이벤트 자격 여부
  const fetchEventAuthInfo = () => {
    Api.getWelcomeAuthInfo().then((res) => {
      if (res.code === '00000') {
        const {djQuality, userQuality} = res.data
        if (tabContent.name === 'Lisen') {
          setTabContent({...tabContent, userQuality, djQuality, quality: userQuality})
        } else {
          setTabContent({...tabContent, userQuality, djQuality, quality: djQuality})
        }
      }
    })
  }

  // 1. 청취자 정보
  const fetchEventUserInfo = () => {
    Api.getWelcomeUserInfo().then((res) => {
      if (res.code === '00000') {
        setStepItemInfo(res.data.stepItem)
        setClearItemInfo(res.data.clearItem)
      }
    })
  }

  // 2. DJ 정보
  const fetchEventDjInfo = () => {
    Api.getWelcomeDjInfo().then((res) => {
      if (res.code === '00000') {
        setStepItemInfo(res.data.stepItem)
        setClearItemInfo(res.data.clearItem)
      }
    })
  }

  // 팝업 열기 닫기 이벤트
  const choicePopOpen = (e) => {
    const {targetNum} = e.currentTarget.dataset

    if (targetNum === undefined) {
      return
    }

    if (!globalState.token.isLogin) {
      history.push('/login')
      return
    }

    if (eventAuth.check === false) {
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: `본인 인증을 해주세요.`,
        callback: () => {
          authReq({code: '9', formTagRef: globalState.authRef, dispatch})
        }
      }))
      return
    }

    if (eventAuth.adultYn === 'n') {
      dispatch(setGlobalCtxMessage({type:'alert',
        msg: `시청자 선물은 19세 이상인 회원님만 받을 수 있습니다.`
      }))
      return
    }

    if (tabContent.quality === 'n') {
      dispatch(setGlobalCtxMessage({type:'toast',
        msg: `이벤트 참여대상이 아닙니다.
              신입회원님들을 위한 이벤트이니 양해 부탁드립니다.`
      }))
      return
    }
    const temp = stepItemInfo.find((row) => row.stepNo == targetNum)

    if (temp.dalCnt >= temp.maxDalCnt && temp.likeCnt >= temp.maxLikeCnt && temp.memTime >= temp.maxMemTime) {
      setChoicePopInfo({...choicePopInfo, open: true, stepNo: targetNum, list: temp.itemList})
    } else {
      dispatch(setGlobalCtxMessage({type:'toast',msg: `조건을 만족하지 못했습니다.`}))
    }
  }

  const choicePopClose = () => {
    setChoicePopInfo({...choicePopInfo, open: false})
  }

  // 보상 결과 팝업 열기 이벤트
  const itemPopOpen = (giftInfo) => {
    setChoicePopInfo({ open: false, stepNo: 0, list: []})
    setResultItemPopInfo({ open: true, giftInfo: giftInfo });
  };

  // 보상 결과 팝업 닫기
  const itemPopClose = (giftStepNo) => {
    if (tabContent.name === 'Lisen') {
      fetchEventUserInfo()
    } else if (tabContent.name === 'Dj') {
      fetchEventDjInfo()
    }

    if(giftStepNo == 3) {
      dispatch(setGlobalCtxMessage({type:'alert',
        msg: `축하드립니다!
              ALL CLEAR 선물에 자동으로 응모되었습니다.
              결과는 매월 초 공지사항에서 확인하실 수 있습니다.`
      }))
    }
    setResultItemPopInfo({ open: false, giftInfo: {} });
  };

  // 상단 메뉴 탭 클릭 이벤트
  const handleClick = (value) => {
    if (tabContent.name !== value.name) {
      setTabContent({
        ...tabContent,
        name: value.name,
        quality: (value.name === 'Lisen' ? tabContent.userQuality : tabContent.djQuality),
      })
    }
  };

  useEffect(() => {
    fetchEventAuthInfo();
    Api.self_auth_check({}).then((res) => {
      if (res.result === 'success') {
        setEventAuth({...eventAuth, check: true, adultYn: res.data.adultYn, phoneNo:res.data.phoneNo})
      } else {
        setEventAuth({...eventAuth, check: false })
      }
    })
  }, [])

  useEffect(() => {
    if (tabContent.name === 'Lisen') {
      fetchEventUserInfo()
    } else if (tabContent.name === 'Dj') {
      fetchEventDjInfo()
    }
  }, [tabContent.name])

  return (
    <div id="welcome" style={{background: `${colorInfo.bgColor}`}}>
      <Header title="이벤트" type="back" backEvent={backEvent}/>
      <img src={`${IMG_SERVER}/event/welcome/welcomeTop-${colorInfo.bgUrl}.png`} className="bgImg" />
      <Tabmenu tab={tabContent.name}>
        <TabmenuBtn tabBtn1={'Lisen'} tabBtn2={'Dj'} tab={tabContent.name} setTab={handleClick} event={'welcome'} onOff={true} btnColor={colorInfo.btnColor}/>
      </Tabmenu>
      <div className="step">
        {stepItemInfo.length > 0 &&
          stepItemInfo.map((data, index) => {
            const {stepNo, giftOrd, giftReqYn, itemList, dalCnt, likeCnt, memTime, maxDalCnt, maxLikeCnt, maxMemTime} = data
            const ynBtn = dalCnt >= maxDalCnt && likeCnt >= maxLikeCnt && memTime >= maxMemTime && tabContent.quality === 'y'
            return (
              <section key={index}>
                <div className="containerBox">
                  <div className="title">
                    <img src={`${IMG_SERVER}/event/welcome/stepTitle${tabContent.name}-${index + 1}.png`} />
                  </div>
                  <ul className={`giftUl ${giftReqYn === 'y' ? 'complete' : ''}`}>
                    {itemList.map((list, index) => {
                      const {giftCode, giftName} = list
                      return (
                        <li
                          className={`giftList ${giftReqYn === 'y' && data.giftCode === giftCode ? 'select' : ''}`}
                          data-list-num={index + 1}
                          key={`item-${index}`}>
                          <div className="giftItem">
                            <img
                              src={`${IMG_SERVER}/event/welcome/item/${
                                index + 1 === giftOrd && giftReqYn === 'y' ? data.giftCode : giftCode
                              }.png`}
                              alt={index + 1 === giftOrd && giftReqYn === 'y' ? data.giftName : giftName}
                            />
                          </div>
                          <p>{index + 1 === giftOrd && giftReqYn === 'y' ? data.giftName : giftName}</p>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="questUl">
                    {maxMemTime > 0 && (
                      <div className="questList">
                        {
                          {
                            Lisen: <p className="questText">방송 시청 {maxMemTime / 3600}시간</p>,
                            Dj: <p className="questText">방송 진행 {maxMemTime / 3600}시간</p>
                          }[tabContent.name]
                        }
                        <div className="gaugeOuter">
                          <div
                            className="gaugeInner"
                            style={{width: `${tabContent.quality === 'n' ? '0' : memTime > maxMemTime ? '100' : (memTime / maxMemTime) * 100}%`}}></div>
                        </div>
                        <p className={`questCount ${tabContent.quality === 'n' ? '' : memTime >= maxMemTime && 'complete'}`}>
                          (
                          {memTime > maxMemTime
                            ? `${tabContent.quality === 'n' ? '0' : maxMemTime / 60}/${maxMemTime / 60}`
                            : `${tabContent.quality === 'n' ? '0' : Math.floor(memTime / 60)}/${maxMemTime / 60}`}
                          )
                        </p>
                      </div>
                    )}
                    {maxLikeCnt > 0 && (
                      <div className="questList">
                        {
                          {
                            Lisen: <p className="questText">좋아요 {maxLikeCnt}회</p>,
                            Dj: <p className="questText">좋아요 받기 {maxLikeCnt}회</p>
                          }[tabContent.name]
                        }
                        <div className="gaugeOuter">
                          <div
                            className="gaugeInner"
                            style={{width: `${tabContent.quality === 'n' ? '0' : likeCnt > maxLikeCnt ? '100' : (likeCnt / maxLikeCnt) * 100}%`}}></div>
                        </div>
                        <p className={`questCount ${tabContent.quality === 'n' ? '' : likeCnt >= maxLikeCnt && 'complete'}`}>
                          ({likeCnt > maxLikeCnt ? `${tabContent.quality === 'n' ? '0' : maxLikeCnt}/${maxLikeCnt}` : `${tabContent.quality === 'n' ? '0' : likeCnt}/${maxLikeCnt}`})
                        </p>
                      </div>
                    )}
                    {maxDalCnt > 0 && (
                      <div className="questList">
                        {
                          {
                            Lisen: <p className="questText">{maxDalCnt}달 충전</p>,
                            Dj: <p className="questText">{maxDalCnt}달 선물받기</p>
                          }[tabContent.name]
                        }
                        <div className="gaugeOuter">
                          <div
                            className="gaugeInner"
                            style={{width: `${tabContent.quality === 'n' ? '0' : dalCnt > maxDalCnt ? '100' : (dalCnt / maxDalCnt) * 100}%`}}></div>
                        </div>
                        <p className={`questCount ${tabContent.quality === 'n' ? '' : dalCnt >= maxDalCnt && 'complete'}`}>
                          ({dalCnt > maxDalCnt ? `${tabContent.quality === 'n' ? '0' : maxDalCnt}/${maxDalCnt}` : `${tabContent.quality === 'n' ? '0' : dalCnt}/${maxDalCnt}`})
                        </p>
                      </div>
                    )}
                  </div>
                  {giftReqYn === 'n' ? (
                    <button className={`giftBtn ${ynBtn ? 'on' : ''}`} data-target-num={stepNo} onClick={choicePopOpen}>
                      <img src={`${IMG_SERVER}/event/welcome/giftBtn-${ynBtn ? 'on' : 'off'}.png`} alt="선물 받기" />
                    </button>
                  ) : (
                    <button className="giftBtn complete">
                      <img src={`${IMG_SERVER}/event/welcome/giftBtn-complete.png`} alt="받기 완료" />
                    </button>
                  )}
                </div>
              </section>
            )
          })}
      </div>
      <div className="allClear">
        {clearItemInfo && (
          <div className="containerBox">
            {clearItemInfo.itemList &&
              clearItemInfo.itemList.map((data, index) => {
                const {giftCode, giftName} = data
                return (
                  <div className="giftList" key={index}>
                    <div className="giftItem">
                      <img src={`${IMG_SERVER}/event/welcome/item/${giftCode}.png`} />
                    </div>
                    <p>{giftName}</p>
                    <div className="badge">
                      <img src={`${IMG_SERVER}/event/welcome/allClearBadge.png`} alt="매월 3명 추첨" />
                    </div>
                    <div className="charactor">
                      <img src={`${IMG_SERVER}/event/welcome/allClearChara.png`} />
                    </div>
                  </div>
                )
              })}
            <img src={`${IMG_SERVER}/event/welcome/allClearText.png`} className="textImg" />
            <button className={`applyBtn ${clearItemInfo.giftReqYn === 'y' && 'complete'}`}>
              <img
                src={`${IMG_SERVER}/event/welcome/applyBtn-${clearItemInfo.giftReqYn === 'y' ? 'on' : 'off'}.png`}
                alt="응모 예정"
              />
            </button>
          </div>
        )}
      </div>
      <div className="notice">
        {noticeText === 'off' ? (
          <img
            src={`${IMG_SERVER}/event/welcome/eventNotice-${noticeText}.png`}
            className="noticeImg"
            onClick={() => setNoticeText('on')}
          />
        ) : (
          <img
            src={`${IMG_SERVER}/event/welcome/eventNotice-${noticeText}.png`}
            className="noticeImg"
            onClick={() => setNoticeText('off')}
          />
        )}
      </div>
      {choicePopInfo.open && <PopupChoice onClose={choicePopClose} stepNo={choicePopInfo.stepNo} list={choicePopInfo.list} phoneNo={eventAuth.phoneNo} onSuccess={itemPopOpen}/>}
      {resultItemPopInfo.open && <PopupItems onItemPopClose={itemPopClose} item={resultItemPopInfo.giftInfo} />}
    </div>
  )
}

export default EventWelcome
