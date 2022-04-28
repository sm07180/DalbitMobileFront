import React, {useCallback, useEffect, useRef, useState} from 'react';

import Api from 'context/api';
import Utility from 'components/lib/utility';
import Lottie from 'react-lottie';
import moment from "moment";
// global components
import Header from '../../components/ui/header/Header';
import CntTitle from '../../components/ui/cntTitle/CntTitle';
import BannerSlide from '../../components/ui/bannerSlide/BannerSlide';
import UtilityCommon from "../../common/utility/utilityCommon";
// components
import Tabmenu from './components/tabmenu';
import SubTabmenu from './components/SubTabmenu';
import MainSlide from './components/MainSlide';
import PrevMainSlide from './components/PrevMainSlide';
import FavoriteSwiper from './components/FavoriteSwiper';
import ToptenSwiper from './components/ToptenSwiper';
import LiveContents from './components/LiveContents';
import FloatEventBtn from './popup/FloatEventBtn';

import './style.scss';

// popup
import UpdatePop from "../../pages/main/popup/UpdatePop";
import LayerPopupWrap from "pages/main/component/layer_popup_wrap";

import {setIsRefresh} from "redux/actions/common";
import {isHybrid, isIos} from "context/hybrid";
import {useHistory} from "react-router-dom";
import {IMG_SERVER} from "context/config";
import {useDispatch, useSelector} from "react-redux";
import {setMainData, setMainLiveList} from "redux/actions/main";
import {convertDateTimeForamt} from "pages/common/rank/rank_fn";

import smoothscroll from 'smoothscroll-polyfill';
import qs from 'query-string';

const topTenTabMenu = ['DJ','FAN','TEAM'];
const liveTabMenu = ['전체','VIDEO','RADIO','신입DJ'];
let totalPage = 1;
const pagePerCnt = 50;

let touchStartY = null;
let touchEndY = null;
const refreshDefaultHeight = 48; // pullToRefresh 높이
const SCROLL_TO_DURATION = 500;
let canHit = true; // scroll 안에서는 상태값 갱신 안돼서 추가

