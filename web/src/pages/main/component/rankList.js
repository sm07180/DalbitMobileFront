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
    spaceBetween: 20,
    slidesPerView: 'auto',
    // slidesPerView: '3',
    rebuildOnUpdate: true
  }

  return (
    <>
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
    </>
  )
}
