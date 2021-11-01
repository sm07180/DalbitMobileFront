import React, {useContext, useEffect, useState} from 'react'

import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import TotalRaffle from './content/totalRaffle'
import RoundRaffle from './content/roundRaffle'

import './style.scss'

export default () => {
  const history = useHistory()
  const [tabFixed, setTabFixed] = useState(false)
  const [scrollOn, setScrollOn] = useState(false)
  const [tabContent, setTabContent] = useState('total') // total, round

  const goBack = () => {
    history.goBack()
  }
  useEffect(() => {
    const windowScrollEvent = () => {
      if (window.scrollY >= 1) {
        setScrollOn(true)
        console.log('scrollY: true')
      } else {
        setScrollOn(false)
        console.log('scrollY: false')
      }
    }
    window.addEventListener('scroll', windowScrollEvent)
    console.log('event on')
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
      console.log('return event on')
    }
  }, [])

  //   function tabMenuFixed() {
  //         window.addEventListener('scroll', windowScrollEvent)
  //   }

  useEffect(() => {
    console.log('rendering')
  }, [])

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
          {/* <span>총 이벤트 기간</span>
              <span>11/10 ~ 12/7,</span>
              <span>발표</span>
              <span>12/8</span> */}
          <img src="https://image.dalbitlive.com/event/raffle/date-listener.png" alt="총 이벤트 기간 11/10 ~ 12/7, 발표 12/8" />
        </div>
      </div>
      <div className={`tabWrap ${tabFixed === true ? 'fixed' : ''}`}>
        <div className="tabBtn">
          <button onClick={() => setTabContent('total')}>
            <img src="https://image.dalbitlive.com/event/raffle/tabBtn-1.png" alt="종합 경품 이벤트" />
          </button>
          <button onClick={() => setTabContent('round')}>
            <img src="https://image.dalbitlive.com/event/raffle/tabBtn-2.png" alt="회차별 추첨 이벤트" />
          </button>
        </div>
      </div>
      {tabContent === 'total' ? <TotalRaffle /> : <RoundRaffle />}
    </div>
  )
}
