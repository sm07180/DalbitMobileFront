import React, {useEffect, useRef, useContext} from 'react'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'

import {broadcastLive} from 'constant/broadcast.js'

import audioIcon from '../static/ico_audio.svg'
import noBgAudioIcon from '../static/audio_s.svg'
import videoIcon from '../static/ico_video.svg'
import maleIcon from '../static/ico_male.svg'
import femaleIcon from '../static/ico_female.svg'
import hitIcon from '../static/ico_hit_g.svg'
import likeIcon from '../static/ico_like_g_s.svg'
import boostIcon from '../static/ico_like_g.svg'
import starIcon from '../static/ico_hit_g_s.svg'
import Util from 'components/lib/utility.js'

// static
import EntryImg from '../static/person_w_s.svg'
import specialIcon from '../static/ico_speciladj_s.svg'
import fanIcon from '../static/ico_fan.svg'
import twentyIcon from '../static/ico_20.svg'
import allIcon from '../static/ico_all.svg'
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const makeContents = (props) => {
  const {list, liveListType} = props
  const evenList = list.filter((v, idx) => idx % 2 === 0)
  if (liveListType === 'detail') {
    return list.map((list, idx) => {
      const {
        roomNo,
        roomType,
        bjProfImg,
        bjNickNm,
        bjGender,
        title,
        likeCnt,
        entryCnt,
        giftCnt,
        badgeSpecial,
        boostCnt,
        rank
      } = list

      return (
        <LiveList
          key={`live-${idx}`}
          onClick={() => {
            RoomJoin({roomNo: roomNo, nickNm: bjNickNm})
          }}>
          <div className="broadcast-img" style={{backgroundImage: `url(${bjProfImg['thumb190x190']})`}} />
          <div className="broadcast-content">
            <div className="icon-wrap">
              <img className="type-icon" src={audioIcon} />
              <div className="type-text">{broadcastLive[roomType]}</div>
              {bjGender !== '' && <img className="gender-icon" src={bjGender === 'm' ? maleIcon : femaleIcon} />}
              {badgeSpecial > 0 && <em className="specialIcon">스페셜DJ</em>}
            </div>
            <div className="title">{title}</div>
            <div className="nickname">{bjNickNm}</div>
            <div className="detail">
              <div className="value">
                <img src={hitIcon} />
                <span>{Util.printNumber(entryCnt)}</span>
              </div>
              {boostCnt > 0 ? (
                <div className="value">
                  <img src={boostIcon} />
                  <span className="txt_boost">{Util.printNumber(likeCnt)}</span>
                </div>
              ) : (
                <div className="value">
                  <img src={likeIcon} />
                  <span>{Util.printNumber(likeCnt)}</span>
                </div>
              )}
              {rank < 11 && (
                <div className="value">
                  <img src={starIcon} />
                  <span>{Util.printNumber(giftCnt)}</span>
                </div>
              )}
            </div>
          </div>
        </LiveList>
      )
    })
  } else {
    return (
      <EvenWrap>
        {evenList.map((first, idx) => {
          const windowHalfWidth = (window.innerWidth - 32) / 2
          const firstList = first
          const lastList = list[idx * 2 + 1]

          return (
            <HalfWrap style={{height: `${windowHalfWidth}px`}} key={`half-${idx}`}>
              <div
                className="half-live"
                style={{backgroundImage: `url(${firstList.bjProfImg['thumb190x190']})`}}
                onClick={() => {
                  RoomJoin({roomNo: firstList.roomNo + '', nickNm: bjNickNm})
                }}>
                <div className="top-status">
                  {firstList.entryType === 2 ? (
                    <span className="twenty-icon">20</span>
                  ) : firstList.entryType === 1 ? (
                    <span className="fan-icon">FAN</span>
                  ) : (
                    <span className="all-icon">ALL</span>
                  )}
                  {firstList.badgeSpecial > 0 && <span className="special-icon">S</span>}
                </div>
                <div className="entry-count">
                  <img className="entry-img" src={EntryImg} />
                  <span className="count-txt">{Util.printNumber(firstList.entryCnt)}</span>
                </div>
                <div className="bottom-wrap">
                  <div className="type-icon-wrap">
                    <img className="type-icon" src={noBgAudioIcon} />
                  </div>
                  <div className="dj-nickname">{firstList.bjNickNm}</div>
                </div>
              </div>
              {lastList && (
                <div
                  className="half-live"
                  style={{backgroundImage: `url(${lastList.bjProfImg['thumb190x190']})`}}
                  onClick={() => {
                    RoomJoin({roomNo: lastList.roomNo, nickNm: bjNickNm})
                  }}>
                  <div className="top-status">
                    {lastList.entryType === 2 ? (
                      <span className="twenty-icon">20</span>
                    ) : lastList.entryType === 1 ? (
                      <span className="fan-icon">FAN</span>
                    ) : (
                      <span className="all-icon">ALL</span>
                    )}
                    {lastList.badgeSpecial > 0 && <img src={specialIcon} className="special-icon" />}
                  </div>
                  <div className="entry-count">
                    <img className="entry-img" src={EntryImg} />
                    <span className="count-txt">{Util.printNumber(lastList.entryCnt)}</span>
                  </div>
                  <div className="bottom-wrap">
                    <div className="type-icon-wrap">
                      <img className="type-icon" src={noBgAudioIcon} />
                    </div>
                    <div className="dj-nickname">{lastList.bjNickNm}</div>
                  </div>
                </div>
              )}
            </HalfWrap>
          )
        })}
      </EvenWrap>
    )
  }
}

