/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 */
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import 'styles/errorstyle.scss'
import './styles/navigation.scss'
import "./asset/scss/index.scss";
import {Hybrid, isHybrid} from 'context/hybrid'

//components
import Utility from 'components/lib/utility'
import Route from './Route'
import Interface, {FOOTER_VIEW_PAGES} from './Interface'
import NoService from './pages/no_service/index'

import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import {CHAT_CONFIG} from "constant/define";
import {ChatSocketHandler} from "common/realtime/chat_socket";
import {useDispatch, useSelector} from "react-redux";
import {getMemberProfile} from "redux/actions/member";
import {getArgoraRtc, getWowzaRtc, rtcSessionClear} from "common/realtime/rtc_socket";
import {ClipPlayerHandler} from "common/audio/clip_player";
import {getMypageNew} from "common/api";
import Navigation from "components/ui/navigation/Navigation";

import LayoutMobile from 'pages/common/layout'
import Layout from "common/layout";
import Common from "common";
import Alert from "common/alert";
import MoveToAlert from "common/alert/MoveToAlert";
import AdminLayerPopup from "pages/common/popup/AdminLayerPopup";
import {useHistory, useLocation} from "react-router-dom";
import {getDeviceOSTypeChk} from "common/DeviceCommon";
import {setUpdateVersionInfo} from "redux/actions/payStore";
import {
  setGlobalCtxAdminChecker,
  setGlobalCtxAlarmMoveUrl,
  setGlobalCtxAlarmStatus,
  setGlobalCtxAlertStatus, setGlobalCtxAuthRef, setGlobalCtxChatInfoInit,
  setGlobalCtxClipInfoAdd, setGlobalCtxClipPlayerInfo,
  setGlobalCtxClipPlayerInit, setGlobalCtxClipPlayerState, setGlobalCtxClipState,
  setGlobalCtxCustomHeader, setGlobalCtxIntervalId,
  setGlobalCtxIsMailboxOn, setGlobalCtxMailChatInfoInit, setGlobalCtxMediaPlayerStatus,
  setGlobalCtxMessage,
  setGlobalCtxMyInfo, setGlobalCtxNativePlayer, setGlobalCtxNoServiceInfo, setGlobalCtxPlayer,
  setGlobalCtxRoomType, setGlobalCtxRtcInfoInit,
  setGlobalCtxSplash,
  setGlobalCtxUpdateProfile,
  setGlobalCtxUpdateToken, setGlobalCtxUseMailbox
} from "redux/actions/globalCtx";

function setNativeClipInfo(isJsonString, dispatch) {
  const nativeClipInfo = Utility.getCookie('clip-player-info')
  if (nativeClipInfo) {
    if (isJsonString(nativeClipInfo) && window.location.href.indexOf('webview=new') === -1) {
      const parsed = JSON.parse(nativeClipInfo)
      dispatch(setGlobalCtxClipState(true))
      dispatch(setGlobalCtxClipPlayerState(parsed.playerState))
      dispatch(setGlobalCtxClipPlayerInfo({bgImg: parsed.bgImg, title: parsed.title, nickname: parsed.nickname}))
      dispatch(setGlobalCtxPlayer(true))
    }
  }
}

function setNativePlayInfo(isJsonString, dispatch) {
  const nativeInfo = Utility.getCookie('native-player-info')
  if (nativeInfo) {
    if (isJsonString(nativeInfo) && window.location.href.indexOf('webview=new') === -1) {
      const parsed = JSON.parse(nativeInfo);
      dispatch(setGlobalCtxPlayer(true));
      dispatch(setGlobalCtxMediaPlayerStatus(true));
      dispatch(setGlobalCtxNativePlayer(parsed));
    }
  }
}


