import React, {useEffect, useState, useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'

//components
import Tabmenu from './components/Tabmenu'
import MainSlide from './components/MainSlide'
import BannerSlide from './components/BannerSlide'
import SwiperList from './components/SwiperList'
import LiveView from './components/LiveView'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setMainData, setMainLiveList} from "redux/actions/main";

import {ILiveListParam} from 'redux/types/mainType';

const topTenTabMenu = ['DJ','FAN','LOVER']
const liveTabMenu = ['전체','VIDEO','RADIO','신입DJ']
const mainLink = {
  rankingPage: 'rank'
  , clipPage: 'clip'
}
let totalPage = 1
let pagePerCnt = 1

const MainPage = () => {
  const history = useHistory()
  const headerRef = useRef()
  const overRef = useRef()
  const [topTenData, setTopTenData] = useState({DJ: [], FAN: [], LOVER: []});
  const [liveList, setLiveList] = useState([])
  const [topRankType, setTopRankType] = useState(topTenTabMenu[0])
  const [liveListType, setLiveListType] = useState(liveTabMenu[0])
  const [headerFixed, setHeaderFixed] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const liveList2 = useSelector(state => state.live);

  // 조회 API
  const fetchMainInfo = () => dispatch(setMainData());

  const fetchLiveInfo = useCallback(() => {
    const params = {
      page: currentPage,
      mediaType: liveListType === 'VIDEO' ? 'v' : liveListType === 'RADIO' ? 'a' : '',
      records: pagePerCnt,
      roomType: '',
      searchType: 1,
      gender: '',
      djType: liveListType === '신입DJ' ? 3 : ''
    }
    Api.broad_list({params}).then((res) => {
      if (res.result === 'success') {
        const data = res.data;
        if (res.data.paging !== undefined) {
          totalPage = Math.ceil(data.paging.total / pagePerCnt)
        }
        if (currentPage > 1) {
          const listConcat = liveList2.list.concat(data.list);
          dispatch(setMainLiveList({list: listConcat, paging: data.paging}));
          setLiveList(liveList.concat(data.list))
        } else {
          dispatch(setMainLiveList(data.list));
          setLiveList(data.list)
        }
      }
    })
  }, [currentPage, liveListType]);

  // scroll
  const scrollEvent = useCallback(() => {
    // 탑메뉴 스크롤시 스타일 클래스 추가
    const overNode = overRef.current
    const headerNode = headerRef.current

    if (overNode && headerNode) {
      const overTop = overNode.offsetTop - headerNode.clientHeight
      if (window.scrollY >= overTop) {
        setHeaderFixed(true)
      } else {
        setHeaderFixed(false)
      }
    }

    // 스크롤시 추가 리스트
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    document.addEventListener('scroll', scrollEvent)
    return () => document.removeEventListener('scroll', scrollEvent)
  }, [currentPage])

  // 페이지 셋팅
  useEffect(() => {
    fetchMainInfo()
  }, [])

  useEffect(() => {
    if (currentPage > 0) fetchLiveInfo()
  }, [currentPage, liveListType])
 
  // 페이지 시작
  return (
    <div id="main">
      <div className={`headerWrap1 ${headerFixed === true ? 'isShow' : ''}`} ref={headerRef}>
        <Header title={'라이브'} type={'noBack'} />
      </div>
      <section className='topSwiper'>
        <MainSlide data={mainState.topBanner} />
      </section>
      <section className='favorites' ref={overRef}>
        <SwiperList data={mainState.myStar} profImgName="profImg" />
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'} more={mainLink['rankingPage']}>
          <Tabmenu data={topTenTabMenu} tab={topRankType} setTab={setTopRankType} />
        </CntTitle>
        <SwiperList
          data={topRankType === 'DJ' ? mainState.dayRanking.djRank
            : topRankType === 'FAN' ? mainState.dayRanking.fanRank
              : mainState.dayRanking.loverRank}
          profImgName="profImg"
        />
      </section>
      <section className='daldungs'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} more={mainLink['clipPage']} />
        <SwiperList data={mainState.newBjList} profImgName="bj_profileImageVo" />
      </section>
      <section className='bannerWrap'>
        <BannerSlide data={mainState.centerBanner} />
      </section>
      <section className='liveView'>
        <CntTitle title={'🚀 지금 라이브 중!'} />
        <Tabmenu data={liveTabMenu} tab={liveListType} setTab={setLiveListType} setPage={setCurrentPage} />
        <LiveView data={liveList} />
      </section>
    </div>
  )
}
 
export default MainPage
 