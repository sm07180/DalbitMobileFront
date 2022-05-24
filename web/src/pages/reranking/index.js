import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import moment from 'moment'

import Api from 'context/api'
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide'
import DjChatSwiper from './components/DjChatSwiper'
import MyRanking from './components/MyRanking'
import Refresh from './components/Refresh'
import RankingList from './components/more/RankList'
import LayerPopup from 'components/ui/layerPopup/LayerPopup';

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";
import {setSubTab} from "redux/actions/rank";
import {convertMonday, convertMonth} from "lib/rank_fn";


const RankPage = () => {

  const history = useHistory()
  const dispatch = useDispatch()
  const {token, profile} = useSelector(({globalCtx}) => globalCtx)
  const commonPopup = useSelector(state => state.popup)
  const rankState = useSelector(state => state.rankCtx)

  const [popup, setPopup] = useState(false) //선정기준
  const [period , setPeriod] = useState("time") //DJ 차트 [타임, 일간, 주간, 월간, 연간]
  const [count, setCount] = useState() //DJ 차트기간 표시
  const [djRank, setDjRank] = useState([]); // DJ 차트랭킹
  const [myRank, setMyRank] = useState({dj:0, fan:0, cupid: 0, team:0})  //MY 랭킹
  const [dayTabType, setDayTabType] = useState("fan") // 하단 [FAN, CUPID]
  const [etcRank, setEtcRank] = useState({  // FAN,CUPID 랭킹
    fan: [],
    cupid: [],
  })

  // initialize
  useEffect(() => {
    if(token.isLogin){
      fetchMyRank();
    }
    fetchDjRank();
    fetchRank();

    if (rankState.subTab === "fan") {
      setDayTabType("fan");
    } else {
      setDayTabType("cupid");
      dispatch(setSubTab("fan"));
    }
  }, []);

  //59~143 Line DJ 차트 남음기간 계산 function
  const timer = () => {
    let now = new Date();
    let time = new Date(now);
    if (time.getHours() < 10){
      time.setHours(10);
      time.setMinutes(0);
      time.setSeconds(0);
    } else if (time.getHours() < 19) {
      time.setHours(19);
      time.setMinutes(0);
      time.setSeconds(0);
    } else {
      time.setDate(time.getDate() + 1);
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
    }
    let day = new Date(now);
    day.setDate(day.getDate() + 1);
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    let week = new Date(now);
    week.setDate(week.getDate() + 1 + 7 - week.getDay() % 7);
    week.setHours(0);
    week.setMinutes(0);
    week.setSeconds(0);
    let reMainTime = period === "time" ? counting(time, now) :
                     period === "today" ? counting(day, now) :
                     period === "week" ? `${moment(now).format('M')}월 ${changeNumberToString(weekNumberByThurFnc(now))}째주` :
                     period === "month" ? `${moment(now).format('YY')}년 ${moment(now).format('MM')}월` : `${moment(now).format('YYYY')}년`;
    setCount(reMainTime);
  }
  const counting = (endDate, now) => {
    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;
    let distDt = endDate - now;
    let hours = Math.floor((distDt % _day) / _hour);
    let minutes = Math.floor((distDt % _hour) / _minute);
    let seconds = Math.floor((distDt % _minute) / _second);
    let countDown = "";
    if (hours > 0) {
      if (hours < 10){
        countDown += `0${hours}:`
      } else {
        countDown += `${hours}:`
      }
    } else {
      countDown += "00:"
    }
    if (minutes > 0) {
      if (minutes < 10){
        countDown += `0${minutes}`
      } else {
        countDown += `${minutes}`
      }
    } else {
      countDown += "00"
    }
    if (period !== "week"){
      if (seconds > 0) {
        if (seconds < 10){
          countDown += `:0${seconds}`
        } else {
          countDown += `:${seconds}`
        }
      } else {
        countDown += ":00"
      }
    }
    return countDown
  }
  const weekNumberByThurFnc = (paramDate) => {
    const year = paramDate.getFullYear();
    const month = paramDate.getMonth();
    const date = paramDate.getDate();
    const firstDate = new Date(year, month, 1);
    const firstDayOfWeek = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
    return Math.ceil((firstDayOfWeek - 1 + date) / 7);
  }
  const changeNumberToString = (number) => number === 2 ? "둘" : number === 3 ? "셋" : number === 4 ? "넷" : number === 5 ? "다섯" : "첫";
  useEffect(() => {
    let interval = "";
    timer(period);
    if (period === "time") {
      interval = setInterval(() => {
        timer(period);
      }, 1000);
    } else {
      if (period === "today") {
        interval = setInterval(() => {
          timer(period);
        }, 1000);
      } else {
        timer(period);
      }
    }
    return () => {
      clearInterval(interval)
    }
  }, [period]);

  //DJ 차트 [타임, 일간, 주간, 월간, 연간] 선택
  const chartSelect = (e) => {
    switch (e.currentTarget.innerText) {
      case "타임":
        setPeriod("time")
        break;
      case "일간":
        setPeriod("today")
        break;
      case "주간":
        setPeriod("week")
        break;
      case "월간":
        setPeriod("month")
        break;
      case "연간":
        setPeriod("year")
        break;
    }
    closePopup(dispatch)
  }

  //DJ 차트 랭킹 (기간)
  useEffect(()=>{
    fetchDjRank()
  },[period])

  //FAN/CUPID 랭킹 (탭)
  useEffect(() => {
    fetchRank()
  }, [dayTabType])

  // DJ 랭킹 가져오기
  const fetchDjRank = () => {
    if(period==="time"){
      Api.getRankTimeList({
        rankSlct: 1,  // [DJ=1]
        page: 1,
        records: 10,
        rankingDate: moment(new Date()).format("YYYY-MM-DD HH:00:00")
      }).then((res)=>{
        if (res.result === "success") {
          setDjRank(res.data.list)
        }
      })
    }else{
      const payload = {
        type: period === "today" ? 1 : period === "week" ? 2 : period === "month" ? 3 : 4,
        date: moment(period === "today" ? new Date() : period === "week" ? convertMonday() : period === "month" ? convertMonth() : new Date()).format("YYYY-MM-DD")
      }
      Api.get_ranking({
        param: {
          rankSlct: 1,
          rankType: payload.type,
          rankingDate: payload.date,
          page: 1,
          records: 10
        }
      }).then((res)=>{
        if (res.result === "success"){
          setDjRank(res.data.list)
        }
      })
    }
  }

  // 일간 FAN/CUPID 가져오기
  const fetchRank = () => {
    Api.get_ranking({
      param: {
        rankSlct: dayTabType === "fan" ?  2 : 3, // [FAN=2, CUPID=3]
        rankType: 1,  // [today=1, week=2, thismoth=3, year=4]
        rankingDate: moment(new Date()).format("YYYY-MM-DD"),
        page: 1,
        records: 5
      }
    }).then((res)=>{
      if (res.result === "success") {
        if(dayTabType === "fan") {
          setEtcRank({...etcRank, fan: res.data.list})
        } else {
          setEtcRank({...etcRank, cupid: res.data.list})
        }
      }
    })
  }

  // 내 랭킹 정보 가져오기
  const fetchMyRank = () => {
    Api.getMyRank().then((res) => {
      if (res.result === "success"){
        let rankInfo = {dj: 0, fan: 0, cupid: 0, team: 0}
        res.data.map((res) => {
          switch (res.s_rankSlct) {
            case 'DJ':
              rankInfo.dj = res.s_rank;
              break;
            case 'FAN':
              rankInfo.fan = res.s_rank;
              break;
            case 'LOVER': //CUPID
              rankInfo.cupid = res.s_rank;
              break;
            case 'TEAM':
              rankInfo.team = res.s_rank;
              break;
          }
        });
        setMyRank(rankInfo);
      }
    });
  }

  return (
    <div id="renewalRanking">
      <Header title={'랭킹'} type={'back'}/>

      {/*DJ 차트*/}
      <section className='rankingTop'>
        <button className='rankingTopMore' onClick={() => {
          history.push({pathname: '/rank/list/dj/1', state: period});
        }}>더보기</button>
        <div className='title' onClick={()=>{dispatch(setSlidePopupOpen())}}>
          <div>DJ {period === "time" && "실시간"}</div>
          <div>
            <strong>
              {period === "time" && "타임"}
              {period === "today" && "일간"}
              {period === "week" && "주간"}
              {period === "month" && "월간"}
              {period === "year" && "연간"}
            </strong>차트
            <span className='optionSelect'/>
          </div>
        </div>
        <span className={`countDown ${(period === "time" || period === "today") ? "text" : "" }`}>{count}</span>
        <div className='criteria'>
          <div className='relative'>
            <div className='clickArea' onClick={()=>{setPopup(true)}}/>
          </div>
        </div>
        <DjChatSwiper data={djRank}/>
        <Refresh period={period} setPeriod={setPeriod}/>
      </section>

      {/*나의 순위는?*/}
      {token.isLogin ?
        <section className='myRanking'>
          <CntTitle title={'님의 오늘 순위는?'}>
            <div className="point">{profile.nickNm}</div>
          </CntTitle>
          <MyRanking data={myRank}/>
        </section>
        :
        <section className='myRanking'>
          <CntTitle title={'나의 순위는?'}/>
          <div className='rankBox'>
            <p className='loginText'>로그인하여 내 순위를 확인해보세요!</p>
            <button className='loginBtn' onClick={() => {history.push("login")}}>로그인</button>
          </div>
        </section>
      }

      {/*배너*/}
      <section className='bannerWrap'>
        <BannerSlide type={17}/>
      </section>

      {/*일간 FAN/CUPID*/}
      <section className='dailyRankList'>
        <div className="cntTitle">
          <h2>일간 FAN / CUPID</h2>
          <button onClick={() => {
            if (dayTabType === "fan"){
              history.push("/rank/list/fan/1");
              dispatch(setSubTab("fan"));
            } else {
              history.push("/rank/list/cupid/1");
              dispatch(setSubTab("cupid"));
            }
          }}>더보기</button>
        </div>
        <ul className="tabmenu">
          <li className={dayTabType === "fan" ? 'active' : ''} onClick={() => {setDayTabType("fan")}}>FAN</li>
          <li className={dayTabType === "cupid" ? 'active' : ''} onClick={() => {setDayTabType("cupid")}}>CUPID</li>
          <div className="underline"/>
        </ul>
        {etcRank.fan.length > 0 || etcRank.cupid.length > 0 ?
          <RankingList data={dayTabType === "fan" ? etcRank.fan : etcRank.cupid} tab={dayTabType}/> : <p>순위가 없습니다.</p>
        }
      </section>

      {/*슬라이드 팝업(상단 DJ 차트 클릭)*/}
      {commonPopup.slidePopup &&
      <PopSlide>
        <div className='selectWrap'>
          <div className={`selectOption ${period === "time" ? "active" : ""}`} onClick={chartSelect}>타임</div>
          <div className={`selectOption ${period === "today" ? "active" : ""}`} onClick={chartSelect}>일간</div>
          <div className={`selectOption ${period === "week" ? "active" : ""}`} onClick={chartSelect}>주간</div>
          <div className={`selectOption ${period === "month" ? "active" : ""}`} onClick={chartSelect}>월간</div>
          <div className={`selectOption ${period === "year" ? "active" : ""}`} onClick={chartSelect}>연간</div>
        </div>
      </PopSlide>
      }

      {/*선정기준 버튼*/}
      {popup &&
      <LayerPopup setPopup={setPopup}>
        <div className='popTitle'>선정 기준</div>
        <div className='standardWrap'>
          <div className='standardList'>
            <div className='popSubTitle'>DJ 랭킹</div>
            <div className='popText'>받은 별, 청취자 수, 받은 좋아요<br/>(부스터 포함)의 종합 순위입니다.</div>
          </div>
          <div className='standardList'>
            <div className='popSubTitle'>FAN 랭킹</div>
            <div className='popText'>보낸 달과 보낸 좋아요(부스터 포함)의<br/>종합 순위입니다.</div>
          </div>
          <div className='standardList'>
            <div className='popSubTitle'>CUPID 랭킹</div>
            <div className='popText'>보낸 좋아요 개수 (부스터 포함)의<br/>1~200위의 순위입니다.</div>
          </div>
        </div>
        <div className='popInfo'>
          <span>HONEY</span>(허니)는 랭커로부터 가장 많은<br/>좋아요 (부스터 포함)를 받은 유저입니다.
        </div>
      </LayerPopup>
      }

    </div>
  )
}

export default RankPage