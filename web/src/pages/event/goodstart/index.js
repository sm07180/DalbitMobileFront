import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import {authReq} from 'pages/self_auth'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import {Context} from 'context'

import Api from 'context/api'

import Header from 'components/ui/new_header'
import PopupNotice from './content/PopupNotice'

import './style.scss'

const GoodStart = () => {
  const history = useHistory()
  const context = useContext(Context)
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabFixed, setTabFixed] = useState(false)
  const [tabContent, setTabContent] = useState({name: 'dj'}) // dj, fan
  const [ranktabCnt, setRankTabCnt] = useState({name: 'all'}) // all, new

  const [noticePopInfo, setNoticePopInfo] = useState({open: false})

  // 조회 API

  // 팝업 열기 닫기 이벤트
  const popupOpen = () => {
    setNoticePopInfo({...noticePopInfo, open: true})
  }

  const popupClose = () => {
    setNoticePopInfo({...noticePopInfo, open: false})
  }

  // 탭메뉴 이벤트
  const tabClick = (e) => {
    const {tab} = e.currentTarget.dataset

    if (tab === 'dj' || tab === 'fan') {
      setTabContent({name: tab})
    }

    if (tab === 'all' || tab === 'new') {
      setRankTabCnt({name: tab})
    }
    console.log(tab)
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

  useEffect(() => {
    // if (!context.token.isLogin) {
    //   history.push('/login')
    // } else {
    //   fetchEventAuthInfo()
    //   Api.self_auth_check({}).then((res) => {
    //     if (res.result === 'success') {
    //       setEventAuth({...eventAuth, check: true, adultYn: res.data.adultYn})
    //     } else {
    //       setEventAuth({...eventAuth, check: false, adultYn: res.data.adultYn})
    //     }
    //   })
    // }

    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  }, [])

  useEffect(() => {
    if (tabContent.name === 'dj') {
      console.log(1)
    } else if (tabContent.name === 'fan') {
      console.log(2)
    }
    if (tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight)
    }
  }, [tabContent.name])

  return (
    <div id="goodStart">
      <Header title="이벤트" />
      <img src={`${IMG_SERVER}/event/goodstart/topImg.png`} className="bgImg" />
      <div className="tabContainer" ref={tabMenuRef}>
        <div className={`tabWrapper ${tabFixed === true ? 'fixed' : ''}`} ref={tabBtnRef}>
          <div className="tabmenu">
            <button className={tabContent.name === 'dj' ? 'active' : ''} data-tab="dj" onClick={tabClick}>
              <img src={`${IMG_SERVER}/event/goodstart/tabBtn-1.png`} alt="DJ" />
            </button>
            <button className={tabContent.name === 'fan' ? 'active' : ''} data-tab="fan" onClick={tabClick}>
              <img src={`${IMG_SERVER}/event/goodstart/tabBtn-2.png`} alt="FAN" />
            </button>
          </div>
        </div>
      </div>
      <section className="bodyContainer">
        <img src={`${IMG_SERVER}/event/goodstart/bodybg-${tabContent.name === 'dj' ? 'dj' : 'fan'}.png`} className="bgImg" />
        <div className="notice">
          <p>* 순위는 6시간 단위로 집계 됩니다.</p>
          <button onClick={popupOpen}>
            <img src={`${IMG_SERVER}/event/goodstart/noticeBtn.png`} alt="유의사항" />
          </button>
        </div>
      </section>
      <section className={`rankContainer ${tabContent.name === 'dj' ? 'dj' : 'fan'}`}>
        {tabContent.name === 'dj' ? (
          <div className="rankTabmenu">
            <button className={`${ranktabCnt.name === 'all' ? 'active' : ''}`} data-tab="all" onClick={tabClick}>
              <img
                src={`${IMG_SERVER}/event/goodstart/rankTabBtn-1-${ranktabCnt.name === 'all' ? 'on' : 'off'}.png`}
                alt="종합랭킹"
              />
            </button>
            <button className={`${ranktabCnt.name === 'new' ? 'active' : ''}`} data-tab="new" onClick={tabClick}>
              <img
                src={`${IMG_SERVER}/event/goodstart/rankTabBtn-2-${ranktabCnt.name === 'new' ? 'on' : 'off'}.png`}
                alt="신인랭킹"
              />
            </button>
          </div>
        ) : (
          <h1 className="rankTitle">
            <img src={`${IMG_SERVER}/event/goodstart/rankTitle.png`} />
          </h1>
        )}

        <div className="rankUl">
          <div className={`rankList ${context.token.isLogin ? 'my' : ''}`}>
            <div className="rankNum">
              <span className="num">1</span>
            </div>
            <div className="photo">
              <img src={`${IMG_SERVER}/event/goodstart/bodybg-dj.png`} />
            </div>
            <div className="listBox">
              <em className="icon_wrap">
                <span className="blind">성별</span>
              </em>
              <span className="userNick">아이디다</span>
            </div>
            <div className="listBack">
              <img src={`${IMG_SERVER}/event/tree/rankPoint.png`} />
              {Utility.addComma(1000000)}
            </div>
          </div>
          <div className={`rankList list`}>
            <div className="rankNum">
              <span className="num">1</span>
            </div>
            <div className="photo">
              <img src={`${IMG_SERVER}/event/goodstart/bodybg-dj.png`} />
            </div>
            <div className="listBox">
              <em className="icon_wrap">
                <span className="blind">성별</span>
              </em>
              <span className="userNick">아이디다</span>
            </div>
            <div className="listBack">
              <img src={`${IMG_SERVER}/event/tree/rankPoint.png`} />
              {Utility.addComma(1000000)}
            </div>
          </div>
          <div className={`rankList list`}>
            <div className="rankNum">
              <span className="num">1</span>
            </div>
            <div className="photo">
              <img src={`${IMG_SERVER}/event/goodstart/bodybg-dj.png`} />
            </div>
            <div className="listBox">
              <em className="icon_wrap">
                <span className="blind">성별</span>
              </em>
              <span className="userNick">아이디다</span>
            </div>
            <div className="listBack">
              <img src={`${IMG_SERVER}/event/tree/rankPoint.png`} />
              {Utility.addComma(1000000)}
            </div>
          </div>
        </div>
      </section>
      {noticePopInfo.open === true && <PopupNotice onClose={popupClose} />}
    </div>
  )
}

export default GoodStart
