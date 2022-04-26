import React, {useState, useEffect, useCallback, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import qs from 'query-string'
import {Hybrid, isHybrid} from 'context/hybrid'

import CommentTab from './tab_comment'
import GuideTab from './tab_guide'
import VoteTab from './tab_vote'

function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

let timer
export default function awardEvent() {
  const history = useHistory()
  const params = useParams()
  const {webview, type} = qs.parse(location.search)
  const [tabState, setTabState] = useState('guide') //guide, vote, comment

  //카운트 state
  const [count, setCount] = useState(null)
  const previousDt = usePrevious(count)
  const [countEnd, setCountEnd] = useState(false)

  //카운트 관련
  function convertClassName(dt, previousDt) {
    return Object.keys(dt).map((v, idx) => {
      let count = dt[v]
      let previousCount
      if (previousDt !== null) {
        previousCount = previousDt[v]
      }
      return (
        <div className={`times ${v}`} key={idx}>
          <span className={`images ${count[0]} ${previousCount && previousCount[0] !== count[0] && 'active'}`}>
            <img src={`https://image.dalbitlive.com/event/award/201214/num0${count[0]}.png`} />
          </span>
          {v === 'seconds' ? (
            <span className={`images ${count[1]} always`}>
              <img src={`https://image.dalbitlive.com/event/award/201214/num0${count[1]}.png`} />
            </span>
          ) : (
            <span className={`images ${count[1]} ${previousCount && previousCount[1] !== count[1] && 'active'}`}>
              <img src={`https://image.dalbitlive.com/event/award/201214/num0${count[1]}.png`} />
            </span>
          )}
        </div>
      )
    })
  }

  const CountWrapComponent = useCallback(() => {
    return <div>{count !== null && convertClassName(count, previousDt)}</div>
  }, [count, previousDt])

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
  }
  useEffect(() => {
    function CountDownTimer() {
      let end = new Date('2020/12/30 23:59:59')

      let _second = 1000
      let _minute = _second * 60
      let _hour = _minute * 60
      let _day = _hour * 24
      let timer
      let count

      function showRemaining() {
        let now = new Date()
        let distance = end - now

        if (distance < 0) {
          clearInterval(timer)
          setCountEnd(true)
          return
        }
        const days = ('0' + Math.floor(distance / _day)).slice(-2)
        const hours = ('0' + Math.floor((distance % _day) / _hour)).slice(-2)
        const minutes = ('0' + Math.floor((distance % _hour) / _minute)).slice(-2)
        const seconds = ('0' + Math.floor((distance % _minute) / _second)).slice(-2)

        setCount({days, hours, minutes, seconds})
      }

      timer = setInterval(showRemaining, 1000)

      return count
    }

    CountDownTimer()

    return () => {
      clearTimeout(timer)
    }
  }, [])
  //카운트 관련 끝

  //-------------------
  useEffect(() => {
    if (params.type === 'vote') {
      setTabState('vote')
    } else if (params.type === 'comment') {
      setTabState('comment')
    } else {
      setTabState('guide')
    }
  }, [params.type])

  return (
    <>
      <div className="topBox">
        <button className="btnBack" onClick={() => clickCloseBtn()}>
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
        </button>
        <img src="https://image.dalbitlive.com/event/award/201214/main-img.jpg" className="topBox__mainImg" alt="main Image" />

        <div className="countBoxWrap">
          <p className="countBoxWrap__title">투표 마감</p>
          {!countEnd ? (
            <>
              <p className="countBoxWrap__subTxt">2020년 12월 31일 00시까지</p>
              <div className="countBox">{count !== null && CountWrapComponent()}</div>
              <p className="countBoxWrap__subTxt">남았습니다</p>
            </>
          ) : (
            <p className="countBoxWrap__subTxt--end">투표가 마감되었습니다.</p>
          )}
        </div>
      </div>
      <div className="tabBox">
        <button className={`btn ${tabState === 'guide' && 'active'}`} onClick={() => setTabState('guide')}>
          행사안내
        </button>
        <button className={`btn ${tabState === 'vote' && 'active'}`} onClick={() => setTabState('vote')}>
          투표하기
        </button>
        <button className={`btn ${tabState === 'comment' && 'active'}`} onClick={() => setTabState('comment')}>
          댓글달기
        </button>
      </div>
      {tabState === 'guide' && <GuideTab />}
      {tabState === 'vote' && <VoteTab />}
      {tabState === 'comment' && <CommentTab />}
    </>
  )
}
