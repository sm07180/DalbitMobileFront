/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import {NavLink} from 'react-router-dom'
import {Link} from 'react-router-dom'
//context
import Api from 'context/api'
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import {StoreLink} from 'context/link'
import qs from 'query-string'
import moment from 'moment'
//import Lottie from 'react-lottie'
import LottiePlayer from 'lottie-web'
import styled from 'styled-components'
// components
import Layout from 'pages/common/layout'
import MainSlideList from './component/mainSlideList.js'
import LiveList from './component/livelist.js'
import RankList from './component/rankList.js'
import BannerList from './component/bannerList.js'
import StarList from './component/starList.js'
import LayerPopup from './component/layer_popup.js'
import LayerPopupWrap from './component/layer_popup_wrap.js'
import LayerPopupCommon from './component/layer_popup_common.js'
import LayerPopupEvent from './component/layer_popup_event.js'
import LayerPopupPay from './component/layer_popup_pay.js'
import LayerPopupInput from './component/layer_popup_input.js'
import NoResult from './component/NoResult.js'
import {OS_TYPE} from 'context/config.js'
import AttendEventBtn from './component/attend_event_button'
import RankingTimer from './component/rankingTimer'

import Swiper from 'react-id-swiper'
import {useHistory} from 'react-router-dom'
import Utility from 'components/lib/utility'
import {RoomMake} from 'context/room'
import {clipExit} from 'pages/common/clipPlayer/clip_func'
import {Hybrid} from 'context/hybrid'

// static
import RankArrow from './static/arrow_right_b.svg'
const arrowRefreshIcon = 'https://image.dalbitlive.com/main/common/ico_refresh.png'
const starNew = 'https://image.dalbitlive.com/svg/mystar_live.svg'
const RankNew = 'https://image.dalbitlive.com/svg/ranking_live.svg'

import 'styles/main.scss'

let concatenating = false

const records = 20
const refreshDefaultHeight = 48

let touchStartY = null
let touchEndY = null

let totalLivePage = 1

// updateLink
let storeUrl = ''
let updateState

let loading = false

const round = [
  {
    title: '1회차',
    start: '000000',
    end: '100000',
    timer: '080000'
  },
  {
    title: '2회차',
    start: '100000',
    end: '190000',
    timer: '170000'
  },
  {
    title: '3회차',
    start: '190000',
    end: '240000',
    timer: '220000'
  }
]

