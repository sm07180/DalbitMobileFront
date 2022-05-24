import React, {useEffect, useState} from 'react';

import Api from "context/api";
import moment from "moment/moment";
import {useHistory, useParams} from "react-router-dom";
import Utility from "../lib/utility";


import '../scss/RankingMore.scss';
import Header from "components/ui/header/Header";
import TopRanker from "../components/more/TopRanker";
import RankingList from "../components/more/RankList";
import TeamRankList from "../components/more/TeamRankList";

const rankSlctCode = {dj: 1, fan: 2, cupid: 3, team: 4};
const tabListInfo = {
  dj: ['타임','일간','주간', '월간', '연간'],
  fan: ['일간','주간','월간'],
  cupid: ['일간','주간'],
  team: [],
}
const rankTypeCode = {'타임': 0, '일간': 1, '주간': 2, '월간': 3, '연간': 4};

let loading = false;

const RankingMore = () => {
  const history = useHistory();
  const params = useParams();

  const [tab, setTab] = useState({
    type: params.type || 'DJ',
    date: params.date || 1,
  })

  const [pageInfo, setPageInfo] = useState({
    rankSlct: (rankSlctCode[params.type] || 1),
    rankType: (rankTypeCode[tabListInfo[params.type][0]] || 1),
    page: 1,
    records: 150
  });
  const [breakNo, setBreakNo] = useState(47); // 페이징 처리용 state
  const [rankInfo, setRankInfo] = useState({paging: {total: 0}, list: []}); // total : 총 리스트 개수, list: 4 ~ 10 위 정보
  const [topRankInfo, setTopRankInfo] = useState([]); // 실시간 랭킹 TOP3, 이전 랭킹 TOP3

  useEffect(() => {
    if (pageInfo.rankSlct === 4) {
      TeamRankFetch();  //팀랭킹
    } else if (pageInfo.rankSlct === 1 && pageInfo.rankType === 0) {
      DjTimeRankFetch();  //DJ 타임랭킹
    } else {
      RankFetch();  //DJ, FAN, CUPID 일간, 주간,월간, 연간
    }
  }, [pageInfo]);

  // 팀랭킹 fetch
  const TeamRankFetch = async () => {
    const today = getCurrentDate(2);
    const preDate = getPreDate(2);
    const params = {
      tDate: today,
      memNo: 0,
      pageNo: 1,
      pagePerCnt: 500
    };
    let topRankList = [];
    const realRank =await Api.getTeamRankWeekList(params);
    const prevRank =await Api.getTeamRankWeekList({...params, tDate: preDate, pagePerCnt: 3});
    if (realRank.code === '00000') {
      const { data } = realRank;
      topRankList.push(addEmptyRanker(data.list.slice(0, 3)));
      setRankInfo({list: data.list.slice(3), paging: { total: data.listCnt }});
    }

    if (prevRank.code === '00000' && prevRank.data.list.length > 0) {
      const { data } = prevRank;
      topRankList.push(addEmptyRanker(data.list));
    }

    setTopRankInfo(topRankList.reverse());
    loading = false;
  }

  // DJ 타임랭킹 fetch
  const DjTimeRankFetch = async () => {
    let today = moment().format('YYYY-MM-DD HH:mm:ss');
    let preDate = Utility.timeCheck();
    let topRankList = []; // 상단 탑랭킹 정보
    const realTimeRank =await Api.getRankTimeList({ rankSlct: rankSlctCode[tab.type], ...pageInfo, rankType: 1, rankingDate: today }); // 실시간 랭킹 정보
    const prevTimeRank =await Api.getRankTimeList({ rankSlct: rankSlctCode[tab.type], ...pageInfo, rankType: 1, rankingDate: preDate, page: 1, records: 3 }); // 이전 랭킹 정보

    if (realTimeRank.code === 'C001') {
      const { data } = realTimeRank;
      setRankInfo({ ...data, list: data.list.slice(3) });
      topRankList.push(addEmptyRanker(data.list.slice(0, 3)));
    }

    if (prevTimeRank.code === 'C001') {
      const { data } = prevTimeRank;
      topRankList.push(addEmptyRanker(data.list));
    } else {
      topRankList.push(addEmptyRanker([]));
    }

    setTopRankInfo(topRankList.reverse());
    loading = false;
  };

  // DJ, FAN, CUPID 일간, 주간,월간, 연간
  const RankFetch = async () => {
    const today = getCurrentDate();
    const preDate = getPreDate();
    let topRankList = []; // 상단 탑랭킹 정보
    const param = {
      ...pageInfo,
      rankingDate: today,
    }; // API 파라미터
    const realRank =await Api.get_ranking({param}); // 실시간 랭킹 정보
    const prevRank =await Api.get_ranking({param: {...param, rankingDate: preDate, records: 3}}); // 이전 회차 랭킹 정보

    if (realRank.code === 'C001') {
      const { data } = realRank;
      topRankList.push(addEmptyRanker(data.list.slice(0, 3)));
      setRankInfo({ ...data, list: data.list.slice(3) });
    }

    if (prevRank.code === 'C001') {
      const { data } = prevRank;
      topRankList.push(addEmptyRanker(data.list));
    } else {
      topRankList.push(addEmptyRanker([]));
    }

    setTopRankInfo(topRankList.reverse());
    loading = false;
  }

  // 이전 회차 날짜 파라미터 구하기
  const getPreDate = (type) => {
    let result = '';

    let rankType = type || pageInfo.rankType;

    //rankType => 0 - 타임, 1 - 일간, 2- 주간, 3- 월간, 4 - 연간
    switch (rankType) {
      case 1:
        result = moment().subtract(1, 'd').format('YYYY-MM-DD'); // 어제 날짜
        break;
      case 2:
        result = moment().startOf('isoWeek').subtract(7, 'd').day(1).format('YYYY-MM-DD'); // 지난주 월요일
        break;
      case 3:
        result = moment().subtract(1, 'months').date(1).format('YYYY-MM-DD'); // 지난달 1일
        break;
      case 4:
        result = moment().subtract(1, 'y').month(0).date(1).format('YYYY-MM-DD'); // 지난년 1월 1일
        break;
      default:
        result = moment().subtract(1, 'd').format('YYYY-MM-DD'); // 어제 날짜
        break;
    }

    return result;
  }

  // 오늘 회차 날짜 데이터 구하기
  const getCurrentDate = (type) => {
    let result = '';

    let rankType = type || pageInfo.rankType;

    //rankType => 0 - 타임, 1 - 일간, 2- 주간, 3- 월간, 4 - 연간
    switch (type) {
      case 1:
        result = moment().format('YYYY-MM-DD'); // 오늘 날짜
        break;
      case 2:
        result = moment().startOf('isoWeek').days(1).format('YYYY-MM-DD'); // 이번주 월요일
        break;
      case 3:
        result = moment().date(1).format('YYYY-MM-DD'); // 이번달 1일
        break;
      case 4:
        result = moment().month(0).date(1).format('YYYY-MM-DD'); // 이번년 1월 1일
        break;
      default:
        result = moment().format('YYYY-MM-DD'); // 오늘 날짜
        break;
    }

    return result;
  }

  // 상단 랭킹 저보 빈값 넣어주는 함수
  const addEmptyRanker = (list) => {
    let topList = list;
    for (let i = 0; i < 3 - list.length; i++){
      topList = topList.concat({isEmpty: true})
    }
    return topList;
  };

  //DJ, FAN, CUPID, TEAM 클릭릭
  const changeType = (e) => {
    const {typeTab} = e.currentTarget.dataset;
    if (!loading) {
      loading = true;
      history.replace(`/rank/list/${typeTab}/${tab.date}`)
      setTab({...tab, type: typeTab})

      setRankInfo({list: [], paging: {total: 0}});
      setTopRankInfo([]);
      setPageInfo({
        ...pageInfo,
        page: 1,
        rankSlct: rankSlctCode[typeTab],
        rankType: rankTypeCode[tabListInfo[typeTab][0]]
      });
    }
  }

  //타임/일간/주간/월간/연간 클릭
  const changeDate = (e) => {
    const {dateTab} = e.currentTarget.dataset;
    if (!loading) {
      loading = true;
      history.replace(`/rank/list/${tab.type}/${dateTab}`)
      setTab({...tab, date: dateTab})

      setBreakNo(47);
      setRankInfo({list: [], paging: {total: 0}});
      setTopRankInfo([]);
      setPageInfo({...pageInfo, page: 1, rankType: parseInt(dateTab)});
    }
  };

  const scrollEvent = () => {
    if (rankInfo.paging.total > breakNo && Utility.isHitBottom()) {
      setBreakNo(breakNo + 50);
      window.removeEventListener('scroll', scrollEvent);
    } else if (rankInfo.paging.total === breakNo) {
      window.removeEventListener('scroll', scrollEvent);
    }
  };

  useEffect(() => {
      window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    }
  }, [rankInfo, breakNo]);

  return (
    <div id="rankingList">
      {/*헤더*/}
      <Header position={'sticky'} title={'랭킹 전체'} type={'back'}>
        <div className='buttonGroup'>
          <button className='benefits' onClick={()=>history.push({pathname: `/rank/benefit/${params.type}`})}>혜택</button>
        </div>
      </Header>

      {/*DJ, FAN, CUPID, TEAM 탭*/}
      <div id="rankCategory">
        <div className="rankCategoryWrapbox">
          <div className={`rankCategoryList ${tab.type === "dj" ? "active" : ""}`} data-type-tab="dj" onClick={changeType}>DJ</div>
          <div className={`rankCategoryList ${tab.type === "fan" ? "active" : ""}`} data-type-tab="fan" onClick={changeType}>FAN</div>
          <div className={`rankCategoryList ${tab.type === "cupid" ? "active" : ""}`} data-type-tab="cupid" onClick={changeType}>CUPID</div>
          <div className={`rankCategoryList ${tab.type === "team" ? "active" : ""}`} data-type-tab="team" onClick={changeType}>TEAM</div>
          <div className="wrapboxBg"/>
          <div className="underline"/>
        </div>
      </div>

      {/*타임/일간/주간/월간/연간 탭*/}
      <div className='tabWrap'>
        <ul className="tabmenu">
          {tabListInfo[tab.type].map((menu, index) => {
            const target = rankTypeCode[menu];
            return (<li key={index} className={target === pageInfo.rankType ? 'active' : ''} data-date-tab={target} onClick={changeDate}>{menu}</li>);
          })}
        </ul>
      </div>

      {/*랭킹리스트 TOP3, List 구성*/}
      <div className="rankingContent">
        <TopRanker data={topRankInfo} rankSlct={tab.type} rankType={pageInfo.rankType}/>

        {pageInfo.rankSlct !== 4 ?
          <RankingList data={rankInfo.list} tab={tab.type} topRankList={false} breakNo={breakNo}/>
          :
          <TeamRankList data={rankInfo.list} breakNo={breakNo}/>
        }
      </div>
    </div>
  );
};

export default RankingMore;
