/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useMemo, useEffect, useContext} from 'react'
//context
import {Context} from 'context'
import {isHybrid, Hybrid} from 'context/hybrid'
// etc
import SignalingHandler from 'components/lib/SignalingHandler'
import Content from './content'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {mediaHandler, mediaPlayerStatus} = context
  //useMemo
  const visible = useMemo(() => {
    if (props.location.search.indexOf('roomNo') !== -1) return false
    return true
  })
  //---------------------------------------------------------------------
  function update(mode) {
    switch (true) {
      case mode.playerClose !== undefined: //--------------------------Player 종료
        if (isHybrid()) {
          Hybrid('ExitRoom')
          context.action.updateMediaPlayerStatus(false)
        } else {
          if (mediaHandler.rtcPeerConn) {
            mediaHandler.stop()
          }
        }
        break
      case mode.playerNavigator !== undefined: //----------------------방송방으로 이동
        if (isHybrid()) {
          Hybrid('EnterRoom', '')
          //          Hybrid('ReconnectRoom', context.roomInfo)
        } else {
          const {roomNo} = context.roomInfo
          props.history.push('/broadcast/' + '?roomNo=' + roomNo, context.roomInfo)
        }
        break
      default:
        break
    }
  }
  /**
   * @brief 로그인,이벤트처리핸들러
   */
  //makeContents
  useEffect(() => {
    //---------------------------------------------------------------------
    /**
  context.mediaHandler!==null && context.mediaHandler.rtcPeerConn !==null 
    */
    if (!mediaHandler) {
      const mediaHandler = new SignalingHandler()
      mediaHandler.setGlobalStartCallback(() => context.action.updateMediaPlayerStatus(true))
      mediaHandler.setGlobalStopCallback(() => context.action.updateMediaPlayerStatus(false))
      context.action.updateMediaHandler(mediaHandler)
    }
    return () => {}
  }, [])
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {/* 미디어 플레이어 */}
      {visible && context.mediaPlayerStatus && <Content {...props} update={update} />}
    </React.Fragment>
  )
}
