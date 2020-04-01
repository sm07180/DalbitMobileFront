import React, {useEffect} from 'react'
import styled from 'styled-components'

// component
import Swiper from 'react-id-swiper'

// static
import peopleIcon from '../static/ic_people_s.svg'
import heartIcon from '../static/ic_heart_s.svg'

export default props => {
  const {rankType, djRank, fanRank} = props
  return (
    <RankList>
      {rankType === 'dj' ? (
        <Swiper>
          {djRank.map((dj, idx) => {
            // const {} = dj
            return (
              <div className="slide-wrap" key={`dj-${idx}`}>
                <div className="main-img">
                  <div className="counting" />
                </div>
                <div className="broadcast-title"></div>
                <div className="info-wrap">
                  <img src={peopleIcon} />
                  <div className="text"></div>
                  <img src={heartIcon} />
                  <div className="text"></div>
                </div>
              </div>
            )
          })}
        </Swiper>
      ) : (
        <Swiper>
          {fanRank.map((fan, idx) => {
            // const {} = fan
            return (
              <div className="slide-wrap" key={`fan-${idx}`}>
                <div className="main-img">
                  <div className="counting" />
                </div>
                <div className="broadcast-title"></div>
                <div className="info-wrap">
                  <img src={peopleIcon} />
                  <div className="text"></div>
                  <img src={heartIcon} />
                  <div className="text"></div>
                </div>
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
    display: flex;
    flex-direction: column;

    .main-img {
      position: relative;
      width: 102px;
      height: 102px;
      border-radius: 32px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;

      .couting {
        color: #fff;
        border-radius: 50%;
        background-color: #8556f6;
      }
    }
    .broadcast-title {
      color: #424242;
      font-size: 14px;
      letter-spacing: -0.35px;
    }
    .info-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;

      .text {
        color: #bdbdbd;
        font-size: 11px;
        letter-spacing: -0.28px;
      }
    }
  }
`
