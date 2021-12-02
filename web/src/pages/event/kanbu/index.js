import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'

import {useHistory} from 'react-router-dom'
import Header from 'components/ui/new_header.js'
import Collect from './content/collect'
import Betting from './content/betting'
import PopupNotice from './content/popupNotice'
import PopupSearch from './content/popupSearch'
import PopupStatus from './content/popupStatus'

import './style.scss'
import './betting.scss'

export default () => {
  const history = useHistory()
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabFixed, setTabFixed] = useState(false)
  const [kanbuOn, setKanbuOn] = useState(true)
  const [tabContent, setTabContent] = useState('collect') // collect, betting
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupSearch, setPopupSearch] = useState(true)
  const [popupStatus, setPopupStatus] = useState(false)

  const goBack = useCallback(() => history.goBack(), [])

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
    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  }, [])

  useEffect(() => {
    if (tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight)
    }
  }, [tabContent])

  return (
    <div id="kanbu">
      <Header title="깐부게임" />
      <div className="top">
        <img
          src="https://image.dalbitlive.com/event/kanbu/kanbuTopImg.png"
          className="topImg"
          alt="깐부게임 00만원 상금이 피었습니다."
        />
        <button className="topBtn" onClick={() => setPopupNotice(true)}>
          <img src="https://image.dalbitlive.com/event/kanbu/topBtn.png" alt="" />
        </button>
        <div className="memo">
          <div className="memoInner">
            <div className="userWrap">
              <div className="userTxt">우리는 깐부잖나. 구슬을 같이 쓴느 친구 말이야.</div>
              <div className="userUl">
                <div className="userList">
                  <div className="photo">
                    <img src="https://image.dalbitlive.com/event/kanbu/kanbuTopImg.png" alt="" />
                  </div>
                  <span className="badge">Lv 65</span>
                  <span className="nick">띵 동 ◡̈♪</span>
                </div>
                <div className="dot">
                  {kanbuOn === true && <img className="normal" src="https://image.dalbitlive.com/event/kanbu/dotNormal.png" />}
                  {kanbuOn === false && (
                    <div className="var">
                      <img src="https://image.dalbitlive.com/event/kanbu/dotKanbu.png" />
                      <span className="varLevel">56</span>
                      <span className="varTit">평균레벨</span>
                    </div>
                  )}
                </div>
                {kanbuOn === true && (
                  <div className="userList">
                    <div className="photo" onClick={() => setPopupSearch(true)}>
                      <img src="https://image.dalbitlive.com/event/kanbu/kanbuUserNone.png" />
                    </div>
                    <button className="kanbuBtn" onClick={() => setPopupStatus(true)}>
                      <img src="https://image.dalbitlive.com/event/kanbu/kanbuStatusBtn.png" />
                      <img className="btnNew" src="https://image.dalbitlive.com/event/kanbu/kanbuStatusBtnNew.png" />
                    </button>
                  </div>
                )}
                {kanbuOn === false && (
                  <div className="userList">
                    <div className="photo" onClick={() => setPopupSearch(true)}>
                      <img src="https://image.dalbitlive.com/event/kanbu/kanbuTopImg.png" />
                    </div>
                    <span className="badge">Lv 65</span>
                    <span className="nick">띵 동 ◡̈♪</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`tabWrap ${tabFixed === true ? 'fixed' : ''}`} ref={tabMenuRef}>
        <div className="tabBtn" ref={tabBtnRef}>
          <button className={tabContent === 'collect' ? 'active' : ''} onClick={() => setTabContent('collect')}>
            <img
              src={`https://image.dalbitlive.com/event/kanbu/tabTxt-1-${tabContent === 'collect' ? 'on' : 'off'}.png`}
              alt="구슬 모으기"
            />
          </button>
          <button className={tabContent === 'betting' ? 'active' : ''} onClick={() => setTabContent('betting')}>
            <img
              src={`https://image.dalbitlive.com/event/kanbu/tabTxt-2-${tabContent === 'betting' ? 'on' : 'off'}.png`}
              alt="구슬 베팅소"
            />
          </button>
          <span className="tabLine"></span>
        </div>
      </div>
      <Collect tabContent={tabContent} setTabContent={setTabContent} />
      <Betting tabContent={tabContent} setTabContent={setTabContent} />

      {/* 팝업 */}
      {popupNotice && <PopupNotice setPopupNotice={setPopupNotice} />}
      {popupSearch && <PopupSearch setPopupSearch={setPopupSearch} />}
      {popupStatus && <PopupStatus setPopupStatus={setPopupStatus} />}
    </div>
  )
}
