/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import {NavLink} from 'react-router-dom'
//context
import Api from 'context/api'
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import {StoreLink} from 'context/link'
import Lottie from 'react-lottie'

// components
import Layout from 'pages/common/layout'
import MainSlideList from './component/mainSlideList.js'
import LiveList from './component/livelist.js'
import RankList from './component/rankList.js'
import BannerList from './component/bannerList.js'
import StarList from './component/starList.js'
import LayerPopup from './component/layer_popup.js'
import LayerPopupWrap from './component/layer_popup_wrap.js'
import LayerPopupPay from './component/layer_popup_pay.js'
import NoResult from './component/NoResult.js'
import {OS_TYPE} from 'context/config.js'

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
import arrowRefreshIcon from './static/ic_arrow_refresh.svg'
import CrownIcon from './static/crown.jpg'
import CrownLottie from './static/crown_lottie.json'

import 'styles/main.scss'

let concatenating = false
let tempScrollEvent = null

const records = 30

let touchStartY = null
let touchEndY = null

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

  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')

  const [livePage, setLivePage] = useState(1)
  const [totalLivePage, setTotalLivePage] = useState(null)

  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false)
  const [categoryList, setCategoryList] = useState([{sorNo: 0, cd: '', cdNm: '전체'}])
  const customHeader = JSON.parse(Api.customHeader)

  const [payState, setPayState] = useState(false)

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
          setCategoryList(concatenated)
        }
      }
    })
  }, [])

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
        const {totalPage, next} = paging
        setLivePage(next)
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
        const {totalPage, next} = paging
        setLivePage(next)
        setTotalLivePage(totalPage)
      }
      setLiveList(list)
    }
  }

  const concatLiveList = async () => {
    concatenating = true

    const broadcastList = await Api.broad_list({
      params: {
        page: livePage,
        records: records,
        roomType: selectedLiveRoomType,
        searchType: liveAlign,
        gender: liveGender
      }
    })

    if (broadcastList.result === 'success') {
      const {list, paging} = broadcastList.data
      if (paging) {
        const {totalPage, next} = paging
        setLivePage(next)
        setTotalLivePage(totalPage)
      }

      const currentList = [...liveList]
      const concatenated = currentList.concat(list)
      setLiveList(concatenated)
    }
  }

  const windowScrollEvent = () => {
    const GnbHeight = 48
    const sectionMarginTop = 24
    const LiveTabDefaultHeight = 48

    const MainNode = MainRef.current
    const SubMainNode = SubMainRef.current
    const RecommendNode = RecommendRef.current
    const RankSectionNode = RankSectionRef.current
    const StarSectionNode = StarSectionRef.current
    const BannerSectionNode = BannerSectionRef.current

    const LiveSectionNode = LiveSectionRef.current

    const MainHeight = MainNode.clientHeight
    const SubMainHeight = SubMainNode.clientHeight
    const RecommendHeight = RecommendNode.clientHeight
    const RankSectionHeight = RankSectionNode.clientHeight
    const StarSectionHeight = StarSectionNode.style.display !== 'none' ? StarSectionNode.clientHeight : 0
    const BannerSectionHeight = BannerSectionNode.clientHeight

    const LiveSectionHeight = LiveSectionNode.clientHeight + sectionMarginTop

    const TopSectionHeight = SubMainHeight + RecommendHeight + RankSectionHeight + StarSectionHeight + BannerSectionHeight

    if (window.scrollY >= TopSectionHeight) {
      setLiveCategoryFixed(true)
    } else {
      setLiveCategoryFixed(false)
    }

    const GAP = 300

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

      if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        refreshIconNode.style.transform = `rotate(${-(heightDiff * ratio)}deg)`
      }
    },
    [reloadInit]
  )

  const mainTouchEnd = useCallback(
    async (e) => {
      if (reloadInit === true) return

      const ratio = 3
      const transitionTime = 150
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      const heightDiff = (touchEndY - touchStartY) / ratio

      if (heightDiff >= 100) {
        let current_angle = (() => {
          const str_angle = refreshIconNode.style.transform
          console.log(str_angle)
          let head_slice = str_angle.slice(7)
          let tail_slice = head_slice.slice(0, 4)
          return Number(tail_slice)
        })()
        console.log(current_angle)
        if (typeof current_angle === 'number') {
          setReloadInit(true)
          iconWrapNode.style.transitionDuration = `${transitionTime}ms`
          iconWrapNode.style.height = `${refreshDefaultHeight + 50}px`

          const loadIntervalId = setInterval(() => {
            if (Math.abs(current_angle) === 360) {
              current_angle = 0
            }
            current_angle -= 10
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
        <div ref={SubMainRef} className="main-gnb">
          <div className="left-side">
            <div className="tab">
              <NavLink
                className="tab__item"
                activeClassName={'tab__item--active'}
                onClick={(event) => {
                  event.preventDefault()
                  StoreLink(globalCtx, history)
                }}
                to={'/'}>
                라이브
              </NavLink>
            </div>
            {globalCtx.isDevIp ? (
              <>
                <div className="tab tab--yellow">
                  <NavLink
                    className="tab__item newicon"
                    activeClassName={'tab__item--active'}
                    to={'/clip'}
                    onClick={(event) => {
                      event.preventDefault()
                      history.push('/clip')
                    }}>
                    클립
                    {/* 클립<i>NEW</i> */}
                  </NavLink>
                </div>
              </>
            ) : (
              <>
                <div className="tab tab--yellow">
                  <NavLink
                    className="tab__item newicon"
                    activeClassName={'tab__item--active'}
                    to={'/clip_open'}
                    onClick={(event) => {
                      event.preventDefault()
                      history.push('/clip_open')
                    }}>
                    클립<i>NEW</i>
                  </NavLink>
                </div>
              </>
            )}

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

        <div ref={RecommendRef} className="main-slide">
          {reloadInit === false && Array.isArray(initData.recommend) && <MainSlideList list={initData.recommend} />}
        </div>
        <div className="main-content">
          <div className="section rank" ref={RankSectionRef}>
            <div className="title-wrap">
              <button className="title" onClick={() => goRank()}>
                <Lottie
                  options={{
                    loop: true,
                    autoPlay: true,
                    animationData: CrownLottie
                  }}
                  width={40}
                />
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
            <div className="content-wrap my-star-list">
              <StarList list={initData.myStar} />
            </div>
          </div>

          <div className="section live-list" ref={LiveSectionRef}>
            <div className={`title-wrap ${liveCategoryFixed ? 'fixed' : ''}`}>
              <div className="title">
                <span className="txt">실시간 LIVE</span>
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
                  <button
                    className={`btn__refresh ${liveRefresh ? 'btn__refresh--active' : ''}`}
                    onClick={async () => {
                      // setReloadInit(true)
                      // await fetchMainInitData()
                      setLiveRefresh(true)
                      await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
                      await fetchLiveList(true)
                      setLiveRefresh(false)
                      // setReloadInit(false)
                    }}>
                    <img src="https://image.dalbitlive.com/main/200714/ico-refresh-gray.svg" alt="새로고침" />
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

            <div className="content-wrap" style={{paddingTop: liveCategoryFixed && '105px'}}>
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

        {payState && <LayerPopupPay info={payState} setPopup={setPayPopup} />}
      </div>
    </Layout>
  )
}
