import React, {useEffect, useState} from 'react';

import * as cacheApi from "../lib/api"

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
import {useDispatch, useSelector} from "react-redux";
import {setCache, setPaging, setRankList, setRankTopList} from "redux/actions/rank";

const RankingMore = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const rankState = useSelector(state => state.rankCtx)

  const [tab, setTab] = useState({
    slct: params.slct || 'dj',
    type: params.type || 'time',
  })

  const [payload, setPayload] = useState({
    rankSlct: Utility.slctCode(tab.slct),
    rankType: Utility.typeCode(tab.type),
    page: 1,
    records: 150
  });

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
    cacheApi.getRankTeam(rankState.cache).then((res) => {
      if(res.data.code === "00000"){
        let topRank = [];
        topRank.push(Utility.addEmptyRanker(res.data.data.prevTop));
        topRank.push(Utility.addEmptyRanker(res.data.data.list.slice(0, 3)));
        dispatch(setRankTopList(topRank));
        dispatch(setRankList(res.data.data.list.slice(3)));
        dispatch(setPaging({
          pageNo: rankState.paging.pageNo,
          pagePerCnt: 20,
          lastPage: Math.ceil((res.data.data.listCnt) / rankState.paging.pagePerCnt)
        }));
      }
    });
  }

  // DJ 타임랭킹 fetch
  const DjTimeRankFetch = () => {
    const param = {
      ...payload,
      rankingDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      prevRankingDate: Utility.timeCheck()
    }

    cacheApi.getRankTime(param, rankState.cache).then((res)=>{
      if(res.data.code === "C001"){
        let topRank = [];
        topRank.push(Utility.addEmptyRanker(res.data.data.prevTop));
        topRank.push(Utility.addEmptyRanker(res.data.data.list.slice(0, 3)));
        dispatch(setRankTopList(topRank));
        dispatch(setRankList(res.data.data.list.slice(3)));
        dispatch(setPaging({
          pageNo: rankState.paging.pageNo,
          pagePerCnt: 20,
          lastPage: Math.ceil((res.data.data.listCnt) / rankState.paging.pagePerCnt)
        }));
      }
    });
  };

  // DJ, FAN, CUPID 일간, 주간,월간, 연간
  const RankFetch = (type) => {
    const {rankingDate, prevRankingDate} = Utility.getSearchRankingDate(type);
    const param = {...payload, rankingDate: rankingDate, prevRankingDate: prevRankingDate};

    cacheApi.getRank(param, rankState.cache).then((res)=>{
      if(res.data.code === "C001"){
        let topRank = [];
        topRank.push(Utility.addEmptyRanker(res.data.data.prevTop));
        topRank.push(Utility.addEmptyRanker(res.data.data.list.slice(0, 3)));
        dispatch(setRankTopList(topRank));
        dispatch(setRankList(res.data.data.list.slice(3)));
        dispatch(setPaging({
          pageNo: rankState.paging.pageNo,
          pagePerCnt: 20,
          lastPage: Math.ceil((res.data.data.listCnt) / rankState.paging.pagePerCnt)
        }));
      }
    });
  }

  // 스크롤 이벤트
  let list = !_.isEmpty(rankState.rankList) && rankState.rankList.slice(0, (rankState.paging.pageNo * rankState.paging.pagePerCnt));
  const getScroll = () => {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      if (Utility.isHitBottom() && rankState.paging.pageNo <= rankState.paging.lastPage) {
        dispatch(setPaging({
          pageNo: rankState.paging.pageNo+1,
          pagePerCnt: 20,
          lastPage: rankState.paging.lastPage
        }));
      }
    }
  }
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('scroll', getScroll);
      return () => document.removeEventListener('scroll', getScroll)
    }
  },[rankState.paging]);

  return (
    <div id="rankingList">
      {/*헤더*/}
      <Header position={'sticky'} title={'랭킹 전체'} type={'back'}>
        <div className='buttonGroup'>
          <button className='benefits' onClick={()=>{
            dispatch(setCache(true))
            history.push({pathname: `/rank/benefit/${tab.slct}`})
          }}>혜택</button>
        </div>
      </Header>

      {/*DJ, FAN, CUPID, TEAM 탭*/}
      <SlctTab tab={tab} setTab={setTab} setPaging={setPaging}/>

      {/*타임/일간/주간/월간/연간 탭*/}
      {payload.rankSlct !== 4 && <TypeTab tab={tab} setTab={setTab} setPaging={setPaging}/>}

      {/*랭킹리스트 TOP3, List 구성*/}
      <div className="rankingContent">
        <TopRanker data={rankState.rankTopList} tab={tab}/>
        {payload.rankSlct !== 4 ? <RankingList data={list} tab={tab}/> : <TeamRankList data={list}/>}
      </div>
    </div>
  );
};

export default RankingMore;
