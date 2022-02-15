import React, {useCallback, useEffect, useRef, useState} from 'react'

import Api from 'context/api'
import Utility from 'components/lib/utility'
import styled from 'styled-components'
// global components
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
// components
import Tabmenu from './components/tabmenu'
import MainSlide from './components/MainSlide'
import SwiperList from './components/SwiperList'
import LiveView from './components/LiveView'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setMainData, setMainLiveList} from "redux/actions/main";
import {OS_TYPE} from "context/config";
// popup
import ReceiptPop from "pages/main/popup/ReceiptPop";
import UpdatePop from "pages/main/popup/UpdatePop";

const topTenTabMenu = ['DJ','FAN','LOVER']
const liveTabMenu = ['전체','VIDEO','RADIO','신입DJ']
let totalPage = 1
const pagePerCnt = 20

const arrowRefreshIcon = 'https://image.dalbitlive.com/main/common/ico_refresh.png';
let touchStartY = null
let touchEndY = null
const refreshDefaultHeight = 48

const customHeader = JSON.parse(Api.customHeader)

const MainPage = () => {
  const headerRef = useRef()
  const overRef = useRef()
  const overTabRef = useRef()
  const iconWrapRef = useRef()
  const MainRef = useRef()
  const arrowRefreshRef = useRef()

  const [topRankType, setTopRankType] = useState(topTenTabMenu[0])
  const [liveListType, setLiveListType] = useState(liveTabMenu[0])
  const [headerFixed, setHeaderFixed] = useState(false)
  const [tabFixed, setTabFixed] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [reloadInit, setReloadInit] = useState(false)

  const [payOrderId, setPayOrderId] = useState("")
  const [receiptPop, setReceiptPop] = useState(false)
  const clearReceipt = () => {
    setReceiptPop(false)
    sessionStorage.removeItem('orderId')
  }
  useEffect(() => {
    if (sessionStorage.getItem('orderId') !== null) {
      const orderId = sessionStorage.getItem('orderId')
      setReceiptPop(true);
      setPayOrderId(orderId);
    }
    return () => {
      sessionStorage.removeItem('orderId')
    }
  }, [])

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

  const mainDataReset = () => {
    fetchMainInfo();
    fetchLiveInfo();
    setTopRankType(topTenTabMenu[0])
    setLiveListType(liveTabMenu[0])
    setHeaderFixed(false);
    setCurrentPage(0);

  }

  // scroll
  const scrollEvent = useCallback(() => {
    // 탑메뉴 스크롤시 스타일 클래스 추가
    const overTabNode = overTabRef.current
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

    if (overTabNode) {
      const overTabTop = overTabNode.getBoundingClientRect().top
      if (0 > overTabTop) {
        setTabFixed(true)
      } else {
        setTabFixed(false)
      }
    }

    // 스크롤시 추가 리스트
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  })

  const mainTouchStart = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0) return

      touchStartY = e.touches[0].clientY
    },
    [reloadInit]
  )

  const mainTouchMove = useCallback((e) => {
    if (reloadInit === true || window.scrollY !== 0) return

    const iconWrapNode = iconWrapRef.current
    const refreshIconNode = arrowRefreshRef.current

    touchEndY = e.touches[0].clientY
    const ratio = 3
    const heightDiff = (touchEndY - touchStartY) / ratio
    const heightDiffFixed = 50

    if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
      if (heightDiff <= heightDiffFixed) {
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        refreshIconNode.style.transform = `rotate(${heightDiff * ratio}deg)`
      }
    }
  }, [reloadInit])

  const mainTouchEnd = useCallback(async (e) => {
    if (reloadInit === true) return

    const ratio = 3
    const transitionTime = 150
    const iconWrapNode = iconWrapRef.current
    const refreshIconNode = arrowRefreshRef.current

    const heightDiff = (touchEndY - touchStartY) / ratio
    const heightDiffFixed = 48
    if (heightDiff >= heightDiffFixed) {
      let current_angle = (() => {
        const str_angle = refreshIconNode.style.transform
        let head_slice = str_angle.slice(7)
        let tail_slice = head_slice.slice(0, 3)
        return Number(tail_slice)
      })()

      if (typeof current_angle === 'number') {
        setReloadInit(true)
        iconWrapNode.style.transitionDuration = `${transitionTime}ms`
        iconWrapNode.style.height = `${refreshDefaultHeight + 50}px`

        const loadIntervalId = setInterval(() => {
          if (Math.abs(current_angle) === 360) {
            current_angle = 0
          }
          current_angle += 10
          refreshIconNode.style.transform = `rotate(${current_angle}deg)`
        }, 17)

        mainDataReset();

        await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
        clearInterval(loadIntervalId)

        setReloadInit(false)
      }
    }

    const promiseSync = () =>
      new Promise((resolve, _) => {
        iconWrapNode.style.transitionDuration = `${transitionTime}ms`
        iconWrapNode.style.height = `${refreshDefaultHeight}px`
        setTimeout(() => resolve(), transitionTime)
      })

    await promiseSync()
    iconWrapNode.style.transitionDuration = '0ms'
    refreshIconNode.style.transform = 'rotate(0)'
    touchStartY = null
    touchEndY = null
  }, [reloadInit])


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
  let MainLayout = <>
    <div className="refresh-wrap"
      ref={iconWrapRef}
      style={{position: customHeader['os'] === OS_TYPE['Desktop'] ? 'relative' : 'absolute'}}>
      <div className="icon-wrap">
        <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} alt="" />
      </div>
    </div>
    <div id="mainPage" ref={MainRef} 
      onTouchStart={mainTouchStart}
      onTouchMove={mainTouchMove}
      onTouchEnd={mainTouchEnd}
      style={{marginTop: customHeader['os'] !== OS_TYPE['Desktop'] ? '48px' : ''}}>
      <div className={`headerWrap ${headerFixed === true ? 'isShow' : ''}`} ref={headerRef}>
        <Header title="메인" position="relative" alarmCnt={mainState.newAlarmCnt} />
      </div>
      <section className='topSwiper'>
        <MainSlide data={mainState.topBanner}/>
      </section>
      <section className='favorites' ref={overRef}>
        <SwiperList data={mainState.myStar} profImgName="profImg" type="myStar" />
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP 10'} more={'rank'}>
          <Tabmenu data={topTenTabMenu} tab={topRankType} setTab={setTopRankType}/>
        </CntTitle>
        <SwiperList
          data={topRankType === 'DJ' ? mainState.dayRanking.djRank
            : topRankType === 'FAN' ? mainState.dayRanking.fanRank
              : mainState.dayRanking.loverRank}
          profImgName="profImg"
          type="top10"
        />
      </section>
      <section className='daldungs'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} />
        <SwiperList data={mainState.newBjList} profImgName="bj_profileImageVo" type="daldungs" />
      </section>
      <section className='bannerWrap'>
        <BannerSlide/>
      </section>
      <section className='liveView'  ref={overTabRef}>
        <CntTitle title={'🚀 지금 라이브 중!'}/>
        <div className={`tabmenuWrap ${tabFixed === true ? 'isFixed' : ''}`}>
          <Tabmenu data={liveTabMenu} tab={liveListType} setTab={setLiveListType} setPage={setCurrentPage}/>
        </div>
        <LiveView data={liveList.list}/>
      </section>
    </div>
    {receiptPop && <ReceiptPop payOrderId={payOrderId} clearReceipt={clearReceipt} />}
    <UpdatePop />
  </>;
  return MainLayout;
}

export default MainPage
 