/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

// components
import Gnb from '../common/newGnb'

// static
import Mic from './static/ic_mike.svg'
import PlayIcon from './static/ic_play.svg'
import PlusIcon from './static/ic_circle_plus.svg'
import TopScrollIcon from './static/ic_circle_top.svg'

import Api from 'context/api'

// components
import LiveList from './component/livelist.js'

export default props => {
  const [liveList, setLiveList] = useState([])
  const [topBtnStatus, setTopBtnStatus] = useState(false)

  const handleTopBtnStatus = status => {
    setTopBtnStatus(status)
  }

  const scrollToTop = () => {
    if (topBtnStatus && window.scrollY) {
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    ;(async () => {
      const response = await Api.broad_list()
      if (response.result === 'success') {
        const {list} = response.data
        setLiveList(list)
      }
    })()
  }, [])

  return (
    <MainWrap>
      <Gnb handleTopBtnStatus={handleTopBtnStatus} />
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
      </SubMain>

      <Content>
        <div className="section">
          <div className="title-wrap">
            <div className="title">
              <div className="txt">디제이 랭킹</div>
              <div className="txt">팬 랭킹</div>
            </div>
            <Link to="/ranking">
              <img className="plus-icon" src={PlusIcon} />
            </Link>
          </div>
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
            {/* {liveList.map((list, idx) => {
              const {roomType, bgImg, bjNickNm, title, likeCnt, entryCnt} = list

              return (
                <LiveList key={`live-${idx}`} bgImg={bgImg['thumb150x150']}>
                  <div className="broadcast-img" />
                  <div className="broadcast-content">
                    <div className="title">{title}</div>
                    <div className="nickname">{bjNickNm}</div>
                    <div className="detail">
                      <div className="broadcast-type">{broadcastLive[roomType]}</div>
                      <div className="value">
                        <img src={HeartIcon} />
                        <span>{likeCnt !== undefined && likeCnt.toLocaleString()}</span>
                      </div>
                      <div className="value">
                        <img src={HeadphoneIcon} />
                        <span>{entryCnt !== undefined && entryCnt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </LiveList>
              )
            })} */}
          </div>
        </div>
      </Content>
      {topBtnStatus && <TopScrollBtn onClick={scrollToTop} />}
    </MainWrap>
  )
}

const TopScrollBtn = styled.button`
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
