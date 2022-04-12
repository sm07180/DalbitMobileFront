import React, {useContext, useEffect, useState} from 'react';
import Swiper from 'react-id-swiper'

import Api from 'context/api'
//global components
import Header from 'components/ui/header/Header'
import DataCnt from 'components/ui/dataCnt/DataCnt'

// components
import Tabmenu from '../../components/Tabmenu'
import TopRanker from '../../components/TopRanker'
import RankingList from '../../components/RankingList'

import './clipRanking.scss'
import moment from "moment";
import {playClip} from "pages/clip/components/clip_play_fn";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import NoResult from "components/ui/noResult/NoResult";
import {isHybrid} from "context/hybrid";

const ClipRanking = () => {
  const tabmenu = ['오늘', '이번주'];
  const context = useContext(Context);
  const history = useHistory();
  const [ rankClipInfo, setRankClipInfo ] = useState({ list: [], paging: {}, topInfo: [] });
  const [ searchInfo, setSearchInfo ] = useState( { rankType: 1, rankingDate: moment().format('YYYY-MM-DD'), page: 1, records: 100});
  const [ breakNo, setBreakNo ] = useState(47);

  const getRankInfo = async () => {
    if (rankClipInfo.list.length > 0) {
      setRankClipInfo({ list: [], paging: {}, topInfo: [] });
    }

    const todayInfo = await Api.getClipRankingList({ ...searchInfo, })
    const yesterdayInfo = await Api.getClipRankingList({ ...searchInfo, rankingDate: moment(searchInfo.rankingDate).subtract((searchInfo.rankType === 1 ? 1 : 7), 'days').format('YYYY-MM-DD'), records: 3 });
    let topInfo = [];

    if ( yesterdayInfo.code === 'C001' && yesterdayInfo.data.paging.total > 0 ) {
      topInfo.push({ title: searchInfo.rankType === 1 ? '어제' : '저번주', list: yesterdayInfo.data.list })
    }

    if ( todayInfo.code === 'C001' && todayInfo.data.paging.total > 0 ) {
      topInfo.push({ title: searchInfo.rankType === 1 ? '오늘' : '이번주', list: todayInfo.data.list.slice(0, 3) })
    }

    setRankClipInfo({ list: todayInfo.data.list.slice(3), paging: todayInfo.data.paging, topInfo});
  }

  const handleTabmenu = (value) => {
    const targetType = parseInt(value) + 1;
    let targetDate = targetType !== 1 ? moment().day(1).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    window.scrollTo(0, 0);
    setSearchInfo({ ...searchInfo, rankType: targetType, rankingDate: targetDate });
  };

  /*
   클립 랭킹 재생목록 정책 #7867
   어제의 TOP3 재생: 어제 1,2,3 + 오늘 1,2,3 + 오늘 4위~
   오늘의 TOP3 재생, 오늘 4위~ 재생, 오늘 탭 전체듣기: 오늘 1,2,3 + 오늘 4위~
   지난주의 TOP3 재생: 지난주 1,2,3 + 이번주 1,2,3 + 이번주 4위~
   이번주의 TOP3 재생, 이번주 4위~ 재생, 이번주 탭 전체듣기: 이번주 1,2,3 + 이번주 4위~
  */
  const getPlayList = (playType) => {
    // playType = "today" | "yesterday" | "thisWeek" | "lastWeek"
    // 1~3위
    const top3List = () => {
      switch (playType) {
        case 'today':
        case 'thisWeek':
          return rankClipInfo.topInfo[1] ? rankClipInfo.topInfo[1].list : rankClipInfo.topInfo[0]?.list;
        case 'yesterday':
        case 'lastWeek':
          return rankClipInfo.topInfo[1] ? [...rankClipInfo.topInfo[0].list, ... rankClipInfo.topInfo[1].list] : rankClipInfo.topInfo[0].list;
        default:
          return rankClipInfo.topInfo[1] ? rankClipInfo.topInfo[1].list : rankClipInfo.topInfo[0]?.list;
      }
    }

    // 4위 ~
    const otherList = () => {
      return rankClipInfo.list;
    }

    return [...top3List(), ...otherList()];
  }

  const clipPlayHandler = (e, playType="default") => {
    // playType = "today" | "yesterday" | "thisWeek" | "lastWeek" | "default"
    e.preventDefault();
    const { clipNo, type } = e.currentTarget.dataset;
    let tempType = type;
    if (type === undefined) tempType = 1;
    // 0: 어제 + 오늘, 1: 오늘, 2: 저번주 + 이번주, 3: 이번주
    const callType = playType === 'yesterday' ? '0' : playType === 'today' ? '1' : playType === 'lastWeek' ? '2' : playType === 'thisWeek' ? '3' : '1';
    let playListInfoData = {
      ...searchInfo,
      rankingDate: (tempType == 0 ? moment(searchInfo.rankingDate).subtract((searchInfo.rankType === 1 ? 1 : 7), 'days').format('YYYY-MM-DD') : searchInfo.rankingDate),
      callType,
      type: 'setting'
    }

    Api.getClipRankCombineList({rankType: searchInfo.rankType, callType}).then(res => {
      const playList = res.data.list;
      const clipParam = { clipNo, playList, context, history, playListInfoData };
      playClip(clipParam);
    })
  };

  useEffect(() => {
    getRankInfo();
  },[searchInfo])

  return (
    <div id="clipRanking">
      <Header title='클립 랭킹' type='back' />
      <Tabmenu tabList={tabmenu} targetIndex={searchInfo.rankType - 1} changeAction={handleTabmenu}/>
      <div className='rankingContent'>
        {rankClipInfo.topInfo.length > 0 && <TopRanker data={rankClipInfo.topInfo} clipPlayHandler={clipPlayHandler}/>}
        {rankClipInfo.paging.total > 3 ?
          <>
            <section className="listWrap">
              <div className="listAll">
                <span>지금 가장 인기있는 클립을 들어보세요!</span>
                <button data-clip-no={rankClipInfo.topInfo[1] ? rankClipInfo.topInfo[1].list[0].clipNo : rankClipInfo.topInfo[0]?.list[0].clipNo}
                        onClick={clipPlayHandler}>전체듣기<span className="iconPlayAll"/>
                </button>
              </div>
              <RankingList data={rankClipInfo.list} playAction={clipPlayHandler}/>
            </section>
          </>
          :
          <NoResult ment="클립 랭킹 순위가 만들어지고 있어요." />
        }
      </div>      
    </div>
  );
};

export default ClipRanking;