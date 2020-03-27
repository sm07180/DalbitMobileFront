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
import Api from 'context/api'

//etc
import roomCheck from 'components/lib/roomCheck.js'
import qs from 'query-string'
import {isHybrid, Hybrid} from 'context/hybrid'

//components
import useResize from 'components/hooks/useResize'
import ChatUI from './chat-ui'
import {setSesstionStorage, getSesstionStorage} from 'components/lib/sesstionStorageCtl'

const sc = require('context/socketCluster')
import SideContent from './tab'

let audioStartInterval = null
let getBoradInfo = false
const {roomNo} = qs.parse(location.search)

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
    context.action.updateRoomInfo(state)
    return state
  })
  //useState
  const [isSideOn, setIsSideOn] = useState(true)
  const [resizeCheck, setResizeCheck] = useState(false)

  const {mediaHandler, broadcastTotalInfo} = context

  const hostRole = 3
  // const guestRole = ?
  const listenerRole = 0
  //---------------------------------------------------------------------
  // if (!broadcastTotalInfo && !getBoradInfo) {
  //   ;(async () => {
  //     getBoradInfo = true
  //     const data = await roomCheck(roomNo, context, () => {
  //       props.history.push('/live')
  //     })
  //     if (data) {
  //       if (isHybrid()) {
  //         Hybrid('RoomJoin', data)
  //         props.history.goBack()
  //       } else {
  //         context.action.updateBroadcastTotalInfo(data)
  //       }
  //     }
  //   })()
  // }
  //---------------------------------------------------------------------

  const [publishStatus, setPublishStatus] = useState(false)
  const [playStatus, setPlayStatus] = useState(false)
  const [authValue, setAuthValue] = useState(null)

  const startPlayer = () => {
    if (authValue === hostRole) {
      setPublishStatus(true)
    } else if (authValue === listenerRole) {
      setPlayStatus(true)
    }
  }
  const stopPlayer = () => {
    if (authValue === hostRole) {
      setPublishStatus(false)
    } else if (authValue === listenerRole) {
      setPlayStatus(false)
    }
  }
  useEffect(() => {
    context.action.updateState({isOnCast: true})
    return () => {
      context.action.updateState({isOnCast: false})
    }
  }, [])

  // Media Handle Logic
  useEffect(() => {
    if (mediaHandler && broadcastTotalInfo) {
      const {bjStreamId, auth} = broadcastTotalInfo
      setAuthValue(auth)

      // 이미 방송이 연결되어 있을 때
      if (mediaHandler.rtcPeerConn) {
        if (mediaHandler.streamId !== bjStreamId) {
          mediaHandler.stop()
        }
      }

      mediaHandler.setContext(context)
      mediaHandler.setLocalStartCallback(startPlayer)
      mediaHandler.setLocalStopCallback(stopPlayer)
      mediaHandler.setStreamId(bjStreamId)
      ;(async () => {
        if (auth === hostRole) {
          await mediaHandler.setType('host')
          // mediaHandler.setPublishToken(pubToken)
        } else if (auth === listenerRole) {
          await mediaHandler.setType('listener')
        }

        // media start
        if (mediaHandler.streamId) {
          if (mediaHandler.type === 'host') {
            audioStartInterval = setInterval(() => {
              if (mediaHandler.ws.readyState === 1) {
                mediaHandler.publish()
                clearInterval(audioStartInterval)
              }
            }, 50)
          }
          if (mediaHandler.type === 'listener') {
            audioStartInterval = setInterval(() => {
              if (mediaHandler.ws.readyState === 1) {
                mediaHandler.play()
                clearInterval(audioStartInterval)
              }
            }, 50)
          }
        }
      })()
    }

    return () => {
      if (mediaHandler) {
        mediaHandler.resetLocalCallback()
      }
    }
  }, [mediaHandler])

  //---------------------------------------------------------------------

  async function getReToken(roomNo) {
    const res = await Api.broadcast_reToken({data: {roomNo: roomNo}})
    //Error발생시
    if (res.result === 'fail') {
      context.action.updateMediaPlayerStatus(false) //플레이어 remove
      props.history.push('/')
      return
    }

    //sc.socketClusterBinding(roomNo, context)
    context.action.updateBroadcastTotalInfo(res.data)
  }

  async function reloadRoom(roomNo) {
    const res = await Api.broad_join({data: {roomNo: roomNo}})
    //Error발생시
    if (res.result === 'fail') {
      return
    }
    context.action.updateBroadcastTotalInfo(res.data)
    props.history.push('/broadcast/' + '?roomNo=' + roomNo)
  }

  useEffect(() => {
    if (authValue === null) {
    } else if (authValue === hostRole) {
      //getReToken(roomNo)            //20200326 - 김호겸 -> 방생성 후 reToken 받으면서 해당 방이 꺼지면서 플레이어가 생기지만 플레이어 누르면 죽어버림
    } else {
      document.addEventListener('keydown', function(e) {
        if (e.key == 'F5') {
          setSesstionStorage('isReloadSocket', {reconnected: false})
        } else {
        }
        return () => document.removeEventListener('keydown')
      })
    }
    console.log('방송방 진입해서 private chennel 입장 ')
    const pathUrl = window.location.search
    let UserRoomNo = pathUrl ? pathUrl.split('=')[1] : ''
    sc.socketClusterBinding(UserRoomNo)
    // if (context.broadcastTotalInfo === null || context.broadcastTotalInfo === undefined) {
    //   const aaa = getSesstionStorage('userInfo')
    //   if (aaa) {
    //     console.log(aaa)
    //     console.log('socketClusterBinding3 = ' + aaa.roomNo)
    //     sc.socketClusterBinding(aaa.roomNo)
    //   }
    // } else {
    //   console.log('socketClusterBinding2 = ' + context.broadcastTotalInfo.roomNo)
    //   sc.socketClusterBinding(context.broadcastTotalInfo.roomNo)
    // }

    //방송방 최초 진입시 모바일 사이즈일경우 사이드탭은 무조건 닫혀있는 상태, PC일경우에만 열려있음
    if (window.innerWidth <= 840) {
      setIsSideOn(false)
    }
  }, [authValue])

  //방송방 리사이즈시
  //pc->모바일은 탭닫음 //모바일->pc는 탭열림
  //나중에 모바일 사이드탭->팝업으로 변경시 수정해야 할 부분
  useEffect(() => {
    if (window.innerWidth <= 840 && isSideOn && !resizeCheck) {
      setIsSideOn(false)
      setResizeCheck(true)
    } else if (window.innerWidth > 840 && resizeCheck) {
      setIsSideOn(true)
      setResizeCheck(false)
    }
  }, [useResize()])
  //---------------------------------------------------------------------
  if (broadcastTotalInfo) {
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
      </Content>
    )
  } else {
    return <div></div>
  }
}
//---------------------------------------------------------------------

const Content = styled.section`
  position: relative;
  width: 1210px;
  height: auto;
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
  z-index: 2;
  /* min-width: 408px; */
  @media (max-width: ${WIDTH_TABLET_S}) {
    padding: 14px;
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