const MainPage = () => {
  const headerRef = useRef();
  const iconWrapRef = useRef();
  const MainRef = useRef();
  const overRef = useRef(null);
  const arrowRefreshRef = useRef();
  const history = useHistory();
  const {webview} = qs.parse(location.search);

  const [topRankType, setTopRankType] = useState(''); // 일간 top10 탭 타입
  const [liveListType, setLiveListType] = useState(liveTabMenu[0]); // 방송 리스트 타입
  const [rankingListInfo , setRankingListInfo] = useState({list: [], listCnt: 0, type: ''});

  const [headerFixed, setHeaderFixed] = useState(false); // 헤더 fixed
  const [currentPage, setCurrentPage] = useState(1); // 메인 데이터 현재 호출 페이지
  const [reloadInit, setReloadInit] = useState(false); // pullToRefresh 할때

  const [scrollOn, setScrollOn] = useState(false); // 스크롤

  const [popupData, setPopupData] = useState([]); // 이벤트, 공지 등 메인 팝업

  const [updatePopInfo, setUpdatePopInfo] = useState({ // 업데이트 가능한 버전이 출시됐는지
    showPop: false,
    storeUrl: '',
  });

  const [pullToRefreshPause, setPullToRefreshPause] = useState(true);  // pullToRefresh 할때 (모바일)
  const [dataRefreshPrevent, setDataRefreshPrevent] = useState(false); // 로고, 헤더, 푸터 등 메인 페이지 리로드할때

  /* redux */
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const liveList = useSelector(state => state.live);
  const common = useSelector(state => state.common);

  // page 조회 API
  const fetchMainInfo = () => {
    dispatch(setMainData());
  }

  /* 메인 랭킹 10위 목록 API */
  const fetchRankDataTop10 = async (type) => {
    if(type !=="" || type!==null){
      if(type === topTenTabMenu[0]) {
        Api.getRankTimeList({
          rankSlct: 1,
          page: 1,
          records: 10,
          rankingDate: convertDateTimeForamt(new Date() , "-")
        }).then(res => {
          if (res.result === "success") {
            const list = res.data.list;
            const listCnt = res.data.listCnt;
            setRankingListInfo({ list, listCnt, type });
          }
        });
      } else if (type === topTenTabMenu[2]) {
        const realRank = await Api.getTeamRankWeekList({ tDate: moment().format('YYYY-MM-DD'), pageNo: 1, pagePerCnt: 10, memNo: 0});
        if (realRank.code === '00000') {
          const { data } = realRank;
          const list = data.list;
          const listCnt = data.listCnt;
          setRankingListInfo({ list, listCnt, type });
        }
      } else {
        Api.get_ranking({
          param: {
            rankSlct: type === topTenTabMenu[1] ? 2 : 3,
            rankType: 1,
            rankingDate: moment().format("YYYY-MM-DD"),
            page: 1,
            records: 10,
          }
        }).then(res=> {
          if(res.result === "success"){
            const list = res.data.list;
            const listCnt = res.data.listCnt;
            setRankingListInfo({ list, listCnt, type });
          }else{
            setRankingListInfo({ list: [], listCnt: 0, type });
          }
        });
      }
    }
  };

  /* 라이브 리스트 */
  const fetchLiveInfo = useCallback(({pageNo, mediaType, djType}) => {
    const callPageNo = pageNo ? pageNo : currentPage
    if(pageNo !== 1) { // 디폴트 호출이 아닐때
      mediaType = liveListType === liveTabMenu[1] ? 'v' : liveListType === liveTabMenu[2] ? 'a' : ''
      djType = liveListType === liveTabMenu[3] ? 3 : '';
    }
    const params = {
      page: callPageNo,
      mediaType,
      records: pagePerCnt,
      roomType: '',
      searchType: 1,
      gender: '',
      djType
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

        if (callPageNo > 1) {
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
    const randomValue = getRandomIndex();
    fetchMainInfo();
    fetchLiveInfo({pageNo: 1, mediaType: '', djType: ''});
    setTopRankType(topTenTabMenu[randomValue])
    setLiveListType(liveTabMenu[0])
    setHeaderFixed(false);
    setCurrentPage(1);
  }

  // scroll
  const scrollEvent = useCallback(() => {
    // 탑메뉴 스크롤시 스타일 클래스 추가
    const overNode = overRef.current;
    const headerNode = headerRef.current;

    // 플로팅 버튼
    if (window.scrollY >= 1) {
      setScrollOn(true)
    } else {
      setScrollOn(false)
    }

    // 모바일 헤더
    if (overNode && headerNode) {
      const overTop = overNode.clientHeight - headerNode.clientHeight
      if (window.scrollY >= overTop) {
        setHeaderFixed(true)
      } else {
        setHeaderFixed(false)
      }
    }

    // 스크롤시 추가 리스트
    if (totalPage > currentPage && canHit && Utility.isHitBottom()) {
      setCurrentPage(currentPage => currentPage + 1)
    }
  },[])

  /* pullToRefresh */
  const mainTouchStart = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0) return

      touchStartY = e.touches[0].clientY
    },
    [reloadInit]
  )

  /* pullToRefresh */
  const mainTouchMove = useCallback((e) => {
    if (reloadInit === true || window.scrollY !== 0) return

    const iconWrapNode = iconWrapRef.current
    // const refreshIconNode = arrowRefreshRef.current

    touchEndY = e.touches[0].clientY
    const ratio = 3
    const heightDiff = (touchEndY - touchStartY) / ratio
    const heightDiffFixed = 80

    if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
      if (heightDiff <= heightDiffFixed) {
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        // refreshIconNode.style.transform = `rotate(${heightDiff * ratio}deg)`
      }
    }
  }, [reloadInit])

  /* pullToRefresh */
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
        iconWrapNode.style.height = `${refreshDefaultHeight + 80}px`

        /* reload 아이콘 + 데이터 리프레시 */
        if(pullToRefreshPause) {
          showPullToRefreshIcon({duration: 300});
          mainDataReset();
        }

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

  /* 메인 팝업 */
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

  /* 리다이렉트할 페이지 있는지 체크 */
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
    const refreshWrap = iconWrapRef.current;
    if(refreshWrap) {
      refreshWrap.style.height = `${refreshDefaultHeight + 80}px`;
      setPullToRefreshPause(false);
      setTimeout(() => {
        refreshWrap.style.height = `${refreshDefaultHeight}px`;
        setPullToRefreshPause(true);
      }, duration);
    }
  }

  /* scrollTo action */
  const scrollToEvent = () => {
    if(window.scrollY === 0) {
      if(location?.pathname === '/') {
        showPullToRefreshIcon({duration: SCROLL_TO_DURATION});
        window.removeEventListener('scroll', scrollToEvent);
      }else {
        window.removeEventListener('scroll', scrollToEvent);
      }
    }
  }

  /* 로고, 헤더, 푸터 등 클릭해서 페이지 리프레시할때 액션 */
  const pullToRefreshAction = () => {
    if(window.scrollY !== 0) {
      mainDataReset();
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }else {
      showPullToRefreshIcon({duration: SCROLL_TO_DURATION});
      mainDataReset();
    }
  }

  /* tabmenu */
  const tabAction = (value) => {
    setLiveListType(value)
  }

  /* subTabmenu */
  const getRandomIndex = () => {
    const boundary = 3;
    return Math.floor(Math.random() * boundary); // 0 ~ boundary
  }

  const topRankTabChange = (value) => {
    if (value !== undefined && value !== topRankType) {
      setTopRankType(value);
    }
  }

  // 스와이퍼 공용 함수
  const swiperRefresh = (value) => {
    const swiper = document.querySelector(`.${value} .swiper-container`)?.swiper;
    const refreshSlideNum = value === 'mainSwiper' ? 1 : 0 // 메인 탑 스와이퍼 1번 슬라이드로 이동해야 번호가 맞음 ㅠㅠ
    swiper?.update();
    swiper?.slideTo(refreshSlideNum);
  }

  /* 로고, 푸터 클릭했을때 */
  useEffect(() => {
    if(common.isRefresh && pullToRefreshPause && !dataRefreshPrevent) {
      setDataRefreshPrevent(true);
      canHit = false;
    }else {
      dispatch(setIsRefresh(false));
    }
  }, [common.isRefresh]);

  useEffect(() => {
    if(dataRefreshPrevent) {
      dispatch(setIsRefresh(false));
      window.addEventListener('scroll', scrollToEvent)
      pullToRefreshAction();
      /* 데이터를 다 불러온 후에 false로 바꿔야 되는데 일단 1초 텀을 둠 */
      const dataRefreshTimeout = setTimeout(() => {
        window.removeEventListener('scroll', scrollToEvent);
        setDataRefreshPrevent(false);
        canHit = true;
      }, 1000);

      return () => { clearTimeout(dataRefreshTimeout); }
    }
  }, [dataRefreshPrevent]);

  /* 라이브 리스트 페이징, 탭 변경 */
  useEffect(() => {
    if(!dataRefreshPrevent) {
      fetchLiveInfo(currentPage)
    }
    document.addEventListener('scroll', scrollEvent);
    return () => {
      document.removeEventListener('scroll', scrollEvent)
    }
  }, [currentPage, liveListType]);

  useEffect(() => {
    fetchMainInfo();                // 메인 page api
    fetchMainPopupData('6');        // 메인 팝업
    updatePopFetch();               // 업데이트 팝업
    redirectPage();                 // redirect 체크

    setTopRankType(topTenTabMenu[getRandomIndex()]); // now top10 랜덤
    
    if(isIos()) smoothscroll?.polyfill(); // ios scrollTo 대응

    return () => {
      sessionStorage.removeItem('orderId')
      sessionStorage.setItem('checkUpdateApp', 'otherJoin')
      window.removeEventListener('scroll', scrollToEvent)
    }
  }, []);

  useEffect(() => {
    if(topRankType) {
      fetchRankDataTop10(topRankType);
    }
  },[topRankType]);

  // 페이지 시작
  let MainLayout = <>
    <div className="refresh-wrap"
         style={{height: `${refreshDefaultHeight}px`}}
         ref={iconWrapRef}>
      <div className="icon-wrap">
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

      {/* 헤더 */}
      <div className={`headerWrap ${headerFixed === true ? 'isShow' : ''}`} ref={headerRef}>
        <Header title="메인" position="relative" alarmCnt={mainState.newAlarmCnt} titleClick={fixedHeaderLogoClick} />
      </div>

      {/* 메인 탑 스와이퍼 */}
      <section className="mainSwiper" ref={overRef}>
        {UtilityCommon.eventDateCheck("20220501") ? <MainSlide data={mainState.topBanner} swiperRefresh={() => swiperRefresh("mainSwiper")} pullToRefreshPause={pullToRefreshPause} /> :
          <PrevMainSlide data={mainState.topBanner} swiperRefresh={() => swiperRefresh("mainSwiper")} pullToRefreshPause={pullToRefreshPause} />
        }
      </section>

      {/* 마이스타 */}
      <FavoriteSwiper
        data={mainState.myStar}
        swiperRefresh={() => swiperRefresh("favorites")}
        myStarCnt={mainState.myStarCnt}
        pullToRefreshPause={pullToRefreshPause} />
      
      {/* 탑 10 */}
      <ToptenSwiper
        data={rankingListInfo.list}
        swiperRefresh={() => swiperRefresh("topTen")}
        topRankType={rankingListInfo.type}>
        <SubTabmenu data={topTenTabMenu} tab={topRankType} setTab={topRankTabChange} defaultTab={0} />
      </ToptenSwiper>

      {/* 배너 영역 */}
      <section className='bannerWrap'>
        <BannerSlide/>
      </section>

      {/* 라이브 */}
      <LiveContents data={liveList.list}>
        <CntTitle title={'🚀 지금 라이브 중!'}/>
        <Tabmenu
          data={liveTabMenu}
          tabAction={tabAction}
          setPage={setCurrentPage}
          defaultTab={1} />
      </LiveContents>
    </div>

    {/* 업데이트 확인 팝업 */}
    {updatePopInfo.showPop && <UpdatePop updatePopInfo={updatePopInfo} setUpdatePopInfo={setUpdatePopInfo} />}

    {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}

    {/* 플로팅 버튼(출석체크) */}
    {scrollOn && <FloatEventBtn />}
  </>
  return MainLayout;
}

export default MainPage;
