import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
import CardList from './components/cardList'
import Header from './components/header'
import ListRow from './components/listRow'

import './style.scss'

const RankPage = () => {
  const history = useHistory()
  const global_ctx = useContext(Context)

  const rankTabmenu = ['오늘','이번주','이번달', '올해']
  const dayTabmenu = ['FAN','LOVER']

  const [rankSlctType, setRankSlctType] = useState(1)
  const [dateType, setDateType] = useState(1)
  const [timeDjRank, setTimeDjRank] = useState([])
  const [timeFanRank, setTimeFanRank] = useState([])
  const [timeLoverRank, setTimeLoverRank] = useState([])
  const [myProfile, setMyProfile] = useState([])
  const [myData, setMyData] = useState([])
  const [rankTabName, setRankTabName] = useState({name: rankTabmenu[0]})
  const [dayTabName, setDayTabName] = useState({name: dayTabmenu[0]})



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
        records: 100,
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
  };

  // 스와이퍼
  const swiperTimeDjRank = {
    slidesPerView: 'auto',
    loop: false
  }

  // 컴포넌트
  const CntTitle = (props) => {
    const {point,title,more,children} = props

    const onMoreClick = () => {
      history.push(`/${more}`)
    }

    return (
      <div className="cntTitle">
        <h2><span className='point'>{point}</span>{title}</h2>
        {children}
        {more &&
          <button onClick={onMoreClick}>더보기</button>
        }
      </div>
    )
  }

  const TabBtn = (props) => {
    const {param} = props

    const tabClick = (e) => {
      const {tabTarget} = e.currentTarget.dataset
      const tabType = e.currentTarget.type

      if (tabTarget === param.item) {
        param.setTab({name: tabTarget})
        if(tabType === "day"){
          setDateType(param.index + 2);
        } else {
          setRankSlctType(param.index + 1);
        }
      }
    }

    return (
      <li className={param.tab === param.item ? 'active' : ''} type={param.type} data-tab-target={param.item} onClick={tabClick}>{param.item}</li>
    )
  }

  // 페이지 셋팅
  useEffect(() => {
    fetchTimeRank()
    fetchRankData()
    fetchRankData(2, 1)
    setMyProfile(global_ctx.profile)
  }, [])

  useEffect(() => {
    fetchRankData(dateType, rankSlctType)

  }, [dateType, rankSlctType])

  // 페이지 시작
  return (
    <div id="renewalRanking">
      <Header title="랭킹" leftCtn="backBtn">
        <div className='rightCtn'>
          <button className='benefits'>혜택</button>
        </div>
      </Header>
      <section className='rankingTop'>
        <div className='more white'>더보기</div>
        <div className='timeChart'>
          <div>DJ 실시간</div>
          <div>타임 차트<span className=''></span></div>
        </div>
        <div className='countDown'>
          00:00:00
        </div>
        <div className='timeRank'>
          {timeDjRank && timeDjRank.length > 0 &&    
            <Swiper {...swiperTimeDjRank}>
                {timeDjRank.map((list, index) => {
                  return (
                    <div key={index}>
                      <CardList list={list} isRanking={true}/>
                    </div>
                  )
                })}
            </Swiper>
          }
        </div>
      </section>

      <section className='myRank'>
        <CntTitle point={`${myProfile.nickNm}`} title={'님의 순위는?'} more={'rank'}/>
        <ul className="tabmenu">
          {rankTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: rankTabName.name,
              type: "rank",
              setTab: setRankTabName,
              index: index,
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
        </ul>
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
      </section>

      <section className='rankList'>
        <CntTitle title={'DAY FAN / LOVER'} more={'rank'}/>
        <ul className="tabmenu">
          {dayTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: dayTabName.name,
              type: "day",
              setTab: setDayTabName,
              index: index,
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
        </ul>
        <div className='listWrap'>
          { dateType !== 3 ?
              timeFanRank.map((list, index) => {
                return (
                  <ListRow list={list} key={index} rank={true} nick={true} gender={true} data={"fanPoint giftPoint"}>
                    {list.roomNo && <div className='liveTag'>LIVE</div>}                    
                  </ListRow>
                )
              })
            :
              timeLoverRank.map((list, index) => {
                return (
                  <ListRow list={list} key={index} rank={true} nick={true} gender={true} data={"goodPoint"}>
                    {list.roomNo && <div className='liveTag'>LIVE</div>}                    
                  </ListRow>
                )
              })
          }
        </div>        
      </section>
    </div>      
  )
}

export default RankPage
