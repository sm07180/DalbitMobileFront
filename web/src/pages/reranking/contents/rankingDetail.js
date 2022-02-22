import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import PopSlide from 'components/ui/popSlide/PopSlide'

// components
import Tabmenu from '../components/Tabmenu'
import TopRanker from '../components/TopRanker'
import RankingList from '../components/rankingList'
//static
import './rankingDetail.scss'
import {convertDateTimeForamt, convertMonday, convertMonth} from "pages/common/rank/rank_fn";
import moment from "moment";

const RankDetailPage = () => {
  const params = useParams()
  let history = useHistory()
  const rankingListType = params.type
  //Ranking 종류(DJ, FAN, CUPID)
  const [rankSlct, setRankSlct] = useState(rankingListType === "DJ" ? 1 : rankingListType === "FAN" ? 2 : 3);
  //Ranking 기간(타임, 일간 등등)
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
    } else if (rankingListType === 'FAN') {
      setTabList(['오늘','이번주', '이번달']);
      setTabName('오늘')
    } else if (rankingListType === 'CUPID') {
      setTabList(['오늘','이번주']);
      setTabName('오늘')
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
        if(data.paging) {
          setLastPage(Math.ceil(data.paging.total / pagePerCnt));
        }

        let curHour = new Date().getHours();
        let prev = getTopRankDate(5, date);
        let doublePrev = getTopRankDate(5, prev);
        if (curHour >= 19){
          Promise.all([fetchTimeRankTop3(prev), fetchTimeRankTop3(doublePrev)]).then(([prevTwo, prevOne]) => {
            if (prevTwo.result === "success" && prevOne.result === "success"){
              if (data.list.length > 3){
                setRankList(data.list.slice(3));
                setTopRankList([data.list.slice(0, 3), addEmptyRanker(prevTwo.data.list), addEmptyRanker(prevOne.data.list)].reverse());
              } else {
                setTopRankList([addEmptyRanker(data.list), addEmptyRanker(prevTwo.data.list), addEmptyRanker(prevOne.data.list)].reverse());
                setRankList([]);
              }
            }
          })
        } else if (curHour >= 10){
          fetchTimeRankTop3(prev).then(res => {
            if (res.result === "success"){
              if (data.list.length > 3){
                setRankList(data.list.slice(3));
                setTopRankList([data.list.slice(0, 3), addEmptyRanker(res.data.list)].reverse());
              } else {
                setTopRankList([addEmptyRanker(data.list), addEmptyRanker(res.data.list)].reverse());
                setRankList([]);
              }
            }
          });
        } else{
          if (data.list.length > 3){
            setRankList(data.list.slice(3));
            setTopRankList([data.list.slice(0, 3)].reverse());
          } else {
            setTopRankList([addEmptyRanker(data.list)].reverse());
            setRankList([]);
          }
        }
      } else {
        setPageNo(pageNo);
        setRankList(rankList.concat(data.list));
      }
      setLoading(false);
    }
  };

  // 나머지
  const fetchRankData = async (rankSlct, rankType, pageNo) => {
    let curDate = new Date();
    const {result, data} = await Api.get_ranking({
      param: {
        rankSlct: rankSlct,
        rankType: rankType,
        rankingDate: moment(rankType === 1 ? curDate : rankType === 2 ? convertMonday() : rankType === 3 ? convertMonth() : curDate).format("YYYY-MM-DD"),
        page: pageNo,
        records: pagePerCnt,
      }
    });
    if (result === "success") {
      if(pageNo === 1) {
        if(data.paging){
          setLastPage(Math.ceil(data.paging.total / pagePerCnt));
        }
        let prevTop = fetchRankDataTop3(rankSlct, rankType, moment(rankType === 1 ? curDate : rankType === 2 ? convertMonday() : rankType === 3 ? convertMonth() : curDate).format("YYYY-MM-DD"));

          prevTop.then((prevData) => {
            if (prevData.result === "success"){
              if (data.list.length > 3){
                setRankList(data.list.slice(3));
                setTopRankList([data.list.slice(0, 3), addEmptyRanker(prevData.data.list)].reverse());
              } else {
                let todayList = addEmptyRanker(data.list);
                let prevList = addEmptyRanker(prevData.data.list);
                setTopRankList([todayList, prevList].reverse());
                setRankList([]);
              }
            }
          });
      } else {
        setPageNo(pageNo);
        setRankList(rankList.concat(data.list));
      }
      setLoading(false);
    }
  };

  const addEmptyRanker = (list) => {
    let topList = list;
    for (let i = 0; i < 3 - list.length; i++){
      topList = topList.concat({isEmpty: true})
    }
    return topList;
  }

  const fetchRankDataTop3 = async (rankSlct, rankType, selectDate) => {
    let prevDate = getTopRankDate(rankType, selectDate);
    return await Api.get_ranking({
      param: {
        rankSlct: rankSlct,
        rankType: rankType,
        rankingDate: moment(prevDate).format("YYYY-MM-DD"),
        page: 1,
        records: 3,
      }
    });
  };

  const fetchTimeRankTop3 = async (prevDate) => {
    return await Api.getRankTimeList({
      rankSlct: 1,
      page: 1,
      records: 3,
      rankingDate: convertDateTimeForamt(prevDate , "-")
    });
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
      setSelect("CUPID")
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

  const getTopRankDate = (dateType, currentDate) => {
    let day1 = new Date(moment(currentDate));
    let year = day1.getFullYear();
    let month = day1.getMonth() + 1;
    let date = day1.getDate();

    let hours = day1.getHours();
    let handle;
    switch (dateType) {
      case 1:
        handle = new Date(day1.setDate(day1.getDate() - 1));
        break;
      case 2:
        handle = new Date(day1.setDate(day1.getDate() - 7));
        break;
      case 3:
        if (month === 1) {
          handle = new Date(`${year - 1}-12-01`);
        } else {
          month -= 1;
          if (month < 10) {
            month = `0${month}`;
          }
          handle = new Date(`${year}-${month}-01`);
        }
        break;
      case 4:
        handle = new Date(day1.setFullYear(day1.getFullYear() - 1));
        break;
      case 5:
        if (hours < 10) {
          handle = new Date(day1.setDate(day1.getDate() - 1));

          handle = new Date(handle.getFullYear(), handle.getMonth(), handle.getDate(), 19, 0, 0);
          // handle = new Date(`${handle2.getFullYear()}-${handle2.getMonth() + 1}-${handle2.getDate()}T19:00:00`)

          // alert(handle)
        } else if (hours >= 10 && hours < 19) {
          handle = new Date(year, month - 1, date, 0, 0, 0);

          // handle = new Date(`${year}-${month}-${date}T00:00:00`)
        } else if (hours >= 19) {
          handle = new Date(year, month - 1, date, 10, 0, 0);
          // handle = new Date(`${year}-${month}-${date}T10:00:00`)
        }
        break;
    }
    return handle;
  }

  return (
    <div id="rankingList">
      <Header position={'sticky'} type={'back'}>
        <h1 className='title' onClick={bottomSlide}>{select.toUpperCase()}<span className='optionSelect'></span></h1>
        <div className='buttonGroup'>
          <button className='benefits' onClick={() => history.push("/rankBenefit")}>혜택</button>
        </div>
      </Header>
      <Tabmenu data={tabList} tab={tabName} setTab={setTabName} />
      <div className="rankingContent">
        <TopRanker data={topRankList} rankSlct={rankSlct === 1 ? "DJ" : rankSlct === 2 ? "FAN" : "CUPID"} rankType={rankType}/>
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
            <div className={`selectOption ${select === "CUPID" ? "active" : ""}`} onClick={optionSelect}>CUPID</div>
          </div>
        </PopSlide>
      }
    </div>
  )
}

export default RankDetailPage