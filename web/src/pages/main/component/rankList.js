import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'

import {saveUrlAndRedirect} from 'components/lib/link_control.js'

// component
import Swiper from 'react-id-swiper'

// static
import GoldMedal from '../static/medal_gold_m@2x.png'
import SilverMedal from '../static/medal_silver_m@2x.png'
import BronzeMedal from '../static/medal_bronze_m@2x.png'

export default (props) => {
  let {rankType, djRank, fanRank} = props
  const globalCtx = useContext(Context)

  const MyMemNo = globalCtx.profile && globalCtx.profile.memNo

  if (djRank === undefined || fanRank === undefined) {
    return null
  }

  const swiperParams = {
    spaceBetween: 12,
    slidesPerView: 'auto',
    // slidesPerView: '3',
    rebuildOnUpdate: true
  }

  return (
    <RankList>
      {rankType === 'dj' ? (
        <Swiper {...swiperParams}>
          {djRank.map((dj, idx) => {
            const {rank, nickNm, memNo, profImg} = dj
            return (
              <div
                className="rank-slide"
                key={`dj-${idx}`}
                onClick={() => saveUrlAndRedirect(MyMemNo === memNo ? `/menu/profile` : `/mypage/${memNo}`)}>
                <div className="main-img" style={{backgroundImage: `url(${profImg['thumb190x190']})`}}>
                  {idx > 2 ? (
                    // <div className="counting">{rank}</div>
                    <></>
                  ) : (
                    <img className="medal-img" src={idx === 0 ? GoldMedal : idx === 1 ? SilverMedal : BronzeMedal} />
                  )}
                </div>
                <div className="nickname">{nickNm}</div>
              </div>
            )
          })}
        </Swiper>
      ) : (
        <Swiper {...swiperParams}>
          {fanRank.map((fan, idx) => {
            const {rank, nickNm, memNo, profImg} = fan
            return (
              <div
                className="rank-slide"
                key={`fan-${idx}`}
                onClick={() => saveUrlAndRedirect(MyMemNo === memNo ? `/menu/profile` : `/mypage/${memNo}`)}>
                <div className="main-img" style={{backgroundImage: `url(${profImg['thumb190x190']})`}}>
                  {idx > 2 ? (
                    <></>
                  ) : (
                    <img className="medal-img" src={idx === 0 ? GoldMedal : idx === 1 ? SilverMedal : BronzeMedal} />
                  )}
                </div>
                <div className="nickname">{nickNm}</div>
              </div>
            )
          })}
        </Swiper>
      )}
    </RankList>
  )
}

const RankList = styled.div`
  .swiper-container {
    padding: 16px 0 0 16px;
  }
  .rank-slide {
    position: relative;
    display: block;
    width: auto;
    height: auto;
    text-align: center;
    /* .counting {
      position: absolute;
      top: 0;
      left: 0;
      color: #000;
      border-radius: 50%;
      background-color: #e0e0e0;
      width: 24px;
      height: 24px;
      font-size: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    } */
    .main-img {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto;
      border-radius: 24px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      .medal-img {
        position: absolute;
        top: -4px;
        left: -4px;
        width: 24px;
        height: 24px;
      }
    }
    .nickname {
      overflow: hidden;
      text-overflow: ellipsis;
      height: 16px;
      white-space: nowrap;
      font-weight: bold;
      font-size: 16px;
      color: #000;
      line-height: 1.08;
      letter-spacing: -0.35px;
      text-align: center;
      margin-top: 8px;
      transform: skew(-0.03deg);
    }
    .info-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 6px;
      line-height: 2.17;
      height: 13px;
      .text {
        color: #424242;
        font-size: 12px;
        letter-spacing: -0.3px;
        line-height: 2.17;
        margin-left: 2px;
      }
      .heart-icon {
        margin-left: 6px;
      }
    }
  }
`
