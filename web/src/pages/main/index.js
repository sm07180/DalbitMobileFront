import React, {useCallback, useEffect, useRef, useState} from 'react'

import Api from 'context/api'
import Utility from 'components/lib/utility'
import Lottie from 'react-lottie'
// global components
import Header from 'components/ui/header/Header'
import CntTitle from '../../components/ui/cntTitle/CntTitle'
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
// components
import Tabmenu from './components/tabmenu'
import MainSlide from './components/MainSlide'
import SwiperList from './components/SwiperList'
import LiveView from './components/LiveView'

import AttendEventBtn from './component/AttendEventBtn'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setMainData, setMainLiveList} from "redux/actions/main";
import {IMG_SERVER} from "context/config";

// popup
import ReceiptPop from "pages/main/popup/ReceiptPop";
import UpdatePop from "pages/main/popup/UpdatePop";
import {setIsRefresh} from "redux/actions/common";
import {isHybrid} from "context/hybrid";
import LayerPopupWrap from "pages/main/component/layer_popup_wrap";
import {useHistory} from "react-router-dom";

const topTenTabMenu = ['DJ','FAN','CUPID']
const liveTabMenu = ['전체','VIDEO','RADIO','신입DJ']
let totalPage = 1
const pagePerCnt = 20

let touchStartY = null
let touchEndY = null
const refreshDefaultHeight = 48

