import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'

import {broadcastLive} from 'constant/broadcast.js'

import HeartIcon from '../static/ic_heart_s_g.svg'
import HeadphoneIcon from '../static/ic_headphones_s.svg'
import audioIcon from '../static/ico_audio.svg'
import videoIcon from '../static/ico_video.svg'
import maleIcon from '../static/ico_male.png'
import femaleIcon from '../static/ico_female.png'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

//makeContents

const makeContents = props => {
  const {list} = props

  return list.map((list, idx) => {
    const {roomNo, roomType, bjProfImg, bjNickNm, bjGender, title, likeCnt, entryCnt} = list
    console.log('list', list)
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
            <img className="gender-icon" src={bjGender === 'm' ? maleIcon : femaleIcon} />
          </div>
          <div className="title">{title}</div>
          <div className="nickname">{bjNickNm}</div>
          <div className="detail">
            <div className="value">
              <img src={HeadphoneIcon} />
              <span>{entryCnt !== undefined && entryCnt.toLocaleString()}</span>
            </div>
            <div className="value">
              <img src={HeartIcon} />
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
    width: 72px;
    height: 72px;
    border-radius: 12px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #eee;
  }

  .broadcast-content {
    margin-left: 16px;

    & > div {
      margin: 5px 0;
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
        padding: 1px 6px;
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
