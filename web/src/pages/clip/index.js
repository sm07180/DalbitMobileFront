import React, {useContext, useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'
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
import refreshIcon from './static/refresh_g.svg'
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'
export default (props) => {
  //Hybrid('GetLoginTokenNewWin', loginInfo.data)
  const context = useContext(Context)
  let history = useHistory()
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
    slidesPerView: 'auto'
  }
  //state
  const [chartListType, setChartListType] = useState('detail') // type: detail, simple
  const [detailPopup, setDetailPopup] = useState(false)
  //list
  const [popularList, setPopularList] = useState([])
  const [popularType, setPopularType] = useState(0)
  const [latestList, setLatestList] = useState([])
  // top3 list
  const [listTop3, setListTop3] = useState({})
  const [top3On, setTop3On] = useState(false)
  // common state
  const [clipType, setClipType] = useState([])
  const [clipTypeActive, setClipTypeActive] = useState('')
  const [refreshAni, setRefreshAni] = useState(false)
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
    const {result, data, message} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      clipJoin(data, context)
    } else {
      context.action.alert({
        msg: message
      })
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
  const makeCategoryList = () => {
    return clipType.map((item, idx) => {
      const {cdNm, value} = item
      return (
        <div
          className={clipTypeActive === value ? 'slideWrap active' : 'slideWrap'}
          onClick={() => setClipTypeActive(value)}
          key={idx + `categoryTab`}>
          {cdNm}
        </div>
      )
    })
  }
  // initial category
  const refreshCategory = () => {
    setClipTypeActive('')
    context.action.updateClipSort(0)
    context.action.updateClipGender('')
    if (context.clipMainRefresh) {
      context.action.updateClipGender(false)
    } else {
      context.action.updatClipRefresh(true)
    }
    setInterval(() => {
      setRefreshAni(true)
    }, 1)
    setRefreshAni(false)
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
  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])
  //didmount
  useEffect(() => {
    fetchDataListPopular()
    fetchDataListLatest()
    fetchDataListTop3()
    fetchDataClipType()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Header title="클립" />
      <div id="clipPage">
        {popularList.length > 0 ? (
          <div className="recomClip">
            <h2 className="recomClip__title">{popularType === 0 ? '인기 클립' : '당신을 위한 추천 클립'}</h2>
            <ul className="recomClipBox">{makePoupularList()}</ul>
          </div>
        ) : (
          <></>
        )}
        <div className="recentClip">
          <h2 className="recentClip__title">최신 클립</h2>
          {latestList.length > 0 ? <Swiper {...swiperParamsRecent}>{makeLatestList()}</Swiper> : <></>}
        </div>
        {top3On && Object.keys(listTop3).length !== 0 && (
          <div className="categoryBest">
            <Swiper {...swiperParamsBest}>{listTop3 && makeTop3List()}</Swiper>
          </div>
        )}
        <div className="liveChart">
          <div className="liveChart__titleBox">
            <h2>
              실시간 차트{' '}
              <img
                src={'https://image.dalbitlive.com/main/200714/ico-refresh.svg'}
                className={refreshAni ? 'refresh-icon refresh-icon--active' : 'refresh-icon'}
                onClick={() => refreshCategory()}
                style={{cursor: 'pointer'}}
              />
            </h2>

            <div className="sequenceBox">
              <div className="sequenceItem"></div>
              <div className="sequenceItem">
                <button type="button" onClick={() => setChartListType('detail')}>
                  <img src={chartListType === 'detail' ? detailListIconActive : detailListIcon} />
                </button>
                <button type="button" onClick={() => setChartListType('simple')}>
                  <img src={chartListType === 'simple' ? simpleListIconActive : simpleListIcon} />
                </button>
              </div>
            </div>
          </div>
          {clipType.length > 0 ? (
            <Swiper {...swiperParamsCategory}>
              <div className={clipTypeActive === '' ? 'slideWrap active' : 'slideWrap'} onClick={() => setClipTypeActive('')}>
                전체
              </div>
              {makeCategoryList()}
            </Swiper>
          ) : (
            <></>
          )}
          <ChartList chartListType={chartListType} clipTypeActive={clipTypeActive} clipType={clipType}></ChartList>
        </div>
      </div>
      {detailPopup && <DetailPopup setDetailPopup={setDetailPopup} />}
    </Layout>
  )
}
//---------------------------------------------------------------------
