/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState, useRef, useMemo} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

//context
import Api from 'context/api'
import {Context} from 'context'
import {StoreLink} from 'context/link'

// components
import Layout from 'pages/common/layout'
import Recommend from './component/recommend_new.js'
import LiveList from './component/livelist.js'
import RankList from './component/rankList.js'
import BannerList from './component/bannerList.js'
import StarList from './component/starList.js'
import LayerPopup from './component/layer_popup.js'
import LayerPopupNotice from './component/layer_popup_notice.js'
import LayerPopupPay from './component/layer_popup_pay.js'
import NoResult from './component/NoResult.js'
import {OS_TYPE} from 'context/config.js'

import Swiper from 'react-id-swiper'
import {useHistory} from 'react-router-dom'
import Utility from 'components/lib/utility'

// static
import Mic from './static/ic_broadcastng.svg'
import sequenceIcon from './static/ic_live_sequence.svg'
import detailListIcon from './static/detaillist_circle_w.svg'
import detailListIconActive from './static/detaillist_circle_purple.svg'
import simpleListIcon from './static/simplylist_circle_w.svg'
import simpleListIconActive from './static/simplylist_circle_purple.svg'

import refreshIcon from './static/refresh_w.svg'
import sortIcon from './static/choose_circle_w.svg'
import RankArrow from './static/ic_rank_arrow.svg'

import {RoomMake} from 'context/room'
import {COLOR_MAIN} from 'context/color.js'

let concatenating = false
let tempScrollEvent = null
//7->50
const records = 30
const today = new Date().getDate()

