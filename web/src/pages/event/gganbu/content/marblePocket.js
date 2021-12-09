import React, {useState, useEffect, useContext ,useLayoutEffect, useCallback} from 'react'

import Api from 'context/api'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//components
import {useHistory} from 'react-router-dom'
import Utility, {printNumber, addComma} from 'components/lib/utility'

//staic
import newIcon from '../static/new_circle_m.svg'

export default () => {
  const context = useContext(Context)
  const history = useHistory()
  const [totalCommentCnt, setTotalCommentCnt] = useState(0)
  const [nextList, setNextList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [logList, setLogList] = useState([])
  const [openPocket, setOpenPocket] = useState(false)
  const [btnActive, setBtnActive] = useState(false)
  const [exchangeAble, setExchangeAble] = useState(0)
  const [pocketCtn, setPocketCtn] = useState(0)
  const [myPoint, setMyPoint] = useState(0)
  const [averageLevel, setAverageLevel] = useState(0)
  const [randomPoint, setRandomPoint] = useState(0)
  const [aniLevel, setAniLevel] = useState("")
  const [ticketCtn, setTicketCtn] = useState({
    rTicket : 0,
    yTicket : 0,
    bTicket : 0,
    pTicket : 0,
  })

  const fetchGganbuPocketPage = async () => {
    const {data, message} = await Api.gganbuPocketPage({gganbuNo: 1});
    console.log(data)
    if(message === "SUCCESS") {
      if(message === "SUCCESS") {
        setTicketCtn({
          rTicket : data.gganbuMemSel.exc_red_marble,
          yTicket : data.gganbuMemSel.exc_yellow_marble,
          bTicket : data.gganbuMemSel.exc_blue_marble,
          pTicket : data.gganbuMemSel.exc_violet_marble,
        })      
        if((data.gganbuMemSel.exc_red_marble >= 10) && (data.gganbuMemSel.exc_yellow_marble >= 10) && (data.gganbuMemSel.exc_blue_marble >= 10) && (data.gganbuMemSel.exc_violet_marble >= 10)) {
          let rPossible = data.gganbuMemSel.exc_red_marble/10;
          let yPossible = data.gganbuMemSel.exc_yellow_marble/10;
          let bPossible = data.gganbuMemSel.exc_blue_marble/10;
          let pPossible = data.gganbuMemSel.exc_violet_marble/10;
  
          var min = parseInt(Math.min(rPossible,yPossible,bPossible,pPossible));
          setExchangeAble(min)
          setBtnActive(true)
        }
        setMyPoint(data.gganbuMemSel.marble_pocket_pt);
        setPocketCtn(data.gganbuMemSel.marble_pocket);
        setAverageLevel(data.gganbuMemSel.average_level);
      }
    }
  }

  const fetchGganbuPocketOpen = async (randomPoint) => {
    const {data} = await Api.getGganbuPocketOpen({
      marblePocketPt : randomPoint
    });
    if(data === 1) {
      setPocketCtn(pocketCtn - 1);
      setOpenPocket(true)
  
       
    }
  }

  const fetchGganbuPocket = async () => {
    const {data} = await Api.getGganbuPocket();
    if(data === 1) {
      setPocketCtn(pocketCtn + 1)
      setExchangeAble(exchangeAble - 1);
      setTicketCtn({
        rTicket : ticketCtn.rTicket - 10,
        yTicket : ticketCtn.yTicket - 10,
        bTicket : ticketCtn.bTicket - 10,
        pTicket : ticketCtn.pTicket - 10,
      })   
      if(exchangeAble > 1) {
  
      } else {
        setBtnActive(false);
      }
    }
  }
  
  const dateFormatter = (date) => {
    if (!date) return null

    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    let time = `${date.substring(11, 13)}:${date.substring(14, 16)}`
    return `${month}.${day} ${time}`
  }

  let totalPage = 1
  let pagePerCnt = 30
  // 깐부 리포트 리스트 조회
  const fetchGganbuPocketReport = useCallback(async () => {
    const {data, message} = await Api.getGganbuPocketReport({
      gganbuNo: 1,
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    })
    if (message === 'SUCCESS') {
      setLogList(data.list)
      setTotalCommentCnt(data.listCnt)

      totalPage = Math.ceil(data.listCnt / pagePerCnt)

      if (currentPage > 1) {
        setLogList(data.list.concat(data.list))
      }
    } else {
      console.log(message)
    }
  }, [currentPage])

  const scrollEvtHdr = () => {
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  }

  useLayoutEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    console.log(currentPage)
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage > 0) fetchGganbuPocketReport()
  }, [currentPage])

 
  const pocketGet = () => {
    fetchGganbuPocket();    
  }

  const pocketOpen = () => {
    let point = 0;
    if(averageLevel < 30) {
      point = Math.floor(Math.random() * 30) + 70;
      setRandomPoint(point);
      setAniLevel("ani4");
      setTimeout(() => {      
        setOpenPocket(false);
        fetchGganbuPocketPage();
      }, 10000);
    } else if (averageLevel < 50) {
      point = Math.floor(Math.random() * 30) + 40;
      setRandomPoint(point);
      setAniLevel("ani3");
      setTimeout(() => {      
        setOpenPocket(false);
        fetchGganbuPocketPage();
      }, 9000);
    } else if (averageLevel < 70) {
      point = Math.floor(Math.random() * 20) + 30;
      setRandomPoint(point);
      setAniLevel("ani2");
      setTimeout(() => {      
        setOpenPocket(false);
        fetchGganbuPocketPage();
      }, 8000);
    } else {
      point = Math.floor(Math.random() * 20) + 10;
      setRandomPoint(point);
      setAniLevel("ani1");
      setTimeout(() => {      
        setOpenPocket(false);
        fetchGganbuPocketPage();
      }, 8000);
    }

    fetchGganbuPocketOpen(point);    
  }

  useEffect(() => {
    fetchGganbuPocketPage();
    fetchGganbuPocketReport();
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
            <div className="title">구슬 티켓</div>
            <p className="info">*구슬 한 개 당 해당 색깔의 티켓을 한 장 드립니다.</p>
            <p className="info">*구슬 주머니로 교환 시 10개씩 차감됩니다.</p>
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
                <span className="pocketCount">{pocketCtn}</span>
              </div>
            </div>
            <button className={`pocketBtn large ${pocketCtn > 0 ? "active" : ""}`} onClick={pocketOpen}>구슬 주머니 열기</button>
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
                <th>받은 사람</th>
                <th>얻은 점수</th>
                <th>받은 일시</th>
              </tr>
            </thead>

            <tbody>
              {!logList.length ? (
                <tr>
                  <td colSpan="3">받은 내역이 없습니다.</td>
                </tr>
              ) : (
                logList.map((item, index) => {
                  const {mem_nick, mem_no, marble_pocket_pt, ins_date} = item
                  return (
                    <tr key={index}>
                      <td
                        className="nick"
                        onClick={() => {
                          history.push(`/mypage/${mem_no}`)
                        }}>
                        <p>{mem_nick}</p>
                      </td>
                      <td className="bonus">{marble_pocket_pt}점</td>
                      <td className="date">{dateFormatter(ins_date)}</td>
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
          <div className={`openPocketAni`} 
               style={{backgroundImage: `url(https://image.dalbitlive.com/event/gganbu/ani/special_marble_0${aniLevel === "ani1" ? 1 : aniLevel === "ani2" ? 2 : aniLevel === "ani3" ? 3 : 4}.webp?timestamp=${Math.random()})` }}
          >
            <div className="openPocketNum" style={{animationDelay: `${aniLevel === "ani1" ? "3.5s" : aniLevel === "ani2" ? "3.5s" : aniLevel === "ani3" ? "4.5s" : "5.5s"}`}}>{randomPoint}</div>
          </div>
        </div>
      }
    </div>
  )
}
