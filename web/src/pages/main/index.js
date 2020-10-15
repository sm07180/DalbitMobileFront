/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import {useHistory, NavLink} from 'react-router-dom'
//context
import Api from 'context/api'
import Utility from 'components/lib/utility'
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import {RoomMake} from 'context/room'
import {clipExit} from 'pages/common/clipPlayer/clip_func'
import {Hybrid} from 'context/hybrid'
//import Lottie from 'react-lottie'
// components
import Layout from 'pages/common/layout'
import MainSlideList from './component/mainSlideList.js'
import LiveList from './component/livelist.js'
import RankList from './component/rankList.js'
import BannerList from './component/bannerList.js'
import StarList from './component/starList.js'
import LayerPopup from './component/layer_popup.js'
import LayerPopupWrap from './component/layer_popup_wrap.js'
import LayerPopupEvent from './component/layer_popup_event.js'
import LayerPopupPay from './component/layer_popup_pay.js'
import NoResult from './component/NoResult.js'
import {OS_TYPE} from 'context/config.js'

import Swiper from 'react-id-swiper'

// static
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'
import RankArrow from './static/arrow_right_b.svg'
import CrownIcon from './static/ic_crown.png'
import LiveIcon from './static/ic_newlive.png'
//import CrownLottie from './static/crown_lottie.json'
//import LiveLottie from './static/live_lottie.json'
const arrowRefreshIcon = 'https://image.dalbitlive.com/main/common/ico_refresh.png'

import 'styles/main.scss'

