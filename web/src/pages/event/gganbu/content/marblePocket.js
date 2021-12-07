import React, {useState, useEffect, useContext} from 'react'

import Api from 'context/api'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//components
import {useHistory} from 'react-router-dom'
import Utility, {printNumber, addComma} from 'components/lib/utility'

//staic
import newIcon from '../static/new_circle_m.svg'

//flag
let currentPage = 1
let moreState = false
let timer
export default () => {
  const context = useContext(Context)
  const history = useHistory()
  const [winList, setWinList] = useState([])
  const [nextList, setNextList] = useState([])
  const [openPocket, setOpenPocket] = useState(false)
  const [btnActive, setBtnActive] = useState(false)
  const [exchangeAble, setExchangeAble] = useState(0)
  const [myPoint, setMyPoint] = useState(0)
  const [ticketCtn, setTicketCtn] = useState({
    rTicket : 0,
    yTicket : 0,
    bTicket : 0,
    pTicket : 0,
  })

  const goBack = () => {
    return history.goBack()
  }

  const fetchGganbuPocketReport = async (next) => {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage

    const {data, message} = await Api.getGganbuPocketReport({
      gganbuNo: 1,
      pageNo: 1,
      pagePerCnt: currentPage
    })
    if(message === "SUCCESS") {
      let listLength = data.list.length;
      let pointSum = 0;

      for(let i = 0; i < listLength; i++){
        pointSum = pointSum + data.list[i].marble_pocket_pt;
      }
      setMyPoint(pointSum);
    }
  }

  const fetchGganbuData = async () => {
    const {data, message} = await Api.gganbuInfoSel({gganbuNo: 1});
    console.log(data)
    if(message === "SUCCESS") {
      setTicketCtn({
        rTicket : data.tot_red_marble,
        yTicket : data.tot_yellow_marble,
        bTicket : data.tot_blue_marble,
        pTicket : data.tot_violet_marble,
      })      
      if((data.tot_red_marble >= 10) && (data.tot_yellow_marble >= 10) && (data.tot_blue_marble >= 10) && (data.tot_violet_marble >= 10)) {
        setBtnActive(true)
        let rPossible = data.tot_red_marble/10;
        let yPossible = data.tot_yellow_marble/10;
        let bPossible = data.tot_blue_marble/10;
        let pPossible = data.tot_violet_marble/10;

        var min = Math.min(rPossible,yPossible,bPossible,pPossible);
        setExchangeAble(min)
      }
    }
  }

  const fetchGganbuPocketOpen = async () => {
    const {data} = await Api.getGganbuPocketOpen({
      averageLevel: 2
    });
    console.log(data)
  }

  const fetchGganbuPocket = async () => {
    const {data} = await Api.getGganbuPocket();
    console.log(data)
  }
  
  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // 20200218145519
    let month = date.substring(4, 6)
    let day = date.substring(6, 8)
    let time = `${date.substring(8, 10)}:${date.substring(10, 12)}`
    return `${month}월 ${day}일`
    // return `${month}월 ${day}일 ${time}`
  }

  //scroll
  const showMoreList = () => {
    setWinList(winList.concat(nextList))
    fetchGganbuPocketReport('next')
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
  }
  const pocketGet = () => {
    console.log("click");
  }

  const pocketOpen = () => {
  }

  //-------------------
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  useEffect(() => {
    setWinList([]);
    fetchGganbuPocketReport();
    fetchGganbuData();
    fetchGganbuPocketOpen();
    fetchGganbuPocket();
  }, [])

  return (
    <div id="marblePocketPage">
      <div className="marblePocketBox">
        <Header title="구슬 주머니" />
        <div className="content">
          <div className="mypointWrap">
            <div className="title">내 구슬 주머니 점수</div>
            <div className="mypoint">
              <span className="score">{Utility.addComma(myPoint)}</span>점
            </div>
          </div>
          <div className="exchangeMarble">
            <div className="title">교환 가능한 구슬 획득 내역</div>
            <p className="info">*얻은 구슬만 집계되며, 주머니 받기 시 10개씩 차감됩니다.</p>
            <div className="shadowBox">
              <div className="ticketWrap">
                <div className="ticketGroup">
                  <span className="ticket red"></span>
                  <span className="ticketCount">{ticketCtn.rTicket}</span>
                </div>
                <div className="ticketGroup">
                  <span className="ticket yellow"></span>
                  <span className="ticketCount">{ticketCtn.yTicket}</span>
                </div>
                <div className="ticketGroup">
                  <span className="ticket blue"></span>
                  <span className="ticketCount">{ticketCtn.bTicket}</span>
                </div>
                <div className="ticketGroup">
                  <span className="ticket purple"></span>
                  <span className="ticketCount">{ticketCtn.pTicket}</span>
                </div>
              </div>
              <button className={`pocketBtn small ${btnActive ? "active" : ""}`} onClick={pocketGet}>
                구슬 주머니 받기 {btnActive ? <span className="possible">({exchangeAble}회 가능)</span> : ""}
              </button>
            </div>
          </div>
          <div className="exchangePocket">
            <div className="title">교환 가능한 구슬 주머니</div>
            <div className="shadowBox">
              <div className="pocketWrap">
                <span className="pocket blue"></span>
                <span className="pocketCount">0</span>
              </div>
            </div>
            <button className="pocketBtn large" onClick={pocketOpen}>구슬 주머니 열기</button>
          </div>
        </div>
        <div className="space"></div>
        <div className="content">
          <div className="titleWrap">
            <div className="title">받은 내역</div>
          </div>
          <table>
            <colgroup>
              <col width="40%" />
              <col width="25%" />
              <col width="*" />
            </colgroup>

            <thead>
              <tr>
                <th>받은사람</th>
                <th>보너스점수</th>
                <th>일자</th>
              </tr>
            </thead>

            <tbody>
              {!winList.length ? (
                <tr>
                  <td colSpan="3">받은 내역이 없습니다.</td>
                </tr>
              ) : (
                winList.map((item, index) => {
                  const {winDt, nickNm, profImg, isNew, memNo, itemImageUrl, itemName} = item
                  return (
                    <tr key={index}>
                      <td
                        className="nick"
                        onClick={() => {
                          history.push(`/mypage/${memNo}`)
                        }}>
                        <p>{nickNm}</p>
                      </td>
                      <td className="bonus">점</td>
                      <td className="date">
                        <span className="iconNew">{isNew ? <img src={newIcon} width={14} alt="new" /> : ''}</span>

                        {dateFormatter(winDt)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*
       <div className="openPocket"> 삭제 시점
        ani1 = 5초
        ani2 = 5초
        ani3 = 6초
        ani4 = 7초
      */}
      {openPocket &&      
        <div className="openPocket">
          <div className="openPocketAni ani4">
            <div className="openPocketNum">100</div>
          </div>
        </div>
      }
    </div>
  )
}
