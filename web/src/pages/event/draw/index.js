import React, {useState, useEffect, useCallback, useRef, useContext} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Hybrid, isHybrid} from 'context/hybrid'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'
import qs from 'query-string'
import {Context} from 'context'

import './draw.scss'
import DrawBoard from './contents/drawBoard'
import PopupWinning from './contents/popupWinning'
import PopupPresent from './contents/popupPresent'

export default () => {
    const history = useHistory()
    const context = useContext(Context)
    const ticketWrapRef = useRef()

    const [ticketFixed, setTicketWrapFixed] = useState(false)
    const [popupWinning, setPopupWinning] = useState(false)
    const [popupPresent, setPopupPresent] = useState(false)

    const goBack = useCallback(() => history.goBack(), [])

    // 달 충전
    const chargeDal = () => {
      if (!context.token.isLogin) {
        history.push('/login')
        return
      }
  
      history.push('/pay/store')
    } 
  
    const tabScrollEvent = () => {
        const ticketWrapNode = ticketWrapRef.current
        if (ticketWrapNode) {
          const ticketWrapTop = ticketWrapNode.offsetTop
    
          if (window.scrollY >= ticketWrapTop) {
            setTicketWrapFixed(true)
          } else {
            setTicketWrapFixed(false)
          }
        }
    }
    
    useEffect(() => {
    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
    }, [])

    return(
        <div id="drawEventPage">
            <div className="top">
                <div className="header">
                    <a className="header__left">
                        <i className="header__back" onClick={goBack}></i>
                    </a>
                    <div className="header__center">
                        <div className="header__title">
                            추억의 뽑기 이벤트
                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="topImgWrap">
                    <img src={`${IMG_SERVER}/event/draw/topImg.png`} className="topImg" alt="달빛표 추억의 뽑기판 달 구매 1만원당 응모권 1장 자동 지급!"></img>
                    <div className={`ticketWrap ${ticketFixed === true ? 'fixed' : ''}`} ref={ticketWrapRef} onClick={chargeDal}>
                        <button className="ticketBtn">999</button>
                    </div>
                    <button className="myWinningBtn" onClick={()=>setPopupWinning(true)}>
                        <img src={`${IMG_SERVER}/event/draw/myWinng.png`} alt="내 당첨 내역"></img> 
                    </button>
                </div>
                <div className="boardMoreWrap">
                    <div className="boardMore">
                        <img src={`${IMG_SERVER}/event/draw/boardMore.png`} alt="뽑기판 더보기"></img>
                        <span className="">(1/5)</span>
                        <button className="refresh"></button>
                    </div>
                </div>
                <DrawBoard />
                <img src={`${IMG_SERVER}/event/draw/present.png`} className="present" alt="선물소개"></img>
            </div>
            <div className="footer">
                <img src={`${IMG_SERVER}/event/draw/footer__notice.png`} className="footer__notice" alt="확인해주세요"></img>
            </div>
            <button className="buttonDraw" onClick={()=>setPopupPresent(true)}>
                <img src={`${IMG_SERVER}/event/draw/drawStart.png`} alt="뽑기 시작"/>
                <span>(3/30)</span>
            </button>
            {popupWinning && <PopupWinning setPopupWinning={setPopupWinning} />}
            {popupPresent && <PopupPresent setPopupPresent={setPopupPresent} />}
        </div>
    )
}