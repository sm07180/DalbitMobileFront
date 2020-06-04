import React, {useEffect, useState, useContext} from 'react'

import './event_page.scss'
import API from 'context/api'

// component
import Layout from 'pages/common/layout'
import RankingTypeContent from './ranking_type_content'
import CommentEvent from './comment_event'

import {PHOTO_SERVER} from 'context/config.js'

// static
import GoldMedal from './static/medal_gold@2x.png'
import SivelMedal from './static/medal_silver@2x.png'
import BronzeMedal from './static/medal_bronze@2x.png'

export default props => {
  const [eventType, setEventType] = useState('event') // event, comment

  const [rankingType, setRankingType] = useState('exp') // exp: 경험치, like: 좋아요, gift: 선물
  const [rankingStep, setRankingStep] = useState(1) // 1차, 2차, 3차
  const [rankList, setRankList] = useState([])
  const [myRankInfo, setMyRankInfo] = useState({})

  const RankType = {
    exp: 1,
    like: 2,
    gift: 3
  }

  useEffect(() => {
    // reset event type category
    if (eventType === 'event') {
      setRankingType('exp')
      setRankingStep(1)
    }
  }, [eventType])

  useEffect(() => {
    async function fetchInitData() {
      const {result, data} = await API.getEventRanking({slctType: RankType[rankingType]})
      if (result === 'success') {
        setRankList(data.list)
        setMyRankInfo({
          myRank: data.myRank,
          myPoint: data.myPoint
        })
      }
    }

    fetchInitData()
  }, [rankingType])

  return (
    <Layout {...props} status="no_gnb">
      <div id="event-page">
        <div className="event-main">
          <img src="https://image.dalbitlive.com/event/200603/main_top.png" />
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

                  <RankingTypeContent rankingType={rankingType} />
                </div>

                <div className="stage-wrap">
                  <div className="stage-tab-wrap">
                    <div className={`tab ${rankingStep === 1 ? 'active' : ''}`} onClick={() => setRankingStep(1)}>
                      1차
                      <br />
                      <span>6/1~ 6/7</span>
                    </div>
                    <div className={`tab ${rankingStep === 2 ? 'active' : ''}`} onClick={() => setRankingStep(2)}>
                      2차
                      <br />
                      <span>6/1~ 6/7</span>
                    </div>
                    <div className={`tab ${rankingStep === 3 ? 'active' : ''}`} onClick={() => setRankingStep(3)}>
                      3차
                      <br />
                      <span>6/1~ 6/7</span>
                    </div>
                  </div>

                  <div className="my-info">
                    <span>내 순위</span>
                    <span className="ranking">{myRankInfo.myRank}</span>
                    <span>위</span>
                    <span className="bar">|</span>
                    <span className="exp-title">달성 경험치</span>
                    <span>{myRankInfo.myPoint}</span>
                  </div>

                  <div className="content-wrap">
                    <div className="category-wrap">
                      <span className="rank-txt">순위</span>
                      <span className="dj-txt">DJ</span>
                      <span className="top-fan">최고팬</span>
                    </div>
                    {rankList.map((value, idx) => {
                      const {profileImage, nickName, level, gainPoint, fanImage, fanNick, memSex} = value

                      return (
                        <div className="user-wrap" key={`user-${idx}`}>
                          <div className="rank-wrap">
                            {idx < 3 ? (
                              <img className="medal-icon" src={idx === 0 ? GoldMedal : idx === 1 ? SivelMedal : BronzeMedal} />
                            ) : (
                              <span className="num">{idx}</span>
                            )}
                          </div>
                          <div className="dj-info">
                            <div className="thumb" style={{backgroundImage: `url(${PHOTO_SERVER}${profileImage})`}}></div>
                            <div>
                              <span className="nick-name">{nickName}</span>
                              <span className="level">Lv{level}</span>
                              <div className="exp-box">
                                달성경험치 <span>{gainPoint}</span>
                              </div>
                            </div>
                          </div>
                          <div className="top-fan">
                            <div className="thumb" style={{backgroundImage: `url(${PHOTO_SERVER}${fanImage})`}}></div>
                            <div className="fan-nick">{fanNick}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
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
