/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//context
import {isHybrid} from 'context/hybrid'
import {Context} from 'context'
import {COLOR_POINT_Y} from 'context/color'
import {IMG_SERVER, WIDTH_PC_S, WIDTH_TABLET_S} from 'context/config'
import Utility from 'components/lib/utility'
// etc

// image

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [info, setInfo] = useState({
    /**
     * {roomNo,bjNickNm,title,bjProfImg,auth}
     */
    bjNickNm: 'BJ아이유😍',
    roomNo: null,
    bjProfImg: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
    title: '✨상쾌한 아침을 함께해요✨✨상쾌한 아침을 함께해요✨',
    auth: 0
  })
  //---------------------------------------------------------------------
  const makeCloseBtn = () => {
    if (info.auth === 3) return
    return (
      <button
        className="close"
        onClick={() => {
          props.update({playerClose: true})
        }}>
        닫기
      </button>
    )
  }
  //useEffect Native
  useEffect(() => {
    if (!isHybrid()) return
    //@Native
    if (context.nativePlayer !== null && context.nativePlayer !== undefined) {
      setInfo(context.nativePlayer)
    }
  }, [context.nativePlayer])
  //useEffect React
  useEffect(() => {
    if (isHybrid()) return
    //@PC
    if (context.roomInfo !== null && context.roomInfo !== undefined) {
      const {auth, title, bjNickNm, roomNo, bjProfImg, likes} = context.roomInfo
      setInfo({
        bjNickNm: bjNickNm,
        roomNo: roomNo,
        bjProfImg: bjProfImg.thumb150x150,
        title: title,
        auth: auth
      })
    }
  }, [context.roomInfo])

  //---------------------------------------------------------------------
  return (
    <MediaPlayerWrap>
      <MediaPlayer>
        <div className="equalizer">
          <ul>
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
          <p>LIVE</p>
        </div>
        <div className="info">
          <div className="profile">
            <Figure url={info.bjProfImg}></Figure>
            <em></em>
          </div>
          <p>
            <b>{info.bjNickNm}</b>
            <span>{info.title}</span>
          </p>
        </div>
        {!isHybrid() && (
          <div className="state">
            <span>{_.hasIn(context.broadcastTotalInfo, 'userCount') && context.broadcastTotalInfo.userCount}</span>
            <span>{_.hasIn(context.broadcastTotalInfo, 'historyCount') && context.broadcastTotalInfo.historyCount}</span>
            <span>{_.hasIn(context.broadcastTotalInfo, 'likes') && context.broadcastTotalInfo.likes}</span>
          </div>
        )}
        <button
          className="enter-btn"
          onClick={() => {
            props.update({playerNavigator: true})
          }}>
          방송방 재진입
        </button>
        {/* 닫기버튼 */}
        {makeCloseBtn()}
      </MediaPlayer>
    </MediaPlayerWrap>
  )
}
//---------------------------------------------------------------------
const MediaPlayerWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  width: 100%;
  z-index: 100;
`
const MediaPlayer = styled.div`
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
          transform: none;
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
    padding: 12px 22px;
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
      p {
        width: calc(100% - 50px);
        margin-top: 2px;
        font-size: 12px;
        line-height: 20px;
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
`

const Figure = styled.figure`
  display: inline-block;
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 50%;
  background: url(${props => props.url}) no-repeat center center / cover;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
`

/**
   {pathCheck && mediaPlayerStatus && mediaHandler && mediaHandler.rtcPeerConn && (
        <MediaPlayerWrap>
          <MediaPlayer>
            {mediaHandler.type === 'listener' && (
              <>
                <img style={{width: '60px', borderRadius: '50%'}} src={mediaHandler.connectedHostImage} />
                <img
                  src={stopSvg}
                  style={{
                    cursor: 'pointer',
                    marginLeft: 'auto',
                    width: '36px',
                    height: '36px'
                  }}
                  onClick={() => {
                    if (mediaHandler.rtcPeerConn) {
                      mediaHandler.stop()
                    }
                  }}
                />
              </>
            )}
          </MediaPlayer>
        </MediaPlayerWrap>
      )}
 */
