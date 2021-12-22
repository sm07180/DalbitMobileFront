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
      <section className="tabContainer"></section>
      <section className="step">
        <div className="containerBox">
          <div className="title">
            <img src={`${IMG_SERVER}/event/welcome/stepTitleBj-1.png`} alt="step 1" />
          </div>
          <div className="giftUl">
            <div className="giftList">
              <img src="" alt="" />
              <span>10달</span>
            </div>
            <div className="giftList">
              <img src="" alt="" />
              <span>10달</span>
            </div>
            <div className="giftList">
              <img src="" alt="" />
              <span>10달</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
