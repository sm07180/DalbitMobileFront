/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
//components

// etc
import SignalingHandler from 'components/lib/SignalingHandler'
// image
import stopSvg from 'images/ic_close_b.svg'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {mediaHandler, mediaPlayerStatus} = context
  let pathCheck = window.location.pathname.indexOf('/broadcast') < 0 ? true : false

  console.log(mediaHandler)
  /**
   * @brief 로그인,이벤트처리핸들러
   */

  //makeContents
  const makeContents = visible => {
    /**
     * @visible true
     */
  }
  useEffect(() => {
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
      {context.mediaPlayerStatus && (
        <MediaPlayerWrap>
          <MediaPlayer>
            <>
              <img style={{width: '60px', borderRadius: '50%'}} />
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
          </MediaPlayer>
        </MediaPlayerWrap>
      )}
    </React.Fragment>
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

  padding: 14px 32px;
  box-sizing: border-box;
  width: 90%;
  border-radius: 44px;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;

  @media (max-width: 780px) {
    width: 100%;
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
