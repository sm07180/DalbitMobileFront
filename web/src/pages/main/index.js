import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Utility from 'components/lib/utility'
// global components
import Header from 'components/ui/header/Header'
import Navigation from 'components/ui/navigation/Navigation'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
// components
import Tabmenu from './components/Tabmenu'
import MainSlide from './components/MainSlide'
import SwiperList from './components/SwiperList'
import LiveView from './components/LiveView'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setMainData, setMainLiveList} from "redux/actions/main";
import {Context} from "context";

const topTenTabMenu = ['DJ','FAN','LOVER']
const liveTabMenu = ['전체','VIDEO','RADIO','신입DJ']
let totalPage = 1
const pagePerCnt = 20

const MainPage = () => {
  const history = useHistory()
  const context = useContext(Context);
  const headerRef = useRef()
  const overRef = useRef()
  const [topRankType, setTopRankType] = useState(topTenTabMenu[0])
  const [liveListType, setLiveListType] = useState(liveTabMenu[0])
  const [headerFixed, setHeaderFixed] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const liveList = useSelector(state => state.live);

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
        let paging = data.paging;
        if(data.paging) {
          totalPage = Math.ceil(data.paging.total / pagePerCnt)
        }else {
          paging = liveList.paging;
        }

        if (currentPage > 1) {
          const listConcat = liveList.list.concat(data.list);
          dispatch(setMainLiveList({list: listConcat, paging}));
        } else {
          dispatch(setMainLiveList({list: data.list, paging}));
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
  }, [currentPage])

  // 페이지 셋팅
  useEffect(() => {
    fetchMainInfo()
  }, [])

  useEffect(() => {
    if (currentPage > 0) fetchLiveInfo()
    document.addEventListener('scroll', scrollEvent)
    return () => document.removeEventListener('scroll', scrollEvent)
  }, [currentPage, liveListType])
 
  // 페이지 시작
  return (
    <div id="main">
      <div className={`headerWrap1 ${headerFixed === true ? 'isShow' : ''}`} ref={headerRef}>
        <Header title="메인" />
      </div>
      <section className='topSwiper'>
        <MainSlide data={mainState.topBanner} />
      </section>
      <section className='favorites' ref={overRef}>
        <SwiperList data={mainState.myStar} profImgName="profImg" />
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'} more={'rank'}>
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
        <CntTitle title={'방금 착륙한 NEW 달둥스'} more={'clip'} />
        <SwiperList data={mainState.newBjList} profImgName="bj_profileImageVo" />
      </section>
      <section className='bannerWrap'>
        <BannerSlide />
      </section>
      <section className='liveView'>
        <CntTitle title={'🚀 지금 라이브 중!'} />
        <Tabmenu data={liveTabMenu} tab={liveListType} setTab={setLiveListType} setPage={setCurrentPage} />
        <LiveView data={liveList.list} />
      </section>
    </div>
  )
}
 
export default MainPage
 