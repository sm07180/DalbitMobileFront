/**
 *
 */
//context
import Ip from 'pages/common/ip'
import Message from 'pages/common/message'
import NewPlayer from 'pages/common/newPlayer'
import ClipPlayer from 'pages/common/clipPlayer'
import Popup from 'pages/common/popup'
import Sticker from 'pages/common/sticker'

import React, {useContext, useMemo, useEffect, useState, useRef} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import styled from 'styled-components'
import Utility from 'components/lib/utility'
import LayerPopupAppDownLogin from '../../main/component/layer_popup_appDownLogin'
import qs from 'query-string'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'
import MultiImageViewer from '../multi_image_viewer'
import ReceiptPop from "pages/main/popup/ReceiptPop";
import {useDispatch, useSelector} from "react-redux";
import {Hybrid, isHybrid} from "context/hybrid";
import {initReceipt, setReceipt} from "redux/actions/payStore";
import {setGlobalCtxMultiViewer} from "redux/actions/globalCtx";
//
const Layout = (props) => {
  const {children, webview} = props

  const location = useLocation();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const payStoreRdx = useSelector(({payStore})=> payStore);
  const history = useHistory();
  const playerCls = useMemo(() => {
    return globalState.player || globalState.clipState ? 'player_show' : ''
  })
  const isMainPage = location.pathname === '/' ? true : false
  //---------------------------------------------------------------------
  const [appPopupState, setAppPopupState] = useState(false)

  const customHeader = JSON.parse(Api.customHeader)
  const noAppCheck = customHeader['os'] === OS_TYPE['Desktop']

  const isLoginPage = location.pathname === '/login'
  const isRulePage = history.location.pathname.startsWith("/rule")
  const storePage = history.location.pathname.startsWith("/store")
  const payPage = history.location.pathname.startsWith("/pay")

  const {qsWebview} = qs.parse(location.search)

  useEffect(() => {
    if (noAppCheck) {
      if (Utility.getCookie('AppPopup')) {
        setAppPopupState(false)
      } else {
        setAppPopupState(true)
      }
    }
  }, [noAppCheck])

  useEffect(() => {
    dispatch(setGlobalCtxMultiViewer({show:false}))
  }, [location]);

  return (
    <>
      {/* Sticker */}
      {globalState.sticker && <Sticker />}
      {/* 탑버튼 */}
      <Article
        className={`content-article mobileType ${
          webview ? `webview ${playerCls} ${isMainPage ? 'main-page' : ''}` : `${playerCls} ${isMainPage ? 'main-page' : ''}`
        }
        ${playerCls ? "player" : ""}
        `}>
        {children}
        {payStoreRdx.receipt.visible && <ReceiptPop payOrderId={payStoreRdx.receipt.orderId} clearReceipt={()=>{
          if (payStoreRdx.receipt.returnType === 'room' && isHybrid()) {
            Hybrid('CloseLayerPopup')
            Hybrid('ClosePayPopup')
          }else{
            dispatch(initReceipt());
            history.replace("/");
          }

        }} />}
      </Article>
      {/* (방송방)Player */}
      {
        !isLoginPage && !isRulePage && !storePage && !payPage &&
        <NewPlayer {...props} />
      }
      {/* (클립)Player */}
      {
        !isLoginPage && !isRulePage && !storePage && !payPage &&
        <ClipPlayer {...props} />
      }

      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      {/* <Message {...props} /> */}
      {/* IP노출 */}
      <Ip {...props} />



      {/*{appPopupState === true && noAppCheck && (*/}
      {/*  <>*/}
      {/*    <LayerPopupAppDownLogin appPopupState={appPopupState} setAppPopupState={setAppPopupState} />*/}
      {/*  </>*/}
      {/*)}*/}

      {globalState.multiViewer.show && <MultiImageViewer />}
    </>
  )
}
export default Layout

// 메인,랭킹,알림
const Article = styled.article`
  height: 100%;
  &.webview {
    .header-wrap .close-btn {
      display: none;
    }
  }
  &.player {
    padding-bottom : 40px;
  }
`
