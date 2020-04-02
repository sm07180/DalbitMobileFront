import React, {useEffect} from 'react'
import styled from 'styled-components'

// component
import Swiper from 'react-id-swiper'

// static
import peopleIcon from '../static/ic_people_s.svg'
import heartIcon from '../static/ic_heart_s.svg'

export default props => {
  const {rankType, djRank, fanRank} = props

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
                <div className="main-img" style={{backgroundImage: `url(${profImg['thumb190x190']})`}}>
                  <div className="counting">{rank}</div>
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
  .slide-wrap {
    width: 102px;
    margin-right: 10px;

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
      color: #424242;
      font-size: 14px;
      letter-spacing: -0.35px;
      text-align: center;
      margin-top: 10px;
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
`
