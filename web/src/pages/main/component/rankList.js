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
    slidesPerView: 'auto',
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
                className="slide-wrap"
                key={`dj-${idx}`}
                onClick={() => saveUrlAndRedirect(MyMemNo === memNo ? `/menu/profile` : `/mypage/${memNo}`)}>
                <div className="main-img" style={{backgroundImage: `url(${profImg['thumb80x80']})`}}></div>
                <div className="nickname">{nickNm}</div>
                {idx > 2 ? (
                  <div className="counting">{rank}</div>
                ) : (
                  <img className="medal-img" src={idx === 0 ? GoldMedal : idx === 1 ? SilverMedal : BronzeMedal} />
                )}
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
                className="slide-wrap"
                key={`fan-${idx}`}
                onClick={() => saveUrlAndRedirect(MyMemNo === memNo ? `/menu/profile` : `/mypage/${memNo}`)}>
                <div className="main-img" style={{backgroundImage: `url(${profImg['thumb80x80']})`}}></div>
                <div className="nickname">{nickNm}</div>
                {idx > 2 ? (
                  <div className="counting">{rank}</div>
                ) : (
                  <img className="medal-img" src={idx === 0 ? GoldMedal : idx === 1 ? SilverMedal : BronzeMedal} />
                )}
              </div>
            )
          })}
        </Swiper>
      )}
    </RankList>
  )
}

const RankList = styled.div`
  position: absolute;
  top: 0;
  left: 16px;
  width: calc(100% - 16px);

  .swiper-container {
    padding-right: 16px;
  }
  .slide-wrap {
    position: relative;
    width: 76px;
    padding-top: 6px;
    padding-left: 6px;

    .medal-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 24px;
      height: 24px;
    }
    .counting {
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
    }
    .main-img {
      position: relative;
      width: 72px;
      height: 72px;
      border-radius: 36px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .nickname {
      width: 72px;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 16px;
      white-space: nowrap;
      font-weight: normal;
      font-size: 12px;
      color: #424242;
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
  .slide-wrap + .slide-wrap {
    margin-left: 10px;
  }
`
