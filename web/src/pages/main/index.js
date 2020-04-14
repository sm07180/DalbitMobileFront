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
import StarList from './component/starList.js'

import Swiper from 'react-id-swiper'
import {broadcastLive} from 'constant/broadcast.js'

// static
import Mic from './static/ic_mike.svg'
import PlayIcon from './static/ic_play.svg'
import PlusIcon from './static/ic_circle_plus.svg'

import {RoomMake} from 'context/room'

export default props => {
  const liveCategoryListRef = useRef()

  //context
  const globalCtx = useContext(Context)

  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState([])
  const [rankType, setRankType] = useState('dj') // type: dj, fan

  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false)

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
    ;(async () => {
      const broadcastList = await Api.broad_list({
        params: {
          records: 30
        }
      })
      if (broadcastList.result === 'success') {
        const {list} = broadcastList.data
        setLiveList(list)
      }
    })()
  }, [])

  const windowScrollEvent = e => {
    if (window.scrollY >= 574) {
    } else {
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [])

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
                <a href={'/live'}>라이브</a>
              </div>
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
                <div className={`txt ${rankType === 'dj' ? '' : 'in-active'}`} onClick={() => setRankType('dj')}>
                  DJ 랭킹
                </div>
                <div className={`txt ${rankType === 'fan' ? '' : 'in-active'}`} onClick={() => setRankType('fan')}>
                  팬 랭킹
                </div>
              </div>
              <a href="/rank">
                <img className="plus-icon" src={PlusIcon} />
              </a>
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
                <img className="icon live" src={PlayIcon} />
              </div>
              <a href="/live">
                <img className="plus-icon" src={PlusIcon} />
              </a>
            </div>

            <div className="live-list-category" ref={liveCategoryListRef} style={liveCategoryFixed ? {display: 'fixed'} : {}}>
              <div className="inner-wrapper">
                <Swiper {...swiperParams}>
                  {Object.keys(broadcastLive)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((key, idx) => {
                      return (
                        <div className="list" key={`list-${idx}`}>
                          {broadcastLive[key]}
                        </div>
                      )
                    })}
                </Swiper>
              </div>
            </div>

            <div className="content-wrap" style={{height: '1000px'}}>
              <LiveList list={liveList} />
            </div>
          </div>
        </Content>
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
      height: 40px;
      flex-direction: row;
      align-items: center;

      .inner-wrapper {
        position: absolute;
        top: 0;
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
          &.live {
            display: block;
            width: 16px;
            margin-left: 10px;
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

      &.my-star-slide {
      }

      &.rank-slide {
        padding: 0;
        min-height: 150px;
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
        border-radius: 18px;
        background-color: #fff;
        color: #8556f6;
        font-size: 16px;
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
