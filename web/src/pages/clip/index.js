import React, {useContext, useState, useEffect, useRef, useCallback, useMemo} from 'react'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'
import Api from 'context/api'
import Swiper from 'react-id-swiper'
import {Hybrid} from 'context/hybrid'
import {clipJoin, clipReg} from 'pages/common/clipPlayer/clip_func'
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {calcDate, convertMonday} from 'pages/common/rank/rank_fn'
import {OS_TYPE} from 'context/config.js'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import {DATE_TYPE} from 'pages/clip_rank/constant'

// components
import ChartList from './components/chart_list'
import DetailPopup from './components/detail_popup'
import Header from 'components/ui/new_header'
import BannerList from '../main/component/bannerList'
import LayerPopupWrap from '../main/component/layer_popup_wrap'
import ClipRegPopup from './components/clip_reg_popup'
import Layout from 'pages/common/layout'
import NoResult from 'components/ui/noResult'
//static
import newIcon from './static/new_circle_m.svg'
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'
import filterIcon from './static/choose_circle_w.svg'

const arrowRefreshIcon = 'https://image.dalbitlive.com/main/common/ico_refresh.png'
//scss
import './clip.scss'
import {useDispatch, useSelector} from "react-redux";

import {setFormDateType} from "redux/actions/clipRank";

