import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import ListRow from 'components/ui/listRow/ListRow'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import CardList from './components/cardList'
import BottomSlide from './components/bottomSlide'

import './style.scss'

const RankPage = () => {
  const history = useHistory()
  const context = useContext(Context)

  const rankTabmenu = ['오늘','이번주','이번달', '올해']
  const dayTabmenu = ['FAN','LOVER']

  const [slidePop, setSlidePop] = useState(false)
  const [select , setSelect] = useState("time")
  const [rankSlctType, setRankSlctType] = useState(1)
  const [dateType, setDateType] = useState(1)
  const [timeDjRank, setTimeDjRank] = useState([])
  const [timeFanRank, setTimeFanRank] = useState([])
  const [timeLoverRank, setTimeLoverRank] = useState([])
  const [myProfile, setMyProfile] = useState([])
  const [myData, setMyData] = useState([])
  const [rankTabName, setRankTabName] = useState(rankTabmenu[0])
  const [dayTabName, setDayTabName] = useState(dayTabmenu[0])

  
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
      setMyData(data);
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
    fetchRankData(2, 1)
    setMyProfile(context.profile)
  }, [])

  useEffect(() => {
    fetchRankData(dateType, rankSlctType)

  }, [dateType, rankSlctType])

  // 기능
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
        <div className='timeChart' onClick={selectChart}>
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
        <div className='countDown'>
          00/00/00
        </div>
        <div className='timeRank'>
          <CardList data={timeDjRank} />
        </div>
      </section>
      <section className='myRank'>
        <CntTitle title={'님의 순위는?'}>
          <div className="point">찡구</div>
        </CntTitle>
        <ul className="tabmenu">
          {rankTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: rankTabName,
              setTab: setRankTabName,
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
          <div className="underline"></div>
        </ul>
        <div className='myDataContent'>
          <div className='myData'>
            <div className='dataWrap'>
              <span className='rankCategory'>DJ</span>
              <span className='rankData'>{myData.myRank !== 0 ? myData.myRank : "-"}</span>
            </div>
            <div className='dataWrap'>
              <span className='rankCategory'>FAN</span>
              <span className='rankData'>{myData.myRank !== 0 ? myData.myRank : "-"}</span>
            </div>
            <div className='dataWrap'>
              <span className='rankCategory'>LOVER</span>
              <span className='rankData'>{myData.myRank !== 0 ? myData.myRank : "-"}</span>
            </div>
          </div>
        </div>        
      </section>
      <section className='rankList'>
        <CntTitle title={'일간 FAN / LOVER'} more={'rank'}/>
        <ul className="tabmenu">
          {dayTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: dayTabName,
              setTab: setDayTabName,
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
          <div className="underline"></div>
        </ul>
        <div className='listWrap'>
          { dateType !== 3 ?
            timeFanRank.map((list, index) => {
              return (
                <ListRow photo={list.profImg.thumb88x88} key={index}>
                  <div className="rank">{list.rank}</div>
                  <div className='listContent'>
                    <div className='listItem'>
                      <GenderItems data={list.gender} />
                      <span className="nick">{list.nickNm}</span>
                    </div>
                    <div className='listItem'>
                      <i className="star">123</i>
                      <i className="time">123</i>
                    </div>
                  </div>
                  <div className="listBack">
                    {list.roomNo && <div className='liveTag'></div>}                    
                  </div>
                </ListRow>
              )
            })
          :
            timeLoverRank.map((list, index) => {
              return (
                <ListRow photo={list.profImg.thumb88x88} key={index}>
                  <div className="rank">{list.rank}</div>
                  <div className='listContent'>
                    <div className='listItem'>
                      <GenderItems data={list.gender} />
                      <span className="nick">{list.nickNm}</span>
                    </div>
                    <div className='listItem'>
                      <i className="star">123</i>
                      <i className="time">123</i>
                    </div>
                  </div>
                  <div className="listBack">
                    {list.roomNo && <div className='liveTag'></div>}                    
                  </div>
                </ListRow>
              )
            })
          }
        </div>        
      </section>      
      <section className='rankingBottom'>
          <p>
            달라의 숨막히는 순위 경쟁<br/>
            랭커에 도전해보세요! 
          </p>
          <a>랭킹순위 전체보기</a>
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
