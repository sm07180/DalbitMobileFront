import React, {useEffect, useState} from 'react'

import './event_page.scss'
import API from 'context/api'

// component
import CommentEvent from './comment_event'

// static
import GoldMedal from './static/medal_gold@2x.png'
import SivelMedal from './static/medal_silver@2x.png'
import BronzeMedal from './static/medal_bronze@2x.png'

export default props => {
  const [eventType, setEventType] = useState('event') // event, comment

  const [rankingType, setRankingType] = useState('exp') // exp: 경험치, like: 좋아요, gift: 선물
  const [rankingStep, setRankingStep] = useState(1) // 1차, 2차, 3차

  useEffect(() => {
    // reset event type category
    if (eventType === 'event') {
      setRankingType('exp')
      setRankingStep(1)
    }
  }, [eventType])

  useEffect(() => {
    async function fetchInitData() {
      // await API
    }

    fetchInitData()
  }, [])

  return (
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
                <div className="content-wrap">
                  <img src="https://image.dalbitlive.com/event/200603/ranking_exp_img.png" />

                  <div className="notice-wrap">
                    <p>
                      <span>※</span> 순위는 실시간으로 집계됩니다.
                    </p>
                    <p>
                      <span>※</span> 당첨자 발표일 및 유의사항 <button type="button">자세히보기</button>
                    </p>
                  </div>
                </div>
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
                  <span className="ranking">23</span>
                  <span>위</span>
                  <span className="bar">|</span>
                  <span className="exp-title">달성 경험치</span>
                  <span>32,432</span>
                </div>

                <div className="content-wrap">
                  <div className="category-wrap">
                    <span className="rank-txt">순위</span>
                    <span className="dj-txt">DJ</span>
                    <span className="top-fan">최고팬</span>
                  </div>
                  {[1, 2, 3, 4].map((value, idx) => {
                    return (
                      <div className="user-wrap" key={`user-${idx}`}>
                        <div className="rank-wrap">
                          {idx < 3 ? (
                            <img className="medal-icon" src={idx === 0 ? GoldMedal : idx === 1 ? SivelMedal : BronzeMedal} />
                          ) : (
                            100
                          )}
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
  )
}
