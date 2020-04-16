import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'

import {broadcastLive} from 'constant/broadcast.js'

import audioIcon from '../static/ico_audio.svg'
import videoIcon from '../static/ico_video.svg'
import maleIcon from '../static/ico_male.png'
import femaleIcon from '../static/ico_female.png'
import hitIcon from '../static/ico_hit_g.svg'
import likeIcon from '../static/ico_like_g_s.svg'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const makeContents = props => {
  const {list} = props

  return list.map((list, idx) => {
    const {roomNo, roomType, bjProfImg, bjNickNm, bjGender, title, likeCnt, entryCnt} = list

    return (
      <LiveList
        key={`live-${idx}`}
        onClick={() => {
          RoomJoin(roomNo + '')
        }}>
        <div className="broadcast-img" style={{backgroundImage: `url(${bjProfImg['thumb150x150']})`}} />
        <div className="broadcast-content">
          <div className="icon-wrap">
            <img className="type-icon" src={audioIcon} />
            <div className="type-text">{broadcastLive[roomType]}</div>
            {bjGender !== 'n' && <img className="gender-icon" src={bjGender === 'm' ? maleIcon : femaleIcon} />}
          </div>
          <div className="title">{title}</div>
          <div className="nickname">{bjNickNm}</div>
          <div className="detail">
            <div className="value">
              <img src={hitIcon} />
              <span>{entryCnt !== undefined && entryCnt.toLocaleString()}</span>
            </div>
            <div className="value">
              <img src={likeIcon} />
              <span>{likeCnt !== undefined && likeCnt.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </LiveList>
    )
  })
}
export default props => {
  return (
    <React.Fragment>
      <Room />
      {makeContents(props)}
    </React.Fragment>
  )
}

const LiveList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;

  .broadcast-img {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #eee;
  }

  .broadcast-content {
    width: calc(100% - 92px);
    margin-left: 12px;

    .title {
      margin-top: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 20px;
      line-height: 20px;
    }

    .nickname {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 20px;
      line-height: 20px;
      margin-top: 3px;
    }

    .detail {
      margin-top: 4px;
    }

    .icon-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;

      & > div {
        margin-right: 2px;
      }

      .type-icon {
        display: block;
        margin-right: 2px;
      }

      .type-text {
        min-width: 30px;
        background-color: #9e9e9e;
        border-radius: 8px;
        color: #fff;
        font-size: 11px;
        /* padding: 1px 6px 0px 6px; */
        padding: 0 6px;
        height: 16px;
        line-height: 16px;
      }

      .gender-icon {
        display: block;
        width: 44px;
      }
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
        color: #424242;
        font-size: 11px;
        letter-spacing: -0.3px;

        &:nth-child(2) {
          margin-left: 6px;
        }

        img {
          display: block;
        }
      }
    }
  }
`
