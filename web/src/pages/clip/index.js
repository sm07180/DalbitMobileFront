//
import React, {useContext, useState, useEffect, useRef} from 'react'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'
import Swiper from 'react-id-swiper'
import {Hybrid} from 'context/hybrid'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
//layout
import Layout from 'pages/common/layout'
// components
import ChartList from './components/chart_list'
import DetailPopup from './components/detail_popup'
import Header from 'components/ui/new_header'
//scss
import './clip.scss'
//static
import newIcon from './static/new_circle_m.svg'
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'
// header scroll flag
let tempScrollEvent = null
let randomData = Math.random() >= 0.5 ? 0 : 4
export default (props) => {
  const context = useContext(Context)

  let history = useHistory()
  //fixed category
  const recomendRef = useRef()
  const recentClipRef = useRef()
  const categoryBestClipRef = useRef()
  const [clipCategoryFixed, setClipCategoryFixed] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  //swiper
  const swiperParamsRecent = {
    slidesPerView: 'auto',
    spaceBetween: 20
  }
  const swiperParamsBest = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 15,
    loop: true,
    pagination: {
      el: '.swiper-pagination'
    }
  }
  const swiperParamsCategory = {
    slidesPerView: 'auto',
    slidesPerView: 'auto'
  }
  //state
  const [chartListType, setChartListType] = useState('detail') // type: detail, simple
  const [detailPopup, setDetailPopup] = useState(false)
  //list
  const [popularList, setPopularList] = useState([])
  const [popularType, setPopularType] = useState(0)
  const [latestList, setLatestList] = useState([])
  const [selectType, setSelectType] = useState(randomData)
  // top3 list
  const [listTop3, setListTop3] = useState({})
  const [top3On, setTop3On] = useState(false)
  // common state
  const [clipType, setClipType] = useState([])
  const [clipTypeActive, setClipTypeActive] = useState('')
  const [refreshAni, setRefreshAni] = useState(false)
  // scroll fixed func
  const windowScrollEvent = () => {
    const ClipHeaderHeight = 50
    const recomendClipNode = recomendRef.current
    const recentClipNode = recentClipRef.current
    const categoryBestClipNode = categoryBestClipRef.current
    const RecomendHeight = recomendClipNode.clientHeight
    const categoryBestHeight = categoryBestClipNode.clientHeight
    const recentClipHeight = recentClipNode.clientHeight
    const TopSectionHeight = ClipHeaderHeight + RecomendHeight + categoryBestHeight + recentClipHeight
    if (window.scrollY >= TopSectionHeight) {
      setClipCategoryFixed(true)
      setScrollY(TopSectionHeight)
    } else {
      setClipCategoryFixed(false)
      setScrollY(0)
    }
  }
  //api func
  const fetchDataListPopular = async () => {
    const {result, data, message} = await Api.getPopularList({})
    if (result === 'success') {
      setPopularList(data.list)
      setPopularType(data.type)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const fetchDataListLatest = async () => {
    const {result, data, message} = await Api.getLatestList({})
    if (result === 'success') {
      setLatestList(data.list)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
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
  // 플레이가공
  const fetchDataPlay = async (clipNum) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
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
      const {bgImg, clipNo, type, nickName} = item
      return (
        <li className="recomClipItem" key={`popular-` + idx} onClick={() => fetchDataPlay(clipNo)} style={{cursor: 'pointer'}}>
          <div className="recomClipItem__thumb">
            <img src={bgImg['thumb336x336']} alt="thumb" />
          </div>
          <p className="recomClipItem__nickName">{nickName}</p>
        </li>
      )
    })
  }
  const makeLatestList = () => {
    return latestList.map((item, idx) => {
      const {bgImg, clipNo, nickName, title} = item
      if (!item) return null
      return (
        <div className="slideWrap" onClick={() => fetchDataPlay(clipNo)} key={`latest-` + idx} style={{cursor: 'pointer'}}>
          <div className="slideWrap__thumb">
            <img src={bgImg['thumb336x336']} alt={title} />
          </div>
          <i className="slideWrap__iconNew">
            <img src={newIcon} />
          </i>
          <p className="slideWrap__subject">{title}</p>
          <p className="slideWrap__nicknName">{nickName}</p>
        </div>
      )
    })
  }
  const makeTop3List = () => {
    return Object.values(listTop3).map((item, idx) => {
      if (item.length === 0) return null
      let subjectMap = item[0].subjectType
      return (
        <div className="slideWrap" key={idx} style={{display: item.length !== 3 ? 'none' : 'block'}}>
          <h3 className="slideWrap__title">
            {clipType.map((item, idx) => {
              const {cdNm, value} = item
              if (subjectMap === value) {
                return cdNm
              }
            })}
          </h3>
          <p className="slideWrap__subTitle">주제별 인기 클립 Top 3</p>
          <ul>
            {item.map((item, idx) => {
              const {bgImg, title, nickName, rank, clipNo} = item
              return (
                <li
                  className="categoryBestItem"
                  onClick={() => fetchDataPlay(clipNo)}
                  key={idx + `toplist`}
                  style={{zIndex: 7, cursor: 'pointer'}}>
                  <span className="categoryBestItem__num">{rank}</span>
                  <div className="categoryBestItem__thumb">
                    <img src={bgImg['thumb336x336']} alt="thumb" />
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
  // initial category
  const refreshCategory = () => {
    // setClipTypeActive('')
    if (scrollY !== 0) {
      window.scrollTo(0, scrollY)
    }
    // context.action.updateClipSort(0)
    //context.action.updateClipGender('')
    if (context.clipRefresh) {
      context.action.updatClipRefresh(false)
      // context.action.updateClipGender(false)
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
  // #layer pop
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
  //---------------------------------------------------------
  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])
  //------------------------------------------------------
  useEffect(() => {
    fetchDataListPopular()
    fetchDataListLatest()
    fetchDataListTop3()
    fetchDataClipType()
  }, [])
  //---------------------------------------
  useEffect(() => {
    window.removeEventListener('scroll', tempScrollEvent)
    window.addEventListener('scroll', windowScrollEvent)
    tempScrollEvent = windowScrollEvent

    return () => {
      window.removeEventListener('scroll', tempScrollEvent)
    }
  }, [])
  //---------------------------------------------------------------------

  return (
    <Layout {...props} status="no_gnb">
      <Header title="클립" />
      <div id="clipPage">
        {popularList.length > 0 ? (
          <div className="recomClip" ref={recomendRef}>
            <h2 className="recomClip__title">{popularType === 0 ? '인기 클립' : '당신을 위한 추천 클립'}</h2>
            <ul className="recomClipBox">{makePoupularList()}</ul>
          </div>
        ) : (
          <div ref={recomendRef}></div>
        )}
        <div className="recentClip" ref={recentClipRef}>
          <h2 className="recentClip__title">최신 클립</h2>
          {latestList.length > 0 ? <Swiper {...swiperParamsRecent}>{makeLatestList()}</Swiper> : <></>}
        </div>

        {top3On && Object.keys(listTop3).length !== 0 ? (
          <div className="categoryBest" ref={categoryBestClipRef}>
            <Swiper {...swiperParamsBest}>{listTop3 && makeTop3List()}</Swiper>
          </div>
        ) : (
          <div ref={categoryBestClipRef}></div>
        )}
        <div className="liveChart">
          <div className={`fixedArea ${clipCategoryFixed ? 'on' : ''}`}>
            <div className="liveChart__titleBox">
              <h2 onClick={() => refreshCategory()}>클립</h2>
              <div className="sortTypeWrap">
                <button onClick={() => changeActiveSort(0)} className={selectType === 0 ? 'sortBtn active' : 'sortBtn'}>
                  인기순
                </button>
                <button onClick={() => changeActiveSort(4)} className={selectType === 4 ? 'sortBtn active' : 'sortBtn'}>
                  최신순
                </button>
              </div>
              <div className="sequenceBox">
                <div className="sequenceItem"></div>
                <div className="sequenceItem">
                  <button type="button" onClick={() => setChartListType('detail')}>
                    <img
                      src={chartListType === 'detail' ? detailListIconActive : detailListIcon}
                      alt="카테고리 디테일 버튼 이미지"
                    />
                  </button>
                  <button type="button" onClick={() => setChartListType('simple')}>
                    <img
                      src={chartListType === 'simple' ? simpleListIconActive : simpleListIcon}
                      alt="카테고리 심플 버튼 이미지"
                    />
                  </button>
                  <button
                    className={`btn__refresh ${refreshAni ? ' btn__refresh--active' : ''}`}
                    onClick={() => refreshCategory()}>
                    <img
                      src={'https://image.dalbitlive.com/main/200714/ico-refresh-gray.svg'}
                      alt="카테고리 리프래시 아이콘 이미지"
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
          <ChartList
            selectType={selectType}
            chartListType={chartListType}
            clipTypeActive={clipTypeActive}
            clipType={clipType}
            clipCategoryFixed={clipCategoryFixed}
          />
        </div>
      </div>
      {detailPopup && <DetailPopup setDetailPopup={setDetailPopup} />}
    </Layout>
  )
}
//---------------------------------------------------------------------
