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
import {array} from "@storybook/addon-knobs";
import {ClipPlayFn} from "pages/clip/components/clip_play_fn";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import {NewClipPlayerJoin} from "common/audio/clip_func";
import NoResult from "components/ui/noResult/NoResult";

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

  const playList = (e) => {
    e.preventDefault();
    const { clipNo, type } = e.currentTarget.dataset;
    let tempType = type;
    if (type === undefined) tempType = 1;
    if (rankClipInfo.list.length > 0) {
      const clipParam = { clipNo: clipNo, gtx: context, history, type: 'all' };
      let playListInfoData = {
        ...searchInfo,
        rankingDate: (tempType == 0 ? moment(searchInfo.rankingDate).subtract((searchInfo.rankType === 1 ? 1 : 7), 'days').format('YYYY-MM-DD') : searchInfo.rankingDate)
      }
      sessionStorage.setItem("clipPlayListInfo", JSON.stringify(playListInfoData));
      NewClipPlayerJoin(clipParam);
    }
  };

  useEffect(() => {
    getRankInfo();
  },[searchInfo])

  return (
    <div id="clipRanking">
      <Header title='클립 랭킹' type='back' />
      <Tabmenu tabList={tabmenu} targetIndex={searchInfo.rankType - 1} changeAction={handleTabmenu}/>
      <div className='rankingContent'>
        {rankClipInfo.topInfo.length > 0 && <TopRanker data={rankClipInfo.topInfo} playAction={playList}/>}
        {rankClipInfo.paging.total > 3 ?
          <>
            <section className="listWrap">
              <div className="listAll">
                <span>지금 가장 인기있는 클립을 들어보세요!</span>
                <button data-clip-no={rankClipInfo.topInfo[1].list[0].clipNo} onClick={playList}>전체듣기<span className="iconPlayAll"/></button>
              </div>
              <RankingList data={rankClipInfo.list} playAction={playList}/>
            </section>
          </>
          :
          <NoResult/>
        }
      </div>      
    </div>
  );
};

export default ClipRanking;