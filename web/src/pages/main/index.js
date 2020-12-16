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

import Swiper from 'react-id-swiper'
import {useHistory} from 'react-router-dom'
import Utility from 'components/lib/utility'
import {RoomMake} from 'context/room'
import {clipExit} from 'pages/common/clipPlayer/clip_func'
import {Hybrid} from 'context/hybrid'

// static
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'
import sortIcon from './static/choose_circle_w.svg'
import RankArrow from './static/arrow_right_b.svg'
import CrownIcon from './static/ic_crown.png'
import LiveIcon from './static/ic_newlive.png'
import CrownLottie from './static/crown_lottie.json'
import LiveLottie from './static/live_lottie.json'
const arrowRefreshIcon = 'https://image.dalbitlive.com/main/common/ico_refresh.png'
const liveNew = 'https://image.dalbitlive.com/svg/newlive_s.svg'
const starNew = 'https://image.dalbitlive.com/svg/mystar_live.svg'
const RankNew = 'https://image.dalbitlive.com/svg/ranking_live.svg'
import 'styles/main.scss'

let concatenating = false
let tempScrollEvent = null

const records = 50

let touchStartY = null
let touchEndY = null

// updateLink
let storeUrl = ''
let updateState
export default (props) => {
  const customerHeader = JSON.parse(Api.customHeader)
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
  const liveArrowRefreshRef = useRef()

  //context
  const globalCtx = useContext(Context)
  const {rankAction} = useContext(RankContext)
  const history = useHistory()

  // state
  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState(null)
  const [rankType, setRankType] = useState('') // type: dj, fan
  const [liveListType, setLiveListType] = useState('detail') // type: detail, simple

  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false)
  const [selectedLiveRoomType, setSelectedLiveRoomType] = useState('')
  const [popup, setPopup] = useState(false)
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupData, setPopupData] = useState([])
  const [scrollY, setScrollY] = useState(0)
  const [liveRefresh, setLiveRefresh] = useState(false)
  const [scrollOn, setScrollOn] = useState(false)
  const [viewLevel, setViewLevel] = useState()

  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')

  const [livePage, setLivePage] = useState(1)
  const [totalLivePage, setTotalLivePage] = useState(null)

  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false)
  const [categoryList, setCategoryList] = useState([{sorNo: 0, cd: '', cdNm: '전체'}])
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

    Api.splash().then((res) => {
      const {result} = res
      if (result === 'success') {
        const {data} = res
        const {roomType} = data
        if (roomType) {
          const concatenated = categoryList.concat(roomType)
          globalCtx.action.updateRoomType(concatenated)
          setCategoryList(concatenated)
        }
      }
    })
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

  const fetchLiveListAsInit = async () => {
    // setLiveList(null)
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
        setLivePage(page)
        setTotalLivePage(totalPage)
      }
      setLiveList(list)
    }
  }

  const fetchLiveList = async (reset) => {
    setLiveList(null)
    const broadcastList = await Api.broad_list({
      params: {
        page: reset === true ? 1 : livePage,
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
        setLivePage(page)
        setTotalLivePage(totalPage)
      }
      // if (broadcastList.data.isGreenMoon === true) {
      //   setPopupMoonState(true)
      // } else {
      //   setPopupMoonState(false)
      // }
      setLiveList(list)
    }
  }

  const concatLiveList = async () => {
    concatenating = true

    const currentList = [...liveList]
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
        setLivePage(page)
        setTotalLivePage(totalPage)
      }

      if (list !== undefined && list !== null && Array.isArray(list) && list.length > 0) {
        //const concatenated = currentList.concat(list)
        const concatenated = Utility.contactRemoveUnique(currentList, list, 'roomNo')
        setLiveList(concatenated)
      }
    }
  }

  const windowScrollEvent = () => {
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
    const MainHeight = MainNode.clientHeight
    // const SubMainHeight = SubMainNode.clientHeight
    const RecommendHeight = RecommendNode.clientHeight
    const RankSectionHeight = RankSectionNode.clientHeight
    const StarSectionHeight = StarSectionNode && StarSectionNode.clientHeight
    // const StarSectionHeight = StarSectionNode.style.display !== 'none' ? StarSectionNode.clientHeight : 0
    const BannerSectionHeight = BannerSectionNode ? BannerSectionNode.clientHeight + sectionMarginTop : 0

    const LiveSectionHeight = LiveSectionNode.clientHeight

    let TopSectionHeight
    if (customHeader['os'] === OS_TYPE['Desktop']) {
      if (StarSectionNode) {
        TopSectionHeight = RecommendHeight + RankSectionHeight + StarSectionHeight + BannerSectionHeight + LiveTabDefaultHeight
      } else {
        TopSectionHeight = RecommendHeight + RankSectionHeight + BannerSectionHeight + LiveTabDefaultHeight
      }
    } else {
      if (globalCtx.token.isLogin === true) {
        if (StarSectionNode) {
          TopSectionHeight = RecommendHeight + RankSectionHeight + StarSectionHeight + BannerSectionHeight - LiveTabDefaultHeight
        } else {
          TopSectionHeight = RecommendHeight + RankSectionHeight + BannerSectionHeight + 20
        }
      } else {
        TopSectionHeight = RecommendHeight + RankSectionHeight + BannerSectionHeight - LiveTabDefaultHeight
      }
    }

    if (window.scrollY >= TopSectionHeight) {
      setLiveCategoryFixed(true)
    } else {
      setLiveCategoryFixed(false)
      if (globalCtx.attendStamp === false) globalCtx.action.updateAttendStamp(true)
    }

    const GAP = 100
    if (
      window.scrollY + window.innerHeight > MainHeight + GnbHeight - GAP &&
      !concatenating &&
      Array.isArray(liveList) &&
      liveList.length &&
      livePage <= totalLivePage
    ) {
      concatLiveList()
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

  const resetFetchList = () => {
    setLivePage(1)
    fetchLiveList(true)
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
    window.addEventListener('scroll', windowScrollEvent)
    tempScrollEvent = windowScrollEvent

    if (sessionStorage.getItem('pay_info') !== null) {
      const payInfo = JSON.parse(sessionStorage.getItem('pay_info'))
      setPayState(payInfo)
    }

    return () => {
      sessionStorage.removeItem('pay_info')
      window.removeEventListener('popstate', popStateEvent)
      window.removeEventListener('scroll', windowScrollEvent)
      window.removeEventListener('scroll', tempScrollEvent)
      tempScrollEvent = null
      concatenating = false
    }
  }, [])

  useEffect(() => {
    resetFetchList()
  }, [selectedLiveRoomType])

  useEffect(() => {
    window.removeEventListener('scroll', tempScrollEvent)
    window.addEventListener('scroll', windowScrollEvent)
    tempScrollEvent = windowScrollEvent
    concatenating = false
  }, [liveList])

  useEffect(() => {
    fetchMainPopupData('6')
    fetchThxgivingCheck()

    return () => {
      globalCtx.action.updateAttendStamp(false)
    }
  }, [])

  const [reloadInit, setReloadInit] = useState(false)
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
  const openPopupMoon = async () => {
    setPopupMoon(true)
  }
  const RefreshFunc = async () => {
    // setReloadInit(true)
    // await fetchMainInitData()
    setLiveRefresh(true)
    await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
    await fetchLiveList(true)
    setLiveRefresh(false)
    // setReloadInit(false)
  }
  //updatefunc
  const updateApp = () => {
    if (customerHeader.os === OS_TYPE['Android']) {
      if (__NODE_ENV === 'dev' || customHeader.appBuild >= 48) {
        Hybrid('goToPlayStore')
      } else {
        Hybrid('openUrl', storeUrl)
      }
    } else if (customerHeader.os === OS_TYPE['IOS']) {
      Hybrid('openUrl', storeUrl)
    }
  }
  const updateLink = () => {
    updateApp()
  }
  const closeLink = () => {
    setChecker(false)
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
          await fetchLiveListAsInit()

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
          setSelectedLiveRoomType('')
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
  const scrollMove = () => {
    if (window.scrollY >= 1) {
      setScrollOn(true)
    } else {
      setScrollOn(false)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollMove)

    return () => {
      document.removeEventListener('scroll', scrollMove)
    }
  }, [])
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
    if (customerHeader.os === OS_TYPE['Android'] || customerHeader.os === OS_TYPE['IOS']) {
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
        style={{position: customHeader['os'] === OS_TYPE['Desktop'] ? 'relative' : 'absolute'}}>
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
                    history.push('/menu/profile')
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
          <span className="evnetText">💛이벤트💛</span> 5레벨이 되면 달 20개 <p className="giftIcon">선물받기</p>
        </button>
        ) : viewLevel === 10 ? (
        <button className="levelEventBanner isRed" onClick={() => history.push('/event/level_achieve')}>
          <span className="evnetText isWhite">💛이벤트💛</span> 10레벨이 되면 달 50개 <p className="giftIcon isRed">선물받기</p>
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
            <div className={`title-wrap ${liveCategoryFixed ? 'fixed' : ''}`}>
              <div className="title">
                <span className="txt" onClick={RefreshFunc}>
                  <img src={liveNew} alt="실시간라이브" width={28} style={{marginRight: '4px'}} />
                  {/* <Lottie
                      options={{
                        loop: true,
                        autoPlay: true,
                        animationData: LiveLottie
                      }}
                      width={24}
                    /> */}
                  {/* <span className="ico-lottie">
                  </span> */}
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

                  {/* {popupMoonState && (
                    <button className="btn__moon" onClick={openPopupMoon}>
                      <img src="https://image.dalbitlive.com/main/common/ico_moon.png" alt="달이 된 병아리" />
                    </button>
                  )} */}
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
                              className={`list ${key.cd === selectedLiveRoomType ? 'active' : ''}`}
                              key={`list-${idx}`}
                              onClick={() => setSelectedLiveRoomType(key.cd)}>
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
                    <LiveList list={liveList} liveListType={liveListType} categoryList={categoryList} />
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
        {payState && <LayerPopupPay info={payState} setPopup={setPayPopup} />}
        {inputState && <LayerPopupInput info={payState} setInputPopup={setInputPopup} />}
        {scrollOn && <AttendEventBtn />}
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
    background-color: #632beb;
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
        color: #632beb;
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
