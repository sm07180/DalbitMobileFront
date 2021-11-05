import React, {useEffect, useState, useRef, useCallback} from 'react'

import {useHistory} from 'react-router-dom'

import TotalRaffle from './content/totalRaffle'
import RoundRaffle from './content/roundRaffle'

import './style.scss'

export default () => {
  const history = useHistory()
  const tabMenuRef = useRef()
  const tabBtnRef = useRef();
  const [tabFixed, setTabFixed] = useState(false)
  const [tabContent, setTabContent] = useState('total') // total, round

  const goBack = useCallback(() => {
    history.goBack()
  }, []);

  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabBtnNode = tabBtnRef.current;
    if(tabMenuNode && tabBtnNode) {
      const tabMenuTop = tabMenuNode.offsetTop - tabBtnRef.current.clientHeight;

      if (window.scrollY >= tabMenuTop) {
        setTabFixed(true)
      } else {
        setTabFixed(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', tabScrollEvent)
    return () => {
      window.removeEventListener('scroll', tabScrollEvent)
    }
  }, [])

  useEffect(() => {
    if(tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight);
    }
  }, [tabContent]);

  return (
    <div id="raffle">
      <button className="close" onClick={goBack}>
        <img src="https://image.dalbitlive.com/event/raffle/close.png" alt="닫기" />
      </button>
      <div className="top">
        <img
          src="https://image.dalbitlive.com/event/raffle/topImg.png"
          alt="청취자님!! 이게 머선129? 응모권 모으면 경품이 터집니다! 감동의 눈물도 터져요! 청취만 해도 대박 경품에 당첨될 수 있고! 매회 푸짐한 상품 추첨 기회까지!"
        />
        <div className="date">
          <img src="https://image.dalbitlive.com/event/raffle/date-listener.png" alt="총 이벤트 기간 11/10 ~ 12/7, 발표 12/8" />
        </div>
      </div>
      <div className={`tabWrap ${tabFixed === true ? 'fixed' : ''}`} ref={tabMenuRef}>
        <div className="tabBtn" ref={tabBtnRef}>
          <button onClick={() => setTabContent('total')}>
            <img src="https://image.dalbitlive.com/event/raffle/tabBtn-1.png" alt="종합 경품 이벤트" />
          </button>
          <button onClick={() => setTabContent('round')}>
            <img src="https://image.dalbitlive.com/event/raffle/tabBtn-2.png" alt="회차별 추첨 이벤트" />
          </button>
        </div>
      </div>
      {/*{tabContent === 'total' ? <TotalRaffle setTabContent={setTabContent} /> : <RoundRaffle />}*/}
      <TotalRaffle tabContent={tabContent} setTabContent={setTabContent} />
      <RoundRaffle tabContent={tabContent} />
    </div>
  )
}