export default (props) => {
  return (
    <React.Fragment>
      <Room />
      {makeContents(props)}
    </React.Fragment>
  )
}

const EvenWrap = styled.div`
  margin-top: 18px;
`

const HalfWrap = styled.div`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .half-live {
    position: relative;
    width: calc(50% - 4px);
    height: 100%;
    border-radius: 16px;
    background-color: #eee;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    .top-status {
      position: absolute;
      top: 6px;
      left: 6px;
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        margin-right: 3px;
      }

      .twenty-icon {
        width: 24px;
        height: 16px;
        font-size: 8px;
        line-height: 15px;
        box-sizing: border-box;
        border-radius: 8px;
        background-color: rgba(223, 57, 57, 0.5);
        text-align: center;
        color: #fff;
      }
      .special-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        line-height: 16px;
        font-size: 7px;
        text-align: center;
        color: #fff;
        background-color: #ec455f;
      }
      .all-icon {
        width: 24px;
        height: 16px;
        font-size: 8px;
        line-height: 15px;
        box-sizing: border-box;
        border-radius: 8px;
        background-color: rgba(102, 177, 46, 0.5);
        text-align: center;
        color: #fff;
      }
      .fan-icon {
        width: 24px;
        height: 16px;
        font-size: 8px;
        line-height: 15px;
        box-sizing: border-box;
        border-radius: 8px;
        background-color: rgba(78, 115, 217, 0.5);
        text-align: center;
        color: #fff;
      }
    }

    .entry-count {
      position: absolute;
      top: 6px;
      right: 6px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .entry-img {
        display: block;
      }
      .count-txt {
        color: #fff;
        font-size: 11px;
      }
    }

    .bottom-wrap {
      position: absolute;
      bottom: 6px;
      left: 6px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .type-icon-wrap {
        width: 26px;
        border-radius: 8px;
        background-color: rgba(254, 189, 86, 0.5);
        height: 16px;

        .type-icon {
          width: 26px;
        }
      }

      .dj-nickname {
        color: #fff;
        font-size: 12px;
      }
    }

    &:nth-child(1) {
      margin-right: 4px;
    }
    &:nth-child(2) {
      margin-left: 4px;
    }
  }
`

const LiveList = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  padding: 0 7px;
  margin: 20px -8px;
  width: 100%;

  :before {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;

    box-sizing: border-box;
    border-radius: 15px;
    background: #f5f5f5;

    content: '';
  }
  @media (hover: hover) {
    &:hover:before {
      display: block;
    }
  }

  .txt_boost {
    color: #ec455f;
  }

  .specialIcon {
    display: inline-block;
    width: 62px;
    height: 16px;
    margin-left: 4px;
    border-radius: 10px;
    background-color: #ec455f;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: center;
    padding-left: 6px;
    padding-right: 6px;
  }

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
        padding-left: 6px;
        padding-right: 6px;
        height: 16px;
        line-height: 16px;
      }

      .gender-icon {
        display: block;
        width: 16px;
        height: 16px;
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
        color: #632beb;
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

        &:nth-child(2),
        &:nth-child(3) {
          margin-left: 6px;
        }

        img {
          display: block;
        }
      }
    }
  }
`
