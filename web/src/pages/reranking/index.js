import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import moment from 'moment'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
// components
import Tabmenu from './components/Tabmenu'
import ChartSwiper from './components/ChartSwiper'
import MyRanking from './components/MyRanking'
import RankingList from './components/RankingList'
import BottomSlide from './components/bottomSlide'

import './style.scss'

const RankPage = () => {
  const history = useHistory()

  const rankTabmenu = ['오늘','이번주','이번달', '올해']
  const dayTabmenu = ['FAN','LOVER']

  const [slidePop, setSlidePop] = useState(false)
  const [select , setSelect] = useState("time")
  const [timeDjRank, setTimeDjRank] = useState([])
  const [timeFanRank, setTimeFanRank] = useState([])
  const [timeLoverRank, setTimeLoverRank] = useState([])
  const [myRank, setMyRank] = useState([])
  const [rankTabType, setRankTabType] = useState(rankTabmenu[0])
  const [dayTabType, setDayTabType] = useState(dayTabmenu[0])

  
  // API 호출
  const fetchTimeRank = async () => {
    const res = await Api.getRankTimeList({
      rankSlct: 1,
      page: 1,
      records: 10,
      rankingDate: "2022-01-17 10:00:00"
    });
    if (res.result === "success") {
      setTimeDjRank(res.data.list) 
    }
  };

  const fetchRankData = async (dateType, rankSlctType) => {
    const {result, data} = await Api.get_ranking({
      param: {
        rankSlct: dateType,
        rankType: rankSlctType,
        rankingDate: `2022-01-17`,
        page: 1,
        records: 10,
      }
    });
    if (result === "success") {
      setMyRank(data);
      if(dateType === 1){
        setTimeDjRank(data.list)  
      } else if(dateType === 2) {
        setTimeFanRank(data.list)     
      } else if(dateType === 3) {
        setTimeLoverRank(data.list)
      }
    }
  }

  // 페이지 셋팅
  useEffect(() => {
    fetchTimeRank()
    fetchRankData()
  }, [])

  useEffect(() => {
    if (dayTabType === dayTabmenu[0]) {
      fetchRankData(2, 1)
    } else if (dayTabType === dayTabmenu[1]) {
      fetchRankData(3, 1)
    }
  }, [dayTabType])

  // 기능
  const clickDetailOpen = () => {
    history.push('/rank/rankDetail')
  }
  const selectChart = () => {
    setSlidePop(true);
  }
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
    setSlidePop(false);
  }

  // 페이지 시작
  return (
    <div id="renewalRanking">
      <Header title="랭킹" type={'back'}>
        <div className='buttonGroup'>
          <button className='benefits'>혜택</button>
        </div>
      </Header>
      <section className='rankingTop'>
        <CntTitle more={'/'} />
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
        <div className='countDown'>00:00:00</div>
        <ChartSwiper data={timeDjRank} />
      </section>
      <section className='myRanking'>
        <CntTitle title={'님의 순위는?'}>
          <div className="point">찡구</div>
        </CntTitle>
        <Tabmenu data={rankTabmenu} tab={rankTabType} setTab={setRankTabType} />
        <MyRanking data={myRank} />
      </section>
      <section className='dailyRankList'>
        <CntTitle title={'일간 FAN / LOVER'} more={'rank'}/>
        <Tabmenu data={dayTabmenu} tab={dayTabType} setTab={setDayTabType} />
        <div className='listWrap'>
          {dayTabType === dayTabmenu[0] ?
            <RankingList data={timeFanRank}>
              <div className='listItem'>
                <i className="star">123</i>
                <i className="time">123</i>
              </div>
            </RankingList>
            : dayTabType === dayTabmenu[1] ?
            <RankingList data={timeLoverRank}>
              <div className='listItem'>
                <i className="ppyong">123</i>
                <i className="heart">123</i>
              </div>
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
          <button onClick={clickDetailOpen}>랭킹순위 전체보기</button>
      </section>
      {slidePop &&
        <BottomSlide setSlidePop={setSlidePop}> 
          <div className='selectWrap'>
            <div className={`selectOption ${select === "time" ? "active" : ""}`} onClick={chartSelect}>타임</div>
            <div className={`selectOption ${select === "today" ? "active" : ""}`} onClick={chartSelect}>오늘</div>
            <div className={`selectOption ${select === "thisweek" ? "active" : ""}`} onClick={chartSelect}>이번주</div>
            <div className={`selectOption ${select === "thismonth" ? "active" : ""}`} onClick={chartSelect}>이번달</div>
            <div className={`selectOption ${select === "thisyear" ? "active" : ""}`} onClick={chartSelect}>올해</div>
          </div>
        </BottomSlide>      
      }
    </div>      
  )
}

export default RankPage