let tempScrollEvent = null
let touchStartY = null
let touchEndY = null
const refreshDefaultHeight = 49
const clipRankingRecords = 100
const clipRankingCheckIdx = 3
export default (props) => {
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)
  const globalCtx = useContext(Context)
  const clipRankState = useSelector(({clipRank}) => clipRank);
  const {formState, clipRankList} = clipRankState

  let history = useHistory()
  const dispatch = useDispatch();
  //swiper
  const swiperParamsRecent = {
    slidesPerView: 'auto',
    spaceBetween: 20
  }

  const goNext = (e) => {
    swiper.slideNext()
    nextCalcDate()
  }

  const nextCalcDate = useCallback(() => {
    const date = calcDate(new Date(context.dateState), 7)
    context.action.updateDateState(convertDateFormat(date, 'YYYY-MM-DD'))
  }, [context.dateState])

  const goPrev = (e) => {
    swiper.slidePrev()
    prevCalcDate()
  }

  const prevCalcDate = useCallback(() => {
    const date = calcDate(new Date(context.dateState), -7)
    context.action.updateDateState(convertDateFormat(date, 'YYYY-MM-DD'))
  }, [context.dateState])

  let swiperParamsBest = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 15,
    loop: false,
    pagination: {
      el: '.swiper-pagination'
    }
  }
  const swiperParamsCategory = {
    slidesPerView: 'auto'
  }
  //fixed category
  const recomendRef = useRef()
  const myClipRef = useRef()
  const rankClipRef = useRef()
  const BannerSectionRef = useRef()
  const categoryBestClipRef = useRef()
  const clipRankingRef = useRef()
  const marketingClipRef = useRef()
  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()
  const liveChartRef = useRef()

  //state
  const [chartListType, setChartListType] = useState('detail') // type: detail, simple
  const [detailPopup, setDetailPopup] = useState(false)
  const [refreshAni, setRefreshAni] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  //list
  const [popularList, setPopularList] = useState([])
  const [popularType, setPopularType] = useState(0)
  const [latestList, setLatestList] = useState([])

  const [myData, setMyData] = useState([])
  const [date, setDate] = useState('')
  const [randomList, setRandomList] = useState([])
  const [myClipToggle, setMyClipToggle] = useState(false)
  // top3 list
  const [listTop3, setListTop3] = useState({})
  const [top3On, setTop3On] = useState(false)
  const [clipType, setClipType] = useState([])
  const [clipTypeActive, setClipTypeActive] = useState('')
  const [selectType, setSelectType] = useState(4)
  // const [selectType, setSelectType] = useState(randomData)
  const [popupData, setPopupData] = useState([])
  const [reloadInit, setReloadInit] = useState(false)

  const [regPopupState, setRegPopupState] = useState(false) // 등록 유도 팝업

  const [clipCategoryFixed, setClipCategoryFixed] = useState(false)
  const [marketingClipList, setMarketingClipList] = useState([])

  const [minRecDate, setMinRecDate] = useState('')
  const [swiper, setSwiper] = useState(null)
  const [tableSwiperIndex, setTableSwiperIndex] = useState(0)
  const [clipRankDayList, setClipRankDayList] = useState([])
  const [clipRankWeekList, setClipRankWeekList] = useState([])

  const swiperParamsDal = {
    // loop: true, //무제한 롤링
    slidesPerView: 'auto',
    centeredSlides: true, //중앙정렬
    spaceBetween: 15, //사이여백
    initialSlide: marketingClipList.length,
    navigation: {
      nextEl: '.btnNext',
      prevEl: '.btnPrev'
    },
    on: {
      init: function () {
        setSwiper(this)
      },
      slideChange: function () {
        setTableSwiperIndex(this['realIndex'])
      }
    }
  }

  //swiperParams...
  let filterArrayTop3 = Object.keys(listTop3)
    .filter((item) => {
      if (listTop3[item].length >= 3) {
        return item
      }
    })
    .map((item) => {
      return listTop3[item]
    })
  swiperParamsBest.loop = filterArrayTop3.length > 1 ? true : false

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      console.log(j)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    // setRandomList(a)
    return a
  }

  //api func
  const fetchDataListPopular = async () => {
    const {result, data, message} = await Api.getPopularList({})
    if (result === 'success') {
      setPopularList(data.list.slice(0, 6))
      setDate(data.checkDate)
      setPopularType(data.type)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const fetchMyData = async () => {
    const {result, data, message} = await Api.getMyClipData({})
    if (result === 'success') {
      setMyData(data)
      if (data.isReg) {
        setRegPopupState(false)
      } else {
        if (Utility.getCookie('reg_popup') === undefined) {
          setRegPopupState(true)
        } else {
          setRegPopupState(false)
        }
      }
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const fetchDataListLatest = async () => {
    const {result, data, message} = await Api.getLatestList({
      listCnt: 10
    })
    if (result === 'success') {
      setLatestList(data.list)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  const fetchClipRankingDayList = async () => {
    const {result, data, message} = await Api.getClipRankingList({
      rankType: DATE_TYPE.DAY,
      rankingDate: convertDateFormat(new Date(), 'YYYY-MM-DD'),
      page: 1,
      records: clipRankingRecords
    })
    if (result === 'success') {
      setClipRankDayList(data.list.slice(0, clipRankingCheckIdx))
    } else {
      setClipRankDayList([])
      context.action.alert({
        msg: message
      })
    }
  }

  const fetchClipRankingWeekList = async () => {
    const {result, data, message} = await Api.getClipRankingList({
      rankType: DATE_TYPE.WEEK,
      rankingDate: convertDateFormat(convertMonday(), 'YYYY-MM-DD'),
      page: 1,
      records: clipRankingRecords
    })
    if (result === 'success') {
      setClipRankWeekList(data.list.slice(0, clipRankingCheckIdx))
    } else {
      setClipRankWeekList([])
      context.action.alert({
        msg: message
      })
    }
  }

  const fetchMarketingClip = async () => {
    const {result, data, message} = await Api.getMarketingClipList({
      recDate: convertDateFormat(convertMonday(), 'YYYY-MM-DD'),
      isLogin: context.token.isLogin,
      isClick: false
    })
    if (result === 'success') {
      setMarketingClipList(data.leaderList)
      setTableSwiperIndex(data.leaderList.length - 1)
      setMinRecDate(data.minRecDate)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const isLast = useMemo(() => {
    const currentDate = convertDateFormat(convertMonday(), 'YYYY-MM-DD')

    if (context.dateState === currentDate) {
      return true
    } else {
      return false
    }
  }, [context.dateState])

  const isLastPrev = useMemo(() => {
    if (context.dateState <= minRecDate) {
      return true
    } else {
      return false
    }
  }, [context.dateState])

  const fetchDataListTop3 = async () => {
    const {result, data, message} = await Api.getMainTop3List({})
    if (result === 'success') {
      setTop3On(true)
      setListTop3(data)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const fetchDataClipType = async () => {
    const {result, data, message} = await Api.getClipType({})
    if (result === 'success') {
      setClipType(data)
      setTop3On(true)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const fetchDataPlay = async (clipNum, type) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      console.log(type)
      let playListInfoData
      if (type === 'recommend') {
        playListInfoData = {
          listCnt: 20,
          playlist: true
        }
      } else if (type === 'new') {
        playListInfoData = {
          slctType: 1,
          dateType: 0,
          page: 1,
          records: 100
        }
      } else if (type === 'theme') {
        playListInfoData = {
          subjectType: data.subjectType,
          listCnt: 100
        }
      }
      localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))

      if (type === 'dal') {
        localStorage.removeItem('clipPlayListInfo')
      }
      clipJoin(data, context)
    } else {
      if (code === '-99') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
  }
  // make contents
  const makePoupularList = () => {
    return popularList.map((item, idx) => {
      if (!item) return null
      const {bgImg, clipNo, type, nickName, subjectType} = item
      return (
        <li
          className="recomClipItem"
          key={`popular-` + idx}
          onClick={() => {
            if (customHeader['os'] === OS_TYPE['Desktop']) {
              if (context.token.isLogin === false) {
                context.action.alert({
                  msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                  callback: () => {
                    history.push('/login')
                  }
                })
              } else {
                context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
              }
            } else {
              fetchDataPlay(clipNo, 'recommend')
            }
          }}
          style={{backgroundImage: `url(${bgImg['thumb336x336']})`}}>
          <span className="clipListCategory">
            {clipType.map((ClipTypeItem, index) => {
              if (ClipTypeItem.value === subjectType) {
                return <React.Fragment key={idx + 'typeList'}>{ClipTypeItem.cdNm}</React.Fragment>
              }
            })}
          </span>
          <p className="recomClipItem__nickName">{nickName}</p>
        </li>
      )
    })
  }
  const makeWeekClipList = (data) => {
    return data.map((v, i) => {
      return (
        <div
          className="weekClip__item"
          key={i}
          onClick={() => {
            goRecommend()
          }}>
          <div className="weekClip__thumb">{v.thumbUrl && <img src={v.thumbUrl} alt="썸네일" />}</div>
          <div className="textBox">
            <p className="textBox__title">{v.titleMsg}</p>
            <div className="textBox__nickName">{v.nickNm}</div>
            <span className="textBox__subject">{v.title}</span>
          </div>
          <button className="playButton">
            <span className="blind">재생 버튼</span>
          </button>
        </div>
      )
    })
  }
  const makeRankList = (data) => {
    return data.map((item, idx) => {
      const {bgImg, clipNo, nickName, title, subjectType} = item
      if (!item) return null
      return (
        <div
          className="slideWrap"
          onClick={() => {
            if (customHeader['os'] === OS_TYPE['Desktop']) {
              if (globalCtx.token.isLogin === false) {
                context.action.alert({
                  msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                  callback: () => {
                    history.push('/login')
                  }
                })
              } else {
                globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
              }
            } else {
              fetchDataPlay(clipNo, 'new')
            }
          }}
          key={`latest-` + idx}
          style={{cursor: 'pointer'}}>
          <div className="slideWrap__thumb">
            <span className="clipListCategory">
              {clipType.map((ClipTypeItem, index) => {
                const {value, cdNm} = ClipTypeItem
                if (value === subjectType) {
                  return <React.Fragment key={idx + 'typeList'}>{cdNm}</React.Fragment>
                }
              })}
            </span>

            <img src={bgImg['thumb190x190']} alt={title} />
          </div>
          <p className="slideWrap__subject">{title}</p>
          <span className="slideWrap__nickName">{nickName}</span>
        </div>
      )
    })
  }
  const makeTop3List = () => {
    return filterArrayTop3.map((item, idx) => {
      let subjectMap = item[0].subjectType
      return (
        <div className="slideWrap" key={idx}>
          {clipType.map((categoryItem, idx) => {
            const {cdNm, value} = categoryItem
            if (subjectMap === value) {
              return (
                <div key={idx}>
                  <h3 className="slideWrap__title">{cdNm}</h3>
                  <button className="slideWrap__btn" value={value}>
                    더보기
                  </button>
                </div>
              )
            }
          })}
          <p className="slideWrap__subTitle">주제별 인기 클립 Top 3</p>
          <ul>
            {item.map((listItem, idx) => {
              const {bgImg, title, nickName, rank, clipNo} = listItem
              return (
                <li
                  className="categoryBestItem"
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      if (globalCtx.token.isLogin === false) {
                        context.action.alert({
                          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                          callback: () => {
                            history.push('/login')
                          }
                        })
                      } else {
                        globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                      }
                    } else {
                      fetchDataPlay(clipNo, 'theme')
                    }
                  }}
                  key={idx + `toplist`}
                  style={{zIndex: 7, cursor: 'pointer'}}>
                  <span className="categoryBestItem__num">{rank}</span>
                  <div className="categoryBestItem__thumb">
                    <img src={bgImg['thumb120x120']} alt="thumb" />
                  </div>
                  <div className="categoryBestItem__text">
                    <p className="categoryBestItem__text--subject">{title}</p>
                    <p className="categoryBestItem__text--nickName">{nickName}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )
    })
  }

  const makeCategoryList = () => {
    return clipType.map((item, idx) => {
      const {cdNm, value} = item
      return (
        <div
          className={clipTypeActive === value ? 'slideWrap active' : 'slideWrap'}
          onClick={() => changeActiveCategory(value)}
          key={idx + `categoryTab`}>
          {cdNm}
        </div>
      )
    })
  }
  const HandleClick = (e) => {
    setClipTypeActive(e.target.value)

    setTimeout(() => {
      window.scrollTo(0, document.getElementsByClassName('liveChart')[0].offsetTop)
      context.action.updateClipSort(2)
    }, 150)
  }
  const handleScroll = (e) => {
    const item = document.getElementsByClassName('liveChart')[0]
    window.scrollTo({top: item.offsetTop, behavior: 'smooth'})
    setTimeout(() => {}, 150)
  }
  const changeActiveCategory = (value) => {
    setClipTypeActive(value)
    if (scrollY !== 0) {
      window.scrollTo(0, scrollY)
    }
  }
  const changeActiveSort = (value) => {
    if (value === selectType) {
      refreshCategory()
    } else {
      setSelectType(value)
    }
    if (scrollY !== 0) {
      window.scrollTo(0, scrollY)
    }
  }
  // initial category
  const refreshCategory = (type) => {
    // setClipTypeActive('')
    if (scrollY !== 0) {
      window.scrollTo(0, scrollY)
    }

    if (context.clipRefresh && type === 'category') {
      context.action.updatClipRefresh(false)
    } else if (type === 'popular') {
      fetchDataListPopular()
    } else {
      context.action.updatClipRefresh(true)
    }

    if (refreshAni) {
      setRefreshAni(false)
    } else {
      setRefreshAni(true)
    }
    setTimeout(() => {
      setRefreshAni(false)
    }, 360)
  }
  // #layer pop func
  const popStateEvent = (e) => {
    if (e.state === null) {
      setDetailPopup(false)
    } else if (e.state === 'layer') {
      setDetailPopup(true)
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

  // scroll fixed func
  const windowScrollEvent = () => {
    const ClipHeaderHeight = 120
    const myClipNode = myClipRef.current
    const recomendClipNode = recomendRef.current
    const BannerSectionNode = BannerSectionRef.current
    const rankClipNode = rankClipRef.current
    const rankingClipNode = clipRankingRef.current
    const marketingClipNode = marketingClipRef.current
    const categoryBestClipNode = categoryBestClipRef.current
    const myClipHeight = myClipNode && myClipNode.clientHeight
    const RecomendHeight = recomendClipNode && recomendClipNode.clientHeight
    const categoryBestHeight = categoryBestClipNode && categoryBestClipNode.clientHeight
    const rankClipHeight = rankClipNode && rankClipNode.clientHeight
    const rankingClipHeight = rankingClipNode ? rankingClipNode.clientHeight : 0
    const marketingClipHeight = marketingClipNode ? marketingClipNode.clientHeight : 0
    const BannerSectionHeight = BannerSectionNode && BannerSectionNode.clientHeight
    const TopSectionHeight =
      ClipHeaderHeight +
      myClipHeight +
      RecomendHeight +
      rankingClipHeight +
      marketingClipHeight +
      categoryBestHeight +
      rankClipHeight +
      BannerSectionHeight -
      20
    // console.log(TopSectionHeight)
    if (window.scrollY >= liveChartRef.current.offsetTop) {
      setClipCategoryFixed(true)
      setScrollY(TopSectionHeight)
    } else {
      setClipCategoryFixed(false)
      setScrollY(0)
    }
  }

  const clipTouchStart = useCallback((e) => {
    if (reloadInit === true || window.scrollY !== 0) return
    touchStartY = e.touches[0].clientY
  }, [])

  const clipTouchMove = useCallback((e) => {
    if (reloadInit === true || window.scrollY !== 0) return
    const iconWrapNode = iconWrapRef.current
    const refreshIconNode = arrowRefreshRef.current

    touchEndY = e.touches[0].clientY
    const ratio = 3
    const heightDiff = (touchEndY - touchStartY) / ratio
    const heightDiffFixed = 80

    if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
      if (heightDiff <= heightDiffFixed) {
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        refreshIconNode.style.transform = `rotate(${heightDiff * ratio}deg)`
      }
    }
  }, [])

  const clipTouchEnd = useCallback(
    async (e) => {
      if (reloadInit === true) return

      const ratio = 3
      const transitionTime = 150
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      const heightDiff = (touchEndY - touchStartY) / ratio
      const heightDiffFixed = 80
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

          const loadIntervalId = setInterval(() => {
            if (Math.abs(current_angle) === 360) {
              current_angle = 0
            }
            current_angle += 10
            refreshIconNode.style.transform = `rotate(${current_angle}deg)`
          }, 17)

          fetchDataListLatest()
          fetchDataListPopular()
          fetchDataListTop3()
          if (context.token.isLogin) fetchMyData()
          context.action.updatClipRefresh(!context.clipRefresh)

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
    },
    [reloadInit, context.clipRefresh]
  )
  const toggleMyClip = (e) => {
    e.stopPropagation()
    if (myClipToggle) {
      setMyClipToggle(false)
    } else {
      setMyClipToggle(true)
    }
  }

  const goRecommend = () => {
    history.push('/clip_recommend')
    context.action.updateDateState(context.dateState)
  }

  function loginCheck(memNo) {
    if (!context.token.isLogin) {
      history.push(`/login?redirect=/mypage/${memNo}`)
    } else {
      history.push(`/mypage/${memNo}`)
    }
  }

  // const goClip = (tabParam, tabParam) => {
  //   if (tabParam === 0) {
  //     context.action.updateClipTab(0)
  //   } else if (tabParam === 1) {
  //     context.action.updateClipTab(1)
  //   }
  //   history.push(`/mypage/${context.token.memNo}/my_clip?tab=${tabParam}&subTab=${subTabParam}`)
  // }

  const goClip = (tab) => {
    context.action.updateClipTab(+tab)
    history.push(`/mypage/${context.token.memNo}/my_clip`)
  }

  const goClipReg = (type) => {
    if (customHeader['os'] === OS_TYPE['Desktop']) {
      context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
    } else {
      if (context.token.isLogin === false) {
        return context.action.alert({
          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        if (type === 'recording') {
          clipReg('record', globalCtx)
        } else if (type === 'upload') {
          clipReg('upload', globalCtx)
        }
      }
    }
  }

  useEffect(() => {
    //swiper-slide-duplicate onClick 붙지않는 이슈떄문에 addEventListener처리
    if (Object.values(listTop3).length > 0) {
      const btnElem = document.getElementsByClassName('slideWrap__btn')
      for (let i = 0; i < btnElem.length; i++) {
        btnElem[i].addEventListener('click', HandleClick, false)
      }
    }
  }, [listTop3])
  useEffect(() => {
    if (detailPopup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/#layer')
      }
    } else if (!detailPopup) {
      if (window.location.hash === '#layer') {
        window.history.back()
      }
    }
  }, [detailPopup])
  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])
  useEffect(() => {
    fetchDataListTop3()
    fetchDataListPopular()
    fetchDataListLatest()
    fetchDataClipType()
    fetchMainPopupData(13)
    if (context.token.isLogin === true) {
      fetchMyData()
    }
    context.action.updateDateState(convertDateFormat(convertMonday(), 'YYYY-MM-DD'))
    fetchMarketingClip()
  }, [])

  useEffect(() => {
    if (formState.dateType === DATE_TYPE.DAY) {
      fetchClipRankingDayList()
    } else {
      fetchClipRankingWeekList()
    }
  }, [formState.dateType])

  useEffect(() => {
    window.removeEventListener('scroll', tempScrollEvent)
    window.addEventListener('scroll', windowScrollEvent)
    tempScrollEvent = windowScrollEvent

    return () => {
      window.removeEventListener('scroll', tempScrollEvent)
    }
  }, [])
  useEffect(() => {
    if (myData && myData.regCnt === 0 && myData.playCnt === 0 && myData.goodCnt === 0 && myData.byeolCnt === 0) {
      setMyClipToggle(false)
    } else {
      setMyClipToggle(true)
    }
  }, [myData])

  useEffect(() => {
    if (marketingClipList.length > 0) {
      const date = marketingClipList[tableSwiperIndex].recDate
      context.action.updateDateState(convertDateFormat(date, 'YYYY-MM-DD'))
    }
  }, [tableSwiperIndex, marketingClipList])

  return (
    <Layout {...props} status="no_gnb">
      <div id="clipPage" onTouchStart={clipTouchStart} onTouchMove={clipTouchMove} onTouchEnd={clipTouchEnd}>
        <Header type="noBack">
          <span
            className="searchIcon"
            onClick={() =>
              history.push({
                pathname: '/menu/search',
                state: {
                  state: 'clip_search'
                }
              })
            }></span>
          <h2 className="header-title">클립</h2>
        </Header>

        <div className="refresh-wrap rank" ref={iconWrapRef}>
          <div className="icon-wrap">
            <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} />
          </div>
        </div>
        {context.token.isLogin === true ? (
          <>
            <div className="clipRegWrap">
              <button className="clipReg__button" onClick={() => goClipReg('recording')}>
                클립 녹음
              </button>
              <button className="clipReg__button" onClick={() => goClipReg('upload')}>
                클립 업로드
              </button>
            </div>
            <div className="myClip" ref={myClipRef}>
              <h3 className="clipTitle" style={{paddingBottom: !myClipToggle ? '0' : '18px'}}>
                <em
                  onClick={() => {
                    context.action.updatePopup('MYCLIP')
                  }}>
                  내 클립 현황
                </em>
                <div className="myClip__arrow" onClick={(e) => toggleMyClip(e)}>
                  {myClipToggle ? '접기' : '더보기'}
                  <img
                    src={
                      myClipToggle
                        ? `https://image.dalbitlive.com/svg/ico_arrow_up_b.svg`
                        : `https://image.dalbitlive.com/svg/ico_arrow_down_b.svg`
                    }
                    alt="마이클립 화살표 버튼"
                  />
                </div>
              </h3>
              {myClipToggle && (
                <ul className="myClipWrap">
                  {/* <li className="upload" onClick={() => goClip(0, 0)}> */}
                  <li className="upload" onClick={() => goClip(0)}>
                    <em></em>
                    <span>{myData.regCnt > 999 ? Utility.printNumber(myData.regCnt) : Utility.addComma(myData.regCnt)} 건</span>
                  </li>
                  {/* <li className="listen" onClick={() => goClip(1, 0)}> */}
                  <li className="listen" onClick={() => goClip(1)}>
                    <em></em>
                    <span>
                      {myData.playCnt > 999 ? Utility.printNumber(myData.playCnt) : Utility.addComma(myData.playCnt)} 회
                    </span>
                  </li>
                  {/* <li className="like" onClick={() => goClip(1, 1)}> */}
                  <li className="like" onClick={() => goClip(2)}>
                    <em></em>
                    <span>
                      {myData.goodCnt > 999 ? Utility.printNumber(myData.goodCnt) : Utility.addComma(myData.goodCnt)} 개
                    </span>
                  </li>
                  {/* <li className="gift" onClick={() => goClip(1, 2)}> */}
                  <li className="gift" onClick={() => goClip(3)}>
                    <em></em>
                    <span>
                      {myData.byeolCnt > 999 ? Utility.printNumber(myData.byeolCnt) : Utility.addComma(myData.byeolCnt)} 별
                    </span>
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : context.token.isLogin === true ? (
          <div ref={myClipRef} style={{minHeight: '127px'}}></div>
        ) : (
          <div ref={myClipRef}></div>
        )}
        {popularList.length > 0 ? (
          <div className="recomClip" ref={recomendRef}>
            <div className="recomClip__title">
              <h3 className="clipTitle">{popularType === 0 ? '인기 클립' : '당신을 위한 추천 클립'}</h3>
              <div className="recomClip__title__rightSide">
                <span className="recomClip__title__date">매일 00시, 12시 갱신</span>
                <button
                  className={`btn__refresh ${refreshAni ? ' btn__refresh--active' : ''}`}
                  onClick={() => refreshCategory('popular')}>
                  <img
                    src={'https://image.dalbitlive.com/main/200714/ico-refresh-gray.png'}
                    alt="인기클립 리프래시 아이콘 이미지"
                  />
                </button>
              </div>
            </div>
            <ul className="recomClipBox">{makePoupularList()}</ul>
          </div>
        ) : (
          <div ref={recomendRef}></div>
        )}

        {clipRankDayList.length > 0 || clipRankWeekList.length > 0 ? (
          <div className="rankClip" ref={clipRankingRef}>
            <div className="rankClip__titleBox">
              <h3
                className="rankClip__title"
                onClick={() => {
                  history.push('/clip_rank')
                  dispatch(setFormDateType(formState.dateType));
                }}>
                클립 랭킹
              </h3>
              <div className="rankClip__moreButton">
                <button
                  className={`${formState.dateType === DATE_TYPE.DAY ? 'isActive' : ''}`}
                  onClick={() => {
                    dispatch(setFormDateType(DATE_TYPE.DAY));
                  }}>
                  일간
                </button>
                <button
                  className={`${formState.dateType === DATE_TYPE.WEEK ? 'isActive' : ''}`}
                  onClick={() => {
                    dispatch(setFormDateType(DATE_TYPE.WEEK));
                  }}>
                  주간
                </button>
              </div>
            </div>
            <ul className="rankClipList">
              {formState.dateType === DATE_TYPE.DAY
                ? clipRankDayList.map((v, i) => {
                    return (
                      <li
                        key={`day-${i}`}
                        className="rankClipListItem"
                        onClick={() => {
                          if (customHeader['os'] === OS_TYPE['Desktop']) {
                            if (context.token.isLogin === false) {
                              context.action.alert({
                                msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                                callback: () => {
                                  history.push('/login')
                                }
                              })
                            } else {
                              context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                            }
                          } else {
                            fetchDataPlay(v.clipNo, 'dal')
                          }
                        }}>
                        <div className="rankClipListItem__thumb">
                          <img src={v.bgImg.thumb336x336} alt="클립 랭킹 이미지" />
                        </div>
                        <p className="rankClipListItem__title">{v.title}</p>
                        <p className="rankClipListItem__nickName">{v.nickName}</p>
                      </li>
                    )
                  })
                : clipRankWeekList.map((v, i) => {
                    return (
                      <li key={`week-${i}`} className="rankClipListItem week" onClick={() => loginCheck(v.memNo)}>
                        <div className="rankClipListItem__thumb">
                          <img src={v.profImg.thumb336x336} alt="클립 랭킹 이미지" />
                        </div>
                        <p className="rankClipListItem__title">{v.nickName}</p>
                      </li>
                    )
                  })}
            </ul>
          </div>
        ) : (
          <></>
        )}

        <div className="clipBanner" style={{minHeight: '95px'}}>
          <BannerList ref={BannerSectionRef} bannerPosition="10" type="clip" />
        </div>

        {/* {marketingClipList.length > 0 && (
          <div className="weekClip" ref={marketingClipRef}>
            <div className="weekClip__titleBox">
              <h3
                className="weekClip__title"
                onClick={() => {
                  goRecommend()
                  context.action.updateDateState(context.dateState)
                }}>
                주간 클립테이블
              </h3>
              <div className="weekClip__moreButton">
                <button
                  className={`btnPrev`}
                  disabled={isLastPrev === true}
                  onClick={(e) => {
                    goPrev(e)
                  }}>
                  이전
                </button>
                <button
                  className={`btnNext`}
                  disabled={isLast === true}
                  onClick={(e) => {
                    goNext(e)
                  }}>
                  다음
                </button>
              </div>
            </div>

            <div className="weekClip__list">
              {marketingClipList.length > 0 ? (
                <Swiper {...swiperParamsDal}>{makeWeekClipList(marketingClipList)}</Swiper>
              ) : (
                <NoResult text="주간 클립 테이블이 없습니다." />
              )}
            </div>
          </div>
        )} */}
        <div className="rankClip" ref={rankClipRef}>
          <div className="titleBox">
            <h3 className="clipTitle isArrow" onClick={handleScroll}>
              최신 클립
            </h3>
            <p className="warn">음원, MR 등 직접 제작하지 않은 클립은 삭제됩니다.</p>
          </div>
          {latestList.length > 0 ? <Swiper {...swiperParamsRecent}>{makeRankList(latestList)}</Swiper> : <></>}
        </div>

        {top3On && Object.keys(listTop3).length !== 0 ? (
          <div className="categoryBest" ref={categoryBestClipRef}>
            <Swiper {...swiperParamsBest}>{listTop3 && makeTop3List()}</Swiper>
          </div>
        ) : (
          <div ref={categoryBestClipRef}></div>
        )}

        <div className="liveChart" ref={liveChartRef}>
          <div className={`fixedArea ${clipCategoryFixed ? 'on' : ''}`}>
            <div className="titleBox">
              <h3 onClick={() => refreshCategory('category')} className="clipTitle">
                실시간 클립
              </h3>
              <button type="button" onClick={() => setDetailPopup(true)} className="sortCate">
                {context.clipMainSort === 1 && <span>최신순</span>}
                {context.clipMainSort === 3 && <span>선물순</span>}
                {context.clipMainSort === 4 && <span>재생순</span>}
                {context.clipMainSort === 2 && <span>인기순</span>}
                {context.clipMainSort === 6 && <span>랜덤</span>}
                {context.clipMainSort === 5 && <span>스페셜DJ</span>}
                <img src={filterIcon} alt="카테고리 필터 이미지" />
              </button>
              <div className="sequenceBox">
                <div className="sequenceItem">
                  <button type="button" className="btnSequence" onClick={() => setChartListType('detail')}>
                    <img
                      src={chartListType === 'detail' ? detailListIconActive : detailListIcon}
                      alt="카테고리 디테일 버튼 이미지"
                    />
                  </button>
                  <button type="button" className="btnSequence" onClick={() => setChartListType('simple')}>
                    <img
                      src={chartListType === 'simple' ? simpleListIconActive : simpleListIcon}
                      alt="카테고리 심플 버튼 이미지"
                    />
                  </button>
                  <button className="btnRefresh" onClick={() => refreshCategory(`category`)}>
                    <img
                      src={'https://image.dalbitlive.com/main/200714/ico-refresh-gray.png'}
                      className={refreshAni ? 'refresh-icon refresh-icon--active' : 'refresh-icon'}
                      style={{cursor: 'pointer'}}
                      alt="클립 카테고리 Refresh 아이콘"
                    />
                  </button>
                </div>
              </div>
            </div>
            {clipType.length > 0 ? (
              <Swiper {...swiperParamsCategory}>
                <div
                  className={clipTypeActive === '' ? 'slideWrap active' : 'slideWrap'}
                  onClick={() => changeActiveCategory('')}>
                  전체
                </div>
                {makeCategoryList()}
              </Swiper>
            ) : (
              <></>
            )}
          </div>
          <div style={clipCategoryFixed ? {paddingTop: `104px`} : {}}>
            <ChartList
              chartListType={chartListType}
              clipTypeActive={clipTypeActive}
              clipType={clipType}
              selectType={selectType}
            />
          </div>
        </div>
      </div>
      {regPopupState && <ClipRegPopup setRegPopupState={setRegPopupState} />}
      {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
      {detailPopup && <DetailPopup setDetailPopup={setDetailPopup} />}
    </Layout>
  )
}