const MainPage = () => {
  const headerRef = useRef()
  const overRef = useRef()
  const overTabRef = useRef()
  const iconWrapRef = useRef()
  const MainRef = useRef()
  const arrowRefreshRef = useRef()
  const history = useHistory();

  const [topRankType, setTopRankType] = useState(topTenTabMenu[0])
  const [liveListType, setLiveListType] = useState(liveTabMenu[0])
  const [headerFixed, setHeaderFixed] = useState(false)
  const [tabFixed, setTabFixed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [reloadInit, setReloadInit] = useState(false)

  const [scrollOn, setScrollOn] = useState(false)

  const [payOrderId, setPayOrderId] = useState("")
  const [receiptPop, setReceiptPop] = useState(false)

  const [popupData, setPopupData] = useState([]);

  const [updatePopInfo, setUpdatePopInfo] = useState({
    showPop: false,
    storeUrl: '',
  });
  const [pullToRefreshPause, setPullToRefreshPause] = useState(true);
  const [dataRefreshPrevent, setDataRefreshPrevent] = useState(false);

  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const liveList = useSelector(state => state.live);
  const common = useSelector(state => state.common);

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

  /* pullToRefresh 후 데이터 셋 */
  const mainDataReset = () => {
    fetchMainInfo();
    fetchLiveInfo();
    setTopRankType(topTenTabMenu[0])
    setLiveListType(liveTabMenu[0])
    setHeaderFixed(false);
    setCurrentPage(1);
  }

  // scroll
  const scrollEvent = useCallback(() => {
    // 탑메뉴 스크롤시 스타일 클래스 추가
    const overTabNode = overTabRef.current
    const overNode = overRef.current
    const headerNode = headerRef.current
    
    if (window.scrollY >= 1) {
      setScrollOn(true)
    } else {
      setScrollOn(false)
    }

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
      setCurrentPage(currentPage => currentPage + 1)
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
    // const refreshIconNode = arrowRefreshRef.current

    touchEndY = e.touches[0].clientY
    const ratio = 3
    const heightDiff = (touchEndY - touchStartY) / ratio
    const heightDiffFixed = 50

    if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
      if (heightDiff <= heightDiffFixed) {
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        // refreshIconNode.style.transform = `rotate(${heightDiff * ratio}deg)`
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

        // const loadIntervalId = setInterval(() => {
        //   if (Math.abs(current_angle) === 360) {
        //     current_angle = 0
        //   }
        //   current_angle += 10
        //   // refreshIconNode.style.transform = `rotate(${current_angle}deg)`
        // }, 17)

        /* 스크롤 top에 도착하면 reload 아이콘 보이게 + 중복 호출 막음 */
        setDataRefreshPrevent(true);
        showPullToRefreshIcon({duration: 300});
        mainDataReset();

        await new Promise((resolve, _) => setTimeout(() => {
          resolve();
        }, 300))
        // clearInterval(loadIntervalId)

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
    // refreshIconNode.style.transform = 'rotate(0)'
    touchStartY = null
    touchEndY = null
  }, [reloadInit])

  const clearReceipt = () => {
    setReceiptPop(false)
    sessionStorage.removeItem('orderId')
  }

  const getReceipt = () => {
    if (sessionStorage.getItem('orderId') !== null) {
      const orderId = sessionStorage.getItem('orderId')
      setReceiptPop(true);
      setPayOrderId(orderId);
    }
  }

  /* 업데이트 확인 */
  const updatePopFetch = async () => {
    if (isHybrid()) {
      if (sessionStorage.getItem('checkUpdateApp') === null) {
        sessionStorage.setItem('checkUpdateApp', 'FirstMainJoin')
      }

      if(sessionStorage.getItem('checkUpdateApp') === 'FirstMainJoin') {
        Api.verisionCheck().then(res => {
          const isUpdate = res.data.isUpdate
          const storeUrl = res.data.storeUrl
          setUpdatePopInfo({showPop: isUpdate, storeUrl})
        })
      }
    }
  }

  async function fetchMainPopupData(arg) {
    const res = await Api.getBanner({
      params: {
        position: arg
      }
    })

    if (res.result === 'success') {
      if (res.hasOwnProperty('data')) {
        setPopupData(
          res.data.filter((v) => {
            if (Utility.getCookie('popup_notice_' + `${v.idx}`) === undefined) {
              return v
            } else {
              return false
            }
          })
        )
      }
    }
  }

  const redirectPage = useCallback(() => {
    try {
      const item = JSON.parse(sessionStorage.getItem('_loginRedirect__'));
      if (item) {
        sessionStorage.removeItem('_loginRedirect__');
        if (item.indexOf('/wallet') > -1) {
          history.replace('/wallet?exchange=1');
        }
      }
    } catch (e) {
    }
  },[]);

  /* 고정 헤더 로고 클릭 */
  const fixedHeaderLogoClick = () => {
    dispatch(setIsRefresh(true));
  }

  /* pullToRefresh 아이콘 보기 */
  const showPullToRefreshIcon = ({duration = 300}) => {
    if(!dataRefreshPrevent) {
      const refreshWrap = iconWrapRef.current;
      refreshWrap.style.height = `${refreshDefaultHeight + 50}px`;
      setPullToRefreshPause(false);
      setTimeout(() => {
        refreshWrap.style.height = `${refreshDefaultHeight}px`;
        setPullToRefreshPause(true);
      }, duration);
    }
  }

  const pullToRefreshAction = () => {
    if(window.scrollY !== 0) {
      const scrollToEvent = () => {
        if(window.scrollY === 0) {
          window.removeEventListener('scroll', scrollToEvent);
          showPullToRefreshIcon({duration: 500});
          mainDataReset();
        }
      }
      window.addEventListener('scroll', scrollToEvent)
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }else {
      showPullToRefreshIcon({duration: 500});
      mainDataReset();
    }
    dispatch(setIsRefresh(false));
    setTimeout(() => {
      setDataRefreshPrevent(false);
    }, 1000);
  }

  useEffect(() => {
    if(common.isRefresh && pullToRefreshPause && !dataRefreshPrevent) {
      setDataRefreshPrevent(true);
      pullToRefreshAction();
    }else {
      dispatch(setIsRefresh(false));
    }
  }, [common.isRefresh]);

  useEffect(() => {
    fetchLiveInfo()
    document.addEventListener('scroll', scrollEvent);
    return () => {
      document.removeEventListener('scroll', scrollEvent)
    }
  }, [currentPage, liveListType])

  // 페이지 셋팅
  useEffect(() => {
    fetchMainInfo()
    // fetchLiveInfo();
    getReceipt();
    updatePopFetch(); // 업데이트 팝업
    fetchMainPopupData('6');
    redirectPage();

    return () => {
      sessionStorage.removeItem('orderId')
      sessionStorage.setItem('checkUpdateApp', 'otherJoin')
    }
  }, [])
 
  // 페이지 시작
  let MainLayout = <>
    <div className="refresh-wrap"
         style={{height: `${refreshDefaultHeight}px`}}
         ref={iconWrapRef}>
      <div className="icon-wrap">
        {/* <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} alt="" /> */}
        <div className="arrow-refresh-icon" ref={arrowRefreshRef}>
          <Lottie
            isPaused={pullToRefreshPause}
            options={{
              loop: true,
              autoPlay: true,
              path: `${IMG_SERVER}/common/scroll_refresh.json`,
            }}
          />
        </div>
      </div>
    </div>
    <div id="mainPage" ref={MainRef}
      onTouchStart={mainTouchStart}
      onTouchMove={mainTouchMove}
      onTouchEnd={mainTouchEnd}>
      <div className={`headerWrap ${headerFixed === true ? 'isShow' : ''}`} ref={headerRef}>
        <Header title="메인" position="relative" alarmCnt={mainState.newAlarmCnt} titleClick={fixedHeaderLogoClick} />
      </div>
      <section className='topSwiper'>
        <MainSlide data={mainState.topBanner} common={common} pullToRefreshPause={pullToRefreshPause} />
      </section>
      <section className='favorites' ref={overRef}>
        <SwiperList data={mainState.myStar} profImgName="profImg" type="favorites" pullToRefreshPause={pullToRefreshPause} />
      </section>
      <section className='top10'>
        <CntTitle title={'🏆 일간 TOP 10'} more={'rank'}>
          <Tabmenu data={topTenTabMenu} tab={topRankType} setTab={setTopRankType} defaultTab={0} />
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
        {mainState.newBjList.length > 0 &&
        <>
          <CntTitle title={'방금 착륙한 NEW 달린이'} />
          <SwiperList data={mainState.newBjList} profImgName="bj_profileImageVo" type="daldungs" />
        </>
        }
      </section>
      <section className='bannerWrap'>
        <BannerSlide/>
      </section>
      <section className='liveView' ref={overTabRef}>
        <CntTitle title={'🚀 지금 라이브 중!'}/>
        <div className={`tabmenuWrap ${tabFixed === true ? 'isFixed' : ''}`}>
          <Tabmenu data={liveTabMenu} tab={liveListType} setTab={setLiveListType} setPage={setCurrentPage}
                   defaultTab={1} />
        </div>
        <LiveView data={liveList.list}/>
      </section>
    </div>
    {receiptPop && <ReceiptPop payOrderId={payOrderId} clearReceipt={clearReceipt} />}
    {updatePopInfo.showPop && <UpdatePop updatePopInfo={updatePopInfo} setUpdatePopInfo={setUpdatePopInfo} />}

    <AttendEventBtn scrollOn={scrollOn}/>

    {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
  </>;
  return MainLayout;
}

export default MainPage
 