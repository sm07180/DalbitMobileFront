/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import {Context} from 'context'

// components
import Gnb from '../common/newGnb'
import Recommend from './component/recommend.js'
import LiveList from './component/livelist.js'

// static
import Mic from './static/ic_mike.svg'
import PlayIcon from './static/ic_play.svg'
import PlusIcon from './static/ic_circle_plus.svg'
import TopScrollIcon from './static/ic_circle_top.svg'

import Api from 'context/api'

export default props => {
  const globalCtx = useContext(Context)
  const {logoChange} = globalCtx

  const [initData, setInitData] = useState({})
  const [liveList, setLiveList] = useState([])
  const [rankType, setRankType] = useState('dj') // type: dj, fan

  const scrollToTop = () => {
    if (logoChange && window.scrollY) {
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    ;(async () => {
      const initData = await Api.main_init_data()
      if (initData.result === 'success') {
        const {djRank, fanRank, recommend} = initData.data
        setInitData({
          recommend,
          djRank,
          fanRank
        })
      }
    })()
    ;(async () => {
      const broadcastList = await Api.broad_list()
      if (broadcastList.result === 'success') {
        const {list} = broadcastList.data
        setLiveList(list)
      }
    })()
  }, [])

  return (
    <MainWrap>
      <Gnb />
      <SubMain>
        <div className="gnb">
          <div className="left-side">
            <div className="tab">
              <Link to={'/mlive'}>라이브</Link>
            </div>
            <div className="tab">
              <Link to={'/ranking'}>랭킹</Link>
            </div>
            <div className="tab">
              <Link to={'/store'}>스토어</Link>
            </div>
          </div>
          <div className="right-side">
            <div className="btn">방송하기</div>
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
            <Link to="/ranking">
              <img className="plus-icon" src={PlusIcon} />
            </Link>
          </div>

          <div className="content-wrap"></div>
        </div>
        <div className="section">
          <div className="title-wrap">
            <div className="title">
              <div className="txt">실시간 LIVE</div>
              <img className="icon live" src={PlayIcon} />
            </div>
            <Link to="/mlive">
              <img className="plus-icon" src={PlusIcon} />
            </Link>
          </div>

          <div className="content-wrap">
            <LiveList list={liveList} />
          </div>
        </div>
      </Content>
      <TopScrollBtn onClick={scrollToTop} logoChange={logoChange} />
    </MainWrap>
  )
}

const TopScrollBtn = styled.button`
  display: ${props => (props.logoChange ? 'block' : 'none')};
  position: fixed;
  bottom: 30px;
  right: 10px;
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${TopScrollIcon});
`

const Content = styled.div`
  .section {
    margin-top: 22px;
    padding: 0 16px;

    .title-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

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
  }
`

const SubMain = styled.div`
  height: 310px;
  background-color: #8556f6;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;

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
        text-align: right;
        border-radius: 18px;
        background-color: #fff;
        color: #8556f6;
        font-size: 16px;
        box-sizing: border-box;

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
