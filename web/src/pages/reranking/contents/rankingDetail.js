import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import PopSlide from 'components/ui/popSlide/PopSlide'

// components
import Tabmenu from '../components/Tabmenu'
import TopRanker from '../components/TopRanker'
import RankingList from '../components/RankingList'
//static
import './rankingDetail.scss'
import {convertDateTimeForamt, convertMonday, convertMonth} from "pages/common/rank/rank_fn";
import moment from "moment";

const RankDetailPage = () => {
  const params = useParams()
  let history = useHistory()
  const rankingListType = params.type

  const [rankSlct, setRankSlct] = useState(1);
  const [rankType, setRankType] = useState(1);
  //Ranking 종류 선택 팝업
  const [slidePop, setSlidePop] = useState(false);
  //Ranking 종류 Title
  const [select, setSelect] = useState("");  
  //탭 목록
  const [tabList, setTabList] = useState([]);
  //현재 선택된 탭 이름
  const [tabName, setTabName] = useState(tabList[0]);
  //랭킹 list(4위 이후)
  const [rankList, setRankList] = useState([]);
  //랭킹 List(top3)
  const [topRankList, setTopRankList] = useState([]);
  //scroll 이벤트 api 호출  flag
  const [loading, setLoading] = useState(false);
  //pageNo
  const [pageNo, setPageNo] = useState(1);
  //마지막 페이지
  const [lastPage, setLastPage] = useState(0);
  //page당 list수
  let pagePerCnt = 50;

  useEffect(() => {
    if (rankingListType === 'DJ') {
      setTabList(['타임','오늘','이번주', '이번달', '올해']);
      setTabName('오늘')
      fetchRankData(rankSlct, rankType, 1);
    } else if (rankingListType === 'FAN') {
      setTabList(['오늘','이번주', '이번달']);
      setTabName('오늘')
      fetchRankData(rankSlct, rankType, 1);
    } else if (rankingListType === 'LOVER') {
      setTabList(['오늘','이번주']);
      setTabName('오늘')
      fetchRankData(rankSlct, rankType, 1);
    }
    setSelect(rankingListType);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined"){
      document.addEventListener("scroll", scrollEvent);
    }

    return () => {
      document.removeEventListener("scroll", scrollEvent);
    }
  }, [loading, rankSlct, rankType, topRankList, rankList, pageNo, tabName, lastPage]);

  // 타임
  const fetchTimeRank = async (pageNo, date) => {
    const {result, data} = await Api.getRankTimeList({
      rankSlct: 1,
      page: pageNo,
      records: pagePerCnt,
      rankingDate: date
    });
    if (result === "success") {
      if(pageNo === 1) {
        if (data.list.length > 3){
          setRankList(data.list.slice(3));
          setTopRankList([data.list.slice(0, 3)]);
        } else {
          setTopRankList([data.list]);
          setRankList([]);
        }
        setLastPage(Math.ceil(data.paging.total / pagePerCnt))
      } else {
        setPageNo(pageNo);
        setRankList(rankList.concat(data.list));
      }
      setLoading(false);
    }
  };

  // 나머지
  const fetchRankData = async (rankSlct, rankType, pageNo) => {
    const {result, data} = await Api.get_ranking({
      param: {
        rankSlct: rankSlct,
        rankType: rankType,
        rankingDate: moment(rankType === 1 ? new Date() : rankType === 2 ? convertMonday() : rankType === 3 ? convertMonth() : new Date()).format("YYYY-MM-DD"),
        page: pageNo,
        records: pagePerCnt,
      }
    });
    if (result === "success") {
      if(pageNo === 1) {
        if (data.list.length > 3){
          setRankList(data.list.slice(3));
          setTopRankList([data.list.slice(0, 3)]);
        } else {
          setTopRankList([data.list]);
          setRankList([]);
        }
        setLastPage(Math.ceil(data.paging.total / pagePerCnt));
      } else {
        setPageNo(pageNo);
        setRankList(rankList.concat(data.list));
      }
      setLoading(false);
    }
  };

  const scrollEvent = () => {
    if (!loading){
      let scrollHeight = document.documentElement.scrollHeight;
      let scrollTop = document.documentElement.scrollTop;
      let height = document.documentElement.offsetHeight;

      if (scrollHeight - 10 <= scrollTop + height && pageNo < lastPage){
        setLoading(true);
        if (rankType === 0){
          fetchTimeRank(pageNo + 1, convertDateTimeForamt(new Date() , "-"));
        }else {
          fetchRankData(rankSlct, rankType, pageNo + 1);
        }
      }
    }
  }

  const bottomSlide = () => {
    setSlidePop(true);
  }

  const optionSelect = (e) => {
    let text = e.currentTarget.innerText;
    if(text === "DJ"){
      setSelect("DJ");
      setTabName('오늘');
      setTabList(['타임','오늘','이번주', '이번달', '올해']);
      setRankSlct(1);
      setRankType(1);
    } else if(text === "FAN") {
      setSelect("FAN");
      setTabName('오늘');
      setTabList(['오늘','이번주', '이번달']);
      setRankSlct(2);
      setRankType(1);
    } else {      
      setSelect("LOVER")
      setTabName('오늘');
      setTabList(['오늘','이번주']);
      setRankSlct(3);
      setRankType(1);
    }
    setSlidePop(false);
  }

  useEffect(() => {
    if (rankType !== 0){
      setPageNo(1);
      fetchRankData(rankSlct, rankType, 1);
    }
  }, [rankSlct, rankType]);

  useEffect(() => {
    setPageNo(1);
    if (tabName === "타임"){
      setRankType(0);
      fetchTimeRank(1, convertDateTimeForamt(new Date() , "-"));
    } else {
      setRankType(tabName === "올해" ? 4 : tabName === "이번주" ? 2 : tabName === "이번달" ? 3 : 1);
    }
  }, [tabName]);

  return (
    <div id="rankingList">
      <Header position={'sticky'} type={'back'}>
        <h1 className='title'>{select.toUpperCase()}<span className='optionSelect' onClick={bottomSlide}></span></h1>
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push("/rank/benefit")}>혜택</button>
        </div>
      </Header>
      <Tabmenu data={tabList} tab={tabName} setTab={setTabName} />
      <div className="rankingContent">
        <TopRanker data={topRankList} rankSlct={rankSlct === 1 ? "DJ" : rankSlct === 2 ? "FAN" : "LOVER"} rankType={rankType}/>
        <div className='listWrap'>
          <RankingList data={rankList} tab={select}>
          </RankingList>
        </div>
      </div>

      {slidePop &&
        <PopSlide setPopSlide={setSlidePop}>
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