import React, {useState, useEffect, useContext ,useLayoutEffect, useCallback} from 'react'

import Api from 'context/api'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//components
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import Lottie from 'react-lottie'
import moment from 'moment'
import Utility, {printNumber, addComma} from 'components/lib/utility'

//staic
import newIcon from '../static/new_circle_m.svg'

export default () => {
  const context = useContext(Context)
  const history = useHistory()
  const [gganbuNumber, setGganbuNumber] = useState(0)
  const [totalCommentCnt, setTotalCommentCnt] = useState(0)
  const [nextList, setNextList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [logList, setLogList] = useState([])
  const [logList2, setLogList2] = useState([]);
  const [openPocket, setOpenPocket] = useState(false)
  const [btnActive, setBtnActive] = useState(false)
  const [exchangeAble, setExchangeAble] = useState(0)
  const [pocketCtn, setPocketCtn] = useState(0)
  const [myPoint, setMyPoint] = useState(0)
  const [averageLevel, setAverageLevel] = useState(0)
  const [randomPoint, setRandomPoint] = useState(0)
  const [aniLevel, setAniLevel] = useState("")
  const [tabMenuActive, setTabMenuActive] = useState("r")
  const [ticketCtn, setTicketCtn] = useState({
    rTicket : 0,
    yTicket : 0,
    bTicket : 0,
    pTicket : 0,
  })


  const fetchGganbuPocketPage = async () => {
    const {data, message} = await Api.gganbuPocketPage();
    if(message === "SUCCESS") { 
      setGganbuNumber(data.gganbuNo);
      setMyPoint(data.gganbuMemSel.marble_pocket_pt);
      setPocketCtn(data.gganbuMemSel.marble_pocket);
      setAverageLevel(data.gganbuMemSel.average_level);
    }
  }

  const fetchGganbuPocketOpen = async (point) => {
    const {data} = await Api.getGganbuPocketOpen({marblePocketPt : point});
    if(data === 1) {setOpenPocket(true)}
  }

  const dateFormatter = (date) => {
    if (!date) return null
    return moment(date).format('MM.DD HH:mm');
  }

  let totalPage = 1
  let pagePerCnt = 50

  // 깐부 리포트 리스트 조회
  const fetchGganbuPocketReport = useCallback(async () => {
    const {data, message} = await Api.getGganbuPocketReport({
      gganbuNo: gganbuNumber,
      pageNo: currentPage,
      pagePerCnt: pagePerCnt,
      tabSlct: tabMenuActive,
    })
    if (message === 'SUCCESS') {
      setTotalCommentCnt(data.listCnt)

      totalPage = Math.ceil(data.listCnt / pagePerCnt)


      if(currentPage === 1){
        if(tabMenuActive === 'r') {
          setLogList(data.list)
        }else {
          setLogList2(data.list);
        }
      }else{
        if(tabMenuActive === 'r') {
          const datas = logList.concat(data.list);
        setLogList(datas)
        }else {
          const datas = logList2.concat(data.list);
        setLogList2(datas)
        }
      }
    }
  }, [currentPage, tabMenuActive])

  const scrollEvtHdr = () => {
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  }

  useLayoutEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage > 1) fetchGganbuPocketReport()
  }, [currentPage])

  const pocketOpen = () => {
    if(gganbuNumber === 4){
      let point = (Math.ceil(Math.random() * 5) + 5) * 10;
      setRandomPoint(point);
  
      if(point === 60) {
        setAniLevel("ani1");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 8000);
      } else if(point === 70) {
        setAniLevel("ani1");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 8000);
      } else if(point === 80) {
        setAniLevel("ani2");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 8000);
      } else if(point === 90) {
        setAniLevel("ani3");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 9000);
      } else if(point === 100) {
        setAniLevel("ani4");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 10000);
      }  

      fetchGganbuPocketOpen(point); 
    } else {
      let point = 0;
      const modular = 10;
      
      if(averageLevel < 30) {
        point = Math.floor(Math.random() * 39) + 70; // 70 ~ 109
        point = Math.floor(point / modular) * modular;
        setRandomPoint(point);
        setAniLevel("ani4");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 10000);
      } else if (averageLevel < 50) {
        point = Math.floor(Math.random() * 39) + 40; // 40 ~ 74
        point = Math.floor(point / modular) * modular;
        setRandomPoint(point);
        setAniLevel("ani3");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 9000);
      } else if (averageLevel < 70) {
        point = Math.floor(Math.random() * 29) + 30;
        point = Math.floor(point / modular) * modular;
        setRandomPoint(point);
        setAniLevel("ani2");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 8000);
      } else {
        point = Math.floor(Math.random() * 29) + 10;
        point = Math.floor(point / modular) * modular;
        setRandomPoint(point);
        setAniLevel("ani1");
        setTimeout(() => {      
          setOpenPocket(false); 
          fetchGganbuPocketPage();
          setCurrentPage(1);    
          fetchGganbuPocketReport();
          fetchGganbuPocketPage();
        }, 8000);
      }
      fetchGganbuPocketOpen(point); 
    }    
  }

  useEffect(() => {
    fetchGganbuPocketReport();
  }, [tabMenuActive]);

  useEffect(() => {
    fetchGganbuPocketPage();
  }, [])

  return (
    <div id="marblePocketPage">
      <div className="marblePocketBox">
        <Header title="구슬 주머니" />
        <div className="mypointWrap">
          <div className="title">
            <img src="https://image.dalbitlive.com/event/gganbu/gganbuPocket_title-myScore.png"/>
          </div>
          <div className="mypoint">
            <span className="score">{Utility.addComma(myPoint)}</span>점
          </div>
        </div>
        <div className="content">
          <div className="exchangePocket">
            <div className="title">구슬 주머니 보유 개수</div>
            <div className="shadowBox">
              <div className="pocketWrap">
                {pocketCtn > 0 ? 
                    <span id="pocketAni" className="pocket">
                      <Lottie
                        options={{
                          loop: true,
                          autoPlay: true,
                          path: `${IMG_SERVER}/event/gganbu/marblePocket-1-lottie.json`
                        }}
                      />
                    </span>
                  : 
                    <img src="https://image.dalbitlive.com/event/gganbu/marblePocket.png"/>
                }      
                <span className="pocketCount">{pocketCtn}</span>          
              </div>
              <button className={`pocketBtn ${pocketCtn > 0 ? "active" : ""}`} onClick={pocketOpen}>구슬 주머니 열기</button>
            </div>
            <div className="infoWrap">
              <p className="info">*구슬 주머니로 모은 보너스 점수는 전체 점수에 실시간으로 합산됩니다.</p>
              <p className="info">*구슬 주머니를 열면 보너스 점수를 확인할 수 있습니다.</p>
              <p className="info">*회차가 지나가면 구슬 주머니는 소멸되니 그 전에 꼭 확인(열기)하세요.</p>
            </div>
          </div>
        </div>
        <div className="space"></div>
        <div className="content">
          <div className="titleWrap">
            <div className="title">받은 내역</div>
          </div>
          <div className="pocketTab">
            <div className={`pocketTabMenu ${tabMenuActive === "r" ? "active" : ""}`} onClick={() => {setTabMenuActive("r"); setCurrentPage(1)}}>구슬 주머니 받은 내역</div>
            <div className={`pocketTabMenu ${tabMenuActive === "p" ? "active" : ""}`} onClick={() => {setTabMenuActive("p"); setCurrentPage(1)}}>보너스 점수 내역</div>
          </div>
          {tabMenuActive === "r" ?
            <table>
              <colgroup>
                <col width="30%" />
                <col width="25%" />
                <col width="45%" />
              </colgroup>

              <thead>
                <tr>
                  <th>받은 사유</th>
                  <th>받은 일시</th>
                  <th>받은 사람</th>
                </tr>
              </thead>

              <tbody>
                {logList.length === 0 ? (
                  <tr>
                    <td colSpan="3">받은 내역이 없습니다.</td>
                  </tr>
                ) : (
                  logList.map((item, index) => {
                    const {mem_nick, mem_no, ins_date, rcvReason} = item
                    return (
                      <tr key={index}>
                        <td className="reason">{rcvReason}</td>
                        <td className="date">{dateFormatter(ins_date)}</td>
                        <td
                          className="nick"
                          onClick={() => {
                            history.push(`/mypage/${mem_no}`)
                          }}>
                          {mem_nick}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
           : 
           <table>
              <colgroup>
                <col width="30%" />
                <col width="25%" />
                <col width="45%" />
              </colgroup>

              <thead>
                <tr>
                  <th>얻은 점수</th>
                  <th>얻은 일시</th>
                  <th>얻은 사람</th>
                </tr>
              </thead>

              <tbody>
                {logList2.length === 0 ? (
                  <tr>
                    <td colSpan="3">받은 내역이 없습니다.</td>
                  </tr>
                ) : (
                  logList2.map((item, index) => {
                    const {mem_nick, mem_no, marble_pocket_pt, ins_date} = item
                    return (
                      <tr key={index}>
                        <td className="bonus">{marble_pocket_pt}점</td>
                        <td className="date">{dateFormatter(ins_date)}</td>
                        <td
                          className="nick"
                          onClick={() => {
                            history.push(`/mypage/${mem_no}`)
                          }}>
                          {mem_nick}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          }          
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
