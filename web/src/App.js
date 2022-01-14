/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 */
import React, {useMemo, useState, useEffect, useContext, useRef} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import 'styles/errorstyle.scss'

//context
import {Context} from 'context'
import {Hybrid, isHybrid} from 'context/hybrid'

//components
import Utility from 'components/lib/utility'
import Route from './Route'
import Interface from './Interface'
import NoService from './pages/no_service/index'

import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import {getDeviceOSTypeChk} from './common/DeviceCommon';

const App = () => {
  const globalCtx = useContext(Context)
  App.context = () => context
  //본인인증
  const authRef = useRef()

  const [ready, setReady] = useState(false)
  const AGE_LIMIT = globalCtx.noServiceInfo.limitAge

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
      os: OS_TYPE['Desktop'], //OS_TYPE['Desktop']
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

  async function fetchData() {
    // Renew token
    const tokenInfo = await Api.getToken()
    if (tokenInfo.result === 'success') {
      globalCtx.action.updateCustomHeader(customHeader)
      globalCtx.action.updateToken(tokenInfo.data)

      if (isHybrid()) {
        //
        if (customHeader['isFirst'] === 'Y') {
          Hybrid('GetLoginToken', tokenInfo.data)

          if (
            sessionStorage.getItem('room_no') === undefined ||
            sessionStorage.getItem('room_no') === null ||
            sessionStorage.getItem('room_no') === ''
          ) {
            Utility.setCookie('native-player-info', '', -1)
          }

          if (
            sessionStorage.getItem('clip_info') === undefined ||
            sessionStorage.getItem('clip_info') === null ||
            sessionStorage.getItem('clip_info') === ''
          ) {
            Utility.setCookie('clip-player-info', '', -1)
          }

          // replace custom header isFirst value 'Y' => 'N'
          const customHeaderCookie = Utility.getCookie('custom-header')
          if (customHeaderCookie) {
            if (isJsonString(customHeaderCookie)) {
              const parsed = JSON.parse(customHeaderCookie)
              if (parsed['isFirst'] === 'Y') {
                parsed['isFirst'] = 'N'
                globalCtx.action.updateCustomHeader(parsed)
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
        const nativeInfo = Utility.getCookie('native-player-info')
        if (nativeInfo) {
          if (isJsonString(nativeInfo) && window.location.href.indexOf('webview=new') === -1) {
            const parsed = JSON.parse(nativeInfo)
            globalCtx.action.updatePlayer(true)
            globalCtx.action.updateMediaPlayerStatus(true)
            globalCtx.action.updateNativePlayer(parsed)
          }
        }

        const nativeClipInfo = Utility.getCookie('clip-player-info')
        if (nativeClipInfo) {
          if (isJsonString(nativeClipInfo) && window.location.href.indexOf('webview=new') === -1) {
            const parsed = JSON.parse(nativeClipInfo)
            globalCtx.action.updateClipState(true)
            globalCtx.action.updateClipPlayerState(parsed.playerState)
            globalCtx.action.updateClipPlayerInfo({bgImg: parsed.bgImg, title: parsed.title, nickname: parsed.nickname})
            globalCtx.action.updatePlayer(true)
          }
        }

        const appIsFirst = Utility.getCookie('appIsFirst')

        if (appIsFirst !== 'N') {
          Utility.setCookie('appIsFirst', 'N')
          if (tokenInfo.data.isLogin === false) {
            window.location.href = '/login'
          }
        }
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
            globalCtx.action.updateProfile(data)
            globalCtx.action.updateIsMailboxOn(data.isMailboxOn)
          } else {
            globalCtx.action.updateProfile(false)
          }
        }
        const myInfoRes = async () => {
          const res = await Api.mypage()
          if (res.result === 'success') {
            globalCtx.action.updateMyInfo(res.data)
          }
        }
        const fetchAdmin = async () => {
          const adminFunc = await Api.getAdmin()
          if (adminFunc.result === 'success') {
            globalCtx.action.updateAdminChecker(true)
          } else if (adminFunc.result === 'fail') {
            globalCtx.action.updateAdminChecker(false)
          }
        }
        fetchProfile()
        myInfoRes()
        fetchAdmin()
      } else {
        globalCtx.action.updateProfile(false)
        globalCtx.action.updateMyInfo(false)
        globalCtx.action.updateAdminChecker(false)
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

      globalCtx.action.alert({
        title: tokenInfo.messageKey,
        msg: tokenInfo.message,
        callback: () => {
          window.location.reload()
        }
      })
    }
  }

  //SPLASH Room
  async function fetchSplash() {
    const res = await Api.splash({})
    if (res.result === 'success') {
      const {data} = res
      const {roomType, useMailBox} = data
      if (roomType) {
        globalCtx.action.updateRoomType(roomType)
      }
      globalCtx.action.updateSplash(data)
      globalCtx.action.updateUseMailbox(useMailBox)
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
    const americanAge = Utility.birthToAmericanAge(globalCtx.profile.birth)
    const ageCheckFunc = () => {
      if (
        americanAge < AGE_LIMIT && // 나이 14세 미만
        !pathname.includes('/customer/personal') &&
        !pathname.includes('/customer/qnaList')
      ) {
        // 1:1문의, 문의내역은 보임
        globalCtx.action.updateNoServiceInfo({...globalCtx.noServiceInfo, americanAge, showPageYn: 'y'})
      } else {
        let passed = false
        if (americanAge >= globalCtx.noServiceInfo.limitAge) passed = true
        globalCtx.action.updateNoServiceInfo({...globalCtx.noServiceInfo, americanAge, showPageYn: 'n', passed})
      }
    }

    if (globalCtx.profile.memJoinYn === 'o') {
      const auth = async () => {
        const authCheck = await Api.self_auth_check()
        if (authCheck.result === 'fail') {
          globalCtx.action.updateNoServiceInfo({...globalCtx.noServiceInfo, showPageYn: 'n', americanAge, passed: true})
        } else {
          ageCheckFunc()
        }
      }
      auth()
    } else {
      ageCheckFunc()
    }
  }

  const updateAppInfo = async () => {
    const headerInfo = JSON.parse(Utility.getCookie('custom-header'))
    const os = headerInfo.os
    const version = headerInfo.appVer
    let showBirthForm = true

    // IOS 심사 제출시 생년월일 폼이 보이면 안된다
    if (os === 2) {
      const appReviewYn = 'y'
      if (appReviewYn === 'y') {
        const tempIosVersion = '1.6.5' // 이 버전 이상은 birthForm 을 감출려고 한다
        const successCallback = () => (showBirthForm = false)

        await Utility.compareAppVersion(tempIosVersion, successCallback, () => {})
      }
    }

    globalCtx.action.updateAppInfo({os, version, showBirthForm})
  }

  useEffect(() => {
    if (globalCtx.splash !== null && globalCtx.token !== null && globalCtx.token.memNo && globalCtx.profile !== null) {
      setReady(true)
    }
  }, [globalCtx.splash, globalCtx.token, globalCtx.profile])

  useEffect(() => {
    fetchSplash()
    // set header (custom-header, authToken)
    if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
      customHeader['isHybrid'] = 'Y'
    }

    Api.setCustomHeader(JSON.stringify(customHeader))
    Api.setAuthToken(authToken)

    // Renew all initial data
    fetchData()
  }, [])

  useEffect(() => {
    if (globalCtx.token) {
      if (globalCtx.token.isLogin) {
        if (globalCtx.noServiceInfo.passed) return
        ageCheck()
      } else if (!globalCtx.token.isLogin) {
        globalCtx.action.updateNoServiceInfo({...globalCtx.noServiceInfo, americanAge: 0, showPageYn: 'n', passed: false})
      }
    }
  }, [globalCtx.profile, location.pathname])

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

    globalCtx.action.updateAuthRef(authRef) // 본인인증 ref
    globalCtx.action.updateTokenRefreshSetIntervalId(id);//서버이동시 interval clear
    updateAppInfo(); // ios 심사 (회원가입 생년월일 입력란 숨김)
  }, [])

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

      return (
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
      )
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {globalCtx.noServiceInfo.showPageYn === 'n' ? (
        ready ? (
          <>
            <Interface />
            <Route />
          </>
        ) : (
          <>
            <div className="loading">
              <span></span>
            </div>
          </>
        )
      ) : globalCtx.noServiceInfo.showPageYn === 'y' ? (
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

/**
 * @title 글로벌변수
 * @example const context=useContext(Context) 와 동일
 */
export const Global = () => {
  return App.context()
}
