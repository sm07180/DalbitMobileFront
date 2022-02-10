import React, {useState} from 'react'

//global components
import Header from 'components/ui/header/Header'
import DataCnt from 'components/ui/dataCnt/DataCnt'

// components
import Tabmenu from '../components/Tabmenu'
import TopRanker from '../components/TopRanker'
import RankingList from '../components/RankingList'

import './clipRanking.scss'

const tabmenu = ['오늘', '이번주']

const ClipRanking = () =>{
  const [tabType, setTabType] = useState(tabmenu[0])

  return(
    <div id="clipRanking">
      <Header title={'클립 랭킹'} type={'back'} />
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      <section className="rankingContent">
        <TopRanker />
        <div className="listWrap">
          <div className="listAll">
            <span>지금 가장 인기있는 클립을 들어보세요!</span>
            <button>전체듣기<span className="iconPlayAll"></span></button>
          </div>
          <RankingList />
        </div>
      </section>
    </div>
  )
}

export default ClipRanking