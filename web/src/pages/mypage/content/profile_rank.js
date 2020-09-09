import React, {useState, useEffect, useContext, useRef} from 'react'

import {Context} from 'context'

import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
import API from 'context/api'

import NoResult from 'pages/main/component/NoResult.js'
import AlarmPop from 'pages/common/alarm_pop'

export default (props) => {
  const context = useContext(Context)

  const [rankingType, setRankingType] = useState('fan') // fan, all
  const [fanListType, setFanListType] = useState(1)
  const [allListType, setAllListType] = useState('good') //gift, good
  const [fanRankList, setFanRankList] = useState([])
  const [goodList, setGoodList] = useState([])

  async function fetchFanRank() {
    const {result, data} = await API.mypage_fan_ranking({
      params: {
        memNo: props.profile.memNo,
        page: 1,
        records: 100,
        rankType: fanListType
      }
    })
    if (result === 'success') {
      setFanRankList(data.list)
    }
  }

  async function fetchFanGood() {
    const {result, data} = await API.mypage_good_ranking({
      params: {
        memNo: props.profile.memNo
      }
    })
    if (result === 'success') {
      setGoodList(data.list)
    }
  }

  useEffect(() => {
    fetchFanGood()
  }, [allListType])

  useEffect(() => {
    fetchFanRank()
  }, [fanListType])

  return (
    <>
      <HoleWrap>
        <div className="wrapper">
          <button className="close" onClick={() => context.action.updateClosePresent(false)}></button>
          <div className="tabWrap">
            <div
              className={`tabWrap__tab ${rankingType === 'fan' ? 'tabWrap__tab--active' : ''}`}
              onClick={() => setRankingType('fan')}>
              팬 랭킹
            </div>
            <div
              className={`tabWrap__tab ${rankingType === 'all' ? 'tabWrap__tab--active' : ''}`}
              onClick={() => setRankingType('all')}>
              전체 랭킹
            </div>
          </div>
          <div className="scrollWrap">
            {rankingType === 'fan' && (
              <>
                <div className="innerTabWrap">
                  <div
                    className={`innerTabWrap__tab ${fanListType === 1 ? 'innerTabWrap__tab--active' : ''} `}
                    onClick={() => setFanListType(1)}>
                    최근
                  </div>
                  <div
                    className={`innerTabWrap__tab ${fanListType === 2 ? 'innerTabWrap__tab--active' : ''} `}
                    onClick={() => setFanListType(2)}>
                    누적
                  </div>
                </div>

                <ul>
                  {fanRankList.length > 0 ? (
                    <>
                      {fanRankList.map((value, idx) => {
                        const {nickNm} = value
                        return <li key={idx}>{nickNm}</li>
                      })}
                    </>
                  ) : (
                    <NoResult />
                  )}
                </ul>
              </>
            )}
            {rankingType === 'all' && (
              <>
                <div className="innerTabWrap">
                  <div
                    className={`innerTabWrap__tab ${allListType === 'gift' ? 'innerTabWrap__tab--active' : ''} `}
                    onClick={() => setAllListType('gift')}>
                    선물
                  </div>
                  <div
                    className={`innerTabWrap__tab ${allListType === 'good' ? 'innerTabWrap__tab--active' : ''} `}
                    onClick={() => setAllListType('good')}>
                    좋아요
                  </div>
                </div>

                <ul>
                  {goodList.length > 0 ? (
                    <>
                      {goodList.map((value, idx) => {
                        const {nickNm} = value
                        return <li key={idx}>{nickNm}</li>
                      })}
                    </>
                  ) : (
                    <NoResult />
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </HoleWrap>

      <Dim onClick={() => context.action.updateCloseRank(false)}></Dim>
    </>
  )
}

const HoleWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -87px;
  z-index: 24;

  .wrapper {
    width: calc(100% - 32px);
    max-width: 328px;
    border-radius: 12px;
    background-color: #fff;

    .close {
      display: block;
      position: absolute;
      top: -36px;
      right: 8.335%;
      width: 36px;
      height: 36px;
      background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    }
  }

  .tabWrap {
    display: flex;
    padding-top: 4px;

    &__tab {
      width: 50%;
      height: 48px;
      text-align: center;
      line-height: 48px;

      &--active {
        color: #632beb;
        border-bottom: 1px solid #632beb;
      }
    }
  }

  .innerTabWrap {
    display: flex;
    justify-content: center;
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;

    &__tab {
      padding: 0 5px;

      &--active {
        color: #632beb;
      }
    }
  }
`

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 5;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
`
