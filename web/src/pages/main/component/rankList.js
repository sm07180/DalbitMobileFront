import React, {useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import {saveUrlAndRedirect} from 'components/lib/link_control.js'
import {IMG_SERVER} from 'context/config'

// component
import Swiper from 'react-id-swiper'
import {useDispatch, useSelector} from "react-redux";

// static
const GoldMedal = `${IMG_SERVER}/main/200714/ico-ranking-gold.png`
const SilverMedal = `${IMG_SERVER}/main/200714/ico-ranking-silver.png`
const BronzeMedal = `${IMG_SERVER}/main/200714/ico-ranking-bronze.png`
const LiveIcon = 'https://image.dalbitlive.com/svg/ic_live.svg'
const ListenIcon = 'https://image.dalbitlive.com/svg/ico_listen.svg'

export default (props) => {
  const history = useHistory()
  let {rankType, djRank, fanRank} = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();

  if (djRank === undefined || fanRank === undefined) {
    return null
  }

  const swiperParams = {
    slidesPerView: 'auto',
    // slidesPerView: '3',
    rebuildOnUpdate: true
  }

  return (
    <>
      {rankType === 'dj' ? (
        <Swiper {...swiperParams}>
          {djRank &&
            djRank.map((dj, idx) => {
              const {rank, nickNm, memNo, profImg, liveBadgeList, roomNo} = dj
              return (
                <div
                  className="rank-slide"
                  key={`dj-${idx}`}
                  onClick={() => {
                    if (globalState.token.isLogin) {
                      history.push(`/profile/${memNo}`)
                    } else {
                      history.push('/login')
                    }
                  }}>
                  <div className="main-img" style={{backgroundImage: `url(${profImg['thumb120x120']})`}}>
                    {idx > 2 ? (
                      // <div className="counting">{rank}</div>
                      <></>
                    ) : liveBadgeList.length > 0 ? (
                      <img className="live-medal-img" src={liveBadgeList[0].icon} />
                    ) : (
                      <img className="medal-img" src={idx === 0 ? GoldMedal : idx === 1 ? SilverMedal : BronzeMedal} />
                    )}
                    {roomNo !== undefined && roomNo !== '' && <em className="icon_wrap icon_live icon_live_ranking">라이브중</em>}
                  </div>
                  <div className="nickname">{nickNm}</div>
                </div>
              )
            })}
        </Swiper>
      ) : (
        <Swiper {...swiperParams}>
          {fanRank &&
            fanRank.map((fan, idx) => {
              const {rank, nickNm, memNo, profImg, liveBadgeList, listenRoomNo} = fan
              return (
                <div
                  className="rank-slide"
                  key={`fan-${idx}`}
                  onClick={() => {
                    if (globalState.token.isLogin) {
                      history.push(`/profile/${memNo}`)
                    } else {
                      history.push('/login')
                    }
                  }}>
                  <div className="main-img" style={{backgroundImage: `url(${profImg['thumb120x120']})`}}>
                    {idx > 2 ? (
                      // <div className="counting">{rank}</div>
                      <></>
                    ) : liveBadgeList.length > 0 ? (
                      <img className="live-medal-img" src={liveBadgeList[0].icon} />
                    ) : (
                      <img className="medal-img" src={idx === 0 ? GoldMedal : idx === 1 ? SilverMedal : BronzeMedal} />
                    )}
                    {listenRoomNo !== undefined && listenRoomNo !== '' && (
                      <em className="icon_wrap icon_listen icon_listen_ranking">청취중</em>
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
