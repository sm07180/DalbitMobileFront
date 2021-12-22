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
  const [tabContent, setTabContent] = useState('collect') // collect, betting

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
      <div className="tabContainer"></div>
      <div className="step">
        <section>
          <div className="containerBox">
            <div className="title">
              <img src={`${IMG_SERVER}/event/welcome/stepTitleBj-1.png`} alt="step 1" />
            </div>
            <div className="giftUl">
              <div className="giftList">
                <img src={`${IMG_SERVER}/event/welcome/giftSample.png`} alt="" />
                <p>10달</p>
              </div>
              <div className="giftList">
                <img src={`${IMG_SERVER}/event/welcome/giftSample.png`} alt="" />
                <p>10달</p>
              </div>
              <div className="giftList">
                <img src={`${IMG_SERVER}/event/welcome/giftSample.png`} alt="" />
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
            <button className="giftBtn on">
              <img src={`${IMG_SERVER}/event/welcome/giftBtn-on.png`} alt="선물 받기" />
            </button>
          </div>
        </section>
        <section>
          <div className="containerBox">
            <div className="title">
              <img src={`${IMG_SERVER}/event/welcome/stepTitleBj-2.png`} alt="step 1" />
            </div>
            <div className="giftUl">
              <div className="giftList">
                <img src={`${IMG_SERVER}/event/welcome/giftSample.png`} alt="" />
                <p>10달</p>
              </div>
              <div className="giftList">
                <img src={`${IMG_SERVER}/event/welcome/giftSample.png`} alt="" />
                <p>10달</p>
              </div>
              <div className="giftList">
                <img src={`${IMG_SERVER}/event/welcome/giftSample.png`} alt="" />
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
            <button className="giftBtn on">
              <img src={`${IMG_SERVER}/event/welcome/giftBtn-on.png`} alt="선물 받기" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
