import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {authReq} from 'pages/self_auth'
import {Context} from 'context'

import Api from 'context/api'

import Header from 'components/ui/new_header'
import PopupChoice from './content/popupChoice'

import './style.scss'
import PopupItems from "pages/event/welcome/content/popupItems";

const EventWelcome = () => {
  const history = useHistory()
  const context = useContext(Context)
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabFixed, setTabFixed] = useState(false)
  const [giftComplete, setGiftComplete] = useState({on: false, item: -1})
  const [stepItemInfo, setStepItemInfo] = useState([])
  const [clearItemInfo, setClearItemInfo] = useState([])
  const [noticeText, setNoticeText] = useState('off')
  const [eventAuth, setEventAuth] = useState({check: false, adultYn: '', phoneNo:''})
  const [tabContent, setTabContent] = useState({name: 'Lisen', quality: ''}) // Lisen, Dj

  const [choicePopInfo, setChoicePopInfo] = useState({open: false, stepNo: 0, list: []})
  const [resultItemPopInfo, setResultItemPopInfo] = useState({ open: false, giftInfo : {} }); // 아이템 보상 결과 팝업
  
  // 조회 API
  // 0. 이벤트 자격 여부
  const fetchEventAuthInfo = () => {
    Api.getWelcomeAuthInfo().then((res) => {
      if (res.code === '00000') {
        const {djQuality, userQuality} = res.data
        if (tabContent.name === 'Lisen') {
          setTabContent({...tabContent, quality: userQuality})
        } else {
          setTabContent({...tabContent, quality: djQuality})
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

    if (eventAuth.check === false) {
      context.action.confirm({
        msg: `본인 인증을 해주세요.`,
        callback: () => {
          authReq('11', context.authRef, context)
        }
      })
      return
    }

    if (eventAuth.adultYn === 'n') {
      context.action.alert({
        msg: `시청자 선물은 19세 이상인 회원님만 받을 수 있습니다.`
      })
      return
    }

    if (tabContent.quality === 'n') {
      context.action.toast({
        msg: `이벤트 참여대상이 아닙니다.
              신입회원님들을 위한 이벤트이니 양해 부탁드립니다.`
      })
      return
    }
    const temp = stepItemInfo.find((row) => row.stepNo == targetNum)

    if (temp.dalCnt >= temp.maxDalCnt && temp.likeCnt >= temp.maxLikeCnt && temp.memTime >= temp.maxMemTime) {
      setChoicePopInfo({...choicePopInfo, open: true, stepNo: targetNum, list: temp.itemList})
    } else {
      context.action.toast({msg: `조건을 만족하지 못했습니다.`})
    }
  }

  const choicePopClose = (giftSlct) => {
    setChoicePopInfo({...choicePopInfo, open: false})
    setGiftComplete({...giftComplete, on: true, item: giftSlct})
    if (clearItemInfo.giftReqYn === 'y') {
      context.action.alert({
        msg: `축하드립니다! 
              ALL CLEAR 선물에 자동으로 응모되었습니다.
              결과는 매월 초 공지사항에서 확인하실 수 있습니다.`
      })
    }
  }

  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabBtnNode = tabBtnRef.current
    if (tabMenuNode && tabBtnNode) {
      const tabMenuTop = tabMenuNode.offsetTop - tabBtnRef.current.clientHeight

      if (window.scrollY >= tabMenuTop) {
        setTabFixed(true)
      } else {
        setTabFixed(false)
      }
    }
  }

  // 보상 결과 팝업 열기 이벤트
  const itemPopOpen = (giftInfo) => {
    setChoicePopInfo({ open: false, stepNo: 0, list: []})
    setResultItemPopInfo({ open: true, giftInfo: giftInfo });
  };

  // 보상 결과 팝업 닫기
  const itemPopClose = () => {
    if (tabContent.name === 'Lisen') {
      fetchEventUserInfo()
    } else if (tabContent.name === 'Dj') {
      fetchEventDjInfo()
    }
    setResultItemPopInfo({ open: false, giftInfo: {} });
  };

  useEffect(() => {
    if (!context.token.isLogin) {
      history.push('/login')
    } else {
      fetchEventAuthInfo()
      Api.self_auth_check({}).then((res) => {
        if (res.result === 'success') {
          setEventAuth({...eventAuth, check: true, adultYn: res.data.adultYn, phoneNo:res.data.phoneNo})
        } else {
          setEventAuth({...eventAuth, check: false, adultYn: res.data.adultYn, phoneNo:res.data.phoneNo})
        }
      })
    }

    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  }, [])

  console.log(eventAuth)

  useEffect(() => {
    if (tabContent.name === 'Lisen') {
      fetchEventUserInfo()
    } else if (tabContent.name === 'Dj') {
      fetchEventDjInfo()
    }
    if (tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight)
    }
  }, [tabContent.name, giftComplete])

  return (
    <div id="welcome">
      <Header title="이벤트" />
      <img src={`${IMG_SERVER}/event/welcome/welcomeTop.png`} className="bgImg" />
      <div className="tabContainer" ref={tabMenuRef}>
        <div className={`tabWrapper ${tabFixed === true ? 'fixed' : ''}`} ref={tabBtnRef}>
          <div className="tabmenu">
            <button
              className={tabContent.name === 'Lisen' ? 'active' : ''}
              onClick={() => setTabContent({...tabContent, name: 'Lisen'})}>
              <img
                src={`${IMG_SERVER}/event/welcome/tabBtn-1-${tabContent.name === 'Lisen' ? 'on' : 'off'}.png`}
                alt="시청자 선물"
              />
            </button>
            <button
              className={tabContent.name === 'Dj' ? 'active' : ''}
              onClick={() => setTabContent({...tabContent, name: 'Dj'})}>
              <img src={`${IMG_SERVER}/event/welcome/tabBtn-2-${tabContent.name === 'Dj' ? 'on' : 'off'}.png`} alt="DJ선물" />
            </button>
          </div>
        </div>
      </div>
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
                            style={{width: `${memTime > maxMemTime ? '100' : (memTime / maxMemTime) * 100}%`}}></div>
                        </div>
                        <p className={`questCount ${memTime >= maxMemTime && 'complete'}`}>
                          (
                          {memTime > maxMemTime
                            ? `${maxMemTime / 60}/${maxMemTime / 60}`
                            : `${Math.floor(memTime / 60)}/${maxMemTime / 60}`}
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
                            style={{width: `${likeCnt > maxLikeCnt ? '100' : (likeCnt / maxLikeCnt) * 100}%`}}></div>
                        </div>
                        <p className={`questCount ${likeCnt >= maxLikeCnt && 'complete'}`}>
                          ({likeCnt > maxLikeCnt ? `${maxLikeCnt}/${maxLikeCnt}` : `${likeCnt}/${maxLikeCnt}`})
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
                            style={{width: `${dalCnt > maxDalCnt ? '100' : (dalCnt / maxDalCnt) * 100}%`}}></div>
                        </div>
                        <p className={`questCount ${dalCnt >= maxDalCnt && 'complete'}`}>
                          ({dalCnt > maxDalCnt ? `${maxDalCnt}/${maxDalCnt}` : `${dalCnt}/${maxDalCnt}`})
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