// let moreState = false
let tempScrollEvent = null
let touchStartY = null
let touchEndY = null
const records = 8
export default (props) => {
  // reference
  const MainRef = useRef()
  const SubMainRef = useRef()
  const RecommendRef = useRef()
  const RankSectionRef = useRef()
  const BannerSectionRef = useRef()
  const StarSectionRef = useRef()
  const LiveSectionRef = useRef()
  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()

  //context
  const globalCtx = useContext(Context)
  const {rankAction} = useContext(RankContext)
  const history = useHistory()

  // state
  const [initData, setInitData] = useState({}) // main init
  const [rankType, setRankType] = useState('') // ranking > type: dj, fan
  const [liveList, setLiveList] = useState(null) // live list
  const [liveListType, setLiveListType] = useState('detail') // live list type: detail, simple
  const [selectedLiveRoomType, setSelectedLiveRoomType] = useState('') // live room type
  const [categoryList, setCategoryList] = useState([{sorNo: 0, cd: '', cdNm: '전체'}]) //live category list
  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')
  const [livePage, setLivePage] = useState(1)
  const [totalLivePage, setTotalLivePage] = useState(null)

  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false) // category fixed state
  const [scrollY, setScrollY] = useState(0) // scrollY state
  const [liveRefresh, setLiveRefresh] = useState(false) // top refresh state
  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false) //방송하기 버튼
  const [reloadInit, setReloadInit] = useState(false)
  const [liveType, setliveType] = useState({
    roomType: '',
    liveListPage: 1
  })
  const [popup, setPopup] = useState(false)
  const [eventPop, setEventPop] = useState(false) // event용 팝업
  const [payState, setPayState] = useState(false)
  const [popupData, setPopupData] = useState([]) // 관리자 메인 팝업

  const customHeader = JSON.parse(Api.customHeader)
  const eventPopupStartTime = new Date('2020-09-25T09:00:00')
  const eventPopupEndTime = new Date('2020-10-04T23:59:59')
  const nowTime = new Date()
  const alignSet = {1: '추천', 2: '좋아요', 3: '청취자'}
  const swiperParams = {
    slidesPerView: 'auto'
  }

  // fetch
  // 메인 init data - live
  const fetchMainInitData = async () => {
    const initData = await Api.main_init_data()
    if (initData.result === 'success') {
      const {djRank, fanRank, recommend, myStar} = initData.data
      setInitData({
        recommend,
        djRank,
        fanRank,
        myStar
      })
    }
  }

  const fetchLiveListRefresh = async () => {
    setLiveList(null)
    const broadcastList = await Api.broad_list({
      params: {
        page: 1,
        records: records,
        roomType: '',
        searchType: 1,
        gender: ''
      }
    })
    if (broadcastList.result === 'success') {
      const {list, paging} = broadcastList.data
      if (paging) {
        const {totalPage, page} = paging
        // setLivePage(page)
        setTotalLivePage(totalPage)
        setliveType({
          roomType: '',
          liveListPage: 1
        })
      }
      setLiveList(list)
    }
  }

  const concatLiveList = async () => {
    moreState = true

    const currentList = [...liveList]
    console.debug()
    const broadcastList = await Api.broad_list({
      params: {
        page: livePage + 1,
        records: records,
        roomType: selectedLiveRoomType,
        searchType: liveAlign,
        gender: liveGender
      }
    })

    if (broadcastList.result === 'success') {
      const {list, paging} = broadcastList.data
      if (paging) {
        const {totalPage, page} = paging
        // setLivePage(page)
        setTotalLivePage(totalPage)
      }

      if (list !== undefined && list !== null && Array.isArray(list) && list.length > 0) {
        //const concatenated = currentList.concat(list)
        const concatenated = Utility.contactRemoveUnique(currentList, list, 'roomNo')
        setLiveList(concatenated)
      }
    }
  }

  const resetFetchList = () => {
    setliveType({
      roomType: '',
      liveListPage: 1
    })
    // setLivePage(1)
    // fetchLiveList(true)
  }

  // 관리자 메인 팝업
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

  // 추석이벤트
  async function fetchThxgivingCheck() {
    console.log('..')
    const res = await Api.getChooseokCheck()

    if (res.result === 'success') {
      setEventPop(true)
      const {memNo} = globalCtx.token
      const item = localStorage.getItem(`popup_event${memNo}`)
      if (item !== null && item === memNo) {
        setEventPop(false)
      }
    } else {
      setEventPop(false)
    }
  }

  // func
  const popStateEvent = (e) => {
    if (e.state === null) {
      setPopup(false)
    } else if (e.state === 'layer') {
      setPopup(true)
    }
  }
  const goRank = () => {
    history.push(`/rank`, rankType)
  }

  const setPayPopup = () => {
    setPayState(false)
    sessionStorage.removeItem('pay_info')
  }

  const refreshDefaultHeight = 48
  const mainTouchStart = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0) return

      touchStartY = e.touches[0].clientY
    },
    [reloadInit]
  )

  const mainTouchMove = useCallback(
    (e) => {
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
    },
    [reloadInit]
  )

  const RefreshFunc = async () => {
    // setReloadInit(true)
    // await fetchMainInitData()
    setLiveRefresh(true)
    // await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
    // await fetchLiveList()
    changeCategory(liveType.roomType)
    setLiveRefresh(false)
    // setReloadInit(false)
  }
  const mainTouchEnd = useCallback(
    async (e) => {
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
          let tail_slice = head_slice.slice(0, 4)
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

          await fetchMainInitData()
          await fetchLiveListRefresh()

          await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
          clearInterval(loadIntervalId)

          setLiveAlign(1)
          setLiveGender('')
          if (sessionStorage.getItem('ranking_tab') === 'dj') {
            setRankType('fan')
            rankAction.formDispatch &&
              rankAction.formDispatch({
                type: 'RANK_TYPE',
                val: 2
              })
            sessionStorage.setItem('ranking_tab', 'fan')
          } else {
            setRankType('dj')
            rankAction.formDispatch &&
              rankAction.formDispatch({
                type: 'RANK_TYPE',
                val: 1
              })
            sessionStorage.setItem('ranking_tab', 'dj')
          }
          setLiveListType('detail')
          // setSelectedLiveRoomType('')
          setliveType({
            roomType: '',
            liveListPage: 1
          })
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
    },
    [reloadInit]
  )

  // 초기호출
  useEffect(() => {
    // 메인 초기 데이터 호출
    fetchMainInitData()
    // 메인 관리자 팝업
    fetchMainPopupData('6')
    // splash data api
    Api.splash().then((res) => {
      const {result} = res
      if (result === 'success') {
        const {data} = res
        const {roomType} = data
        if (roomType) {
          const concatenated = categoryList.concat(roomType)
          setCategoryList(concatenated)
        }
      }
    })
    // 추석이벤트
    // fetchThxgivingCheck()
    return () => {
      globalCtx.action.updateAttendStamp(false)
    }
  }, [])

  // 랭킹관련
  useEffect(() => {
    rankAction.formDispatch &&
      rankAction.formDispatch({
        type: 'RESET'
      })

    rankAction.setLevelList && rankAction.setLevelList([])
    rankAction.setLikeList && rankAction.setLikeList([])
    rankAction.setRankList && rankAction.setRankList([])

    rankAction.setMyInfo &&
      rankAction.setMyInfo({
        isReward: false,
        myGiftPoint: 0,
        myListenerPoint: 0,
        myRank: 0,
        myUpDown: '',
        myBroadPoint: 0,
        myLikePoint: 0,
        myPoint: 0,
        myListenPoint: 0,
        time: ''
      })

    if (window.sessionStorage) {
      const exceptionList = ['room_active', 'room_no', 'room_info', 'push_type', 'popup_notice', 'pay_info', 'ranking_tab']
      Object.keys(window.sessionStorage).forEach((key) => {
        if (!exceptionList.includes(key)) {
          sessionStorage.removeItem(key)
        }
      })
    }

    if (sessionStorage.getItem('ranking_tab') !== null) {
      if (sessionStorage.getItem('ranking_tab') === 'dj') {
        setRankType('fan')
        rankAction.formDispatch &&
          rankAction.formDispatch({
            type: 'RANK_TYPE',
            val: 2
          })
        sessionStorage.setItem('ranking_tab', 'fan')
      } else {
        setRankType('dj')
        rankAction.formDispatch &&
          rankAction.formDispatch({
            type: 'RANK_TYPE',
            val: 1
          })
        sessionStorage.setItem('ranking_tab', 'dj')
      }
    } else {
      const randomData = Math.random() >= 0.5 ? 'dj' : 'fan'
      setRankType(randomData)
      if (randomData === 'dj') {
        rankAction.formDispatch &&
          rankAction.formDispatch({
            type: 'RANK_TYPE',
            val: 1
          })
      } else {
        rankAction.formDispatch &&
          rankAction.formDispatch({
            type: 'RANK_TYPE',
            val: 2
          })
      }
      sessionStorage.setItem('ranking_tab', randomData)
    }
  }, [])

  // 팝업관련
  useEffect(() => {
    if (popup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/#layer')
        setScrollY(window.scrollY)
      }
    } else if (!popup) {
      if (window.location.hash === '#layer') {
        history.goBack()
        setTimeout(() => window.scrollTo(0, scrollY))
      }
    }
  }, [popup])

  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    // window.addEventListener('scroll', windowScrollEvent)
    // tempScrollEvent = windowScrollEvent

    if (sessionStorage.getItem('pay_info') !== null) {
      const payInfo = JSON.parse(sessionStorage.getItem('pay_info'))
      setPayState(payInfo)
    }

    return () => {
      sessionStorage.removeItem('pay_info')
      window.removeEventListener('popstate', popStateEvent)
      // window.removeEventListener('scroll', windowScrollEvent)
      // window.removeEventListener('scroll', tempScrollEvent)
      // tempScrollEvent = null
      // moreState = false
    }
  }, [])

  // 실시간 라이브 스크롤 이벤트
  useEffect(() => {
    let didFetch = false

    const windowScrollEvent = () => {
      const GnbHeight = 48
      const sectionMarginTop = 30
      const LiveTabDefaultHeight = 48

      const MainNode = MainRef.current
      const SubMainNode = SubMainRef.current
      const RecommendNode = RecommendRef.current
      const RankSectionNode = RankSectionRef.current
      const StarSectionNode = StarSectionRef.current
      const BannerSectionNode = BannerSectionRef.current

      const LiveSectionNode = LiveSectionRef.current
      const MainHeight = MainNode.clientHeight
      // const SubMainHeight = SubMainNode.clientHeight
      const RecommendHeight = RecommendNode.clientHeight
      const RankSectionHeight = RankSectionNode.clientHeight
      const StarSectionHeight = StarSectionNode.style.display !== 'none' ? StarSectionNode.clientHeight : 0
      const BannerSectionHeight = BannerSectionNode.clientHeight + sectionMarginTop

      const LiveSectionHeight = LiveSectionNode.clientHeight

      let TopSectionHeight
      if (customHeader['os'] === OS_TYPE['Desktop']) {
        TopSectionHeight = RecommendHeight + RankSectionHeight + StarSectionHeight + BannerSectionHeight + 48
      } else {
        TopSectionHeight = RecommendHeight + RankSectionHeight + StarSectionHeight + BannerSectionHeight
      }
      if (window.scrollY >= TopSectionHeight) {
        setLiveCategoryFixed(true)
      } else {
        setLiveCategoryFixed(false)
        if (globalCtx.attendStamp === false) globalCtx.action.updateAttendStamp(true)
      }

      const GAP = 100
      console.log(liveType.liveListPage, totalLivePage)
      if (
        window.scrollY + window.innerHeight > MainHeight + GnbHeight - GAP &&
        liveType.liveListPage < totalLivePage &&
        !didFetch
      ) {
        // moreState = true

        // concatLiveList()
        // fetchLiveList(moreState)
        setliveType({
          ...liveType,
          liveListPage: liveType.liveListPage + 1
        })
      }
    }
    console.log('scroll')
    // window.removeEventListener('scroll', tempScrollEvent)
    window.addEventListener('scroll', windowScrollEvent)
    // tempScrollEvent = windowScrollEvent
    // moreState = false
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
      didFetch = true
    }
  }, [liveList, totalLivePage, liveType])

  // 실시간 라이브 - 카테고리 sorting
  // useEffect(() => {
  //   console.log('reset fetch')
  //   resetFetchList()
  // }, [selectedLiveRoomType])

  // 실시간 라이브 - 카테고리 sorting
  const changeCategory = useCallback((arg) => {
    setliveType({
      roomType: arg,
      liveListPage: 1
    })
  }, [])

  const fetchLiveList = async () => {
    // if (!moreState) {
    //   console.log('more')
    //   // setLivePage(1)
    //   setLiveList(null)
    // }

    // console.log(livePage)
    let param = {
      page: liveType.liveListPage,
      records: records,
      roomType: liveType.roomType,
      searchType: 1,
      gender: ''
    }
    const res = await Api.broad_list({
      params: param
    })
    if (res.result === 'success') {
      const {list, paging} = res.data
      // console.log(res.data, paging)
      if (paging) {
        const {totalPage, page, next} = paging
        // setLivePage(next)
        setTotalLivePage(totalPage)
        if (liveType.liveListPage > 1) {
          if (list !== undefined && list !== null && Array.isArray(list) && list.length > 0) {
            const concatenated = Utility.contactRemoveUnique(liveList, list, 'roomNo')
            setLiveList(concatenated)
          }
        } else {
          setLiveList(list)
        }
      } else {
        setLiveList(list)
      }
    }
  }

  useEffect(() => {
    fetchLiveList()
  }, [liveType])

  return (
    <Layout {...props} sticker={globalCtx.sticker}>
      <div className="refresh-wrap" ref={iconWrapRef}>
        <div className="icon-wrap">
          <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} />
        </div>
      </div>
      <div
        className="main-wrap"
        ref={MainRef}
        onTouchStart={mainTouchStart}
        onTouchMove={mainTouchMove}
        onTouchEnd={mainTouchEnd}>
        {customHeader['os'] === OS_TYPE['Desktop'] && (
          <div ref={SubMainRef} className="main-gnb">
            <div className="left-side">
              <div className="tab">
                <NavLink
                  className="tab__item"
                  activeClassName={'tab__item--active'}
                  onClick={(event) => {
                    event.preventDefault()
                  }}
                  to={'/'}>
                  라이브
                </NavLink>
              </div>
              <div className="tab">
                <NavLink
                  className="tab__item newIcon"
                  activeClassName={'tab__item--active'}
                  to={'/clip'}
                  onClick={(event) => {
                    history.push('/clip')
                  }}>
                  클립 <i>N</i>
                </NavLink>
              </div>
              <button
                className="broadBtn"
                onClick={() => {
                  if (customHeader['os'] === OS_TYPE['Desktop']) {
                    window.location.href = 'https://inforexseoul.page.link/Ws4t'
                  } else {
                    if (!broadcastBtnActive) {
                      if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
                        if (Utility.getCookie('clip-player-info')) {
                          globalCtx.action.confirm({
                            msg: `현재 재생 중인 클립이 있습니다.\n방송을 생성하시겠습니까?`,
                            callback: () => {
                              clipExit(globalCtx)
                              RoomMake(globalCtx)
                            }
                          })
                        } else {
                          RoomMake(globalCtx)
                        }
                      } else {
                        globalCtx.action.confirm({
                          msg: `현재 청취 중인 방송방이 있습니다.\n방송을 생성하시겠습니까?`,
                          callback: () => {
                            sessionStorage.removeItem('room_no')
                            Utility.setCookie('listen_room_no', null)
                            Hybrid('ExitRoom', '')
                            globalCtx.action.updatePlayer(false)
                            RoomMake(globalCtx)
                          }
                        })
                      }
                      setBroadcastBtnActive(true)
                      setTimeout(() => setBroadcastBtnActive(false), 3000)
                    }
                  }
                }}></button>

              <div className="tab">
                <NavLink
                  className="tab__item"
                  activeClassName={'tab__item--active'}
                  to={'/rank'}
                  onClick={(event) => {
                    event.preventDefault()
                    history.push('/rank')
                  }}>
                  랭킹
                </NavLink>
              </div>

              <div className="tab">
                <NavLink
                  className="tab__item"
                  activeClassName={'tab__item--active'}
                  to={'/rank'}
                  onClick={(event) => {
                    event.preventDefault()
                    history.push('/menu/profile')
                  }}>
                  마이
                </NavLink>
              </div>
            </div>
          </div>
        )}

        <div ref={RecommendRef} className="main-slide">
          {reloadInit === false && Array.isArray(initData.recommend) && <MainSlideList list={initData.recommend} />}
        </div>
        <div className="main-content">
          <div className="section rank" ref={RankSectionRef}>
            <div className="title-wrap">
              <button className="title" onClick={() => goRank()}>
                {/* <Lottie
                  options={{
                    loop: true,
                    autoPlay: true,
                    animationData: CrownLottie
                  }}
                  width={40}
                /> */}
                <span className="ico-lottie">
                  <img src={CrownIcon} alt="실시간랭킹" width={40} />
                </span>
                <div className="txt">실시간 랭킹</div>
                <img className="rank-arrow" src={RankArrow} />
              </button>
              <div className="right-side">
                <button
                  className={`text ${rankType === 'dj' ? 'active' : ''}`}
                  onClick={() => {
                    setRankType('dj')
                    rankAction.formDispatch &&
                      rankAction.formDispatch({
                        type: 'RANK_TYPE',
                        val: 1
                      })
                  }}>
                  DJ
                </button>

                <button
                  style={{marginLeft: '2px'}}
                  className={`text ${rankType === 'fan' ? 'active' : ''}`}
                  onClick={() => {
                    setRankType('fan')
                    rankAction.formDispatch &&
                      rankAction.formDispatch({
                        type: 'RANK_TYPE',
                        val: 2
                      })
                  }}>
                  팬
                </button>
              </div>
            </div>

            <div className="content-wrap ranking">
              <RankList rankType={rankType} djRank={initData.djRank} fanRank={initData.fanRank} />
            </div>
          </div>

          <div className="section banner">
            <BannerList ref={BannerSectionRef} bannerPosition="9" />
          </div>

          <div
            className={`section my-star ${
              initData.myStar === undefined || (Array.isArray(initData.myStar) && initData.myStar.length === 0) ? '' : 'visible'
            }`}
            ref={StarSectionRef}>
            <div className="title-wrap">
              <div className="title" onClick={() => (window.location.href = `/mypage/${globalCtx.token.memNo}/edit_star`)}>
                <div className="txt">나의스타</div>
                <img className="rank-arrow" src={RankArrow} />
              </div>
            </div>
            <div className="content-wrap my-star-list">
              <StarList list={initData.myStar} />
            </div>
          </div>

          <div className="section live-list" ref={LiveSectionRef}>
            <div className={`title-wrap ${liveCategoryFixed ? 'fixed' : ''}`}>
              <div className="title">
                <span className="txt" onClick={RefreshFunc}>
                  <span className="ico-lottie">
                    <img src={LiveIcon} alt="실시간라이브" width={24} />
                    {/* <Lottie
                      options={{
                        loop: true,
                        autoPlay: true,
                        animationData: LiveLottie
                      }}
                      width={24}
                    /> */}
                  </span>
                  실시간 LIVE
                </span>

                <div className="sequence-wrap">
                  {/* <span className="text" onClick={() => setPopup(popup ? false : true)}>
                  {(() => {
                    return liveAlign ? `${alignSet[liveAlign]}순` : '전체'
                  })()}
                </span>
                <button className="sequence-icon" onClick={() => setPopup(popup ? false : true)}>
                  <img src={sortIcon} alt="검색 정렬하기" />
                </button> */}
                  <button className="detail-list-icon" onClick={() => setLiveListType('detail')}>
                    <img
                      src={liveListType === 'detail' ? detailListIconActive : detailListIcon}
                      alt="리스트 형식으로 리스트 보여주기"
                    />
                  </button>
                  <button className="simple-list-icon" onClick={() => setLiveListType('simple')}>
                    <img
                      src={liveListType === 'simple' ? simpleListIconActive : simpleListIcon}
                      alt="리스트 형식으로 리스트 보여주기"
                    />
                  </button>
                  <button className={`btn__refresh ${liveRefresh ? 'btn__refresh--active' : ''}`} onClick={RefreshFunc}>
                    <img src="https://image.dalbitlive.com/main/200714/ico-refresh-gray.png" alt="새로고침" />
                  </button>
                </div>
              </div>

              <div className="live-list-category">
                <div className="inner-wrapper">
                  {Array.isArray(categoryList) && categoryList.length > 1 && (
                    <Swiper {...swiperParams}>
                      {categoryList
                        .sort((a, b) => Number(a.sortNo) - Number(b.sortNo))
                        .map((key, idx) => {
                          return (
                            <div
                              className={`list ${key.cd === liveType.roomType ? 'active' : ''}`}
                              key={`list-${idx}`}
                              onClick={() => changeCategory(key.cd)}>
                              {key.cdNm}
                            </div>
                          )
                        })}
                    </Swiper>
                  )}
                </div>
              </div>
            </div>

            <div className="content-wrap" style={{paddingTop: liveCategoryFixed && '86px'}}>
              {Array.isArray(liveList) ? (
                liveList.length > 0 && categoryList.length > 1 ? (
                  <div className="liveList">
                    <LiveList liveList={liveList} liveListType={liveListType} categoryList={categoryList} />
                  </div>
                ) : (
                  <NoResult />
                )
              ) : (
                <div style={{height: '600px'}}></div>
              )}
            </div>
          </div>
        </div>
        {popup && (
          <LayerPopup
            alignSet={alignSet}
            setPopup={setPopup}
            liveAlign={liveAlign}
            setLiveAlign={setLiveAlign}
            liveGender={liveGender}
            setLiveGender={setLiveGender}
            resetFetchList={resetFetchList}
          />
        )}
        {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
        {eventPop && nowTime >= eventPopupStartTime && nowTime < eventPopupEndTime && (
          <LayerPopupEvent setEventPop={setEventPop} popupData={popupData} />
        )}
        {payState && <LayerPopupPay info={payState} setPopup={setPayPopup} />}
      </div>
    </Layout>
  )
}
