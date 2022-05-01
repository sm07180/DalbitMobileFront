import React, { useState, useEffect } from 'react';

import './rankingDetail.scss';
import Header from "components/ui/header/Header";
import Tabmenu from "pages/reranking/components/Tabmenu";
import TopRanker from "pages/reranking/components/TopRanker";
import RankingList from "pages/reranking/components/rankingList";
import TeamRankList from "pages/reranking/components/TeamRankList";
import PopSlide, {closePopup} from "components/ui/popSlide/PopSlide";
import Api from "context/api";
import moment from "moment/moment";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import Utility from "components/lib/utility";

const rankSlctCode = {
  DJ: 1,
  FAN: 2,
  CUPID: 3,
  TEAM: 4,
};

const tabListInfo = {
  DJ: ['타임','일간','주간', '월간', '연간'],
  FAN: ['일간','주간','월간'],
  CUPID: ['일간','주간'],
  TEAM: [],
}

const rankTypeCode = {
  '타임': 0,
  '일간': 1,
  '주간': 2,
  '월간': 3,
  '연간': 4
};

let loading = false;

const RankListPage = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();
  const commonPopup = useSelector(state => state.popup);
  const params = useParams();
  // rankType => 0 - 타임, 1 - 일간, 2- 주간, 3- 월간, 4 - 연간
  // rankSlct => 1 - DJ, 2 - FAN, 3 - CUPID, 4 - TEAM
  const [ pageInfo, setPageInfo ] = useState({ rankSlct: (rankSlctCode[params.type] || 1), rankType: (rankTypeCode[tabListInfo[params.type][0]] || 1), page: 1, records: 150 });
  const [ breakNo, setBreakNo ] = useState(47); // 페이징 처리용 state
  const [ tabType, setTabType ] = useState(params.type || 'DJ');
  const [ rankInfo, setRankInfo ] = useState( { paging: { total: 0 }, list: [] }); // total : 총 리스트 개수, list: 4 ~ 10 위 정보
  const [ topRankInfo, setTopRankInfo ] = useState([]); // 실시간 랭킹 TOP3, 이전 랭킹 TOP3
  
  // 혜택 페이지 이동
  const goRankReward = () => {
    history.push("/rankBenefit");
  };

  // 이전 타임 정보 가져오기
  const timeCheck = () => {
    let result = '';
    // 1회차일 경우, 어제 3회차
    if (moment().hour() < 10) {
      result = moment().subtract(1, 'days').hour('19').minute('00').second('00').format('YYYY-MM-DD HH:mm:ss');
    // 2회차일 경우, 오늘 1회차
    }  else if (moment().hour() >= 10 && moment().hour() < 19) {
      result = moment().hour('00').minute('00').second('00').format('YYYY-MM-DD HH:mm:ss');
    // 3회차일 경우, 오늘 2회차
    } else {
      result = moment().hour('10').minute('00').second('00').format('YYYY-MM-DD HH:mm:ss');
    }

    return result;
  }

  // DJ 타임 랭킹 가져오기
  const getDjTimeRank = async () => {
    let today = moment().format('YYYY-MM-DD HH:mm:ss');
    let preDate = timeCheck();
    let topRankList = []; // 상단 탑랭킹 정보
    const realTimeRank = await Api.getRankTimeList({ rankSlct: rankSlctCode[tabType], ...pageInfo, rankType: 1, rankingDate: today }); // 실시간 랭킹 정보
    const prevTimeRank = await Api.getRankTimeList({ rankSlct: rankSlctCode[tabType], ...pageInfo, rankType: 1, rankingDate: preDate, page: 1, records: 3 }); // 이전 랭킹 정보

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
  
  // DJ(타임 제외), FAN, CUPID 랭킹 정보 가져오기
  const getRankList = async () => {
    const today = getCurrentDate();
    const preDate = getPreDate();
    let topRankList = []; // 상단 탑랭킹 정보
    const param = {
      ...pageInfo,
      rankingDate: today,
    }; // API 파라미터
    const realRank = await Api.get_ranking({param}); // 실시간 랭킹 정보
    const prevRank = await Api.get_ranking({param: {...param, rankingDate: preDate, records: 3}}); // 이전 회차 랭킹 정보


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

  // TEAM 랭킹 정보 가져오기
  const getTeamRankList = async () => {
    const today = getCurrentDate(2);
    const preDate = getPreDate(2);
    const params = {
      tDate: today,
      memNo: 0,
      pageNo: 1,
      pagePerCnt: 500
    };
    let topRankList = [];
    const realRank = await Api.getTeamRankWeekList(params);
    const prevRank = await Api.getTeamRankWeekList({...params, tDate: preDate, pagePerCnt: 3});
    if (realRank.code === '00000') {
      const { data } = realRank;
      topRankList.push(addEmptyRanker(data.list.slice(0, 3)));
      setRankInfo({list: data.list.slice(3), paging: { total: data.listCnt }});
    }

    if (prevRank.code === '00000' && prevRank.data.list > 0) {
      const { data } = prevRank;
      topRankList.push(addEmptyRanker(data.list));
    }

    setTopRankInfo(topRankList.reverse());
    loading = false;
  }

  // 상단 랭킹 저보 빈값 넣어주는 함수
  const addEmptyRanker = (list) => {
    let topList = list;
    for (let i = 0; i < 3 - list.length; i++){
      topList = topList.concat({isEmpty: true})
    }
    return topList;
  };
  
  const changeTab = (e) => {
    const { targetTab } = e.currentTarget.dataset;

    if (targetTab !== undefined && rankSlctCode.hasOwnProperty(targetTab) && !loading) {
      loading = true;
      history.replace(`/rankDetail/${targetTab}`); // 뒤로가기 했을경우를 대비해 링크만 바꿔준다.
      setRankInfo({list: [], paging: {total: 0}});
      setTopRankInfo([]);
      setPageInfo({...pageInfo, page: 1, rankSlct: rankSlctCode[targetTab], rankType: rankTypeCode[tabListInfo[targetTab][0]] });
      setTabType(targetTab);
    }
  }

  const subTabClick = (e) => {
    const { subMenu } = e.currentTarget.dataset;

    if (subMenu !== undefined && !loading) {
      loading = true;
      setRankInfo({list: [], paging: {total: 0}});
      setTopRankInfo([]);
      setBreakNo(47);
      setPageInfo({...pageInfo, page: 1, rankType: parseInt(subMenu)});
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
    if (pageInfo.rankSlct === 4) {
      getTeamRankList();
    } else if (pageInfo.rankSlct === 1 && pageInfo.rankType === 0) {
      getDjTimeRank();
    } else {
      getRankList();
    }
  }, [pageInfo]);

  useEffect(() => {
      window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    }
  }, [rankInfo, breakNo]);

  return (
    <div id="rankingList">
      <Header position={'sticky'} title={'랭킹 전체'} type={'back'}>
        <div className='buttonGroup'>
          <button className='benefits' onClick={goRankReward}>혜택</button>
        </div>
      </Header>
      <div id="rankCategory">
        <div className="rankCategoryWrapbox">
          <div className={`rankCategoryList ${tabType === "DJ" ? "active" : ""}`} data-target-tab="DJ" onClick={changeTab}>DJ</div>
          <div className={`rankCategoryList ${tabType === "FAN" ? "active" : ""}`} data-target-tab="FAN" onClick={changeTab}>FAN</div>
          <div className={`rankCategoryList ${tabType === "CUPID" ? "active" : ""}`} data-target-tab="CUPID" onClick={changeTab}>CUPID</div>
          <div className={`rankCategoryList ${tabType === "TEAM" ? "active" : ""}`} data-target-tab="TEAM" onClick={changeTab}>TEAM</div>
          <div className="wrapboxBg"/>
          <div className="underline"/>
        </div>
      </div>
      <div className='tabWrap'>
        <ul className="tabmenu">
          {tabListInfo[tabType].map((menu, index) => {
            const target = rankTypeCode[menu];
            return (<li key={index} className={target === pageInfo.rankType ? 'active' : ''} data-sub-menu={target} onClick={subTabClick}>{menu}</li>);
          })}
        </ul>
      </div>
      <div className="rankingContent">
        <TopRanker data={topRankInfo} rankSlct={tabType} rankType={pageInfo.rankType}/>
        {/* 데이터 뿌려주는 키값이 TEAM 랭킹은 기존 랭킹과 상이하기 때문에 컴포넌트 새로 만듬 */}
        {pageInfo.rankSlct !== 4 ?
          <>
            <div className='listWrap'>
              <RankingList data={rankInfo.list} tab={tabType} topRankList={false} breakNo={breakNo}/>
            </div>
          </>
          :
          <>
            <TeamRankList data={rankInfo.list} breakNo={breakNo}/>
          </>
        }
      </div>
    </div>
  );
};

export default RankListPage;