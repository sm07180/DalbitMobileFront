import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Api from 'context/api'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import moment from 'moment';

// global components
import Swiper from 'react-id-swiper'
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
// components
import ClipSubTitle from '../clip/components/ClipSubTitle'
import HotClipList from '../clip/components/HotClipList'
import SwiperList from '../clip/components/SwiperList'
import NowClipList from '../clip/components/NowClipList'
// contents
import ClipDetail from '../clip/components/clipDetail'


import './style.scss'
import HotClip from "pages/clip/components/HotClip";

const ClipPage = () => {
  const context = useContext(Context);

  const [popularClipInfo, setPopularClipInfo] = useState([])
  const [newClipInfo, setNewClipInfo] = useState([])
  const [hotClipInfo, setHotClipInfo] = useState({})

  const [detail, setDetail] = useState(false)

  // 조회 Api
  /* 핫 클립 */
  const fetchHotClipInfo = () => {
    Api.getClipRankingList({
      rankType: 1,
      rankingDate: convertDateFormat(new Date(), 'YYYY-MM-DD'),
      page: 1,
      records: 20
    }).then((res) => {
      if (res.result === 'success') {
        setHotClipInfo(res.data.list.slice(0,9))
      }
    })
  }
  /* 최신 클립 */
  const fetchNewClipInfo = () => {
    Api.getLatestList({}).then((res) => {
      if (res.result === 'success') {
        setNewClipInfo(res.data.list)
      }
    })
  }
  /* 인기 클립 */
  const fetchPopularClipInfo = () => {
    Api.getPopularList({}).then((res) => {
      if (res.result === 'success') {
        setPopularClipInfo(res.data.list)
      }
    })
  }

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  useEffect(() => {
    fetchHotClipInfo()
    fetchPopularClipInfo()
    fetchNewClipInfo()
  },[])

  const likeSubjectLists = [
    {
      icon : '🎵',
      name : '전체보기'
    },
    {
      icon : '🎤',
      name : '커버/노래'
    },
    {
      icon : '🌱',
      name : '힐링'
    },
    {
      icon : '🎼',
      name : '작사/작곡'
    },
    {
      icon : '🤧',
      name : '고민/사연'
    },
    {
      icon : '💃',
      name : '성우'
    },
    {
      icon : '📺',
      name : '더빙'
    },
    {
      icon : '😄',
      name : '수다/대화'
    },
    {
      icon : '🎧',
      name : 'ASMR'
    },
  ]
  
  return (
    <>
    {detail === false &&
    <div id="clipPage">
      <Header title={'클립'} />
      {hotClipInfo && hotClipInfo.length > 0 && 
        <section className='hotClipWrap'>
          <CntTitle title={'지금, 핫한 클립을 한눈에!'} more={'/'} />
          <HotClipList data={hotClipInfo} />
        </section>
      }
      <div>
        <HotClip/>
      </div>
      <section className='bannerWrap'>
        <Swiper {...swiperParams}>
          <div className="bannerBox">
            <div className="bannerItem"/>
          </div>
          <div className="bannerBox">
            <div className="bannerItem"/>
          </div>
        </Swiper>
      </section>
      <section className="clipDrawer">
        <CntTitle title={`${context.profile.nickNm}님의 클립서랍`} />
        <ClipSubTitle title={'최근 들은 클립'} more={'/clip/detail'} />
        <SwiperList data={newClipInfo} />
        <ClipSubTitle title={'좋아요 한 클립'} more={'/'}/>
        <SwiperList data={newClipInfo} />
      </section>
      <section className="nowClipWrap">
        <CntTitle title={'방금 떠오른 클립'} more={'/'} />
        <NowClipList data={hotClipInfo} />
      </section>
      <section className='likeSubWrap'>
        <CntTitle title={'좋아하는 주제를 골라볼까요?'} more={'/'} />
        <Swiper {...swiperParams}>
          {likeSubjectLists.map((list, index)=>{
            return(
              <div className="likeSubWrap" key={index}>
                <div className="likeSub">
                  <p>{list.icon}</p>
                  <p>{list.name}</p>
                </div>
              </div>
            )
          })}
        </Swiper>
      </section>
      <section className="clipList">
        <CntTitle title={'고민 / 사연 은 어떠세요?'}>
          <button>새로고침</button>
        </CntTitle>
        <SwiperList data={newClipInfo} />
      </section>
    </div>
    }
    {detail === true &&
    <ClipDetail data={popularClipInfo} />
    }
    </>
  );
}

export default ClipPage;