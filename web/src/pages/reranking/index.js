import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import moment from 'moment'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide'
// components
import ChartSwiper from './components/ChartSwiper'
import MyRanking from './components/MyRanking'
import RankingList from './components/rankingList'
import {convertDateTimeForamt, convertMonday, convertMonth} from 'pages/common/rank/rank_fn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup';

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";
import {setSubTab} from "redux/actions/rank";

const RankPage = () => {
  const history = useHistory();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {token, profile} = globalState;

  const dispatch = useDispatch();
  const commonPopup = useSelector(state => state.popup);

  const rankState = useSelector(({rankCtx}) => rankCtx);
  //하단 FAN/CUPID탭 array
  const dayTabmenu = ['FAN','CUPID']

  //선정기준 pop
  const [popup, setPopup] = useState(false)

  //현재 선택된 DJ List 기간
  const [select , setSelect] = useState("time")

  //각 DJ 기간별 남은 시간
  const [daySetting , setDaySetting] = useState("")

  //dj List
  const [djRank, setDjRank] = useState([]);

  //fan List
  const [fanRank, setFanRank] = useState([]);

  //cupid List
  const [cupidRank, setCupidRank] = useState([]);

  //내 순위 정보
  const [myRank, setMyRank] = useState({dj: 0, fan: 0, cupid: 0});

  //하단 FAN/CUPID탭
  const [dayTabType, setDayTabType] = useState(dayTabmenu[0])

  // 페이지 셋팅
  useEffect(() => {
    getMyRank();
    // fetchRankData(1, 1);
    if (rankState.subTab === "FAN") {
      setDayTabType("FAN");
    } else {
      setDayTabType("CUPID");
      dispatch(setSubTab("FAN"));
    }
    fetchRankData(2, 1);
    setSelect("time");
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
    let reMainTime = select === "time" ? counting(time, now) : select === "today" ? counting(day, now) : select === "thisweek" ? `${moment(now).format('M')}월 ${chngNumberToString(weekNumberByThurFnc(now))}째주` : select === "thismonth" ? `${moment(now).format('YY')}년 ${moment(now).format('MM')}월` : `${moment(now).format('YYYY')}년`;
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

    if (select !== "thisweek"){
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
      if(rankSlct === 1){
        if(select !== 'time') {
          setDjRank(data.list);
        }
      } else if(rankSlct === 2) {
        setFanRank(data.list)
      } else if(rankSlct === 3) {
        setCupidRank(data.list)
      }
    }
  }

  const getMyRank = async () => {
    await Api.getMyRank().then((res) => {
      if (res.result === "success"){
        let djRank = 0;
        let fanRank = 0;
        let cupidRank = 0;

        res.data.map((res) => {
          if (res.s_rankSlct === "DJ"){
            djRank = res.s_rank;
          } else if (res.s_rankSlct === "FAN") {
            fanRank = res.s_rank;
          } else {
            cupidRank = res.s_rank;
          }
        });
        setMyRank({dj: djRank, fan: fanRank, cupid: cupidRank});
      }
    });
  }

  //DJ 랭킹 List 기간 pop
  const selectChart = () => {
    dispatch(setSlidePopupOpen());
  }

  const slidePopClose = () => {
    closePopup(dispatch);
  }

  //DJ 랭킹 List 기간 선택
  const chartSelect = (e) => {
    let text = e.currentTarget.innerText;
    if(text === "타임"){
      setSelect("time")
    } else if(text === "일간") {
      setSelect("today")
    } else if(text === "주간") {
      setSelect("thisweek")
    } else if(text === "월간") {
      setSelect("thismonth")
    } else if(text === "연간") {
      setSelect("thisyear")
    }
    slidePopClose();
  }

  //DJ 랭킹 시간별 List호출
  useEffect(() => {
    if(select) {
      let interval = "";
      timer();
      if (select === "time"){
        fetchTimeRank();
        interval = setInterval(() => {
          timer();
        }, 1000);
      } else {
        if (select === "today"){
          interval = setInterval(() => {
            timer();
          }, 1000);
        } else {
          timer();
        }
        fetchRankData(1, select === "today" ? 1 : select === "thisweek" ? 2 : select === "thismonth" ? 3 : 4);
      }
      return () => {
        clearInterval(interval);
      }
    }
  }, [select]);

  const criteriaPop = () => {
    setPopup(true);
  }

  const golink = (path) => {
    history.push(path);
  }

  const weekNumberByThurFnc = (paramDate) => {

    const year = paramDate.getFullYear();
    const month = paramDate.getMonth();
    const date = paramDate.getDate();

    // 인풋한 달의 첫 날과 마지막 날의 요일
    const firstDate = new Date(year, month, 1);
    const firstDayOfWeek = firstDate.getDay() === 0 ? 7 : firstDate.getDay();


    // 날짜 기준으로 몇주차 인지
    let weekNo = Math.ceil((firstDayOfWeek - 1 + date) / 7);

    return weekNo;
  };



  const chngNumberToString = (number) => {
    let val = number === 2 ? "둘" : number === 3 ? "셋" : number === 4 ? "넷" : number === 5 ? "다섯" : "첫";
    return val
  }

  // 페이지 시작
  return (
    <div id="renewalRanking">
      <Header title={'랭킹'} type={'back'}/>
      <section className='rankingTop'>
        <button className='rankingTopMore' onClick={() => {
          history.push({
            pathname: '/rankDetail/DJ',
            state: select
          });
        }}>더보기</button>
        <div className='title' onClick={selectChart}>
          <div>DJ {select === "time" && "실시간"}</div>
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
        <span className={`countDown ${(select === "time" || select === "today") ? "text" : "" }`}>{daySetting}</span>
        <div className='criteria'>
          <div className='relative'>
            <div className='clickArea' onClick={criteriaPop}/>
          </div>
        </div>
        <ChartSwiper data={djRank}/>
      </section>
      {token.isLogin ?
        <section className='myRanking'>
          <CntTitle title={'님의 오늘 순위는?'}>
            <div className="point">{profile.nickNm}</div>
          </CntTitle>
          <MyRanking data={myRank}/>
        </section>
          :
        <section className='myRanking'>
          <CntTitle title={'나의 순위는?'}>
          </CntTitle>
          <div className='rankBox'>
            <p className='loginText'>로그인하여 내 순위를 확인해보세요!</p>
            <button className='loginBtn' onClick={() => {golink("/login")}}>로그인</button>
          </div>
        </section>
      }
      <section className='dailyRankList'>
        <div className="cntTitle">
          <h2>일간 FAN / CUPID</h2>
          <button onClick={() => {
            if (dayTabType === "FAN"){
              history.push("/rankDetail/FAN");
              dispatch(setSubTab("FAN"));
            } else {
              history.push("/rankDetail/CUPID");
              dispatch(setSubTab("CUPID"));
            }
          }}>더보기</button>
        </div>
        <ul className="tabmenu">
          <li className={dayTabType === "FAN" ? 'active' : ''} onClick={() => {
            setDayTabType("FAN");
          }}>FAN</li>
          <li className={dayTabType === "CUPID" ? 'active' : ''} onClick={() => {
            setDayTabType("CUPID");
          }}>CUPID</li>
          <div className="underline"></div>
        </ul>
        <div className='listWrap'>
          {fanRank.length > 0 || cupidRank.length > 0 ?
            <RankingList data={dayTabType === "FAN" ? fanRank : cupidRank} tab={dayTabType}>
            </RankingList>
            :
            <>
              <p>순위가 없습니다.</p>
            </>
          }
        </div>
      </section>
      <section className='rankingBottom' onClick={() => history.push('/honor')}>
        <img src="https://image.dalbitlive.com/banner/dalla/page/ranking_honor.png" alt="명예의전당"/>
      </section>
      {commonPopup.commonPopup &&
      <PopSlide>
        <div className='selectWrap'>
          <div className={`selectOption ${select === "time" ? "active" : ""}`} onClick={chartSelect}>타임</div>
          <div className={`selectOption ${select === "today" ? "active" : ""}`} onClick={chartSelect}>일간</div>
          <div className={`selectOption ${select === "thisweek" ? "active" : ""}`} onClick={chartSelect}>주간</div>
          <div className={`selectOption ${select === "thismonth" ? "active" : ""}`} onClick={chartSelect}>월간</div>
          <div className={`selectOption ${select === "thisyear" ? "active" : ""}`} onClick={chartSelect}>연간</div>
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
            <div className='popSubTitle'>FAN 랭킹</div>
            <div className='popText'>
              보낸 달과 보낸 좋아요(부스터 포함)의<br/>
              종합 순위입니다.
            </div>
          </div>
          <div className='standardList'>
            <div className='popSubTitle'>CUPID 랭킹</div>
            <div className='popText'>
              보낸 좋아요 개수 (부스터 포함)의<br/>
              1~200위의 순위입니다.
            </div>
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