export default props => {
  // reference
  const MainRef = useRef()
  const SubMainRef = useRef()
  const RecommendRef = useRef()
  const RankSectionRef = useRef()
  const BannerSectionRef = useRef()
  const StarSectionRef = useRef()
  const LiveSectionRef = useRef()

  //context
  const globalCtx = useContext(Context)
  const history = useHistory()

  // state
  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState(null)
  const [rankType, setRankType] = useState('dj') // type: dj, fan

  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false)
  const [selectedLiveRoomType, setSelectedLiveRoomType] = useState('')
  const [popup, setPopup] = useState(false)
  const [popupNotice, setPopupNotice] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')

  const [livePage, setLivePage] = useState(1)
  const [totalLivePage, setTotalLivePage] = useState(null)

  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false)
  const [categoryList, setCategoryList] = useState([{sorNo: 0, cd: '', cdNm: '전체'}])
  const customHeader = JSON.parse(Api.customHeader)

  const [payState, setPayState] = useState(false)
  const [broadCnt, setBroadCnt] = useState(false)

  const [liveListType, setLiveListType] = useState('detail')
  // const [liveListType, setLiveListType] = useState('simple')

  useEffect(() => {
    if (window.sessionStorage) {
      const exceptionList = ['room_active', 'room_no', 'room_info', 'push_type', 'popup_notice', 'pay_info']
      Object.keys(window.sessionStorage).forEach(key => {
        if (!exceptionList.includes(key)) {
          sessionStorage.removeItem(key)
        }
      })
    }

    ;(async () => {
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
    })()

    Api.splash().then(res => {
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

  const fetchLiveList = async reset => {
    setLiveList(null)
    const broadcastList = await Api.broad_list({
      params: {
        page: reset ? 1 : livePage,
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

  const fetchBroadCnt = async () => {
    const broadCntRes = await Api.getBroadCnt()
    setBroadCnt(broadCntRes.data)
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

  const popStateEvent = e => {
    if (e.state === null) {
      setPopup(false)
    } else if (e.state === 'layer') {
      setPopup(true)
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
        window.history.back()
        setTimeout(() => window.scrollTo(0, scrollY))
      }
    }
  }, [popup])

  useEffect(() => {
    fetchBroadCnt()
    window.addEventListener('popstate', popStateEvent)
    window.addEventListener('scroll', windowScrollEvent)
    tempScrollEvent = windowScrollEvent

    //globalCtx.action.updateStickerMsg({push_type:1,title:"DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP DJ LEVELUP",contents:"DJ LEVELUP"})
    //globalCtx.action.updateSticker(true)
    // if (sessionStorage.getItem('popup_notice') === null) {
    //   sessionStorage.setItem('popup_notice', 'y')
    // }

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

  const swiperParams = {
    slidesPerView: 'auto'
  }

  const goRank = () => {
    history.push(`/rank`, rankType)
  }
  //go event
  const goEvent = () => {
    globalCtx.action.updatenoticeIndexNum(`/customer/notice/17`)
    history.push(`/customer/notice/17`)
  }

  const alignSet = {1: '추천', 2: '좋아요', 3: '청취자'}

  const setPayPopup = () => {
    setPayState(false)
    sessionStorage.removeItem('pay_info')
  }

  return (
    <Layout {...props} sticker={globalCtx.sticker}>
      <MainWrap ref={MainRef}>
        <SubMain ref={SubMainRef}>
          <div className="gnb">
            <div className="left-side">
              <div className={`tab`}>
                <Link to={'/'}>라이브</Link>
              </div>
              <div className="tab">
                <Link to={'/rank'}>랭킹</Link>
              </div>
              <div className="tab">
                <Link
                  onClick={event => {
                    event.preventDefault()
                    StoreLink(globalCtx)
                  }}
                  to={'/rank'}>
                  스토어
                </Link>
              </div>
            </div>
          </div>
        </SubMain>

        <div ref={RecommendRef} style={{height: '220px'}}>
          {Array.isArray(initData.recommend) && <Recommend list={initData.recommend} />}
        </div>

        <Content>
          <div className="section rank" ref={RankSectionRef}>
            <div className="title-wrap">
              <button className="title" onClick={() => goRank()}>
                <div className="txt">랭킹</div>
                <img className="rank-arrow" src={RankArrow} />
              </button>
              <div className="right-side">
                <span className={`text ${rankType === 'dj' ? 'active' : ''}`} onClick={() => setRankType('dj')}>
                  DJ
                </span>
                <span className="bar"></span>
                <span className={`text ${rankType === 'fan' ? 'active' : ''}`} onClick={() => setRankType('fan')}>
                  팬
                </span>
              </div>
            </div>

            <div className="content-wrap rank-slide">
              <RankList rankType={rankType} djRank={initData.djRank} fanRank={initData.fanRank} />
            </div>
          </div>

          <BannerList ref={BannerSectionRef} bannerPosition="9" />

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
                <div className="txt">실시간 LIVE</div>
                <img className="refresh-icon" src={refreshIcon} onClick={fetchLiveList} />
              </div>

              <div className="sequence-wrap">
                <span className="text" onClick={() => setPopup(popup ? false : true)}>
                  {(() => {
                    return liveAlign ? `${alignSet[liveAlign]}순` : '전체'
                  })()}
                </span>
                <img className="sequence-icon" src={sortIcon} onClick={() => setPopup(popup ? false : true)} />
                <img
                  className="detail-list-icon"
                  src={liveListType === 'detail' ? detailListIconActive : detailListIcon}
                  onClick={() => setLiveListType('detail')}
                />
                <img
                  className="simple-list-icon"
                  src={liveListType === 'simple' ? simpleListIconActive : simpleListIcon}
                  onClick={() => setLiveListType('simple')}
                />
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

            <div className="content-wrap live-list">
              {Array.isArray(liveList) ? (
                liveList.length > 0 ? (
                  <LiveList list={liveList} liveListType={liveListType} />
                ) : (
                  <NoResult />
                )
              ) : (
                <div style={{height: '315px'}}></div>
              )}
            </div>
          </div>
        </Content>

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

        {payState && <LayerPopupPay info={payState} setPopup={setPayPopup} />}
      </MainWrap>
    </Layout>
  )
}

const Content = styled.div`
  .event-section {
    display: block;
    width: calc(100% - 32px);
    height: 65px;
    margin: 25px 16px 16px 16px;
    border-radius: 12px;
  }

  .section {
    box-sizing: border-box;

    &.my-star {
      display: none;

      &.visible {
        display: block;
      }
    }

    &.rank {
      height: 180px;
      background-color: #424242;
      padding: 22px 0;
      color: #fff;

      .title-wrap {
        .title {
          .txt {
            color: #fff;
            font-size: 16px;
          }
        }
      }
    }

    &.live-list {
      .title-wrap {
        display: flex;
        align-items: center;
        flex-direction: row;
        height: 64px;
        padding: 22px 17px;
        box-sizing: border-box;
        background-color: #fff;
        border-bottom: 1px solid #eee;

        .title {
          display: flex;
          flex-direction: row;
          align-items: center;

          .txt {
            font-size: 18px;
            letter-spacing: -0.36px;
          }

          .refresh-icon {
            margin-left: 4px;
          }
        }
      }
    }

      color: red;
      font-weight: 700;
    }
    .room_cnt {
      color: blue;
      font-weight: 700;
    }

    .live-list-category {
      position: relative;
      display: flex;
      height: 36px;
      flex-direction: row;
      align-items: center;
      background-color: #fff;
      border-bottom: 1px solid #eee;

      &.fixed {
        position: fixed;
        top: 48px;
        left: 0;
        width: 100%;
        z-index: 10;
      }

      .inner-wrapper {
        width: calc(100% - 16px);
        margin-left: 16px;

        .swiper-container {
          overflow: hidden;

          .list {
            width: auto;
            height: 36px;
            line-height: 34px;
            font-size: 14px;
            letter-spacing: -0.35px;
            margin: 0 8px;
            color: #424242;
            box-sizing: border-box;

            &.active {
              color: #632beb;
              font-weight: 700;
              border-bottom: 1px solid #632beb;
            }

            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }

    .title-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 16px;

      .title {
        display: flex;
        flex-direction: row;
        align-items: center;

        .txt {
          color: #424242;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: -0.36px;

          &.in-active {
            color: #bdbdbd;
          }

          &:nth-child(2) {
            margin-left: 10px;
          }
        }
      }

      .right-side {
        display: flex;
        flex-direction: row;
        align-items: center;

        .bar {
          width: 1px;
          height: 12px;
          background-color: #9e9e9e;
          margin: 0 10px;
        }

        .text {
          color: #fff;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: -0.36px;

          &.active {
            color: #febd56;
          }
        }
      }

      .sequence-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;

        .text {
          margin-left: 4px;
          color: #424242;
          font-size: 12px;
          letter-spacing: -0.24px;
        }

        .sequence-icon {
          margin-right: 15px;
        }

        .detail-list-icon {
          margin-right: 2px;
        }

        .sequence-icon,
        .detail-list-icon,
        .simple-list-icon {
          display: block;
        }
      }
    }

    .content-wrap {
      position: relative;
      min-height: 50px;
      padding: 0 16px;

      &.rank-slide {
        padding: 0;
        margin-top: 14px;
      }

      &.my-star-list {
        height: 108px;
        background-color: #eee;
      }

      &.live-list {
        width: 100%;
      }
    }
  }
`

const SubMain = styled.div`
  .gnb {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    height: 36px;
    box-sizing: border-box;
    background-color: #632beb;
    z-index: 1;

    .left-side {
      display: flex;
      flex-direction: row;

      .tab {
        height: 36px;
        color: #fff;
        font-size: 16px;
        letter-spacing: -0.4px;
        padding: 0 8px;

        a {
          display: block;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 40px;
          font-weight: 600;
          transform: skew(-0.03deg);
        }
      }
    }

    .right-side {
      .btn {
        display: flex;
        align-items: center;
        position: relative;
        width: 106px;
        height: 34px;
        margin-right: 8px;
        padding-left: 34px;
        font-weight: 600;
        text-align: right;
        letter-spacing: -0.4px;
        border-radius: 18px;
        background-color: #000;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        box-sizing: border-box;
        transform: skew(-0.03deg);

        &::before {
          position: absolute;
          content: '';
          width: 36px;
          height: 36px;
          left: 0;
          top: 0;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url(${Mic});
        }
      }
    }
  }
`

const MainWrap = styled.div`
  margin-top: ${props => (props.sticker ? '0' : '48px')};
`
