//globalCtx
import API from 'context/api'
import {PHOTO_SERVER} from 'context/config.js'
// component
import Layout from 'pages/common/layout'
import NoResult from 'pages/main/component/NoResult.js'
import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import './event_rising.scss'

// static
import btnClose from './static/ico_close.svg'
import BronzeMedal from './static/medal_bronze@2x.png'
import GoldMedal from './static/medal_gold@2x.png'
import SivelMedal from './static/medal_silver@2x.png'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [eventType, setEventType] = useState(1) // star, fan

  const [risingList, setRisingList] = useState([])
  const [myRisingInfo, setMyRisingInfo] = useState({})
  const [eventRound, setEventRound] = useState(0)
  const [risingState, setRisingState] = useState({})

  const history = useHistory()
  const {token} = globalState

  useEffect(() => {
    async function fetchInitData() {
      const {result, data} = await API.getEventRisingLive({
        slct_type: eventType
      })

      if (result === 'success') {
        if (data.state === 'ing') {
          setRisingList(data.risingList)
          setMyRisingInfo({
            myRank: data.risingOutput.myRank,
            myPoint: data.risingOutput.myPoint,
            giftPoint: data.risingOutput.giftPoint,
            goodPoint: data.risingOutput.goodPoint,
            expPoint: data.risingOutput.expPoint,
            listenerPoint: data.risingOutput.listenerPoint
          })

          setEventRound(data.round)
        } else {
          setRisingList([])
          setMyRisingInfo({
            myRank: 0,
            myPoint: 0,
            giftPoint: 0,
            goodPoint: 0,
            expPoint: 0,
            listenerPoint: 0
          })
        }
      } else {
        //실패
      }
    }
    if (!token.isLogin) {
      history.push({
        pathname: '/login',
        state: {
          state: 'event_rising'
        }
      })
    }
    fetchInitData()
  }, [eventType])

  const makeImageTop = () => {
    if (!eventRound) return null
    if (eventRound === 1) {
      return <img src="https://image.dallalive.com/event/rising/200715/main_top.png" />
    } else {
      return <img src="https://image.dallalive.com/event/rising/200722/main_top.png" />
    }
  }

  const makeImageStar = () => {
    if (!eventRound) return null
    if (eventRound === 1) {
      return (
        <img
          src="https://image.dallalive.com/event/rising/200715/rising_star_img.png"
          onClick={() => {
            dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'rising-event-gift-detail']}));
          }}
        />
      )
    } else {
      return (
        <img
          src="https://image.dallalive.com/event/rising/200722/rising_star_img.png"
          onClick={() => {
            dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'rising-event-gift-detail2']}));
          }}
        />
      )
    }
  }

  const makeImageFan = () => {
    if (!eventRound) return null
    if (eventRound === 1) {
      return (
        <img
          src="https://image.dallalive.com/event/rising/200715/rising_fan_img.png"
          onClick={() => {
            dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'rising-event-gift-detail']}));
          }}
        />
      )
    } else {
      return (
        <img
          src="https://image.dallalive.com/event/rising/200722/rising_fan_img.png"
          onClick={() => {
            dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'rising-event-gift-detail2']}));
          }}
        />
      )
    }
  }

  const makeButton = () => {
    if (eventRound === 1) {
      return (
        <button
          onClick={() => {
            dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'rising-event-detail']}));
          }}>
          자세히
        </button>
      )
    } else {
      return (
        <button
          onClick={() => {
            dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'rising-event-detail2']}));
          }}>
          자세히
        </button>
      )
    }
  }

  return (
    <Layout {...props} status="no_gnb">
      <div id="event-page" className={`${eventRound === 1 ? '' : 'round2'}`}>
        <div className="event-main">
          {makeImageTop()}
          <Link to="/">
            <button>
              <img src={btnClose} />
            </button>
          </Link>
        </div>

        <div className="event-type-wrap">
          <div className="event-tab-wrap">
            <div className={`tab ${eventType === 1 ? 'active' : ''}`} onClick={() => setEventType(1)}>
              라이징 스타
            </div>
            <div className={`tab ${eventType === 2 ? 'active' : ''}`} onClick={() => setEventType(2)}>
              라이징 팬
            </div>
          </div>

          <div className="event-content-wrap">
            {/* Star Event Section */}
            {eventType === 1 && (
              <>
                <div className="stage-wrap">
                  <div className="content-wrap">
                    {makeImageStar()}
                    <div className="notice-wrap">
                      <p>순위는 실시간으로 집계됩니다.</p>
                      <p>당첨자 발표일 및 유의사항 {makeButton()}</p>
                    </div>
                    <div className="how-wrap">
                      <p>※ 순위 계산 방법 : 기간 내 경험치 + (청취자 수 × 5)</p>
                    </div>
                  </div>
                  <div className="my-info">
                    <span>내 순위</span>
                    <span className="ranking">{myRisingInfo.myRank}</span>
                    <span>위</span>
                    <div className="my-point">
                      <span className="exp-title">포인트</span>
                      <span>{myRisingInfo.myPoint}</span>
                      <span className="point-detail">
                        (경험치 {myRisingInfo.expPoint} + ({myRisingInfo.listenerPoint}명 x 5)
                      </span>
                    </div>
                  </div>
                  <div className="content-wrap">
                    <div className="category-wrap">
                      <span className="rank-txt">순위</span>
                      <span className="dj-txt">DJ</span>
                      <span className="top-fan">최고팬</span>
                    </div>
                  </div>
                  {Array.isArray(risingList) && risingList.length > 0 ? (
                    risingList.map((value, idx) => {
                      const {
                        profileImage,
                        nickName,
                        level,
                        gainPoint,
                        fanRank1,
                        fanImage,
                        fanNick,
                        mem_no,
                        expPoint,
                        listenerPoint
                      } = value
                      return (
                        <div className="user-wrap" key={`user-${idx}`}>
                          <div className="rank-wrap">
                            {idx < 3 ? (
                              <img className="medal-icon" src={idx === 0 ? GoldMedal : idx === 1 ? SivelMedal : BronzeMedal} />
                            ) : (
                              <span className="num">{idx + 1}</span>
                            )}
                          </div>
                          <div className="dj-info">
                            <div
                              className="thumb"
                              style={{backgroundImage: `url(${PHOTO_SERVER}${profileImage})`}}
                              onClick={() => {
                                history.push(`/profile/${mem_no}`)
                              }}></div>
                            <div className="nick-name-wrap">
                              <span className="nick-name">{nickName}</span>
                              <span className="level">Lv{level}</span>
                              <div className="exp-box">
                                <span>{gainPoint.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          {fanRank1 && (
                            <div className="top-fan">
                              <div
                                className="thumb"
                                style={{backgroundImage: `url(${PHOTO_SERVER}${fanImage})`}}
                                onClick={() => {
                                  history.push(`/profile/${fanRank1}`)
                                }}></div>
                              <div className="fan-nick">{fanNick}</div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <NoResult />
                  )}
                </div>
              </>
            )}

            {/* Fan Event Section */}
            {eventType === 2 && (
              <>
                <div className="stage-wrap">
                  <div className="content-wrap">
                    {makeImageFan()}

                    <div className="notice-wrap">
                      <p>순위는 실시간으로 집계됩니다.</p>
                      <p>당첨자 발표일 및 유의사항 {makeButton()}</p>
                    </div>

                    <div className="how-wrap">
                      <p>※ 순위 계산 방법 : 기간 내 선물 수 + 좋아요 수</p>
                    </div>
                  </div>
                  <div className="my-info">
                    <span>내 순위</span>
                    <span className="ranking">{myRisingInfo.myRank}</span>
                    <span>위</span>
                    <div className="my-point">
                      <span className="exp-title">포인트</span>
                      <span>{myRisingInfo.myPoint}</span>
                      <span className="point-detail">
                        (선물 {myRisingInfo.giftPoint} + 좋아요 {myRisingInfo.goodPoint}명)
                      </span>
                    </div>
                  </div>
                  <div className="content-wrap">
                    <div className="category-wrap">
                      <span className="rank-txt">순위</span>
                      <span className="dj-txt">DJ</span>
                    </div>
                  </div>
                  {Array.isArray(risingList) && risingList.length > 0 ? (
                    risingList.map((value, idx) => {
                      const {profileImage, nickName, level, gainPoint, fanRank1, fanImage, fanNick, mem_no} = value
                      return (
                        <div className="user-wrap" key={`user-${idx}`}>
                          <div className="rank-wrap">
                            {idx < 3 ? (
                              <img className="medal-icon" src={idx === 0 ? GoldMedal : idx === 1 ? SivelMedal : BronzeMedal} />
                            ) : (
                              <span className="num">{idx + 1}</span>
                            )}
                          </div>
                          <div className="dj-info fan">
                            <div
                              className="thumb"
                              style={{backgroundImage: `url(${PHOTO_SERVER}${profileImage})`}}
                              onClick={() => {
                                history.push(`/profile/${mem_no}`)
                              }}></div>
                            <div className="nick-name-wrap">
                              <span className="nick-name">{nickName}</span>
                              <span className="level">Lv{level}</span>
                              <div className="exp-box">
                                <span>{gainPoint.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <NoResult />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
