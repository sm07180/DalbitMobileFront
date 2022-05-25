import React, {useEffect, useLayoutEffect, useState} from 'react';

import Api from "context/api";
import moment from "moment/moment";
import {useHistory, useParams} from "react-router-dom";
import Utility from "../lib/utility";

import '../scss/RankingMore.scss';
import Header from "components/ui/header/Header";
import TopRanker from "../components/more/TopRanker";
import RankingList from "../components/more/RankList";
import TeamRankList from "../components/more/TeamRankList";
import SlctTab from "pages/reranking/components/more/SlctTab";
import TypeTab from "pages/reranking/components/more/TypeTab";

const RankingMore = () => {
  const history = useHistory();
  const params = useParams();

  //string
  const [tab, setTab] = useState({
    slct: params.slct || 'dj',
    type: params.type || 'time',
  })

  //number
  const [payload, setPayload] = useState({
    rankSlct: Utility.slctCode(tab.slct),
    rankType: Utility.typeCode(tab.type),
    page: 1,
    records: 150
  });

  const [paging, setPaging] = useState({
      pageNo: 1,
      pagePerCnt: 20,
      lastPage: 0
  });

  const [rankInfo, setRankInfo] = useState({list: []});
  const [topRankInfo, setTopRankInfo] = useState([]); // 실시간 랭킹 TOP3, 이전 랭킹 TOP3

  useEffect(()=>{
    setPayload({
      ...payload,
      rankSlct: Utility.slctCode(tab.slct),
      rankType: Utility.typeCode(tab.type),
    })
  },[tab])

  useEffect(() => {
    if (tab.slct === "team") {
      TeamRankFetch();  //팀랭킹
    } else if (tab.slct !== "team" && tab.type === "time") {
      DjTimeRankFetch();  //DJ 타임랭킹
    } else {
      RankFetch(payload.rankType);  //DJ, FAN, CUPID 일간, 주간,월간, 연간
    }
  }, [payload]);

  // 팀랭킹 fetch
  const TeamRankFetch = () => {
    let topRank = [];

    Api.getRankTeam().then((res) => {
      if(res.code === "00000"){
        topRank.push(Utility.addEmptyRanker(res.data.prevTop));
        topRank.push(Utility.addEmptyRanker(res.data.list.slice(0, 3)));
        setRankInfo({list: res.data.list.slice(3)});
        setPaging({
          ...paging, lastPage: Math.ceil((res.data.listCnt) / paging.pagePerCnt)
        })
      }
    });
    setTopRankInfo(topRank);
  }

  // DJ 타임랭킹 fetch
  const DjTimeRankFetch = () => {
    let topRank = [];
    const param = {
      ...payload,
      rankSlct: 1,
      rankingDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      prevRankingDate:  Utility.timeCheck()
    }

    Api.getRankTime(param).then((res)=>{
      if(res.code === "C001"){
        topRank.push(Utility.addEmptyRanker(res.data.prevTop));
        topRank.push(Utility.addEmptyRanker(res.data.list.slice(0, 3)));
        setRankInfo({list: res.data.list.slice(3)});
        setPaging({
          ...paging, lastPage: Math.ceil((res.data.listCnt) / paging.pagePerCnt)
        })
      }
    });
    setTopRankInfo(topRank);
  };

  // DJ, FAN, CUPID 일간, 주간,월간, 연간
  const RankFetch = (type) => {
    let topRank = [];
    const {rankingDate, prevRankingDate} = Utility.getSearchRankingDate(type);
    const param = {
      ...payload, rankingDate: rankingDate, prevRankingDate: prevRankingDate
    };

    Api.getRank(param).then((res)=>{
      if(res.code === "C001"){
        topRank.push(Utility.addEmptyRanker(res.data.prevTop));
        topRank.push(Utility.addEmptyRanker(res.data.list.slice(0, 3)));
        setRankInfo({list: res.data.list.slice(3)});
        setPaging({
          ...paging, lastPage: Math.ceil((res.data.listCnt) / paging.pagePerCnt)
        })
      }
    });
    setTopRankInfo(topRank);
  }

  // let list = !_.isEmpty(rankInfo) && rankInfo.list.slice(0, (paging.pageNo * paging.pagePerCnt));
  // const getScroll = () => {
  //   if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  //     if (Utility.isHitBottom() && paging.pageNo <= paging.lastPage) {
  //       setPaging({...paging, pageNo: paging.pageNo + 1})
  //     }
  //   }
  // }
  // useEffect(() => {
  //   if (typeof document !== 'undefined') {
  //     document.addEventListener('scroll', getScroll);
  //     return () => document.removeEventListener('scroll', getScroll)
  //   }
  // });

  return (
    <div id="rankingList">
      {/*헤더*/}
      <Header position={'sticky'} title={'랭킹 전체'} type={'back'}>
        <div className='buttonGroup'>
          <button className='benefits' onClick={()=>history.push({pathname: `/rank/benefit/${tab.slct}`})}>혜택</button>
        </div>
      </Header>

      {/*DJ, FAN, CUPID, TEAM 탭*/}
      <SlctTab tab={tab} setTab={setTab} setRankInfo={setRankInfo} setTopRankInfo={setTopRankInfo} setPaging={setPaging}/>

      {/*타임/일간/주간/월간/연간 탭*/}
      {payload.rankSlct !== 4 && <TypeTab tab={tab} setTab={setTab} setRankInfo={setRankInfo} setTopRankInfo={setTopRankInfo} setPaging={setPaging}/>}

      {/*랭킹리스트 TOP3, List 구성*/}
      <div className="rankingContent">
        <TopRanker data={topRankInfo} tab={tab}/>
        {payload.rankSlct !== 4 ? <RankingList data={rankInfo.list} tab={tab.type}/> : <TeamRankList data={rankInfo.list}/>}
      </div>
    </div>
  );
};

export default RankingMore;
