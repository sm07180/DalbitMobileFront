import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
// etc
import Api from 'context/api'
import Utility from 'components/lib/utility'
import {COLOR_POINT_Y} from 'context/color'
import {IMG_SERVER, WIDTH_PC_S, WIDTH_TABLET_S} from 'context/config'
import {clipExit} from './clip_func'

import IconStart from './static/play_w_m.svg'
import IconPause from './static/pause_w_m.svg'

export default (props) => {
  //---------------------------------------------------------------------
  //context
  const globalCtx = useContext(Context)
  const {clipState, clipPlayerState, clipPlayerInfo} = globalCtx

  const settingSessionInfo = (type) => {
    let data = Utility.getCookie('clip-player-info')
    data = JSON.parse(data)
    data = {...data, playerState: type}
    Utility.setCookie('clip-player-info', JSON.stringify(data))
  }

  const makePlayBtn = () => {
    switch (clipPlayerState) {
      case 'playing':
        return (
          <button
            onClick={() => {
              Hybrid('ClipPlayerPause')
              globalCtx.action.updateClipPlayerState('paused')
              settingSessionInfo('paused')
            }}>
            <img src={IconPause} alt="멈춤" />
          </button>
        )
      case 'paused':
      case 'ended':
        return (
          <button
            onClick={() => {
              Hybrid('ClipPlayerStart')
              globalCtx.action.updateClipPlayerState('playing')
              settingSessionInfo('playing')
            }}>
            <img src={IconStart} alt="시작" />
          </button>
        )
      default:
        return null
    }
  }

  if (!clipState || clipPlayerInfo === null) return null

  //---------------------------------------------------------------------
  return (
    <ClipPlayer>
      <div className="player-wrap">
        <div className="equalizer">
          <ul className={clipPlayerState !== 'playing' ? 'off' : 'on'}>
            <li>
              <span></span>
            </li>
            <li>
              <span></span>
            </li>
            <li>
              <span></span>
            </li>
            <li>
              <span></span>
            </li>
            <li>
              <span></span>
            </li>
          </ul>
          <p>CAST</p>
        </div>
        <div className="info">
          <div className="profile">
            <Figure url={clipPlayerInfo.bgImg}>{makePlayBtn()}</Figure>
          </div>
          <p
            onClick={() => {
              Hybrid('ClipPlayerEnter')
            }}>
            <b>{clipPlayerInfo.nickname}</b>
            <span>{clipPlayerInfo.title}</span>
          </p>
        </div>
        <button
          className="close"
          onClick={() => {
            clipExit(globalCtx)
          }}>
          닫기
        </button>
      </div>
    </ClipPlayer>
  )
}

const ClipPlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 8px;
  width: 100%;
  z-index: 100;

  .player-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    padding: 14px 32px;
    box-sizing: border-box;
    width: 1210px;
    border-radius: 44px;
    background-color: rgba(0, 0, 0, 0.85);
    color: #fff;

    b,
    p,
    span {
      display: inline-block;
      transform: skew(-0.03deg);
    }

    @media (max-width: ${WIDTH_PC_S}) {
      width: 95%;
    }

    .equalizer {
      width: 36px;
      height: 36px;
      margin-right: 20px;
      color: ${COLOR_POINT_Y};
      text-align: center;

      ul {
        height: 14px;
        width: 20px;
        margin: 0 auto;
        padding: 0 0 0 0;
        position: relative;
        li {
          width: 2px;
          float: left;
          margin: 0 2px 0 0;
          padding: 0;
          height: 14px;
          position: relative;
          list-style-type: none;
          span {
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 14px;
            background: ${COLOR_POINT_Y};
            transform: 0.3s height;
          }
        }
        li:nth-child(1) span {
          animation: equalizer-bar 2s 1s ease-out alternate infinite;
        }
        li:nth-child(2) span {
          animation: equalizer-bar 2s 0.5s ease-out alternate infinite;
        }
        li:nth-child(3) span {
          animation: equalizer-bar 2s 1.5s ease-out alternate infinite;
        }
        li:nth-child(4) span {
          animation: equalizer-bar 2s 0.25s ease-out alternate infinite;
        }
        li:nth-child(5) span {
          animation: equalizer-bar 2s 2s ease-out alternate infinite;
        }
        &.off li span {
          animation: none;
          height: 0px;
        }
      }
      p {
        padding-top: 6px;
        font-size: 11px;
      }
    }

    /* 정보부분 */
    .info {
      display: flex;
      align-items: center;
      p {
        margin-top: 4px;
        font-size: 14px;
        line-height: 24px;
        cursor: pointer;
        b {
          display: block;
          font-size: 18px;
          font-weight: 600;
        }
      }
      .profile {
        display: inline-block;
        position: relative;
        height: 60px;
      }
      /* cursor: pointer; */
    }

    .state {
      margin: 0 auto;
      span {
        padding-left: 23px;
        line-height: 18px;
      }
      span:nth-child(1) {
        background: url(${IMG_SERVER}/images/api/ic_bar_people.png) no-repeat left center;
        background-size: 18px;
      }
      span:nth-child(2) {
        background: url(${IMG_SERVER}/images/api/ic_bar_peoples.png) no-repeat left center;
        background-size: 18px;
      }
      span:nth-child(3) {
        background: url(${IMG_SERVER}/images/api/ic_bar_heart.png) no-repeat left center;
        background-size: 18px;
      }
      span + span {
        margin-left: 18px;
      }
    }

    .close {
      display: block;
      width: 50px;
      height: 50px;
      margin-left: auto;
      margin-right: -10px;
      background: url(${IMG_SERVER}/images/api/ic_close_b.png) no-repeat center center / cover;
      background-size: 36px;
      text-indent: -9999px;
    }

    .enter-btn {
      position: absolute;
      left: 0;
      top: 0;
      width: 93%;
      height: 100%;
      text-indent: -9999px;
    }

    @media (min-width: ${WIDTH_TABLET_S}) {
      .close:hover {
        animation: rotate-center 0.5s ease-in-out both;
      }

      &:hover figure {
        position: relative;
        z-index: 1;
        animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
      }

      &:hover figure + em {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 80px;
        height: 80px;
        box-sizing: border-box;
        margin-left: -10px;
        margin-top: -10px;
        border-radius: 100px;
        background-color: ${COLOR_POINT_Y};
        opacity: 0.6;
        animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      }
    }

    @media (max-width: ${WIDTH_TABLET_S}) {
      padding: 3px 16px;
      .enter-btn {
        width: 85%;
      }

      .equalizer {
        height: 29px;
        margin-right: 10px;
      }
      .state {
        display: none;
      }
      .info {
        max-width: calc(100% - 70px);
        min-width: 200px;
        p {
          width: calc(100% - 50px);
          margin-top: 2px;
          font-size: 12px;
          line-height: 20px;
          margin-left: 10px;
          b {
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
          }
          span {
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .profile {
          height: 40px;
        }
      }
    }
  }
`

const Figure = styled.figure`
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: url(${(props) => props.url}) no-repeat center center / cover;
  button {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 40px;
    height: 40px;
  }
`
