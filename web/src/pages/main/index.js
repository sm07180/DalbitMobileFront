/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import {Context} from 'context'
import {useHistory} from 'react-router-dom'

// components
import Layout from 'pages/common/layout/new_index.js'
import Gnb from '../common/newGnb'
import Recommend from './component/recommend.js'
import LiveList from './component/livelist.js'
import RankList from './component/rankList.js'

// static
import Mic from './static/ic_mike.svg'
import PlayIcon from './static/ic_play.svg'
import PlusIcon from './static/ic_circle_plus.svg'

import Api from 'context/api'
import {isHybrid, Hybrid} from 'context/hybrid'

export default props => {
  //---------------------------------------------------------------------

  //context
  let history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx

  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState([])
  const [rankType, setRankType] = useState('dj') // type: dj, fan

  const clickBroadcastBtn = () => {
    // if (isHybrid()) {
    if (token.isLogin) {
      return Hybrid('RoomMake', '')
    }
    // }
    return (window.location.href = '/login')
  }

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

  return (
    <Layout {...props}>
      <MainWrap>
        <Gnb />
        <SubMain>
          <div className="gnb">
            <div className="left-side">
              <div className="tab">
                <Link to={'/live'}>라이브</Link>
              </div>
              <div className="tab">
                <Link to={'/rank'}>랭킹</Link>
              </div>
              <div className="tab">
                <Link
                  onClick={event => {
                    event.preventDefault()
                    //IOS일때
                    if (globalCtx.customHeader.os === '2') {
                      webkit.messageHandlers.openInApp.postMessage('')
                    } else {
                      history.push(`/store`)
                    }
                  }}
                  to={'/store'}>
                  스토어
                </Link>
              </div>
            </div>
            <div className="right-side">
              <div className="btn" onClick={clickBroadcastBtn}>
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
                  디제이 랭킹
                </div>
                <div className={`txt ${rankType === 'fan' ? '' : 'in-active'}`} onClick={() => setRankType('fan')}>
                  팬 랭킹
                </div>
              </div>
              <Link to="/rank">
                <img className="plus-icon" src={PlusIcon} />
              </Link>
            </div>

            <div className="content-wrap rank-slide">
              <RankList rankType={rankType} djRank={initData.djRank} fanRank={initData.fanRank} />
            </div>
          </div>
          <div className="section">
            <div className="title-wrap">
              <div className="title">
                <div className="txt">실시간 LIVE</div>
                <img className="icon live" src={PlayIcon} />
              </div>
              <Link to="/live">
                <img className="plus-icon" src={PlusIcon} />
              </Link>
            </div>

            <div className="content-wrap">
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
      padding-bottom: 32px;

      &.rank-slide {
        padding: 0;
        min-height: 150px;
      }
    }
  }
`

const SubMain = styled.div`
  height: 310px;
  background-color: #8556f6;
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
