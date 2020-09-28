//
import React, {useContext, useState, useEffect, useRef} from 'react'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'
import Swiper from 'react-id-swiper'
import {Hybrid} from 'context/hybrid'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import Utility, {printNumber, addComma} from 'components/lib/utility'
//layout
import Layout from 'pages/common/layout'
// components
import ChartList from './components/chart_list'
import DetailPopup from './components/detail_popup'
import Header from 'components/ui/new_header'
import BannerList from '../main/component/bannerList'
//scss
import './clip.scss'
//static
import newIcon from './static/new_circle_m.svg'
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'
import filterIcon from './static/choose_circle_w.svg'
// header scroll flag
let tempScrollEvent = null
let randomData = Math.random() >= 0.5 ? 0 : 4
export default (props) => {
  const context = useContext(Context)

  let history = useHistory()
  //fixed category
  const recomendRef = useRef()
  const myClipRef = useRef()
  const rankClipRef = useRef()
  const BannerSectionRef = useRef()
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
    slidesPerView: 'auto'
  }
  //state
  const [chartListType, setChartListType] = useState('detail') // type: detail, simple
  const [detailPopup, setDetailPopup] = useState(false)
  //list
  const [popularList, setPopularList] = useState([])
  const [popularType, setPopularType] = useState(0)
  const [rankList, setrankList] = useState([])
  const [selectType, setSelectType] = useState(4)
  // const [selectType, setSelectType] = useState(randomData)
  // top3 list
  const [listTop3, setListTop3] = useState({})
  const [top3On, setTop3On] = useState(false)
  // common state
  const [clipType, setClipType] = useState([])
  const [clipTypeActive, setClipTypeActive] = useState('')
  const [refreshAni, setRefreshAni] = useState(false)
  const [randomList, setRandomList] = useState([])
  const [myData, setMyDate] = useState([])
  const [date, setDate] = useState('')
  // scroll fixed func
  const windowScrollEvent = () => {
    const ClipHeaderHeight = 50
    const myClipNode = myClipRef.current
    const recomendClipNode = recomendRef.current
    const BannerSectionNode = BannerSectionRef.current
    const recentClipNode = recentClipRef.current
    const rankClipNode = rankClipRef.current
    const categoryBestClipNode = categoryBestClipRef.current
    const myClipHeight = myClipNode.clientHeight
    const RecomendHeight = recomendClipNode.clientHeight
    const categoryBestHeight = categoryBestClipNode.clientHeight
    const recentClipHeight = recentClipNode.clientHeight
    const BannerSectionHeight = BannerSectionNode.clientHeight
    const rankClipHeight = rankClipNode.clientHeight
    const TopSectionHeight =
      ClipHeaderHeight + RecomendHeight + categoryBestHeight + rankClipHeight + BannerSectionHeight + myClipHeight
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
      setDate(data.checkDate)
      setRandomList(data.list.slice(0, 6))
      setPopularType(data.type)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  //api func
  const fetchMyData = async () => {
    const {result, data, message} = await Api.getMyClipData({})
    if (result === 'success') {
      setMyDate(data)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
  const fetchDataListLatest = async () => {
    const {result, data, message} = await Api.getLatestList({})
    if (result === 'success') {
      setrankList(data.list)
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
  //
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // make contents
  const makePoupularList = () => {
    return randomList.map((item, idx) => {
      if (!item) return null
      const {bgImg, clipNo, type, nickName, subjectType} = item
      return (
        <li className="recomClipItem" key={`popular-` + idx} onClick={() => fetchDataPlay(clipNo)} style={{cursor: 'pointer'}}>
          <span className="recomClipItem__subject">
            {clipType.map((ClipTypeItem, index) => {
              if (ClipTypeItem.value === subjectType) {
                return <React.Fragment key={idx + 'typeList'}>{ClipTypeItem.cdNm}</React.Fragment>
              }
            })}
          </span>
          <div className="recomClipItem__thumb">
            <img src={bgImg['thumb336x336']} alt="thumb" />
          </div>
          <p className="recomClipItem__nickName">{nickName}</p>
        </li>
      )
    })
  }
  const makeRankList = () => {
    return rankList.map((item, idx) => {
      const {bgImg, clipNo, nickName, title} = item
      if (!item) return null
      return (
        <div className="slideWrap" onClick={() => fetchDataPlay(clipNo)} key={`latest-` + idx} style={{cursor: 'pointer'}}>
          <div className="slideWrap__thumb">
            <img src={bgImg['thumb336x336']} alt={title} />
          </div>
          {/* <i className="slideWrap__iconNew">
            <img src={newIcon} />
          </i> */}
          {/* <p className="slideWrap__subject">{title}</p> */}
          <p className="slideWrap__nicknName">{nickName}</p>
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
  useEffect(() => {
    //swiper-slide-duplicate onClick 붙지않는 이슈떄문에 addEventListener처리
    if (Object.values(listTop3).length > 0) {
      const btnElem = document.getElementsByClassName('slideWrap__btn')
      for (let i = 0; i < btnElem.length; i++) {
        btnElem[i].addEventListener('click', HandleClick, false)
      }
    }
  }, [listTop3])

  const makeTop3List = () => {
    return Object.values(listTop3).map((item, idx) => {
      if (item.length === 0) return null
      let subjectMap = item[0].subjectType
      return (
        <div className="slideWrap" key={idx} style={{display: item.length !== 3 ? 'none' : 'block'}}>
          {clipType.map((item, idx) => {
            const {cdNm, value} = item
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
  const refreshCategory = (type) => {
    // setClipTypeActive('')
    if (scrollY !== 0) {
      window.scrollTo(0, scrollY)
    }
    // context.action.updateClipSort(0)
    //context.action.updateClipGender('')
    if (context.clipRefresh && type === 'category') {
      context.action.updatClipRefresh(false)
      // context.action.updateClipGender(false)
    } else if (type === 'popular') {
      if (popularList.length > 6) {
        let newList = popularList.filter(function (x) {
          return randomList.indexOf(x) < 0
        })
        setRandomList(newList.slice(0, 6))
      } else {
        fetchDataListPopular()
      }
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
    fetchDataListTop3()
    fetchDataListPopular()
    fetchDataListLatest()
    fetchDataClipType()
    if (context.token.isLogin === true) {
      fetchMyData()
    }
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
      <Header title="클립" type="noBack" description="clip" />
      <div id="clipPage">
        {context.token.isLogin === true ? (
          <div className="myClip" ref={myClipRef}>
            <h2
              className="myClip__title"
              onClick={() => {
                context.action.updatePopup('MYCLIP')
              }}>
              내 클립 현황
            </h2>

            <ul className="myClipWrap">
              <li className="upload">
                <em></em>
                <span>{myData.regCnt > 999 ? Utility.printNumber(myData.regCnt) : Utility.addComma(myData.regCnt)} 건</span>
              </li>
              <li className="listen">
                <em></em>
                <span>{myData.playCnt > 999 ? Utility.printNumber(myData.playCnt) : Utility.addComma(myData.playCnt)} 회</span>
              </li>
              <li className="like">
                <em></em>
                <span>{myData.goodCnt > 999 ? Utility.printNumber(myData.goodCnt) : Utility.addComma(myData.goodCnt)} 개</span>
              </li>
              <li className="gift">
                <em></em>
                <span>{myData.byeolCnt > 999 ? Utility.printNumber(myData.byeolCnt) : Utility.addComma(myData.byeolCnt)} 별</span>
              </li>
            </ul>
          </div>
        ) : (
          <div ref={myClipRef}></div>
        )}

        {popularList.length > 0 ? (
          <div className="recomClip" ref={recomendRef}>
            <div className="recomClip__title">
              {popularType === 0 ? '인기 클립' : '당신을 위한 추천 클립'}
              <div className="recomClip__title__rightSide">
                <span className="recomClip__title__date">{date}</span>
                <button
                  className={`btn__refresh ${refreshAni ? ' btn__refresh--active' : ''}`}
                  onClick={() => refreshCategory('popular')}>
                  <img
                    src={'https://image.dalbitlive.com/main/200714/ico-refresh-gray.svg'}
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

        <div className="clipBanner">
          <BannerList ref={BannerSectionRef} bannerPosition="10" type="clip" />
        </div>
        <div className="rankClip" ref={rankClipRef}>
          {/* <div className="rankClip__title">
            클립 랭킹
            <button onClick={() => history.push(`/rank`)} />
          </div> */}
          <div className="rankClip__title">
            최신 클립
            {/* <button onClick={() => history.push(`/rank`)} /> */}
          </div>
          {rankList.length > 0 ? <Swiper {...swiperParamsRecent}>{makeRankList()}</Swiper> : <></>}
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
              <h2 onClick={() => refreshCategory('category')}>실시간 클립</h2>
              {/* <h2 onClick={() => refreshCategory()}>최신 클립</h2> */}

              {/* <div className="sortTypeWrap">
                <button onClick={() => changeActiveSort(4)} className={selectType === 4 ? 'sortBtn active' : 'sortBtn'}>
                  최신순
                </button>
                <button onClick={() => changeActiveSort(0)} className={selectType === 0 ? 'sortBtn active' : 'sortBtn'}>
                  인기순
                </button>
              </div> */}
              <div className="sequenceBox">
                <div className="sequenceItem">
                  <button type="button" onClick={() => setDetailPopup(true)}>
                    {context.clipMainSort === 1 && <span>최신순</span>}
                    {context.clipMainSort === 3 && <span>선물순</span>}
                    {context.clipMainSort === 4 && <span>play 순</span>}
                    {context.clipMainSort === 2 && <span>인기순</span>}
                    <img src={filterIcon} alt="카테고리 필터 이미지" />
                  </button>
                </div>
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
                    onClick={() => refreshCategory('category')}>
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
