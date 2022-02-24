/**
 *
 */
import React, {useEffect, useMemo} from 'react'
import {useLocation} from 'react-router-dom'
import styled from 'styled-components'
//context
//layout
import Gnb from 'pages/common/gnb'
import NewPlayer from 'pages/common/newPlayer'
import ClipPlayer from 'pages/common/clipPlayer'
import Popup from 'pages/common/popup'
import Sticker from 'pages/common/sticker'
import MultiImageViewer from '../multi_image_viewer'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMultiViewer} from "redux/actions/globalCtx";
//
const Layout = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {children, webview} = props
  const location = useLocation()
  const playerCls = useMemo(() => {
    return globalState.player || globalState.clipState ? 'player_show' : ''
  })

  useEffect(() => {
    dispatch(setGlobalCtxMultiViewer({show: false}));
  }, [location])

  //---------------------------------------------------------------------

  return (
    <React.Fragment>
      {/* Sticker */}
      {globalState.sticker && <Sticker/>}
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
      {globalState.multiViewer.show && <MultiImageViewer/>}
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
