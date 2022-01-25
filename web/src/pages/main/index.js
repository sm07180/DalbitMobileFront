import React, {useEffect, useState, useLayoutEffect, useRef} from 'react'
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

const topTabmenu = ['DJ','FAN','LOVER']
const liveTabmenu = ['전체','VIDEO','RADIO','신입DJ']

const MainPage = () => {
  const history = useHistory()
  const headerRef = useRef()
  const overRef = useRef()
  const [myStar, setMyStar] = useState([])
  const [djRank, setDjRank] = useState([])
  const [fanRank, setFanRank] = useState([])
  const [recommendList, setRecommendList] = useState([])
  const [bannerList, setBannerList] = useState([])
  const [liveList, setLiveList] = useState([])
  const [topRankType, setTopRankType] = useState(topTabmenu[0])
  const [liveListType, setLiveListType] = useState(liveTabmenu[0])
  const [headerFixed, setHeaderFixed] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
 
  // 조회 API
  const fetchMainInfo = () => {
    Api.main_init_data().then((res) => {
      if (res.result === 'success') {
        setMyStar(res.data.myStar)
        setDjRank(res.data.djRank)
        setFanRank(res.data.fanRank)
        setRecommendList(res.data.recommend)
      }
    })
  }

  const fetchBannerInfo = (value) => {
    Api.getBanner({params: {position: value}}).then((res) => {
      if (res.result === 'success') {
        setBannerList(res.data)
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
    fetchBannerInfo('9')
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
        <MainSlide data={recommendList} />
      </section>
      <section className='favorites' ref={overRef}>
        <SwiperList data={myStar} />
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'} more={'rank'}>
          <Tabmenu data={topTabmenu} tab={topRankType} setTab={setTopRankType} />
        </CntTitle>
        {topTabmenu.map((tabmenu, index) => {
          const param = {
            initData: topRankType === topTabmenu[0] ? djRank : topRankType === topTabmenu[1] ? fanRank : topRankType === topTabmenu[2] ? djRank : ''
          }
          return (
            <React.Fragment key={index}>
              {tabmenu === topRankType &&
                <SwiperList data={param.initData} />
              }
            </React.Fragment>
          )
        })}
      </section>
      <section className='daldungs'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} more={'clip'} />
        <SwiperList data={fanRank} />
      </section>
      <section className='bannerWrap'>
        <BannerSlide data={bannerList} />
      </section>
      <section className='liveView'>
        <CntTitle title={'🚀 지금 라이브 중!'} />
        <Tabmenu data={liveTabmenu} tab={liveListType} setTab={setLiveListType} setPage={setCurrentPage} />
        <LiveView data={liveList} />
      </section>
    </div>
  )
}
 
export default MainPage
 