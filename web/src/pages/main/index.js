/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

//context
import Api from 'context/api'
import {Context} from 'context'
import {StoreLink} from 'context/link'

// components
import Layout from 'pages/common/layout'
import Recommend from './component/recommend.js'
import LiveList from './component/livelist.js'
import RankList from './component/rankList.js'
import BannerList from './component/bannerList.js'
import StarList from './component/starList.js'
import LayerPopup from './component/layer_popup.js'
import NoResult from 'components/ui/noResult.js'

import Swiper from 'react-id-swiper'
import {broadcastLive} from 'constant/broadcast.js'
import {useHistory} from 'react-router-dom'

// static
import Mic from './static/ic_broadcast.svg'
import sequenceIcon from './static/ic_live_sequence.svg'
import refreshIcon from './static/ic_live_refresh.svg'
import RankArrow from './static/ic_rank_arrow.svg'

import {RoomMake} from 'context/room'

let concatenating = false
let tempScrollEvent = null
const records = 10

export default props => {
  // reference
  const MainRef = useRef()
  const SubMainRef = useRef()
  const RankSectionRef = useRef()
  const BannerSectionRef = useRef()
  const StarSectionRef = useRef()

  //context
  const globalCtx = useContext(Context)
  const history = useHistory()
  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState(null)
  const [rankType, setRankType] = useState('dj') // type: dj, fan

  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false)
  const [selectedLiveRoomType, setSelectedLiveRoomType] = useState('')
  const [popup, setPopup] = useState(false)

  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')

  const [livePage, setLivePage] = useState(1)
  const [totalLivePage, setTotalLivePage] = useState(null)

  useEffect(() => {
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

  const windowScrollEvent = () => {
    const gnbHeight = 48
    const MainNode = MainRef.current
    const SubMainNode = SubMainRef.current
    const RankSectionNode = RankSectionRef.current
    const BannerSectionNode = BannerSectionRef.current
    const StarSectionNode = StarSectionRef.current
    // BannerSectionNode.clientHeight

    if (window.scrollY >= SubMainNode.clientHeight + RankSectionNode.clientHeight + StarSectionNode.clientHeight + 48) {
      setLiveCategoryFixed(true)
    } else {
      setLiveCategoryFixed(false)
    }

    if (
      MainNode.clientHeight + gnbHeight - 150 < window.scrollY + window.innerHeight &&
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

  useEffect(() => {
    window.addEventListener('scroll', windowScrollEvent)
    tempScrollEvent = windowScrollEvent
    return () => {
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

  const alignSet = {1: '추천', 2: '좋아요', 3: '청취자'}

  return (
    <Layout {...props}>
      <MainWrap ref={MainRef}>
        <SubMain ref={SubMainRef}>
          <div className="gnb">
            <div className="left-side">
              <div className="tab">
                <a href={'/'}>라이브</a>
              </div>
              <div className="tab">
                <a href={'/rank'}>랭킹</a>
              </div>
              {/* <div className="tab">
                <Link
                  onClick={event => {
                    event.preventDefault()
                    StoreLink(globalCtx)
                  }}
                  to={'/store'}>
                  스토어
                </Link>
              </div> */}
            </div>
            <div className="right-side">
              <div
                className="btn"
                onClick={() => {
                  RoomMake(globalCtx)
                }}>
                방송하기
              </div>
            </div>
          </div>
          <Recommend list={initData.recommend} />
        </SubMain>

        <Content>
          <div className="section" ref={RankSectionRef}>
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

          {/* <div className="section" ref={BannerSectionRef}>
            <div className="content-wrap">
              {Array.isArray(initData.recommend) && initData.recommend.length > 0 && <BannerList list={initData.recommend} />}
            </div>
          </div> */}

          <div className="section" ref={StarSectionRef} style={{marginTop: '24px'}}>
            <div
              className="content-wrap my-star-list"
              style={Array.isArray(initData.myStar) && initData.myStar.length === 0 ? {display: 'none'} : {}}>
              <StarList list={initData.myStar} />
            </div>
          </div>

          <div className="section" style={{marginTop: '24px'}}>
            <div className="title-wrap">
              <div className="title">
                <div className="txt">실시간 LIVE</div>
                <button className="icon refresh" onClick={() => resetFetchList()} />
              </div>

              <div
                className="sequence-wrap"
                onClick={() => {
                  // props.history.push('/#')
                  setPopup(popup ? false : true)
                }}>
                <span className="text">
                  {(() => {
                    return liveAlign ? `${alignSet[liveAlign]}순` : '전체'
                  })()}
                </span>
                <img className="sequence-icon" src={sequenceIcon} />
              </div>
            </div>

            <div className={`live-list-category ${liveCategoryFixed ? 'fixed' : ''}`}>
              <div className="inner-wrapper">
                <Swiper {...swiperParams}>
                  {Object.keys(broadcastLive)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((key, idx) => {
                      return (
                        <div
                          className={`list ${key === selectedLiveRoomType ? 'active' : ''}`}
                          key={`list-${idx}`}
                          onClick={() => setSelectedLiveRoomType(key)}>
                          {broadcastLive[key]}
                        </div>
                      )
                    })}
                </Swiper>
              </div>
            </div>

            <div className="content-wrap live-list" style={liveCategoryFixed ? {marginTop: '28px'} : {}}>
              {Array.isArray(liveList) ? liveList.length > 0 ? <LiveList list={liveList} /> : <NoResult /> : ''}
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
      </MainWrap>
    </Layout>
  )
}

const Content = styled.div`
  .section {
    margin-top: 28px;

    .live-list-category {
      position: relative;
      display: flex;
      height: 58px;
      flex-direction: row;
      align-items: center;
      background-color: #fff;

      &.fixed {
        position: fixed;
        top: 48px;
        left: 0;
        width: 100%;
        z-index: 50;
      }

      .inner-wrapper {
        position: absolute;
        top: 12px;
        left: 16px;
        width: calc(100% - 16px);

        .swiper-container {
          overflow: hidden;

          .list {
            width: auto;
            height: 30px;
            line-height: 28px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            font-size: 14px;
            letter-spacing: -0.35px;
            padding: 0 8px;
            color: #424242;
            margin: 0 2px;
            background-color: #fff;
            box-sizing: border-box;

            &.active {
              border-color: transparent;
              background-color: #632beb;
              color: #fff;
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
        .icon {
          &.refresh {
            display: block;
            width: 24px;
            height: 24px;
            margin-left: 5px;
            background-repeat: no-repeat;
            background-image: url(${refreshIcon});
          }

          &.live {
            display: block;
            width: 16px;
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
          color: #9e9e9e;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.36px;

          &.active {
            color: #632beb;
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
          font-size: 14px;
          letter-spacing: -0.35px;
        }
        .sequence-icon {
          display: block;
        }
      }
    }

    .content-wrap {
      position: relative;
      min-height: 50px;
      margin-top: 10px;
      padding: 0 16px;

      &.rank-slide {
        padding: 0;
        min-height: 150px;
      }

      &.my-star-list {
        min-height: 94px;
      }

      &.live-list {
        padding-bottom: 100px;
      }
    }
  }
`

const SubMain = styled.div`
  height: 310px;
  background: linear-gradient(#632beb, #632beb, #662eec);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  .gnb {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px 8px;
    box-sizing: border-box;

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
        height: 36px;
        margin-right: 8px;
        padding-left: 34px;
        font-weight: 600;
        text-align: right;
        letter-spacing: -0.4px;
        border-radius: 18px;
        background-color: #fff;
        color: #632beb;
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
  margin-top: 48px;
`
