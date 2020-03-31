import React, {useEffect} from 'react'
import styled from 'styled-components'

import {broadcastLive} from 'constant/broadcast.js'

import HeartIcon from '../static/ic_heart_s_g.svg'
import HeadphoneIcon from '../static/ic_headphones_s.svg'

export default props => {
  return props.list.map((list, idx) => {
    const {roomType, bgImg, bjNickNm, title, likeCnt, entryCnt} = list

    return (
      <LiveList key={`live-${idx}`} bgImg={bgImg['thumb150x150']}>
        <div className="broadcast-img" />
        <div className="broadcast-content">
          <div className="title">{title}</div>
          <div className="nickname">{bjNickNm}</div>
          <div className="detail">
            <div className="broadcast-type">{broadcastLive[roomType]}</div>
            <div className="value">
              <img src={HeartIcon} />
              <span>{likeCnt !== undefined && likeCnt.toLocaleString()}</span>
            </div>
            <div className="value">
              <img src={HeadphoneIcon} />
              <span>{entryCnt !== undefined && entryCnt.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </LiveList>
    )
  })
}

const LiveList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;

  .broadcast-img {
    width: 72px;
    height: 72px;
    border-radius: 26px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-image: url(${props => props.bgImg});
    background-color: #eee;
  }

  .broadcast-content {
    margin-left: 16px;

    & > div {
      margin: 5px 0;
    }

    .title {
      color: #424242;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: -0.35px;
    }
    .nickname {
      color: #757575;
      font-size: 12px;
      letter-spacing: -0.3px;
    }
    .detail {
      display: flex;
      flex-direction: row;
      align-items: center;

      .broadcast-type {
        color: #8556f6;
        font-size: 11px;
        letter-spacing: -0.28px;
        margin-right: 10px;
      }
      .value {
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-left: 6px;
        color: #bdbdbd;
        font-size: 11px;
        letter-spacing: -0.28px;

        img {
          display: block;
          margin-right: 2px;
        }
      }
    }
  }
`
