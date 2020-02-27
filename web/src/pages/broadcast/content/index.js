/**
 * @file /broadcast/index.js
 * @brief 방송방
 */
import React, {useMemo, useEffect, useContext, useState, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {BroadCastStore} from '../store'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//etc

//components
import ChatUI from './chat-ui'

const sc = require('context/socketCluster')
import SideContent from './tab'

//pages
// import Guide from ' pages/common/layout/guide.js'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context) //global context
  const store = useContext(BroadCastStore) //store
  //const
  const {state} = props.location
  //useMemo
  const info = useMemo(() => {
    store.action.updateRoomInfo(state)
    return state
  })
  //useState
  const [isSideOn, setIsSideOn] = useState(true)
  const [timerFlag, setTimerFlag] = useState(false)
  const [myTimer, setMyTimer] = useState()

  const hostRole = 3
  // const guestRole = ?
  const listenerRole = 0
  //---------------------------------------------------------------------

  const {mediaHandler} = context
  const [publishStatus, setPublishStatus] = useState(false)
  const [playStatus, setPlayStatus] = useState(false)
  const {bjStreamId, roomRole, bjProfImg} = state

  const startPlayer = () => {
    if (roomRole === hostRole) {
      setPublishStatus(true)
    } else if (roomRole === listenerRole) {
      setPlayStatus(true)
    }
  }
  const stopPlayer = () => {
    if (roomRole === hostRole) {
      setPublishStatus(false)
    } else if (roomRole === listenerRole) {
      setPlayStatus(false)
    }
  }
  useEffect(() => {
    //방송방 페이지는 header, footer없음.
    context.action.updateState({isOnCast: true})
    return () => {
      context.action.updateState({isOnCast: false})
    }
  }, [])
  useEffect(() => {
    if (mediaHandler) {
      if (mediaHandler.rtcPeerConn) {
        mediaHandler.stop()
      }

      if (bjProfImg) {
        mediaHandler.setHostImage(bjProfImg.url)
      }
      mediaHandler.setLocalStartCallback(startPlayer)
      mediaHandler.setLocalStopCallback(stopPlayer)
      mediaHandler.setStreamId(bjStreamId)

      if (roomRole === hostRole) {
        mediaHandler.setType('host')
        // mediaHandler.setPublishToken(pubToken)
      } else if (roomRole === listenerRole) {
        mediaHandler.setType('listener')
      }
    }

    return () => {
      if (mediaHandler) {
        mediaHandler.resetLocalCallback()
      }
    }
  }, [mediaHandler])

  //--------------------------------------------------------------------- 부스트 정보 조회 테스트 by 최우정
  useEffect(() => {
    let flag = false
    store.action.initBoost(props.location.state.roomNo)
    return () => {
      flag = true
    }
  }, [])

  useEffect(() => {
    if (store.boostList.boostCnt > 0) {
      const stop = clearInterval(myTimer)
      setMyTimer(stop)
      let myTime = store.boostList.boostTime
      const interval = setInterval(() => {
        myTime -= 1
        let m = Math.floor(myTime / 60) + ':' + ((myTime % 60).toString().length > 1 ? myTime % 60 : '0' + (myTime % 60))
        store.action.updateTimer(m)
        if (myTime === 0) {
          clearInterval(interval)
        }
      }, 1000)
      setMyTimer(interval)
    }
  }, [store.boostList])
  //---------------------------------------------------------------------

  //makeContents
  const makeContents = () => {
    return JSON.stringify(state, null, 4)
  }

  useEffect(() => {
    // 방 소켓 연결
    console.log('방소켓 연결 해라 ')
    if (props && props.location.state) sc.socketClusterBinding(props.location.state.roomNo, context)
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content className={isSideOn ? 'side-on' : 'side-off'}>
      <Chat>
        {/* 채팅방 영역 */}
        <ChatUI {...props} />
      </Chat>
      <SideBTN
        onClick={() => {
          setTimeout(() => {
            setIsSideOn(!isSideOn)
          }, 100)
        }}>
        사이드 영역 열고 닫기
      </SideBTN>
      <Side>
        {/* side content 영역 */}

        <SideContent {...props}>{/* <Charge /> */}</SideContent>
      </Side>
      {roomRole === hostRole ? (
        <AudioWrap>
          <h1>Host BJ</h1>
          <div>Stream ID : {bjStreamId}</div>
          <div>
            <button
              style={{
                width: '100px',
                height: '50px',
                color: 'white',
                cursor: 'pointer',
                backgroundColor: publishStatus ? 'red' : 'blue'
              }}
              onClick={() => {
                if (!bjStreamId) {
                  return alert('Need a stream id')
                }
                if (!mediaHandler.audioStream) {
                  return alert('Need a audio sream and stereo mix')
                }

                if (mediaHandler && !mediaHandler.rtcPeerConn) {
                  mediaHandler.publish()
                  startPlayer()
                } else if (mediaHandler && mediaHandler.rtcPeerConn) {
                  mediaHandler.stop()
                  stopPlayer()
                }
              }}>
              {publishStatus ? 'Stop' : 'Publish'}
            </button>
          </div>
        </AudioWrap>
      ) : (
        <AudioWrap>
          <h1>Listener</h1>

          <div>streamId: {bjStreamId}</div>

          {!playStatus && (
            <div>
              <button
                style={{
                  width: '100px',
                  height: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  backgroundColor: 'blue'
                }}
                onClick={() => {
                  if (!bjStreamId) {
                    return alert('Need a stream id')
                  }
                  if (mediaHandler.audioTag && mediaHandler && !mediaHandler.rtcPeerConn) {
                    const status = mediaHandler.play()
                    if (status) {
                      startPlayer()
                    }
                  }
                }}>
                play
              </button>
            </div>
          )}

          {playStatus && (
            <div>
              <button
                style={{width: '100px', height: '50px', backgroundColor: 'red', color: 'white', cursor: 'pointer'}}
                onClick={() => {
                  if (mediaHandler.audioTag && mediaHandler && mediaHandler.rtcPeerConn) {
                    mediaHandler.stop()
                    stopPlayer()
                  }
                }}>
                stop
              </button>
            </div>
          )}
        </AudioWrap>
      )}
    </Content>
  )
}
//---------------------------------------------------------------------

const Content = styled.section`
  position: relative;
  width: 1210px;
  height: 100%;
  margin: 2.5vh auto 0 auto;
  &:after {
    clear: both;
    display: block;
    content: '';
  }
  & > * {
    height: calc(95vh - 80px);

    @media (max-width: ${WIDTH_TABLET_S}) {
      height: 100vh;
    }
  }

  &.side-off > div:first-child {
    width: calc(100% - 20px);
    /* @media (max-width: ${WIDTH_TABLET_S}) {
      width: 100%;
    } */
  }
  &.side-off > button + div {
    width: 20px;
  }

  @media (max-width: 1260px) {
    width: 95%;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0;
  }
`

//채팅창 레이아웃
const Chat = styled.div`
  float: left;
  width: calc(100% - 408px);
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
  }
`
//side영역
const Side = styled.div`
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
  width: 388px;
  padding-left: 20px;
  background: #fff;
  /* min-width: 408px; */
  @media (max-width: ${WIDTH_TABLET_S}) {
    padding: 20px;
    .side-off & {
      padding: 0;
    }
  }

  @media (max-width: 440px) {
    width: calc(100% - 20px);
  }
`

const SideBTN = styled.button`
  position: relative;
  display: block;
  width: 20px;
  background: #f2f2f2;
  transform: none;
  text-indent: -9999px;
  z-index: 11;
  &:after {
    display: block;
    margin: 0 auto;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid #757575;
    content: '';
  }
  .side-off &:after {
    border-left: 0;
    border-right: 8px solid #757575;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    position: absolute;
    right: 388px;
    .side-off & {
      right: 0;
    }
  }
  @media (max-width: 440px) {
    right: inherit;
    left: 0;
    .side-off & {
      right: 0;
      left: inherit;
    }
  }
`
////////////////////////오디오랩
const AudioWrap = styled.div`
  position: fixed;
  top: 41%;
  left: 3%;
  width: 238px;
  height: 108px;
  z-index: 999;
`
