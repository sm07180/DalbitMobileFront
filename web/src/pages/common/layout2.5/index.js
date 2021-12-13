/**
 *
 */
import React, {useMemo, useContext, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Context} from 'context'

//layout
import {Global} from 'App'
import Gnb from 'pages/common/gnb'
import NewPlayer from 'pages/common/newPlayer'
import ClipPlayer from 'pages/common/clipPlayer'
import Popup from 'pages/common/popup'
import Message from 'pages/common/message'

import Ip from 'pages/common/ip'
import Sticker from 'pages/common/sticker'
import MultiImageViewer from '../multi_image_viewer'
//
const Layout = (props) => {
  const {children, webview} = props
  const context = useContext(Context)
  const location = useLocation()
  const playerCls = useMemo(() => {
    return context.player || context.clipState ? 'player_show' : ''
  })

  useEffect(() => {
    context.action.updateMultiViewer({show: false})
  }, [location])

  //---------------------------------------------------------------------

  return (
    <React.Fragment>
      {/* Sticker */}
      {context.sticker && <Sticker />}
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb webview={webview} />}
      {/* 탑버튼 */}
      <Article className={webview ? `webview ${playerCls}` : `${playerCls}`} type={props.type === 'clipBack' ? 'clipBack' : ''}>
        {children}
      </Article>
      {/* (방송방)Player */}
      <NewPlayer {...props} />
      {/* (클립)Player */}
      <ClipPlayer {...props} />
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}

      {/* IP노출 */}
      {/*<Ip {...props} />*/}
      {context.multiViewer.show && <MultiImageViewer />}
    </React.Fragment>
  )
}
export default Layout
//---------------------------------------------------------------------

const Article = styled.article`
  min-height: 100%;
  background-color: #eeeeee;
  &.webview {
    .header-wrap .close-btn {
      display: ${(props) => (props.type === 'clipBack' ? 'block' : 'none')};
    }
  }
  /* player가 노출시 padding-bottom추가 */
  &.player_show {
    padding-bottom: 60px;
  }
`
