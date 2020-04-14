import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import Api from 'context/api'
import {Context} from 'context'
// component
import Swiper from 'react-id-swiper'
import NoRsult from 'components/ui/noResult'

// static
import peopleIcon from '../static/ic_people.svg'
import heartIcon from '../static/ico_like_g.svg'

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
            const {rank, nickNm, memNo, profImg, likes, listeners} = dj
            return (
              <div className="slide-wrap" key={`dj-${idx}`}>
                <Link to={MyMemNo === memNo ? `/menu/profile` : `/mypage/${memNo}`}>
                  <div className="main-img" style={{backgroundImage: `url(${profImg['thumb190x190']})`}}>
                    <div className="counting">{rank}</div>
                  </div>
                  <div className="nickname">{nickNm}</div>
                  <div className="info-wrap">
                    <img src={peopleIcon} />
                    <div className="text">{typeof listeners === 'number' && listeners.toLocaleString()}</div>
                    <img src={heartIcon} className="heart-icon" />
                    <div className="text">{typeof likes === 'number' && likes.toLocaleString()}</div>
                  </div>
                </Link>
              </div>
            )
          })}
        </Swiper>
      ) : (
        <Swiper>
          {fanRank.map((fan, idx) => {
            const {rank, nickNm, memNo, profImg} = fan
            return (
              <div className="slide-wrap" key={`fan-${idx}`}>
                <Link to={MyMemNo === memNo ? `/menu/profile` : `/mypage/${memNo}`}>
                  <div className="main-img" style={{backgroundImage: `url(${profImg['thumb190x190']})`}}>
                    <div className="counting">{rank}</div>
                  </div>
                  <div className="nickname">{nickNm}</div>
                </Link>
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
    width: 102px;

    .main-img {
      position: relative;
      width: 102px;
      height: 102px;
      border-radius: 32px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;

      .counting {
        color: #fff;
        border-radius: 50%;
        background-color: #8556f6;
        width: 18px;
        height: 18px;
        font-size: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .nickname {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #424242;
      font-size: 14px;
      letter-spacing: -0.35px;
      text-align: center;
      margin-top: 10px;
      font-weight: 600;
      transform: skew(-0.03deg);
    }
    .info-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 6px;

      .text {
        color: #bdbdbd;
        font-size: 11px;
        letter-spacing: -0.28px;
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
