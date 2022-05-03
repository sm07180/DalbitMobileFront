import Utility from 'components/lib/utility'
//context
import API from 'context/api'
import {PHOTO_SERVER} from 'context/config.js'
// component
import Layout from 'pages/common/layout'
import NoResult from 'pages/main/component/NoResult.js'
import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import CommentEvent from './comment_event'
import './event_page.scss'
import RankingTypeContent from './ranking_type_content'
import btnClose from './static/ico_close.svg'
import BronzeMedal from './static/medal_bronze@2x.png'
// static
import GoldMedal from './static/medal_gold@2x.png'
import SivelMedal from './static/medal_silver@2x.png'

export default (props) => {

  const [eventType, setEventType] = useState('event') // event, comment
  // const [eventType, setEventType] = useState('comment')

  const [rankingType, setRankingType] = useState('exp') // exp: 경험치, like: 좋아요, gift: 선물
  const [rankingTerm, setRankingTerm] = useState(null) // 1차, 2차, 3차

  const [termList, setTermList] = useState([])
  const [rankList, setRankList] = useState(null)
  const [myRankInfo, setMyRankInfo] = useState({})

  const history = useHistory()

  const RankType = {
    exp: 1,
    like: 2,
    gift: 3
  }

  useEffect(() => {
    async function fetchEventTermData() {
      const {result, data} = await API.getEventTerm()
      if (result === 'success') {
        const {nowRound, terms} = data
        const selectedTerm = terms.find((t) => t.round === nowRound)
        setTermList(terms)
        setRankingTerm(selectedTerm)
      }
    }

    fetchEventTermData()
    let rankTypeNum = Utility.getRandomInt(0, 2)
    setRankingType(Object.keys(RankType)[rankTypeNum])
  }, [])

  useEffect(() => {
    async function fetchInitData() {
      const {state} = rankingTerm

      if (state === 'ing') {
        const {result, data} = await API.getEventRankingLive({slctType: RankType[rankingType]})
        if (result === 'success') {
          setRankList(data.list)
          setMyRankInfo({
            myRank: data.myRank,
            myPoint: data.myPoint
          })
        }
      } else if (state === 'finished') {
        const {result, data} = await API.getEventRankingResult({slctType: RankType[rankingType], round: rankingTerm.round})
        if (result === 'success') {
          setRankList(data.list)
          setMyRankInfo({
            myRank: data.myRank,
            myPoint: data.myPoint
          })
        }
      } else if (state === 'ready') {
        setRankList([])
        setMyRankInfo({
          myRank: 0,
          myPoint: 0
        })
      }
    }

    if (rankingTerm) {
      fetchInitData()
    }
  }, [rankingType, rankingTerm])

  const chageEventText = () => {
    if (rankingType === 'exp') {
      return <>달성 경험치</>
    } else if (rankingType === 'like') {
      return <>좋아요 수</>
    } else if (rankingType === 'gift') {
      return <>선물 개수</>
    }
  }

  return (
    <Layout {...props} status="no_gnb">
      <div id="event-page">
        <div className="event-main">
          <img src="https://image.dallalive.com/event/200608/main_top_v2.png" />
          <Link to="/">
            <button>
              <img src={btnClose} />
            </button>
          </Link>
        </div>

        <div className="event-type-wrap">
          <div className="event-tab-wrap">
            <div className={`tab ${eventType === 'event' ? 'active' : ''}`} onClick={() => setEventType('event')}>
              랭킹 이벤트
            </div>
            <div className={`tab ${eventType === 'comment' ? 'active' : ''}`} onClick={() => setEventType('comment')}>
              댓글 이벤트
            </div>
          </div>

          <div className="event-content-wrap">
            {/* Ranking Event Section */}
            {eventType === 'event' && (
              <>
                <div className="ranking-type-wrap">
                  <div className="ranking-tab-wrap">
                    <div className={`tab ${rankingType === 'exp' ? 'active' : ''}`} onClick={() => setRankingType('exp')}>
                      경험치 랭킹
                    </div>
                    <div className={`tab ${rankingType === 'like' ? 'active' : ''}`} onClick={() => setRankingType('like')}>
                      좋아요 랭킹
                    </div>
                    <div className={`tab ${rankingType === 'gift' ? 'active' : ''}`} onClick={() => setRankingType('gift')}>
                      선물 랭킹
                    </div>
                  </div>

                  {rankingTerm && <RankingTypeContent rankingType={rankingType} rankingTerm={rankingTerm} />}
                </div>

                <div className="stage-wrap">
                  <div className="stage-tab-wrap">
                    {rankingTerm &&
                      termList.map((data, idx) => {
                        const {round, term, state} = data

                        return (
                          <div
                            key={`term-${idx}`}
                            className={`tab ${rankingTerm.round === round ? 'active' : ''}`}
                            onClick={() => {
                              // if (state !== 'ready') {
                              setRankingTerm(data)
                              // }
                            }}>
                            {`${round}차`}
                            <br />
                            <span>{term}</span>
                          </div>
                        )
                      })}
                  </div>

                  <div className="my-info">
                    <span>내 순위</span>
                    <span className="ranking">{myRankInfo.myRank}</span>
                    <span>위</span>
                    <span className="bar">|</span>
                    <span className="exp-title">{chageEventText()}</span>
                    <span>{myRankInfo.myPoint}</span>
                  </div>

                  <div className="content-wrap">
                    <div className="category-wrap">
                      <span className="rank-txt">순위</span>
                      <span className="dj-txt">DJ</span>
                      {rankingType === 'exp' && <span className="top-fan">최고팬</span>}
                    </div>
                  </div>

                  {Array.isArray(rankList) && rankList.length > 0 ? (
                    rankList.map((value, idx) => {
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
                                {chageEventText()} <span>{gainPoint}</span>
                              </div>
                            </div>
                          </div>
                          {rankingType === 'exp' && fanRank1 && (
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

            {/* Comment Event Section */}
            {eventType === 'comment' && <CommentEvent />}
          </div>
        </div>
      </div>
    </Layout>
  )
}
