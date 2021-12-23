import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import Header from 'components/ui/new_header.js'

import './style.scss'

export default () => {
  const history = useHistory()
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabFixed, setTabFixed] = useState(false)
  const [giftCheck, setGiftCheck] = useState(-1)
  const [giftComplete, setGiftComplete] = useState(false)
  const [tabContent, setTabContent] = useState('Lisen') // Lisen, Dj

  const stepCount = [1, 2, 3]

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
    // if (tabContent === 'collect') {
    //   gganbuRoundLookup()
    // }
    if (tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight)
    }
  }, [tabContent])

  return (
    <div id="welcome">
      <Header title="이벤트" />
      <img src={`${IMG_SERVER}/event/welcome/welcomeTop.png`} className="bgImg" />
      <div className="tabContainer" ref={tabMenuRef}>
        <div className={`tabWrapper ${tabFixed === true ? 'fixed' : ''}`} ref={tabBtnRef}>
          <div className="tabmenu">
            <button className={tabContent === 'Lisen' ? 'active' : ''} onClick={() => setTabContent('Lisen')}>
              <img src={`${IMG_SERVER}/event/welcome/tabBtn-1-${tabContent === 'Lisen' ? 'on' : 'off'}.png`} alt="시청자 선물" />
            </button>
            <button className={tabContent === 'Dj' ? 'active' : ''} onClick={() => setTabContent('Dj')}>
              <img src={`${IMG_SERVER}/event/welcome/tabBtn-2-${tabContent === 'Dj' ? 'on' : 'off'}.png`} alt="DJ선물" />
            </button>
          </div>
        </div>
      </div>
      <div className="step">
        {stepCount.map((data, index) => {
          return (
            <section key={index}>
              <div className="containerBox">
                <div className="title">
                  <img src={`${IMG_SERVER}/event/welcome/stepTitle${tabContent}-${data}.png`} />
                </div>
                <div className={`giftUl ${giftComplete === true ? 'complete' : ''}`}>
                  <div className="giftList">
                    <div className="giftItem">
                      <img src={`${IMG_SERVER}/event/welcome/giftSample2.png`} alt="" />
                    </div>
                    <p>10달</p>
                  </div>
                  <div className="giftList">
                    <div className="giftItem">
                      <img src={`${IMG_SERVER}/event/welcome/giftSample2.png`} alt="" />
                    </div>
                    <p>10달</p>
                  </div>
                  <div className="giftList">
                    <div className="giftItem">
                      <img src={`${IMG_SERVER}/event/welcome/giftSample2.png`} alt="" />
                    </div>
                    <p>10달</p>
                  </div>
                </div>
                <div className="questUl">
                  <div className="questList">
                    <p className="questText">방송 진행 1시간</p>
                    <div className="gaugeOuter">
                      <div className="gaugeInner"></div>
                    </div>
                    <p className="questCount">(1/60)</p>
                  </div>
                  <div className="questList">
                    <p className="questText">좋아요 받기 10회</p>
                    <div className="gaugeOuter">
                      <div className="gaugeInner"></div>
                    </div>
                    <p className="questCount complete">(120/120)</p>
                  </div>
                  <div className="questList">
                    <p className="questText">방송 진행 1시간</p>
                    <div className="gaugeOuter">
                      <div className="gaugeInner"></div>
                    </div>
                    <p className="questCount">(59/60)</p>
                  </div>
                </div>
                <button className="giftBtn complete">
                  <img src={`${IMG_SERVER}/event/welcome/giftBtn-complete.png`} alt="선물 받기" />
                </button>
              </div>
            </section>
          )
        })}
      </div>
      <div className="allClear">
        <div className="containerBox">
          <button className="applyBtn complete">
            <img src={`${IMG_SERVER}/event/welcome/giftBtn-complete.png`} alt="선물 받기" />
          </button>
        </div>
      </div>
    </div>
  )
}
