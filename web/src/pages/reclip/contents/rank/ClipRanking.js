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

const ClipRanking = () => {
  const tabmenu = ['오늘', '이번주'];
  const context = useContext(Context);
  const history = useHistory();
  const [ rankClipInfo, setRankClipInfo ] = useState({ list: [], paging: {}, topInfo: [] });
  const [ searchInfo, setSearchInfo ] = useState( { rankType: 1, rankingDate: moment().format('YYYY-MM-DD'), page: 1, records: 50});

  const getRankInfo = async () => {
    if (rankClipInfo.list.length > 0) {
      setRankClipInfo({ list: [], paging: {}, topInfo: [] });
    }

    const todayInfo = await Api.getClipRankingList({ ...searchInfo, })
    const yesterdayInfo = await Api.getClipRankingList({ ...searchInfo, rankingDate: moment().subtract(1, 'days').format('YYYY-MM-DD'), records: 3 });
    let topInfo = [];

    if ( yesterdayInfo.result === 'success' && yesterdayInfo.code === 'C001' ) {
      topInfo.push({ title: searchInfo.rankType === 1 ? '어제' : '저번주', list: yesterdayInfo.data.list })
    }

    if ( todayInfo.result === 'success' && todayInfo.code === 'C001' ) {
      topInfo.push({ title: searchInfo.rankType === 1 ? '오늘' : '이번주', list: todayInfo.data.list.slice(0, 3) })
    }

    setRankClipInfo({ list: todayInfo.data.list.slice(3), paging: todayInfo.data.paging, topInfo});
  }

  const handleTabmenu = (value) => {
    setSearchInfo({ ...searchInfo, rankType: (parseInt(value) + 1) });
  };

  const playList = (e) => {
    e.preventDefault();
    if (rankClipInfo.list.length > 0) {
      const clipParam = { clipNo: rankClipInfo.list[0].clipNo, gtx: context, history, type: 'all' };
      NewClipPlayerJoin(clipParam);
      context.action.updateDateState(searchInfo.rankingDate);
    }
  };

  useEffect(() => {
    getRankInfo();
  },[searchInfo])

  return (
    <div id="clipRanking">
      <Header title='클립 랭킹' type='back' />
      <Tabmenu tabList={tabmenu} targetIndex={searchInfo.rankType - 1} changeAction={handleTabmenu}/>
      {rankClipInfo.topInfo.length > 0 && <TopRanker data={rankClipInfo.topInfo} />}
      <section className="listWrap">
        <div className="listAll">
          <span>지금 가장 인기있는 클립을 들어보세요!</span>
          <button onClick={playList}>전체듣기<span className="iconPlayAll"/></button>
        </div>
        <RankingList data={rankClipInfo.list} />
      </section>
    </div>
  );
};

export default ClipRanking