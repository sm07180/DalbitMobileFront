import React, {useState, useEffect, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

import {convertDateFormat, calcDateFormat} from 'components/lib/dalbit_moment'
// global components
import Header from 'components/ui/header/Header'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import PopSlide from 'components/ui/popSlide/PopSlide'

// components
import Tabmenu from '../components/Tabmenu'
import TopRanker from '../components/TopRanker'
import RankingList from '../components/rankingList'
//static
import './rankingDetail.scss'

const RankDetailPage = () => {
  const params = useParams()
  let history = useHistory()
  const rankingListType = params.type

  const [rankSlct, setRankSlct] = useState(1);
  const [rankType, setRankType] = useState(1);
  const [historySetting, setHistorySetting] = useState(1);

  const [popSlide, setPopSlide] = useState(false);  
  const [select, setSelect] = useState("");  

  const [tabList, setTabList] = useState([]);
  const [TabName, setTabName] = useState(tabList[0])

  const [rankList, setRankList] = useState([])
  const [topRankList, setTopRankList] = useState([])
  const [historyList, setHistoryList] = useState([])

  let historyArray = [];

  const fetchRankData = async (rankSlct, rankType, rankingDate) => {
    const {result, data} = await Api.get_ranking({
      param: {
        rankSlct: rankSlct,
        rankType: rankType,
        rankingDate: rankingDate,
        page: 1,
        records: 100,
      }
    });
    if (result === "success") {
      if(historySetting === 1) {
        setRankList(data.list.slice(3));
        setTopRankList(data.list.slice(0, 3));
        historyArray.push(data.list.slice(0, 3));
        setHistorySetting(historySetting - 1);
      } else {
        historyList.push(...historyList, data.list.slice(0, 3));
      }
    }
  };

  const subTitle = useMemo(() => {
    if (rankingListType === 'dj') {
        return 'DJ'
    } else if (rankingListType === 'fan') {
        return 'FAN'
    } else if (rankingListType === 'lover') {
        return 'LOVER'
    }
  })

  useEffect(() => {
    if (rankingListType === 'dj') {
      setTabList(['타임','오늘','이번주', '이번달', '올해']);
      setTabName('타임')
      setRankSlct(1);
      fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
    } else if (rankingListType === 'fan') {
      setTabList(['오늘','이번주', '이번달']);
      setTabName('오늘')
      setRankSlct(2); 
      fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
    } else if (rankingListType === 'lover') {
      setTabList(['오늘','이번주']);
      setTabName('오늘')
      setRankSlct(3);
      fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
    }
    setSelect(rankingListType);
  }, [])

  useEffect(() => {
    fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
  }, [rankSlct, rankType])

  useEffect(() => {
    console.log(historySetting);
    fetchRankData(rankSlct, rankType, calcDateFormat(new Date(),  -Number(historySetting)));
    console.log(calcDateFormat(new Date(),  -Number(historySetting)));
  }, [historySetting])

  const popSlideOpen = () => {
    setPopSlide(true);
  }
  const optionSelect = (e) => {
    let text = e.currentTarget.innerText;
    if(text === "DJ"){
      setSelect("DJ")
      history.push('../rank/dj')
    } else if(text === "FAN") {
      setSelect("FAN")
      history.push('../rank/fan')
    } else {      
      setSelect("LOVER")
      history.push('../rank/lover')
    }
    setPopSlide(false);
  }

  return (
    <div id="rankingList">
      <Header position={'sticky'} type={'back'}>
        <h1 className='title'>{subTitle}<span className='optionSelect' onClick={popSlideOpen}></span></h1>
        <div className='buttonGroup'>
          <button className='benefits'>혜택</button>
        </div>
      </Header>
      <Tabmenu data={tabList} tab={TabName} setTab={setTabName} />
      <div className="rankingContent">
        <TopRanker data={historyList} rankingListType={rankingListType} />
        <div className='listWrap'>
          <RankingList data={rankList}>
            {rankingListType === 'lover' ?
              <div className='listItem'>
                <DataCnt type={"cupid"} value={rankList.djNickNm ? rankList.djNickNm : "테스트"}/>
                <DataCnt type={"djGoodPoint"} value={rankList.djGoodPoint ? rankList.djGoodPoint : "123"}/>
              </div>
              :
              <div className='listItem'>
                <DataCnt type={"starCnt"} value={rankList.starCnt ? rankList.starCnt : "123"}/>
                <DataCnt type={"listenPoint"} value={rankList.listenPoint ? rankList.listenPoint : "123"}/>
              </div>
            }
          </RankingList>
        </div>
      </div>

      {popSlide &&
        <PopSlide setPopSlide ={setPopSlide}> 
          <div className='selectWrap'>
            <div className={`selectOption ${select === "DJ" ? "active" : ""}`} onClick={optionSelect}>DJ</div>
            <div className={`selectOption ${select === "FAN" ? "active" : ""}`} onClick={optionSelect}>FAN</div>
            <div className={`selectOption ${select === "LOVER" ? "active" : ""}`} onClick={optionSelect}>LOVER</div>
          </div>
        </PopSlide>      
      }
    </div>
  )
}

export default RankDetailPage