const baseSetting = async (dispatch, globalState) => {
  const item = sessionStorage.getItem("clip");
  if (item !== null) {
    const data = JSON.parse(item);
    let newClipPlayer = globalState.clipPlayer;
    if (newClipPlayer === null) {
      newClipPlayer = new ClipPlayerHandler({info:data, dispatch, globalState});
    }
    const fileUrlBoolean = data.file?.url === newClipPlayer?.clipAudioTag?.src;
    const clipNoBoolean = data.clipNo !== newClipPlayer?.clipNo;
    if ( fileUrlBoolean && clipNoBoolean ) {
      newClipPlayer?.init(data.file?.url);
      newClipPlayer?.restart();
    } else {
      newClipPlayer?.init(data.file?.url);
    }
    newClipPlayer?.clipNoUpdate(data.clipNo);
    dispatch(setGlobalCtxClipPlayerInit(newClipPlayer));
    dispatch(setGlobalCtxClipInfoAdd({...data, ...{isPaused: true}}));
  }

  const broadcastData = sessionStorage.getItem("broadcast_data");
  if (broadcastData !== null) {
    const data = JSON.parse(broadcastData);
    broadcastAction.dispatchRoomInfo({type: "reset", data: data});
  }
}


let alarmCheckIntervalId = 0;

const setServerDataJson = () =>{
  const serverData = document?.getElementById('__SERVER_DATA__')?.innerHTML;
  if (serverData && serverData !== '' && serverData !== 'null') {
    try {
      return JSON.parse(serverData);
    } catch (e) {
      return null;
    }
  }
  return null;
}

