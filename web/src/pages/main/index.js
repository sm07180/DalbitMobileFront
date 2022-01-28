import React, {useEffect, useState, useLayoutEffect, useRef} from 'react'
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

const topTenTabMenu = ['DJ','FAN','LOVER']
const liveTabMenu = ['전체','VIDEO','RADIO','신입DJ']
const mainLink = {
  rankingPage: 'rank'
  , clipPage: 'clip'
}

const MainPage = () => {
  const history = useHistory()
  const headerRef = useRef()
  const overRef = useRef()
  const [myStar, setMyStar] = useState([])
  const [topTenData, setTopTenData] = useState({DJ: [], FAN: [], LOVER: []});
  const [recommendList, setRecommendList] = useState([])
  const [bannerList, setBannerList] = useState([])
  const [liveList, setLiveList] = useState([])
  const [topRankType, setTopRankType] = useState(topTenTabMenu[0])
  const [liveListType, setLiveListType] = useState(liveTabMenu[0])
  const [headerFixed, setHeaderFixed] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [daldoongs, setDaldoongs] = useState([]);
 
  // 조회 API
  const fetchMainInfo = () => {
    Api.main_init_data_v2().then((res) => {
      if (res.result === 'success') {
        const data = res.data;
        console.log(data);
        setRecommendList(data.topBanner);
        setMyStar(data.myStar);
        setTopTenData({
          DJ: data.dayRanking.djRank,
          FAN: data.dayRanking.fanRank,
          LOVER: []
        });
        setBannerList(data.centerBanner);
        setDaldoongs(data.newBjList);
      }
    })
  }

  let totalPage = 1
  let pagePerCnt = 20
  const fetchLiveInfo = () => {
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
        if (res.data.paging !== undefined) {
          totalPage = Math.ceil(res.data.paging.total / pagePerCnt)
        }
        if (currentPage > 1) {
          setLiveList(liveList.concat(res.data.list))
        } else {
          setLiveList(res.data.list)
        }
      }
    })
  }

  // scroll
  const scrollEvent = () => {
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
  }

  useEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    window.addEventListener('scroll', scrollEvent)
    return () => window.removeEventListener('scroll', scrollEvent)
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
        <Header title={'메인'} />
      </div>
      <section className='topSwiper'>
        <MainSlide data={recommendList} />
      </section>
      <section className='favorites' ref={overRef}>
        <SwiperList data={myStar} profImgName="profImg" />
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'} more={mainLink['rankingPage']}>
          <Tabmenu data={topTenTabMenu} tab={topRankType} setTab={setTopRankType} />
        </CntTitle>
        <SwiperList data={topTenData[topRankType]} profImgName="profImg" />
      </section>
      <section className='daldungs'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} more={mainLink['clipPage']} />
        <SwiperList data={daldoongs} profImgName="bj_profileImageVo" />
      </section>
      <section className='bannerWrap'>
        <BannerSlide />
      </section>
      <section className='liveView'>
        <CntTitle title={'🚀 지금 라이브 중!'} />
        <Tabmenu data={liveTabMenu} tab={liveListType} setTab={setLiveListType} setPage={setCurrentPage} />
        <LiveView data={liveList} />
      </section>
      <Navigation />
    </div>
  )
}
 
export default MainPage
 