export default (props) => {
  // reference
  const MainRef = useRef()
  const SubMainRef = useRef()
  const RecommendRef = useRef()
  const RankSectionRef = useRef()
  const BannerSectionRef = useRef()
  const StarSectionRef = useRef()
  const LiveSectionRef = useRef()
  const LiveSectionTitleRef = useRef()

  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()
  const liveArrowRefreshRef = useRef()

  const TopSectionHeightRef = useRef(0)

  //context
  const globalCtx = useContext(Context)
  const {rankAction} = useContext(RankContext)
  const history = useHistory()
  // state
  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState(null)
  const [liveNextList, setLiveNextList] = useState(null)

  const [rankType, setRankType] = useState('') // type: dj, fan

  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false)

  const [popup, setPopup] = useState(false)
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupData, setPopupData] = useState([])
  const [scrollY, setScrollY] = useState(0)
  const [liveRefresh, setLiveRefresh] = useState(false)
  const [scrollOn, setScrollOn] = useState(false)
  const [viewLevel, setViewLevel] = useState()

  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')
  const [roundTitle, setRoundTitle] = useState("");
  const [rewardPop, setRewardPop] = useState(false);
  const [getMarble, setGetMarble] = useState({
    rmarbleCnt : 0,
    ymarbleCnt : 0,
    bmarbleCnt : 0,
    vmarbleCnt : 0,
  });

  // const [livePage, setLivePage] = useState(1)
  // const [selectedLiveRoomType, setSelectedLiveRoomType] = useState('')
  // const [liveListType, setLiveListType] = useState('all') // type: // type: all, v, a

  const [liveForm, setLiveForm] = useState({
    page: 1,
    roomType: '',
    mediaType: ''
  })

  const SET_PAGE = (page) => {
    if (!loading) {
      setLiveForm({
        ...liveForm,
        page
      })
    }
  }

  const SET_ROOMTYPE = (type) => {
    if (TopSectionHeightRef.current !== 0) {
      window.scrollTo(0, TopSectionHeightRef.current)
    }
    setLiveForm({
      ...liveForm,
      page: 1,
      roomType: type
    })
  }

  const SET_MEDIATYPE = (type) => {
    loading = true
    if (TopSectionHeightRef.current !== 0) {
      window.scrollTo(0, TopSectionHeightRef.current)
    }
    setLiveForm({
      ...liveForm,
      page: 1,
      mediaType: type
    })
  }

  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false)
  // const [categoryList, setCategoryList] = useState([{sorNo: 0, cd: '', cdNm: '전체'}])
  const customHeader = JSON.parse(Api.customHeader)

  const eventPopupStartTime = new Date('2020-09-25T09:00:00')
  const eventPopupEndTime = new Date('2020-10-04T23:59:59')
  const nowTime = new Date()
  const [popupMoonState, setPopupMoonState] = useState(false)
  const [popupMoon, setPopupMoon] = useState(false)
  const [eventPop, setEventPop] = useState(false)
  const [payState, setPayState] = useState(false)
  //update
  const [checker, setChecker] = useState(null)
  const [inputState, setInputState] = useState(false)

  //loading
  // const [loading, setLoading] = useState(false)

  const CrownWebp = 'https://image.dalbitlive.com/assets/webp/crown_webp.webp'
  const LiveWebp = 'https://image.dalbitlive.com/assets/webp/live_webp.webp'

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

    fetchMainInitData()
    // if (globalCtx.roomType && globalCtx.roomType.length > 0) {
    //   const concatenated = categoryList.concat(globalCtx.roomType)
    //   globalCtx.action.updateRoomType(concatenated)
    //   concatenated.forEach((v, idx) => {
    //     if (idx > 0 && v.sorNo === 0) concatenated.splice(1, idx)
    //   })
    //   setCategoryList(concatenated)
    // }
  }, [])

  const fetchMainInitData = async () => {
    const initData = await Api.main_init_data()
    if (initData.result === 'success') {
      const {djRank, fanRank, recommend, myStar, popupLevel} = initData.data
      setViewLevel(popupLevel)
      setInitData({
        recommend,
        djRank,
        fanRank,
        myStar
      })
    }
  }
  const fetchLiveList = async () => {
    // setLiveList(null)

    const {page, mediaType, roomType} = liveForm

    const broadcastList = await Api.broad_list({
      params: {
        page,
        mediaType: mediaType === 'new' ? '' : mediaType,
        records: records,
        roomType,
        searchType: liveAlign,
        gender: liveGender,
        djType: mediaType === 'new' ? 3 : ''
      }
    })
    if (broadcastList.result === 'success') {
      const {list, paging} = broadcastList.data
      if (paging) {
        const {totalPage, page} = paging
        totalLivePage = totalPage
      }
      setLiveList(list)
      fetchNextList()

      loading = false
    }
  }

  const fetchNextList = async () => {
    const {page, mediaType, roomType} = liveForm

    const broadcastList = await Api.broad_list({
      params: {
        page: page + 1,
        mediaType: mediaType === 'new' ? '' : mediaType,
        records: records,
        roomType,
        searchType: liveAlign,
        gender: liveGender,
        djType: mediaType === 'new' ? 3 : ''
      }
    })

    if (broadcastList.result === 'success') {
      const {list, paging} = broadcastList.data
      if (paging) {
        const {totalPage} = paging
        totalLivePage = totalPage
      }

      setLiveNextList(list)
    }
  }

  const concatLiveList = async () => {
    concatenating = true

    // if (liveList === null) {
    //   SET_PAGE(1)
    //   return
    // }

    const currentList = [...liveList]
    // const {page, mediaType, roomType} = liveForm
    // const broadcastList = await Api.broad_list({
    //   params: {
    //     page,
    //     mediaType,
    //     records: records,
    //     roomType,
    //     searchType: liveAlign,
    //     gender: liveGender
    //   }
    // })

    // const {list, paging} = broadcastList.data
    // if (paging) {
    //   const {totalPage, page} = paging
    //   totalLivePage = totalPage
    // }

    if (liveNextList !== undefined && liveNextList !== null && Array.isArray(liveNextList) && liveNextList.length > 0) {
      const concatenated = Utility.contactRemoveUnique(currentList, liveNextList, 'roomNo')
      setLiveList([...concatenated])

      fetchNextList()
    }
  }

  const playLottie = (lottieObj, elem) => {
    if (lottieObj != null && elem != null) {
      const lottieAnimation = LottiePlayer.loadAnimation({
        container: elem,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: lottieObj
      })
      lottieAnimation.addEventListener('complete', () => {
        lottieAnimation.destroy()
        playLottie(lottieObj, elem)
      })
    }
  }

  const popStateEvent = (e) => {
    if (e.state === null) {
      setPopup(false)
    } else if (e.state === 'layer') {
      setPopup(true)
    }
  }

  const swiperParams = {
    slidesPerView: 'auto'
  }

  const goRank = () => {
    history.push(`/rank`, rankType)
  }

  const alignSet = {1: '추천', 2: '좋아요', 3: '청취자'}

  const setPayPopup = () => {
    setPayState(false)
    sessionStorage.removeItem('pay_info')
  }
  const setInputPopup = () => {
    setInputState(false)
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

  async function fetchThxgivingCheck() {
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

    if (sessionStorage.getItem('pay_info') !== null) {
      const payInfo = JSON.parse(sessionStorage.getItem('pay_info'))
      setPayState(payInfo)
    }

    return () => {
      sessionStorage.removeItem('pay_info')
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  const LiveSectionTitleNode = LiveSectionTitleRef.current
  const LiveSectionTitleHeight = LiveSectionTitleNode && LiveSectionTitleNode.clientHeight
  useEffect(() => {
    const windowScrollEvent = () => {
      if (window.scrollY >= 1) {
        setScrollOn(true)
      } else {
        setScrollOn(false)
      }

      const GnbHeight = 88
      const sectionMarginTop = 30
      const LiveTabDefaultHeight = 28

      const MainNode = MainRef.current
      const SubMainNode = SubMainRef.current
      const RecommendNode = RecommendRef.current
      const RankSectionNode = RankSectionRef.current
      const StarSectionNode = StarSectionRef.current
      const BannerSectionNode = BannerSectionRef.current

      const LiveSectionNode = LiveSectionRef.current
      const MainHeight = Math.max(MainNode.clientHeight, MainNode.offsetHeight)
      // const SubMainHeight = SubMainNode.clientHeight
      const RecommendHeight = RecommendNode.clientHeight
      const RankSectionHeight = RankSectionNode.clientHeight
      const StarSectionHeight = StarSectionNode && StarSectionNode.clientHeight
      // const StarSectionHeight = StarSectionNode.style.display !== 'none' ? StarSectionNode.clientHeight : 0
      const BannerSectionHeight = BannerSectionNode ? BannerSectionNode.clientHeight + sectionMarginTop : 0
      const LiveSectionTop = LiveSectionNode.offsetTop

      TopSectionHeightRef.current = LiveSectionTop - refreshDefaultHeight

      if (window.scrollY >= LiveSectionTop - refreshDefaultHeight) {
        setLiveCategoryFixed(true)
      } else {
        setLiveCategoryFixed(false)
        if (globalCtx.attendStamp === false) globalCtx.action.updateAttendStamp(true)
      }

      const GAP = 500
      if (
        window.scrollY + window.innerHeight > MainHeight + GnbHeight - GAP * liveForm.page &&
        !concatenating &&
        Array.isArray(liveList) &&
        liveList.length &&
        liveForm.page + 1 <= totalLivePage
      ) {
        // setLoading(true)
        SET_PAGE(liveForm.page + 1)
      }
    }

    window.addEventListener('scroll', windowScrollEvent)

    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
      concatenating = false
    }
  }, [liveList, liveForm.page])

  useEffect(() => {
    if (liveForm.page > 1) {
      concatLiveList()
    } else {
      fetchLiveList()
    }
  }, [liveForm])

  useEffect(() => {
    fetchMainPopupData('6')
    fetchThxgivingCheck()

    return () => {
      globalCtx.action.updateAttendStamp(false)
    }
  }, [])

  const [reloadInit, setReloadInit] = useState(false)

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
  const openPopupMoon = async () => {
    setPopupMoon(true)
  }
  const RefreshFunc = async () => {
    // console.log(TopSectionHeightRef)
    if (TopSectionHeightRef.current !== 0) {
      // console.log(TopSectionHeightRef.current)
      window.scrollTo(0, TopSectionHeightRef.current)
    }

    // setReloadInit(true)
    // await fetchMainInitData()

    setLiveRefresh(true)
    await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
    SET_PAGE(1)
    // await fetchLiveList(true)
    setLiveRefresh(false)
    // setReloadInit(false)
  }
  //updatefunc
  const updateApp = () => {
    if (customHeader.os === OS_TYPE['Android']) {
      if (__NODE_ENV === 'dev' || customHeader.appBuild >= 48) {
        Hybrid('goToPlayStore')
      } else {
        Hybrid('openUrl', storeUrl)
      }
    } else if (customHeader.os === OS_TYPE['IOS']) {
      Hybrid('openUrl', storeUrl)
    }
  }
  const updateLink = () => {
    updateApp()
  }
  const closeLink = () => {
    setChecker(false)
  }

  const MainListRoadingBar = () => {
    return (
      <div className={`main-loadingWrap ${liveCategoryFixed ? 'top-fixed' : ''}`}>
        <div className="loading">
          <span></span>
        </div>
      </div>
    )
  }

  const LiveListComponent = useCallback(() => {
    if (Array.isArray(liveList) && liveRefresh === false && loading === false) {
      if (liveList.length > 0) {
        return (
          <div className="liveList">
            <LiveList list={liveList} liveListType={liveForm.mediaType} />
          </div>
        )
      } else {
        return <NoResult />
      }
    } else {
      return <MainListRoadingBar />
    }
  }, [liveList, liveForm.mediaType, liveRefresh])

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

          await fetchMainInitData()
          setLiveForm({
            page: 1,
            mediaType: '',
            roomType: ''
          })
          // await fetchLiveList(true)
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

  useEffect(() => {
    if (globalCtx.profile && globalCtx.profile.gender === 'n' && globalCtx.profile.birth === '20200101') {
      setInputState(true)
    }
  }, [globalCtx.profile])

  useEffect(() => {
    if (sessionStorage.getItem('checkUpdateApp') === 'otherJoin' || sessionStorage.getItem('checkUpdateApp') == null) {
      sessionStorage.setItem('checkUpdateApp', 'FirstMainJoin')
    }
    async function fetchVersionCheck() {
      const res = await Api.verisionCheck()
      updateState = res.data.isUpdate
      storeUrl = res.data.storeUrl
    }
    if (customHeader.os === OS_TYPE['Android'] || customHeader.os === OS_TYPE['IOS']) {
      fetchVersionCheck()
    }
    //메인에 첫번째 조인
    setTimeout(() => {
      if (updateState === true && sessionStorage.getItem('checkUpdateApp') === 'FirstMainJoin') {
        setChecker(true)
      }
    }, 300)
    return () => {
      sessionStorage.setItem('checkUpdateApp', 'otherJoin')
    }
  }, [])

  return (
    <Layout {...props} sticker={globalCtx.sticker}>
      <div
        className="refresh-wrap"
        ref={iconWrapRef}
        style={{position: customHeader['os'] === OS_TYPE['Desktop'] ? '' : 'absolute'}}>
        <div className="icon-wrap">
          <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} />
        </div>
      </div>
      <div
        className="main-wrap"
        ref={MainRef}
        onTouchStart={mainTouchStart}
        onTouchMove={mainTouchMove}
        onTouchEnd={mainTouchEnd}
        style={{marginTop: customHeader['os'] !== OS_TYPE['Desktop'] ? '48px' : ''}}>
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
                    if (globalCtx.token.isLogin === false) {
                      globalCtx.action.alert({
                        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                        callback: () => {
                          history.push('/login')
                        }
                      })
                    } else {
                      globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 1)
                    }
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
                    history.push('/myProfile')
                  }}>
                  마이
                </NavLink>
              </div>
            </div>
          </div>
        )}

        <div ref={RecommendRef} className="main-slide">
          {/* {reloadInit === false && Array.isArray(initData.recommend) && <MainSlideList list={initData.recommend} />} */}
          {Array.isArray(initData.recommend) && <MainSlideList list={initData.recommend} />}
        </div>

        {viewLevel === 5 ? (
          <button className="levelEventBanner" onClick={() => history.push('/event/level_achieve')}>
            <span className="eventText">💛이벤트💛</span> 5레벨이 되면 달 20개 <p className="giftIcon">선물받기</p>
          </button>
        ) : viewLevel === 10 ? (
          <button className="levelEventBanner isRed" onClick={() => history.push('/event/level_achieve')}>
            <span className="eventText isWhite">💛이벤트💛</span> 10레벨이 되면 달 50개 <p className="giftIcon isRed">선물받기</p>
          </button>
        ) : (
          <></>
        )}

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
                {/* <span className="ico-lottie">
          <img src={CrownIcon} alt="실시간랭킹" width={40} />
        </span> */}
                <img className="rank-arrow" src={RankNew} />

                <div className="txt">
                  실시간 랭킹
                  {rankType === 'dj' && roundTitle }
                </div>
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

            { rankType === 'dj' && <RankingTimer round={round} setRoundTitle={setRoundTitle} /> }

            <div className="content-wrap ranking">
              <RankList rankType={rankType} djRank={initData.djRank} fanRank={initData.fanRank} />
            </div>
          </div>

          <div className="section banner" ref={BannerSectionRef}>
            <BannerList bannerPosition="9" />
          </div>

          {Array.isArray(initData.myStar) && initData.myStar.length > 0 && (
            <div className="section my-star" ref={StarSectionRef}>
              <div className="title-wrap">
                <div className="title" onClick={() => (window.location.href = `/mypage/${globalCtx.token.memNo}/edit_star`)}>
                  <img className="rank-arrow" src={starNew} />
                  <div className="txt">나의스타</div>
                  <img className="rank-arrow" src={RankArrow} />
                </div>
              </div>
              <div className="content-wrap my-star-list">
                <StarList list={initData.myStar} />
              </div>
            </div>
          )}

          <div className="section live-list" ref={LiveSectionRef}>
            <div className={`title-wrap ${liveCategoryFixed ? 'fixed' : ''}`} ref={LiveSectionTitleRef}>
              <div className="title">
                <span className="txt" onClick={RefreshFunc}>
                  <button className={`tab_refresh_btn ${liveRefresh ? 'on' : ''}`}>
                    <img src="https://image.dalbitlive.com/main/ico_live_refresh_new_s.svg" alt="새로고침" />
                  </button>
                  실시간 LIVE
                </span>

                <div className="live_btn_box">
                  {/* <span className="text" onClick={() => setPopup(popup ? false : true)}>
                  {(() => {
                    return liveAlign ? `${alignSet[liveAlign]}순` : '전체'
                  })()}
                  </span>
                  <button className="sequence-icon" onClick={() => setPopup(popup ? false : true)}>
                    <img src={sortIcon} alt="검색 정렬하기" />
                  </button> */}

                  {/* {popupMoonState && (
                    <button className="btn__moon" onClick={openPopupMoon}>
                      <img src="https://image.dalbitlive.com/main/common/ico_moon.png" alt="달이 된 병아리" />
                    </button>
                  )} */}
                  <button className={`tab_all_btn ${liveForm.mediaType === '' ? 'on' : ''}`} onClick={() => SET_MEDIATYPE('')}>
                    전체선택
                  </button>

                  <button
                    className={`tab_video_btn ${liveForm.mediaType === 'v' ? 'on' : ''}`}
                    onClick={() => SET_MEDIATYPE('v')}>
                    비디오 타입
                  </button>

                  <button
                    className={`tab_radio_btn ${liveForm.mediaType === 'a' ? 'on' : ''}`}
                    onClick={() => SET_MEDIATYPE('a')}>
                    라디오 타입
                  </button>

                  <button
                    className={`tab_new_btn ${liveForm.mediaType === 'new' ? 'on' : ''}`}
                    onClick={() => SET_MEDIATYPE('new')}>
                    신입 타입
                  </button>
                </div>
              </div>

              {/* <div className="live-list-category">
                <div className="inner-wrapper">
                  {Array.isArray(categoryList) && categoryList.length > 1 && (
                    <Swiper {...swiperParams}>
                      {categoryList
                        .sort((a, b) => Number(a.sortNo) - Number(b.sortNo))
                        .map((key, idx) => {
                          return (
                            <div
                              className={`list ${key.cd === liveForm.roomType ? 'active' : ''}`}
                              key={`list-${idx}`}
                              onClick={() => SET_ROOMTYPE(key.cd)}>
                              {key.cdNm}
                            </div>
                          )
                        })}
                    </Swiper>
                  )}
                </div>
              </div> */}
            </div>

            <div className="content-wrap" style={liveCategoryFixed ? {paddingTop: LiveSectionTitleHeight + `px`} : {}}>
              {liveForm.mediaType === 'new' && (
                <img
                  src="https://image.dalbitlive.com/main/banner_newMember.png"
                  alt="총 방송시간 30시간 미만의 새로운 DJ들입니다. 많은 관심 부탁드립니다!"
                  className="newMember_banner"
                />
              )}
              <LiveListComponent />
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
            SET_PAGE={SET_PAGE}
          />
        )}
        {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
        {eventPop && nowTime >= eventPopupStartTime && nowTime < eventPopupEndTime && (
          <LayerPopupEvent setEventPop={setEventPop} popupData={popupData} />
        )}
        {/* {popupMoon && (
          <LayerPopupCommon setPopupMoon={setPopupMoon}>
            <span className="img img-moon">
              <img src="https://image.dalbitlive.com/main/common/img_moon_popup.png" alt="달이 된 병아리" />
            </span>
            <h3 className="title title--purple">달이 된 병아리가 나타났습니다!</h3>
            <p className="subTitle">
              DJ님, 조금만 노력하시면
              <br />내 방송이 상단으로 올라갈 수 있어요.
              <br />날 수 없었던 저처럼 말이죠!
            </p>
            <div className="desc">
              <strong>P.S</strong>
              <p>
                저는 아무 때나 나타나지 않고,
                <br />
                DJ님이 실시간 LIVE 상단으로
                <br />
                쉽게 올라갈 수 있을 때 나타나요.
              </p>
            </div>
          </LayerPopupCommon>
        )} */}
        {payState && <LayerPopupPay info={payState} setPayState={setPayState} setPopup={setPayPopup}/>}
        {inputState && <LayerPopupInput info={payState} setInputPopup={setInputPopup} />}
        <AttendEventBtn scrollOn={scrollOn}/>
        {checker && (
          <UpdateWrap>
            <div className="Wrapper">
              <div className="topBox">
                <button onClick={closeLink} className="closeBtn" />
                <img
                  alt="앱설치 유도 팝업 이미지"
                  className="topBox__img"
                  src={'https://image.dalbitlive.com/svg/img_app_update@2x.png'}
                />
                <div className="topBox__info">
                  <h2>최신 버전이 출시되었습니다.</h2>
                  <p>새로운 기능과 안정적인 서비스 이용을 위해 최신 버전으로 업데이트 후 이용해주세요.</p>
                </div>
              </div>
              <button onClick={updateLink} className="updateBtn">
                최신 버전으로 업데이트
              </button>
            </div>
          </UpdateWrap>
        )}
      </div>
    </Layout>
  )
}

const UpdateWrap = styled.div`
  position: fixed;
  top: 48px;
  left: 0;
  width: 100%;

  background-color: #eee;
  padding: 12px 16px 10px 16px;
  z-index: 12;
  .Wrapper {
    width: 100%;
  }
  .updateBtn {
    width: 100%;
    height: 32px;
    margin-top: 10px;
    border-radius: 8px;
    background-color: #FF3C7B;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }
  .topBox {
    position: relative;
    display: flex;
    align-items: center;

    .closeBtn {
      position: absolute;
      top: -8px;
      right: 0;
      width: 28px;
      height: 28px;
      background: url('https://image.dalbitlive.com/svg/ico_close_g_m.svg');
    }
    &__img {
      width: 64px;
      height: 64px;
    }
    &__info {
      width: calc(100% - 72px - 28px);
      margin-left: 8px;
      h2 {
        margin-bottom: 4px;
        font-size: 16px;
        letter-spacing: -0.4px;
        color: #FF3C7B;
      }
      p {
        width: 90%;
        font-size: 13px;
        letter-spacing: -0.33px;
        color: #616161;
      }
    }
  }
`
