import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'

import {useHistory} from 'react-router-dom'
import Header from 'components/ui/new_header.js'
import Collect from './content/collect'
import Betting from './content/betting'

import './style.scss'
import './betting.scss'

export default () => {
  const history = useHistory()
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabFixed, setTabFixed] = useState(false)
  const [tabContent, setTabContent] = useState('round') // total, round

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
      <button className="close" onClick={goBack}>
        <img src="https://image.dalbitlive.com/event/raffle/close.png" alt="닫기" />
      </button>
      <div className="top">
        <img
          src="https://image.dalbitlive.com/event/kanbu/kanbuTopImg.png"
          className="topImg"
          alt="깐부게임 00만원 상금이 피었습니다."
        />
        <button className="topBtn">
          <img src="https://image.dalbitlive.com/event/kanbu/topBtn.png" alt="" />
        </button>
        <div className="memo"></div>
      </div>
      <div className={`tabWrap ${tabFixed === true ? 'fixed' : ''}`} ref={tabMenuRef}>
        <div className="tabBtn" ref={tabBtnRef}>
          <button onClick={() => setTabContent('total')}>
            <img src="https://image.dalbitlive.com/event/kanbu/tabTxt-1.png" alt="구슬 모으기" />
          </button>
          <button onClick={() => setTabContent('round')}>
            <img src="https://image.dalbitlive.com/event/kanbu/tabTxt-2.png" alt="구슬 베팅소" />
          </button>
        </div>
      </div>
      <Collect tabContent={tabContent} setTabContent={setTabContent} />
      <Betting tabContent={tabContent} setTabContent={setTabContent}/>
    </div>
  )
}
