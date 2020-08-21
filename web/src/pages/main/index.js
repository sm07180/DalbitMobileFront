/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'

//context
import Api from 'context/api'
import {Context} from 'context'
import {StoreLink} from 'context/link'

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

// static
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'
import refreshIcon from './static/refresh_g.svg'
import sortIcon from './static/choose_circle_w.svg'
import RankArrow from './static/arrow_right_b.svg'
import arrowRefreshIcon from './static/ic_arrow_refresh.svg'

import {RoomMake} from 'context/room'
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

  //context
  const globalCtx = useContext(Context)
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

  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')

  const [livePage, setLivePage] = useState(1)
  const [totalLivePage, setTotalLivePage] = useState(null)

  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false)
  const [categoryList, setCategoryList] = useState([{sorNo: 0, cd: '', cdNm: '전체'}])
  const customHeader = JSON.parse(Api.customHeader)

  const [payState, setPayState] = useState(false)

  useEffect(() => {
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
        sessionStorage.setItem('ranking_tab', 'fan')
      } else {
        setRankType('dj')
        sessionStorage.setItem('ranking_tab', 'dj')
      }
    } else {
      const randomData = Math.random() >= 0.5 ? 'dj' : 'fan'
      setRankType(randomData)
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

    const TopSectionHeight = SubMainHeight + RecommendHeight + RankSectionHeight + StarSectionHeight + BannerSectionHeight + 64

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
            sessionStorage.setItem('ranking_tab', 'fan')
          } else {
            setRankType('dj')
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
              <Link
                to={'/rank'}
                onClick={(event) => {
                  event.preventDefault()
                  history.push('/rank')
                }}>
                랭킹
              </Link>
            </div>
            <div className="tab">
              <Link
                onClick={(event) => {
                  event.preventDefault()
                  StoreLink(globalCtx, history)
                }}
                to={'/rank'}>
                스토어
              </Link>
            </div>
          </div>
          <button
            className="broadBtn"
            onClick={() => {
              if (customHeader['os'] === OS_TYPE['Desktop']) {
                window.location.href = 'https://inforexseoul.page.link/Ws4t'
              } else {
                if (!broadcastBtnActive) {
                  RoomMake(globalCtx)
                  setBroadcastBtnActive(true)
                  setTimeout(() => setBroadcastBtnActive(false), 3000)
                }
              }
            }}>
            방송하기
          </button>
        </div>

        <div ref={RecommendRef} className="main-slide">
          {reloadInit === false && Array.isArray(initData.recommend) && <MainSlideList list={initData.recommend} />}
        </div>
        <div className="main-content">
          <div className="section rank" ref={RankSectionRef}>
            <div className="title-wrap">
              <button className="title" onClick={() => goRank()}>
                <div className="txt">실시간 랭킹</div>
                <img className="rank-arrow" src={RankArrow} />
              </button>
              <div className="right-side">
                <button className={`text ${rankType === 'dj' ? 'active' : ''}`} onClick={() => setRankType('dj')}>
                  DJ
                </button>
                <i className="bar"></i>
                <button className={`text ${rankType === 'fan' ? 'active' : ''}`} onClick={() => setRankType('fan')}>
                  팬
                </button>
              </div>
            </div>

            <div className="content-wrap rank-slide">
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
            <div className="title-wrap">
              <div className="title">
                <span className="txt">실시간 LIVE</span>
                <button
                  className="refresh-icon"
                  onClick={async () => {
                    setReloadInit(true)
                    await fetchMainInitData()
                    await fetchLiveList(true)
                    setReloadInit(false)
                  }}>
                  <img src={refreshIcon} alt="실시간 라이브 리스트 새로고침하기" />
                </button>
              </div>

              <div className="sequence-wrap">
                <span className="text" onClick={() => setPopup(popup ? false : true)}>
                  {(() => {
                    return liveAlign ? `${alignSet[liveAlign]}순` : '전체'
                  })()}
                </span>
                <button className="sequence-icon" onClick={() => setPopup(popup ? false : true)}>
                  <img src={sortIcon} alt="검색 정렬하기" />
                </button>
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
              </div>
            </div>

            <div className={`live-list-category ${liveCategoryFixed ? 'fixed' : ''}`}>
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

            {liveCategoryFixed && <div style={{height: '36px'}} />}

            <div className="content-wrap">
              {Array.isArray(liveList) ? (
                liveList.length > 0 && categoryList.length > 1 ? (
                  <LiveList list={liveList} liveListType={liveListType} categoryList={categoryList} />
                ) : (
                  <NoResult />
                )
              ) : (
                <div style={{height: '315px'}}></div>
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