const App = () => {
  let serverDataJson = setServerDataJson();
  //본인인증
  const authRef = useRef()
  const history = useHistory()
  const location = useLocation()

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const memberRdx = useSelector((state)=> state.member);
  const isDesktop = useSelector((state)=> state.common.isDesktop);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  const [ready, setReady] = useState(false)
  const AGE_LIMIT = globalState.noServiceInfo.limitAge
  const [isFooterPage, setIsFooterPage] = useState(false);

  const {
    chatInfo,
    rtcInfo,
    mailChatInfo,
    alarmStatus,
  } = globalState;

  const isJsonString = (str) => {
    try {
      var parsed = JSON.parse(str)
      return typeof parsed === 'object'
    } catch (e) {
      return false
    }
  }

  const createDeviceUUid = () => {
    var dt = new Date().getTime()
    var uuid = Utility.getCookie('deviceUUid')
    if (uuid === undefined || uuid === null || uuid === '') {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
    }
    return uuid
  }

  /**
   * custom header Cookie 생성 (userAgent)
   *   안드로이드 www에 페이지 요청 : request - header에 'custom-header': {os, deviceId, ...} 추가해서 요청
   *   www (Back) : layout.jsp 에서 request에서 custom-header를 DOM에 담아서 줌 (id="customHeader"의 value에 넣어있음)
   *   1) DOM id="customHeader"에서 꺼내서 쿠키를 만듬
   *   2) 유지되있는 쿠키에서 가져와서 씀
   *   3) 새로 만듬
   */
  const customHeader = useMemo(() => {
    const customHeaderTag = document.getElementById('customHeader');


    if (customHeaderTag && customHeaderTag.value) {
      // The data that got from server is encoded as URIComponent.
      const decodeValue = decodeURIComponent(customHeaderTag.value)
      if (isJsonString(decodeValue)) {
        const parsed = JSON.parse(decodeValue)
        if (parsed['os']) {
          parsed['os'] = Number(parsed['os'])
        }

        if (parsed['deviceId'] && (parsed['os'] === 1 || parsed['os'] === 2)) {
          Utility.setCookie('custom-header', JSON.stringify(parsed), 60)
          parsed['FROM'] = '@@ CUSTOM @@'
          return parsed
        }
      }
    }

    const customHeaderCookie = Utility.getCookie('custom-header')
    if (customHeaderCookie) {
      if (isJsonString(customHeaderCookie)) {
        const parsed = JSON.parse(customHeaderCookie)
        if (parsed['os']) {
          parsed['os'] = Number(parsed['os'])
        }

        if (parsed['deviceId']) {
          Utility.setCookie('custom-header', JSON.stringify(parsed), 60)
          parsed['FROM'] = '@@ COOKIE @@'
          return parsed
        }
      }
    }
    //실섭 유저는 이곳을 탈 수 없음
    //앱 업데이트를 안하면 커스텀 userAgent를 받아올수 없다.
    //앱 업데이트 후 에이전트 받음
    //모바일 웹, PC 웹인 경우
    const createHeader = {
      os: getDeviceOSTypeChk(), //OS_TYPE['Desktop']
      deviceId: createDeviceUUid(),
      appVersion: '1.0.1',
      locale: 'ko',
      FROM: '@@ CREATED @@'
    }
    Utility.setCookie('custom-header', JSON.stringify(createHeader), 60)
    return createHeader
  }, [])

  const authToken = useMemo(() => {
    return Utility.getCookie('authToken')
  }, [])

  function initChantInfo(authToken, memNo, dispatch) {
    const socketUser = {
      authToken,
      memNo,
      locale: CHAT_CONFIG.locale.ko_KR,
      roomNo: null,
    };
    const chatInfo = new ChatSocketHandler(socketUser,null, dispatch);
    chatInfo.setMemNo(memNo);
    // chatInfo.setSplashData(globalState.splashData);
    //deep copy chatInfo
    let cloneMailInfo = Object.assign(
      Object.create(Object.getPrototypeOf(chatInfo)),
      chatInfo
    );

    dispatch(setGlobalCtxChatInfoInit(chatInfo));
    dispatch(setGlobalCtxMailChatInfoInit(cloneMailInfo));
  }
  async function fetchData(dispatch) {
    // Renew token
    let tokenInfo = await Api.getToken();
    let etcData = await Api.getEtcData();
    dispatch(setUpdateVersionInfo({
      ios:etcData.data.ios,
      aos:etcData.data.aos
    }))

    if (tokenInfo.result === 'success') {
      dispatch(setGlobalCtxCustomHeader(customHeader))
      dispatch(setGlobalCtxUpdateToken(tokenInfo.data))
      if (isHybrid()) {
        if (customHeader['isFirst'] === 'Y') {
          Hybrid('GetLoginToken', tokenInfo.data)

          const roomNo = sessionStorage.getItem('room_no');
          const clipInfo = sessionStorage.getItem('clip_info');
          if ( roomNo === undefined || roomNo === null || roomNo=== '') {
            Utility.setCookie('native-player-info', '', -1)
          }
          if ( clipInfo === undefined || clipInfo === null || clipInfo === '' ) {
            Utility.setCookie('clip-player-info', '', -1)
          }

          // replace custom header isFirst value 'Y' => 'N'
          const customHeaderCookie = Utility.getCookie('custom-header')
          if (customHeaderCookie) {
            if (isJsonString(customHeaderCookie)) {
              const parsed = JSON.parse(customHeaderCookie)
              if (parsed['isFirst'] === 'Y') {
                parsed['isFirst'] = 'N'
                dispatch(setGlobalCtxCustomHeader(parsed))
              }
            }
          }
        } else if (customHeader['isFirst'] === 'N') {
          if (tokenInfo.data.authToken !== authToken) {
            //#토큰업데이트
            Hybrid('GetUpdateToken', tokenInfo.data)
          }

          // ?webview=new 형태로 이루어진 player종료
        }
        setNativePlayInfo(isJsonString, dispatch);
        setNativeClipInfo(isJsonString, dispatch);

        const appIsFirst = Utility.getCookie('appIsFirst')

        if (appIsFirst !== 'N') {
          Utility.setCookie('appIsFirst', 'N')
          if (tokenInfo.data.isLogin === false) {
            window.location.href = '/login'
          }
        }
      } else if (isDesktop) {
        initChantInfo(tokenInfo.data.authToken, tokenInfo.data.memNo, dispatch);
      }
      if (tokenInfo.data && tokenInfo.data.isLogin) {
        const fetchProfile = async () => {
          const myProfile = await Api.profile({
            params: {
              memNo: tokenInfo.data.memNo
            }
          })
          if (myProfile.result === 'success') {
            const data = myProfile.data
            dispatch(setGlobalCtxUpdateProfile(data))
            dispatch(setGlobalCtxIsMailboxOn(data.isMailboxOn))
          } else {
            dispatch(setGlobalCtxUpdateProfile(false))
          }
        }
        const myInfoRes = async () => {
          const res = await Api.mypage()
          if (res.result === 'success') {
            dispatch(setGlobalCtxMyInfo(res.data))
          }
        }
        const fetchAdmin = async () => {
          const adminFunc = await Api.getAdmin()
          if (adminFunc.result === 'success') {
            dispatch(setGlobalCtxAdminChecker(true))
          } else if (adminFunc.result === 'fail') {
            dispatch(setGlobalCtxAdminChecker(false))
          }
        }
        dispatch(getMemberProfile({
          memNo:tokenInfo.data.memNo,
          authToken:tokenInfo.data.authToken,
          isLogin:tokenInfo.data.isLogin
        }))
        myInfoRes()
        fetchAdmin()
      } else {
        dispatch(setGlobalCtxUpdateProfile(false))
        dispatch(setGlobalCtxMyInfo(false))
        dispatch(setGlobalCtxAdminChecker(false))
      }
      if(isDesktop){
        baseSetting(dispatch, globalState);
        dispatch(setGlobalCtxAlertStatus(false));
      }
      //모든 처리 완료
    } else {
      const yesterDay = (() => {
        const date = new Date()
        date.setDate(date.getDate() - 1)
        return date.toUTCString()
      })()

      const splited = document.cookie.split(';')
      splited.forEach((bundle) => {
        let [key, value] = bundle.split('=')
        key = key.trim()
        document.cookie = key + '=' + '; expires=' + yesterDay + '; path=/; secure; domain=.dalbitlive.com'
      })

      Api.error_log({
        data: {
          os: 'mobile',
          appVer: customHeader.appVersion,
          dataType: __NODE_ENV,
          commandType: window.location.pathname,
          desc: 'get token error' + error.name + '\n' + error.message + '\n' + error.stack
        }
      })

      dispatch(setGlobalCtxMessage({type:'alert',
        title: tokenInfo.messageKey,
        msg: tokenInfo.message,
        callback: () => {
          window.location.reload()
        }
      }))
    }
  }

  useEffect(() => {
    async function alarmCheck() {
      let memNoParams = memberRdx.memNo ? memberRdx.memNo : "";
      const { result, data, message } = await getMypageNew({
        data: memNoParams,
      });
      if (result === "success") {
        if (data.newCnt > 0) {
          if (alarmCheckIntervalId) {
            clearInterval(alarmCheckIntervalId);
          }
          dispatch(setGlobalCtxAlarmStatus(true));
          dispatch(setGlobalCtxAlarmMoveUrl(data.moveUrl));
        } else {
          if (alarmCheckIntervalId) {
            clearInterval(alarmCheckIntervalId);
          }
          alarmCheckIntervalId = setInterval(alarmCheck, 60000);
          dispatch(setGlobalCtxAlarmStatus(false));
          dispatch(setGlobalCtxAlarmMoveUrl(""));
        }
      }
    }

    if(isDesktop) {
      if (memberRdx.isLogin === true) {
        alarmCheck();
      } else {
        dispatch(setGlobalCtxAlarmStatus(false));
        dispatch(setGlobalCtxAlarmMoveUrl(""));
      }
    }
    return () => {};
  }, [memberRdx.isLogin, alarmStatus]);

  useEffect(()=>{
    if(memberRdx.isLogin && memberRdx.data !== null){
      const data = memberRdx.data
      dispatch(setGlobalCtxUpdateProfile(data))
      dispatch(setGlobalCtxIsMailboxOn(data.isMailboxOn))
    }
  },[memberRdx])

  //SPLASH Room
  async function fetchSplash() {
    let splashData = null;
    if(serverDataJson){
      splashData = {
        result : 'success',
        data : serverDataJson.splash
      };
    }else {
      splashData = await Api.splash({})
    }
    if (splashData.result === 'success') {
      const {data} = splashData
      const {roomType, useMailBox} = data
      if (roomType) {
        dispatch(setGlobalCtxRoomType(roomType))
      }
      dispatch(setGlobalCtxSplash(data));
      dispatch(setGlobalCtxUseMailbox(useMailBox));
    } else {
      Api.error_log({
        data: {
          os: 'mobile',
          appVer: customHeader.appVersion,
          dataType: __NODE_ENV,
          commandType: window.location.pathname,
          desc: 'splash error' + error.name + '\n' + error.message + '\n' + error.stack
        }
      })
    }
  }

  const ageCheck = () => {
    const pathname = location.pathname
    const americanAge = Utility.birthToAmericanAge(globalState.profile.birth)
    const ageCheckFunc = () => {
      if (americanAge < AGE_LIMIT && !pathname.includes('/customer/inquire')) {
        // 1:1문의는 보임
        dispatch(setGlobalCtxNoServiceInfo({...globalState.noServiceInfo, americanAge, showPageYn: 'y'}))
      } else {
        let passed = false
        if (americanAge >= globalState.noServiceInfo.limitAge) passed = true
        dispatch(setGlobalCtxNoServiceInfo({...globalState.noServiceInfo, americanAge, showPageYn: 'n', passed}))
      }
    }

    if (globalState.profile.memJoinYn === 'o') {
      const auth = async () => {
        const authCheck = await Api.self_auth_check()
        if (authCheck.result === 'fail') {
          dispatch(setGlobalCtxNoServiceInfo({...globalState.noServiceInfo, showPageYn: 'n', americanAge, passed: true}))
        } else {
          ageCheckFunc()
        }
      }
      auth()
    } else {
      ageCheckFunc()
    }
  }

  /* 모바일웹용 푸터 */
  const isFooter = () => {
    if(!isDesktop && !isHybrid()) {
      const pages = ['/', '/clip', '/search', '/mypage', '/login'];
      const isFooterPage = pages.findIndex(item => item === location.pathname.toLowerCase()) > -1;

      setIsFooterPage(isFooterPage);
    }
  }

  /* 네이티브용 푸터 관리 */
  const nativeFooterManager = () => {
    if(isHybrid()) {
      const currentPath = location.pathname.toLowerCase();
      const visible = !!FOOTER_VIEW_PAGES[currentPath];
      const stateFooterParam = {
        tabName: visible ? FOOTER_VIEW_PAGES[currentPath] : '',
        visible: visible
      };
      Hybrid('stateFooter', stateFooterParam);
    }
  }

  useEffect(() => {
    if (globalState.splash !== null && globalState.token !== null && globalState.token && globalState.token.memNo && globalState.profile !== null) {
      setReady(true)
    }
  }, [globalState.splash, globalState.token, globalState.profile])

  useEffect(() => {
    fetchSplash()
    // set header (custom-header, authToken)
    if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
      customHeader['isHybrid'] = 'Y'
    }

    Api.setCustomHeader(JSON.stringify(customHeader))
    Api.setAuthToken(authToken)

    // Renew all initial data
    fetchData(dispatch)
  }, [])


  useEffect(()=>{
    if(!memberRdx.memNo || !chatInfo){
      return;
    }
    const sessionWowzaRtc = sessionStorage.getItem("wowza_rtc");
    const sessionAgoraRtc = sessionStorage.getItem("agora_rtc");

    const sessionRtc = sessionWowzaRtc
      ? JSON.parse(sessionWowzaRtc) : sessionAgoraRtc
        ? JSON.parse(sessionAgoraRtc) : undefined;

    if(sessionRtc?.roomInfo?.bjMemNo === memberRdx.memNo){
      if(!rtcInfo){
        if(sessionWowzaRtc){
          const data = JSON.parse(sessionWowzaRtc);
          const dispatchRtcInfo = getWowzaRtc(data);
          // dispatchRtcInfo.setDisplayWrapRef(displayWrapRef);
          chatInfo.setRoomNo(dispatchRtcInfo.roomInfo?.roomNo)
          dispatch(setGlobalCtxRtcInfoInit(dispatchRtcInfo));
          sessionStorage.setItem("wowza_rtc", JSON.stringify({roomInfo:dispatchRtcInfo.roomInfo, userType:dispatchRtcInfo.userType}));
        }
        if(sessionAgoraRtc){
          const data = JSON.parse(sessionAgoraRtc);
          const dispatchRtcInfo = getArgoraRtc(data);
          chatInfo.setRoomNo(dispatchRtcInfo.roomInfo?.roomNo)
          dispatchRtcInfo.join(dispatchRtcInfo.roomInfo).then(()=>{
            dispatch(setGlobalCtxRtcInfoInit(dispatchRtcInfo));
            sessionStorage.setItem("agora_rtc", JSON.stringify({roomInfo:dispatchRtcInfo.roomInfo, userType:dispatchRtcInfo.userType}));
          })
        }
      }
    }else{
      rtcSessionClear();
    }
  }, [memberRdx.memNo, chatInfo])


  useEffect(() => {
    if (globalState.token) {
      if (globalState.token.isLogin) {
        if (globalState.noServiceInfo.passed){
          return;
        } else if(globalState.profile){
          ageCheck()
        }
      } else if (!globalState.token.isLogin) {
        dispatch(setGlobalCtxNoServiceInfo({...globalState.noServiceInfo, americanAge: 0, showPageYn: 'n', passed: false}))
      }
    }
  }, [globalState.profile, globalState.token, location.pathname])

  const [cookieAuthToken, setCookieAuthToken] = useState('')
  useEffect(() => {
    if (ready && cookieAuthToken !== Api.authToken) {
      window.location.reload()
    }
  }, [cookieAuthToken])

  useEffect(() => {
    const id = setInterval(() => {
      setCookieAuthToken(Utility.getCookie('authToken'))
    }, 1000)

    dispatch(setGlobalCtxAuthRef(authRef)) // 본인인증 ref
    dispatch(setGlobalCtxIntervalId(id));//서버이동시 interval clear

  }, [])

  useEffect(()=>{
    let historyListener = () => {
      isFooter();
      nativeFooterManager();
    };
    historyListener();
    // history.listen(historyListener);
  },[location])

  useEffect(()=>{
    const pay = location.pathname.startsWith('/pay');
    const store = location.pathname.startsWith('/store');
    const main = location.pathname === '/';

    if(pay || store || main){
      Hybrid('stateFloating', {visible:'false'});
    }else{
      Hybrid('stateFloating', {visible:'true'});
    }

  },[location])


  useEffect(() => {
    // PG사 페이지에서는 뒤로가기 버튼이 없어서 추가됨
    Hybrid('stateHeader', payStoreRdx.stateHeader);
  }, [payStoreRdx.stateHeader.visible]);

  function ErrorFallback({error, resetErrorBoundary}) {
    if ('ChunkLoadError' === error.name) {
      window.location.reload()
    } else {
      Api.error_log({
        data: {
          os: 'mobile',
          appVer: customHeader.appVersion,
          dataType: __NODE_ENV,
          commandType: window.location.pathname,
          desc: error.name + '\n' + error.message + '\n' + error.stack
        }
      })

      // window.location.href = '/error';

      /*return (
        <section id="error">
          <button
            className="closeButon"
            onClick={() => {
              window.location.href = '/'
            }}>
            닫기
          </button>

          <div className="img"></div>

          <p className="text">
            해당 페이지 접속이 지연되고 있습니다.
            <br />
            다시 시도해주세요
          </p>

          <div className="buttonWrap">
            <button
              onClick={() => {
                window.location.href = '/'
              }}>
              확인
            </button>
          </div>
        </section>
      )*/
    }
  }

  useEffect(() => {
    if (chatInfo !== null && globalState.splash !== null) {
      chatInfo.setSplashData(globalState.splash);
    }
  }, [chatInfo, globalState.splash]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {globalState.noServiceInfo.showPageYn === 'n' ? (
        ready ? (
          <>
            <Interface />
            <Common />
            { isDesktop &&
              <>
                <Layout>
                  <Route />
                </Layout>
                </>
            }
            { !isDesktop &&
              <LayoutMobile status="no_gnb">
                  <Route />
              </LayoutMobile>
            }
            {globalState.broadcastAdminLayer.status && globalState.baseData.isLogin && <AdminLayerPopup />}
            <Alert />
            <MoveToAlert />
            {isFooterPage && <Navigation />}
          </>
        ) : (
          <>
            <div className="loading">
              <span></span>
            </div>
          </>
        )
      ) : globalState.noServiceInfo.showPageYn === 'y' ? (
        <>
          <NoService />
          <Interface />
        </>
      ) : (
        <></>
      )}
      <form ref={authRef} name="authForm" method="post" id="authForm" target="KMCISWindow" />
    </ErrorBoundary>
  )
}
export default App
