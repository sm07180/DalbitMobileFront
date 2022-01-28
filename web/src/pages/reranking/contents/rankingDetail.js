import React, {useState, useEffect, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

import {convertDateFormat, calcDateFormat} from 'components/lib/dalbit_moment'
// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from '../components/Tabmenu'
import TopRanker from '../components/TopRanker'
import RankingList from '../components/RankingList'
//static
import './rankingDetail.scss'

export default (props) => {
  const params = useParams()
  const rankingListType = 'lover' //params.type

  const [rankSlct, setRankSlct] = useState(1);
  const [rankType, setRankType] = useState(1);
  const [historySetting, setHistorySetting] = useState(1);

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
  }, [])

  useEffect(() => {
    fetchRankData(rankSlct, rankType, convertDateFormat(new Date(), 'YYYY-MM-DD'));
  }, [rankSlct, rankType])

  useEffect(() => {
    console.log(historySetting);
    fetchRankData(rankSlct, rankType, calcDateFormat(new Date(),  -Number(historySetting)));
    console.log(calcDateFormat(new Date(),  -Number(historySetting)));
  }, [historySetting])

  console.log(historyList);

  return (
    <div id="rankingList">
      <Header position={'sticky'} type={'back'}>
        <h1 className='title'>{subTitle}<span className='optionSelect'></span></h1>
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
                <i className="ppyong">123</i>
                <i className="heart">123</i>
              </div>
              :
              <div className='listItem'>
                <i className="star">123</i>
                <i className="time">123</i>
              </div>
            }
          </RankingList>
        </div>
      </div>
    </div>
  )
}
