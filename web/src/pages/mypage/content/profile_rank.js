import React, {useState, useEffect, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
import API from 'context/api'
import qs from 'query-string'
import goldMedal from '../static/profile/medal_gold_m@2x.png'
import silverMedal from '../static/profile/medal_silver_m@2x.png'
import bronzeMedal from '../static/profile/medal_bronze_m@2x.png'
import dalIcon from '../static/profile/ic_moon_s@2x.png'
import goodIcon from '../static/profile/like_red_m@2x.png'

import NoResult from 'pages/main/component/NoResult.js'

export default (props) => {
  const context = useContext(Context)
  const history = useHistory()
  const {type} = props
  const {webview} = qs.parse(location.search)
  const [rankingType, setRankingType] = useState(type === 'tabGood' ? 'all' : 'fan') // fan, all
  const [fanListType, setFanListType] = useState(1) //1: 최근, 2, 누적
  const [allListType, setAllListType] = useState(type === 'tabGood' ? 'good' : 'gift') //gift, good
  const [fanRankList, setFanRankList] = useState([])
  const [goodList, setGoodList] = useState([])
  const [fanGiftList, setFanGiftList] = useState([])
  const [select, setSelect] = useState('')

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

  async function fetchGiftRank() {
    const {result, data} = await API.mypage_fan_ranking({
      params: {
        memNo: props.profile.memNo,
        page: 1,
        records: 100,
        rankType: 1,
        rankSlct: 2
      }
    })
    if (result === 'success') {
      setFanGiftList(data.list)
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

  //등록,해제
  const Regist = (memNo) => {
    async function fetchDataFanRegist(memNo) {
      const res = await API.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            setSelect(memNo)
          },
          msg: '팬등록에 성공하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanRegist(memNo)
  }

  const Cancel = (memNo, isFan) => {
    async function fetchDataFanCancel(memNo, isFan) {
      const res = await API.mypage_fan_cancel({
        data: {
          memNo: memNo
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            setSelect(memNo + 1)
          },
          msg: '팬등록을 해제하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanCancel(memNo)
  }
  const Link = (memNo) => {
    if (webview && webview === 'new') {
      history.push(`/mypage/${memNo}?webview=new`)
    } else {
      history.push(`/mypage/${memNo}`)
    }
  }

  useEffect(() => {
    fetchFanGood()
    fetchGiftRank()
  }, [allListType])

  useEffect(() => {
    fetchFanRank()
  }, [fanListType])

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (rankingType === 'fan' && (fanListType === 1 || fanListType === 2)) {
      fetchFanRank()
    } else if (rankingType === 'all' && allListType === 'gift') {
      fetchGiftRank()
    } else if (rankingType === 'all' && allListType === 'good') {
      fetchFanGood()
    }
  }, [select])

  return (
    <>
      <HoleWrap>
        <div className="wrapper">
          <button className="close" onClick={() => context.action.updateCloseRank(false)}></button>
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
          <div>
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

                <ul className="rankList scrollWrap">
                  {fanRankList.length > 0 ? (
                    <>
                      {fanRankList.map((value, idx) => {
                        const {nickNm, giftDal, profImg, isFan, memNo} = value
                        return (
                          <li className="rankitem" key={idx}>
                            <div className="rankitemWrap">
                              <div
                                className="thumbBox"
                                onClick={() => {
                                  Link(memNo), context.action.updateCloseRank(false)
                                }}>
                                <img src={profImg.thumb120x120} className="thumbBox__thumb" alt="thumb" />
                                {idx < 5 && (
                                  <>
                                    {idx < 3 ? (
                                      <img
                                        className="thumbBox__medalIcon"
                                        src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                      />
                                    ) : (
                                      <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="textBox">
                                <p className="textBox__nick">{nickNm}</p>
                                <p className="textBox__dal">
                                  <img src={dalIcon} width={20} alt="dal" />
                                  {giftDal.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {isFan === false && memNo !== context.token.memNo && (
                              <button onClick={() => Regist(memNo)} className="plusFan">
                                +팬등록
                              </button>
                            )}
                            {isFan === true && memNo !== context.token.memNo && <button onClick={() => Cancel(memNo)}>팬</button>}
                          </li>
                        )
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

                {allListType === 'gift' ? (
                  <ul className="scrollWrap">
                    {fanGiftList.length > 0 ? (
                      <>
                        {fanGiftList.map((value, idx) => {
                          const {nickNm, giftDal, profImg, isFan, memNo} = value
                          return (
                            <li className="rankitem" key={idx}>
                              <div className="rankitemWrap">
                                <div
                                  className="thumbBox"
                                  onClick={() => {
                                    Link(memNo), context.action.updateCloseRank(false)
                                  }}>
                                  <img src={profImg.thumb120x120} className="thumbBox__thumb" alt="thumb" />
                                  {idx < 5 && (
                                    <>
                                      {idx < 3 ? (
                                        <img
                                          className="thumbBox__medalIcon"
                                          src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                        />
                                      ) : (
                                        <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="textBox">
                                  <p className="textBox__nick">{nickNm}</p>
                                  <p className="textBox__dal">
                                    <img src={dalIcon} width={20} alt="dal" />
                                    {giftDal.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {isFan === false && memNo !== context.token.memNo && (
                                <button onClick={() => Regist(memNo)} className="plusFan">
                                  +팬등록
                                </button>
                              )}
                              {isFan === true && memNo !== context.token.memNo && (
                                <button onClick={() => Cancel(memNo)}>팬</button>
                              )}
                            </li>
                          )
                        })}
                      </>
                    ) : (
                      <NoResult />
                    )}
                  </ul>
                ) : (
                  <ul className="scrollWrap">
                    {goodList.length > 0 ? (
                      <>
                        {goodList.map((value, idx) => {
                          const {nickNm, good, profImg, isFan, memNo} = value
                          return (
                            <li className="rankitem" key={idx}>
                              <div className="rankitemWrap">
                                <div
                                  className="thumbBox"
                                  onClick={() => {
                                    Link(memNo), context.action.updateCloseRank(false)
                                  }}>
                                  <img src={profImg.thumb120x120} className="thumbBox__thumb" alt="thumb" />
                                  {idx < 5 && (
                                    <>
                                      {idx < 3 ? (
                                        <img
                                          className="thumbBox__medalIcon"
                                          src={idx === 0 ? goldMedal : idx === 1 ? silverMedal : bronzeMedal}
                                        />
                                      ) : (
                                        <span className={`thumbBox__rank thumbBox__rank--${idx + 1}`}>{idx + 1}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="textBox">
                                  <p className="textBox__nick">{nickNm}</p>
                                  <p className="textBox__dal">
                                    <img src={goodIcon} width={20} alt="good" />
                                    {good.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {isFan === false && memNo !== context.token.memNo && (
                                <button onClick={() => Regist(memNo)} className="plusFan">
                                  +팬등록
                                </button>
                              )}
                              {isFan === true && memNo !== context.token.memNo && (
                                <button onClick={() => Cancel(memNo)}>팬</button>
                              )}
                            </li>
                          )
                        })}
                      </>
                    ) : (
                      <NoResult />
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </HoleWrap>
    </>
  )
}

const HoleWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    width: calc(100% - 32px);
    max-width: 328px;
    border-radius: 12px;
    background-color: #fff;
    position: relative;

    .close {
      display: block;
      position: absolute;
      top: -40px;
      right: 0;
      width: 36px;
      height: 36px;
      background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
    }
  }

  .scrollWrap {
    overflow: hidden;
    height: 300px;
    overflow-y: scroll;
  }

  .tabWrap {
    display: flex;

    &__tab {
      width: 50%;
      height: 52px;
      text-align: center;
      line-height: 52px;
      font-size: 18px;
      font-weight: 700;

      &--active {
        color: #632beb;
        border-bottom: 1px solid #632beb;
        font-weight: bold;
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
      font-size: 16px;

      &--active {
        color: #632beb;
        font-weight: bold;
        border-bottom: 1px solid #632beb;
      }
    }
  }

  .rankitem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;

    .rankitemWrap {
      display: flex;
      align-items: center;
      width: calc(100% - 66px);
    }

    .thumbBox {
      position: relative;
      width: 40px;
      height: 40px;
      margin-right: 12px;

      &__thumb {
        width: 100%;
        border-radius: 50%;
      }

      &__rank {
        position: absolute;
        top: -2px;
        left: -2px;
        width: 16px;
        height: 16px;
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        font-size: 9px;
        text-align: center;
        border-radius: 50%;
      }

      &__medalIcon {
        width: 20px;
        position: absolute;
        top: -6px;
        left: -6px;
      }
    }

    .textBox {
      width: calc(100% - 52px);

      &__nick {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: normal;
        margin-bottom: 3px;
        font-weight: 800;
        font-size: 14px;
      }

      &__dal {
        font-size: 14px;
        color: #424242;
      }
    }

    button {
      width: 56px;
      height: 26px;
      border: 1px solid #632beb;
      font-size: 12px;
      letter-spacing: -0.3px;
      border-radius: 13px;
      color: #632beb;
    }
    .plusFan {
      background-color: #632beb;
      color: #fff;
    }
  }
`
