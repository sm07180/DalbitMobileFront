import React, {useEffect, useState} from 'react';
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

const tabmenu = ['오늘', '이번주']

const ClipRanking = () => {
  const [tabType, setTabType] = useState(tabmenu[0])
  const [rankList1,setRankList1] = useState([])
  const [rankList2,setRankList2] = useState([])


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
      setRankList1(data.list);
      setRankList2(data.list);
    } else {
      console.log(message);
    }
  }

  useEffect(() => {
    fetchRankData('2','1','2022-02-11');
  },[])

  return(
    <div id="clipRanking">
      <Header title='클립 랭킹' type='back' />
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      {tabType === tabmenu[0] && 
        <TopRanker data={rankList1} />
      }
      {tabType === tabmenu[1] && 
        <TopRanker data={rankList2} />
      }
      <section className="listWrap">
        <div className="listAll">
          <span>지금 가장 인기있는 클립을 들어보세요!</span>
          <button>전체듣기<span className="iconPlayAll"></span></button>
        </div>
        {tabType === tabmenu[0] && 
          <RankingList data={rankList1} />
        }
        {tabType === tabmenu[1] && 
          <RankingList data={rankList2} />
        }
      </section>
    </div>
  )
}

export default ClipRanking