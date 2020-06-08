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

export default props => {
  const {rankType, djRank, fanRank} = props
  const globalCtx = useContext(Context)

  const MyMemNo = globalCtx.profile && globalCtx.profile.memNo

  if (djRank === undefined || fanRank === undefined) {
    return null
  }

  const swiperParams = {
    slidesPerView: 'auto'
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
                <div className="main-img" style={{backgroundImage: `url(${profImg['thumb190x190']})`}}></div>
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
        <Swiper>
          {fanRank.map((fan, idx) => {
            const {rank, nickNm, memNo, profImg} = fan
            return (
              <div
                className="slide-wrap"
                key={`fan-${idx}`}
                onClick={() => saveUrlAndRedirect(MyMemNo === memNo ? `/menu/profile` : `/mypage/${memNo}`)}>
                <div className="main-img" style={{backgroundImage: `url(${profImg['thumb190x190']})`}}></div>
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
      width: 64px;
      height: 64px;
      border-radius: 12px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .nickname {
      width: 72px;
      overflow: hidden;
      text-overflow: ellipsis;
      height:16px;
      white-space: nowrap;
<<<<<<< HEAD
      color: #fff;
      font-size: 12px;
=======
      color: #424242;
      width:100px;
      font-size: 14px;
      line-height: 1.14;
>>>>>>> mobile
      letter-spacing: -0.35px;
      text-align: center;
      margin-top: 8px;
      font-weight: 600;
      transform: skew(-0.03deg);
    }
    .info-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 6px;
      line-height: 2.17;
      height:13px;

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
