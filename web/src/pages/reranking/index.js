import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import moment from 'moment'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTItle/CntTitle'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import Tabmenu from './components/Tabmenu'
import ChartSwiper from './components/ChartSwiper'
import MyRanking from './components/MyRanking'
import RankingList from './components/rankingList'
import {convertDateTimeForamt, convertMonday, convertMonth} from 'pages/common/rank/rank_fn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup';

import './style.scss'

const RankPage = () => {
  const history = useHistory();

  const context = useContext(Context);

  const {token, profile} = context;

  //DJ 기간 선택 array
  const rankTabmenu = ['오늘','이번주','이번달', '올해']

  //하단 FAN/LOVER탭 array
  const dayTabmenu = ['FAN','LOVER']

  //DJ List 기간 선택 pop flag
  const [popSlide, setPopSlide] = useState(false)

  //선정기준 pop
  const [popup, setPopup] = useState(false)

  //선저기준? 팝업
  const [popupOpen, setPopupOpen] = useState(false)

  //현재 선택된 DJ List 기간
  const [select , setSelect] = useState("today")

  //각 DJ 기간별 남은 시간
  const [daySetting , setDaySetting] = useState("")

  //dj List
  const [djRank, setDjRank] = useState([]);

  //fan List
  const [fanRank, setFanRank] = useState([]);

  //lover List
  const [loverRank, setLoverRank] = useState([]);

  //내 순위 정보
  const [myRank, setMyRank] = useState([]);

  //내 순위 정보 탭
  const [rankTabType, setRankTabType] = useState(rankTabmenu[0]);

  //하단 FAN/LOVER탭
  const [dayTabType, setDayTabType] = useState(dayTabmenu[0])

  // 페이지 셋팅
  useEffect(() => {
    timer();
    fetchRankData(1, 1);
    fetchRankData(2, 1);
  }, []);

  //남은 시간 계산
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
    let reMainTime = select === "time" ? counting(time, now) : select === "today" ? counting(day, now) : select === "thisweek" ? counting(week, now) : select === "thismonth" ? moment(now).format('MM/DD') : moment(now).format('YYYY');
    setDaySetting(reMainTime);
  }

  const counting = (endDate, now) => {
    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;

    let distDt = endDate - now;

    var days = Math.floor(distDt / _day);
    var hours = Math.floor((distDt % _day) / _hour);
    var minutes = Math.floor((distDt % _hour) / _minute);
    var seconds = Math.floor((distDt % _minute) / _second);

    let countDown = "";

    if (days > 0) {
      countDown += `${days}/`
    }

    if (hours > 0) {
      if (hours < 10){
        countDown += `0${hours}/`
      } else {
        countDown += `${hours}/`
      }
    } else {
      countDown += "00/"
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

    if (select !== "thisweek"){
      if (seconds > 0) {
        if (seconds < 10){
          countDown += `/0${seconds}`
        } else {
          countDown += `/${seconds}`
        }
      } else {
        countDown += "/00"
      }
    }
    return countDown;
  }

  //탭 이동
  useEffect(() => {
    if (dayTabType === dayTabmenu[0]) {
      fetchRankData(2, 1)
    } else if (dayTabType === dayTabmenu[1]) {
      fetchRankData(3, 1)
    }
  }, [dayTabType]);

  
  // 타임 List
  const fetchTimeRank = async () => {
    const res = await Api.getRankTimeList({
      rankSlct: 1,
      page: 1,
      records: 10,
      rankingDate: convertDateTimeForamt(new Date() , "-")
    });
    if (res.result === "success") {;
      setDjRank(res.data.list)
    }
  };

  // 나머지 List
  const fetchRankData = async (rankSlct, rankType) => {
    let rankingDate = moment(rankType === 1 ? new Date() : rankType === 2 ? convertMonday() : rankType === 3 ? convertMonth() : new Date()).format("YYYY-MM-DD");
    const {result, data} = await Api.get_ranking({
      param: {
        rankSlct: rankSlct,
        rankType: rankType,
        rankingDate: rankingDate,
        page: 1,
        records: rankSlct === 1 ? 10 : 5,
      }
    });
    if (result === "success") {
      setMyRank(data);
      if(rankSlct === 1){
        setDjRank(data.list);
      } else if(rankSlct === 2) {
        setFanRank(data.list)
      } else if(rankSlct === 3) {
        setLoverRank(data.list)
      }
    }
  }

  //DJ 랭킹 List 기간 pop
  const selectChart = () => {
    setPopSlide(true);
  }

  //DJ 랭킹 List 기간 선택
  const chartSelect = (e) => {
    let text = e.currentTarget.innerText;
    if(text === "타임"){
      setSelect("time")
    } else if(text === "오늘") {
      setSelect("today")
    } else if(text === "이번주") {
      setSelect("thisweek")
    } else if(text === "이번달") {
      setSelect("thismonth")
    } else if(text === "올해") {
      setSelect("thisyear")
    }
    setPopSlide(false);
  }

  //DJ 랭킹 시간별 List호출
  useEffect(() => {
    timer();
    if (select === "time"){
      fetchTimeRank();
    } else {
      fetchRankData(1, select === "today" ? 1 : select === "thisweek" ? 2 : select === "thismonth" ? 3 : 4);
    }
  }, [select]);

  const criteriaPop = () => {
    setPopup(true);
  }

  // 페이지 시작
  return (
    <div id="renewalRanking">
      <Header title={'랭킹'} type={'back'}/>
      <section className='rankingTop'>
        <CntTitle more={'/rankDetail/DJ'} />
        <div className='title' onClick={selectChart}>
          <div>DJ 실시간</div>
          <div>
            <strong>
              {select === "time" && "타임"}
              {select === "today" && "일간"}
              {select === "thisweek" && "주간"}
              {select === "thismonth" && "월간"}
              {select === "thisyear" && "연간"}
            </strong>
            차트<span className='optionSelect'></span>
          </div>
        </div>
        <div className='countDown'>{daySetting}</div>
        <div className='criteria'>
          <div className='relative'>
            <div className='clickArea' onClick={criteriaPop}/>
          </div>
        </div>
        <ChartSwiper data={djRank}/>
      </section>
      {token.isLogin &&
        <section className='myRanking'>
          <CntTitle title={'님의 순위는?'}>
            <div className="point">{profile.nickNm}</div>
          </CntTitle>
          <Tabmenu data={rankTabmenu} tab={rankTabType} setTab={setRankTabType}/>
          <MyRanking data={myRank}/>
        </section>
      }
      <section className='dailyRankList'>
        <CntTitle title={'일간 FAN / LOVER'} more={`${dayTabType === "FAN" ? "/rankDetail/FAN" : "/rankDetail/LOVER"}`}/>
        <Tabmenu data={dayTabmenu} tab={dayTabType} setTab={setDayTabType} />
        <div className='listWrap'>
          {fanRank.length > 0 || loverRank.length > 0 ?
            <RankingList data={dayTabType === "FAN" ? fanRank : loverRank} tab={dayTabType}>
            </RankingList>
            :
            <>
              <p>순위가 없습니다.</p>
            </>
          }
        </div>        
      </section>      
      <section className='rankingBottom'>
          <p>
            달라의 숨막히는 순위 경쟁<br/>
            랭커에 도전해보세요! 
          </p>
          <button onClick={() => history.push('/rankDetail/DJ')}>랭킹순위 전체보기</button>
      </section>
      {popSlide &&
        <PopSlide setPopSlide={setPopSlide}>
         <div className='selectWrap'>
            <div className={`selectOption ${select === "time" ? "active" : ""}`} onClick={chartSelect}>타임</div>
            <div className={`selectOption ${select === "today" ? "active" : ""}`} onClick={chartSelect}>오늘</div>
            <div className={`selectOption ${select === "thisweek" ? "active" : ""}`} onClick={chartSelect}>이번주</div>
            <div className={`selectOption ${select === "thismonth" ? "active" : ""}`} onClick={chartSelect}>이번달</div>
            <div className={`selectOption ${select === "thisyear" ? "active" : ""}`} onClick={chartSelect}>올해</div>
          </div>
        </PopSlide>
      }
      {popup &&
      <LayerPopup setPopup={setPopup}>
        <div className='popTitle'>선정 기준</div>
        <div className='standardWrap'>
          <div className='standardList'>
            <div className='popSubTitle'>DJ 랭킹</div>
            <div className='popText'>
              받은 별, 청취자 수, 받은 좋아요<br/>
              (부스터 포함)의 종합 순위입니다.
            </div>
          </div>
          <div className='standardList'>
            <div className='popSubTitle'>DJ 랭킹</div>
            <div className='popText'>
              받은 별, 청취자 수, 받은 좋아요<br/>
              (부스터 포함)의 종합 순위입니다.
            </div>
          </div>
          <div className='standardList'>
            <div className='popSubTitle'>DJ 랭킹</div>
            <div className='popText'>
              받은 별, 청취자 수, 받은 좋아요<br/>
              (부스터 포함)의 종합 순위입니다.
            </div>
          </div>
        </div>
        <div className='popInfo'>
          <span>CUPID</span>(큐피드)는 랭커로부터 가장 많은<br/>좋아요 (부스터 포함)를 받은 유저입니다.
        </div>
      </LayerPopup>
      }
    </div>      
  )
}

export default RankPage
