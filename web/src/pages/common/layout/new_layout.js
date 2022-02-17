/**
 *
 */
import React, {useMemo} from 'react'
import styled from 'styled-components'
//context

//layout
import Gnb from 'pages/common/gnb'
import NewPlayer from 'pages/common/newPlayer'
import ClipPlayer from 'pages/common/clipPlayer'
import Popup from 'pages/common/popup'
//import Ip from 'pages/common/ip'
import Sticker from 'pages/common/sticker'
import Header from 'components/ui/new_header.js'
import {useDispatch, useSelector} from "react-redux";
//
const Layout = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {children, webview} = props
  const playerCls = useMemo(() => {
    return globalState.player || globalState.clipState ? 'player_show' : ''
  })
  const isLoginPage = location.pathname === '/login' ? true : false
  //---------------------------------------------------------------------

  return (
    <React.Fragment>
      {/* Sticker */}
      {globalState.sticker && <Sticker/>}
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb webview={webview} />}
      {props.header !== undefined && <Header title={props.header} />}
      {/* 탑버튼 */}
      <Article className={webview ? `webview ${playerCls}` : `${playerCls}`}>{children}</Article>
      {/* (방송방)Player */}
      {/* <NewPlayer {...props} /> */}
      {isLoginPage ? <></> : <NewPlayer {...props} />}
      {/* (클립)Player */}
      {/* <ClipPlayer {...props} /> */}
      {isLoginPage ? <></> : <ClipPlayer {...props} />}
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      {/* <Message {...props} /> */}
      {/* IP노출 */}
      {/*<Ip {...props} />*/}
    </React.Fragment>
  )
}
export default Layout
//---------------------------------------------------------------------
// 로그인,
const Article = styled.article`
  height: 100%;
  background-color: #eeeeee;
  color: #000;
  &.webview {
    .header-wrap .close-btn {
      display: none;
    }
  }
  /* player가 노출시 padding-bottom추가 */
  &.player_show {
    padding-bottom: 60px;
    > div {
      padding-bottom: 60px;
    }
  }
`
