/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState} from 'react'
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
import StarList from './component/starList.js'
import LayerPopup from './component/layer_popup.js'

import Swiper from 'react-id-swiper'
import {broadcastLive} from 'constant/broadcast.js'

// static
import Mic from './static/ic_broadcast.svg'
import sequenceIcon from './static/ic_live_sequence.svg'
import refreshIcon from './static/ic_live_refresh.svg'
import RankArrow from './static/ic_rank_arrow.svg'

import {RoomMake} from 'context/room'

export default props => {
  //context
  const globalCtx = useContext(Context)

  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState([])
  const [rankType, setRankType] = useState('dj') // type: dj, fan

  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false)
  const [selectedLiveRoomType, setSelectedLiveRoomType] = useState('')
  const [popup, setPopup] = useState(false)

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
    fetchLiveList()
  }, [])

  const fetchLiveList = async () => {
    const broadcastList = await Api.broad_list({
      params: {
        records: 10,
        roomType: selectedLiveRoomType
      }
    })
    if (broadcastList.result === 'success') {
      const {list} = broadcastList.data
      setLiveList(list)
    }
  }

  const windowScrollEvent = e => {
    if (window.scrollY >= 574) {
      setLiveCategoryFixed(true)
    } else {
      setLiveCategoryFixed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [])

  useEffect(() => {
    fetchLiveList()
  }, [selectedLiveRoomType])

  const swiperParams = {
    slidesPerView: 'auto'
  }

  return (
    <Layout {...props}>
      <MainWrap>
        <SubMain>
          <div className="gnb">
            <div className="left-side">
              <div className="tab">
                <a href={'/rank'}>랭킹</a>
              </div>
              <div className="tab">
                <Link
                  onClick={event => {
                    event.preventDefault()
                    StoreLink(globalCtx)
                  }}
                  to={'/store'}>
                  스토어
                </Link>
              </div>
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
          <div className="section">
            <div className="title-wrap">
              <div className="title">
                <div className="txt">랭킹</div>
                <img className="rank-arrow" src={RankArrow} />
              </div>
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

          <div className="section">
            <div
              className="content-wrap my-star-slide"
              style={Array.isArray(initData.myStar) && initData.myStar.length === 0 ? {display: 'none'} : {}}>
              <StarList list={initData.myStar} />
            </div>
          </div>

          <div className="section">
            <div className="title-wrap">
              <div className="title">
                <div className="txt">실시간 LIVE</div>
                <img className="icon refresh" src={refreshIcon} />
              </div>

              <img className="sequence-icon" src={sequenceIcon} onClick={() => setPopup(popup ? false : true)} />
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

            <div className="content-wrap live-list" style={liveCategoryFixed ? {marginTop: '62px'} : {}}>
              <LiveList list={liveList} />
            </div>
          </div>
        </Content>
        {popup && <LayerPopup setPopup={setPopup} />}
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
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            font-size: 14px;
            letter-spacing: -0.35px;
            padding: 7px 8px;
            color: #424242;
            margin: 0 2px;
            background-color: #fff;

            &.active {
              border: none;
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
            margin-left: 10px;
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
    }

    .content-wrap {
      position: relative;
      min-height: 100px;
      margin-top: 10px;
      padding: 0 16px;
      padding-bottom: 20px;

      &.rank-slide {
        padding: 0;
        min-height: 150px;
      }

      &.live-list {
        min-height: 300px;
      }
    }
  }
`

const SubMain = styled.div`
  height: 310px;
  background: linear-gradient(#8556f6, #8556f6, #662eec);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  .gnb {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px;
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
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
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
