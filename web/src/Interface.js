/**
 * @file Interface.js
 * @brief Native,Windows ->React로 Interface
 * @notice
 * @code document.dispatchEvent(new CustomEvent('native-goLogin', {detail:{info:'someDate'}}))
 */
import React, {useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import _ from 'lodash'
//context
import {OS_TYPE} from 'context/config.js'
import {Hybrid} from 'context/hybrid'
import Api from 'context/api'
import {Context} from 'context'
import Room, {RoomJoin} from 'context/room'
//util
import Utility from 'components/lib/utility'

import qs from 'query-string'

export default () => {
  //context
  const context = useContext(Context)
  //history
  let history = useHistory()
  //
  //---------------------------------------------------------------------
  function update(event) {
    switch (event.type) {
      case 'native-push-foreground': //----------------------native-push-foreground
        let pushMsg = event.detail
        if (__NODE_ENV === 'dev') {
            alert('fore pushMsg :' + pushMsg)
        }

        const isJsonString = (str) => {
            try {
                var parsed = JSON.parse(str)
                return typeof parsed === 'object'
            } catch (e) {
                if (__NODE_ENV === 'dev') {
                    alert(e)
                }
                return false
            }
        }

        if (typeof pushMsg === 'string'){
            pushMsg = decodeURIComponent(pushMsg)
            if (isJsonString(pushMsg)) {
                pushMsg = JSON.parse(pushMsg)
            } else {
                return false
            }
        }

        const {isLogin} = context.token
        const {push_type} = pushMsg
        let room_no, mem_no, board_idx

        //개발쪽만 적용
        if (__NODE_ENV === 'dev') {
          alert('fore isLogin :' + isLogin)
          alert('fore push_type :' + JSON.stringify(pushMsg))
        }

        if (__NODE_ENV === 'dev') {
            switch (push_type + '') {
                case '1': //-----------------방송방 [room_no]
                    context.action.updateStickerMsg(pushMsg)
                    context.action.updateSticker(true) //true,false
                    break
                case '2': //------------------메인
                    window.location.href = '/'
                    break
                case '31': //-----------------마이페이지>팬 보드
                    context.action.updateNews(true) //true,false
                    break
                case '32': //-----------------마이페이지>내 지갑
                    context.action.updateNews(true) //true,false
                    break
                case '33': //-----------------마이페이지>캐스트>캐스트 정보 변경 페이지(미정)
                    break
                case '34': //-----------------마이페이지>알림>해당 알림 글
                    context.action.alert({msg: pushMsg.contents})
                    break
                case '35': //-----------------마이페이지
                    context.action.alert({msg: pushMsg.contents})
                    break
                case '36': //-----------------레벨 업 DJ 마이페이지 [mem_no]
                    context.action.updateStickerMsg(pushMsg)
                    context.action.updateSticker(true) //true,false
                    break
                case '37': //------------------1:1 문의 답변
                    context.action.updateNews(true) //true,false
                    break
                case '4': //------------------등록 된 캐스트(미정)
                    //window.location.href = `/`
                    break
                case '5': //------------------스페셜 DJ 선정 페이지(미정)
                    context.action.updateNews(true) //true,false
                    break
                case '6': //------------------이벤트 페이지>해당 이벤트 [board_idx](미정)
                    break
                case '7': //------------------공지사항 페이지 [board_idx](미정)
                    context.action.alert({msg: pushMsg.contents})
                    break
                default:
                    //------------------기본값
                    //window.location.href = `/`
                    break
            }
        }
        //pushMsg = JSON.parse(pushMsg)
        /*switch (pushMsg.push_type) {
          case '1': //팝업메시지
            //context.action.alert({msg: pushMsg.content})
            break
          case '2': //스티커 상단
            //context.action.updateStickerMsg(pushMsg)
            //context.action.updateSticker(true) //true,false
            break
          case '3': //알림(종표시)
            //context.action.updateNews(true) //true,false
            break
        }*/

        // alert(JSON.stringify(pushMsg, null, 1))
        //---------------------[분기처리시작]

        break
      case 'native-auth-check': //----------------------Native RoomCheck
        const _cookie = decodeURIComponent(Utility.getCookie('authToken'))
        if (_cookie === event.detail.authToken) {
          Room.setAuth(true)
        } else {
          Room.setAuth(false)
          //--
          ;(async () => {
            const result = await Api.error_log({
              data: {
                os: '3',
                appVer: '1.0',
                dataType: 'REACT-event',
                commandType: 'native-auth-check',
                desc: `[_cookie] ${_cookie} [event.detail.authToken] ${event.detail.authToken} `
              }
            })
            console.log(result)
          })()
          async function logout() {
            const res = await Api.member_logout()
            if (res.result === 'success') {
              context.action.updateToken(res.data)
              Hybrid('GetLogoutToken', res.data)
              setTimeout(() => {
                window.location.href = '/'
              }, 500)
            } else {
              context.action.alert({
                msg: res.message
              })
            }
          }
          //---
          logout()
        }
        break
      case 'native-navigator': //-----------------------Native navigator
        const {url, info} = event.detail
        history.push(url, {...info, type: 'native-navigator'})
        break
      case 'native-player-show': //---------------------Native player-show (IOS)
        //(BJ)일경우 방송하기:방송중
        if (_.hasIn(event.detail, 'auth') && event.detail.auth === 3) {
          context.action.updateCastState(event.detail.roomNo)
        }
        const _ios = JSON.stringify(event.detail)
        Utility.setCookie('native-player-info', _ios, 100)
        context.action.updatePlayer(true)
        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(event.detail)
        break
      case 'native-start': //---------------------------Native player-show (Android & IOS)
        //시작
        //App에서 방송종료 알림경우
        sessionStorage.removeItem('room_active')
        //(BJ)일경우 방송하기:방송중
        if (_.hasIn(event.detail, 'auth') && event.detail.auth === 3) {
          context.action.updateCastState(event.detail.roomNo)
        }
        //
        const _android = JSON.stringify(event.detail)
        Utility.setCookie('native-player-info', _android, 100)
        context.action.updatePlayer(true)
        context.action.updateMediaPlayerStatus(true)
        context.action.updateNativePlayer(event.detail)
        break
      case 'native-end': //-----------------------------Native End (Android&iOS)
        //쿠키삭제
        Utility.setCookie('native-player-info', '', -1)
        context.action.updatePlayer(false)
        context.action.updateMediaPlayerStatus(false)
        //방송종료
        context.action.updateCastState(false)
        //(BJ)일경우 방송하기:방송중
        context.action.updateCastState(null)
        //종료시
        //App에서 방송종료 알림경우
        sessionStorage.removeItem('room_no')
        sessionStorage.removeItem('room_active')
        break
      case 'native-google-login': //-------------------------Google 로그인
        const googleLogin = async () => {
          const customHeader = JSON.parse(Api.customHeader)
          const {webview, redirect} = qs.parse(location.search)
          let inputData = event.detail
          if (customHeader['os'] === OS_TYPE['IOS']) {
            inputData = JSON.parse(decodeURIComponent(event.detail))
          }
          const google_result = await Api.google_login({data: inputData})
          let sessionRoomNo = sessionStorage.getItem('room_no')
          if(sessionRoomNo === undefined){
              sessionRoomNo = "";
          }
          google_result.data["room_no"] = sessionRoomNo
          //alert(JSON.stringify(google_result))
          if (google_result.result === 'success') {
            const loginInfo = await Api.member_login({
              data: google_result.data
            })

            //alert(JSON.stringify(loginInfo))
            if (loginInfo.result === 'success') {
              const {memNo} = loginInfo.data

              //--##
              /**
               * @마이페이지 redirect
               */
              let mypageURL = ''
              const _parse = qs.parse(location.search)
              if (_parse !== undefined && _parse.mypage_redirect === 'yes') {
                mypageURL = `/mypage/${memNo}`
                if (_parse.mypage !== '/') mypageURL = `/mypage/${memNo}${_parse.mypage}`
              }

              context.action.updateToken(loginInfo.data)
              const profileInfo = await Api.profile({params: {memNo}})

              if (profileInfo.result === 'success') {
                if (webview && webview === 'new') {
                  Hybrid('GetLoginTokenNewWin', loginInfo.data)
                } else {
                  Hybrid('GetLoginToken', loginInfo.data)
                }

                if (redirect) {
                  const decodedUrl = decodeURIComponent(redirect)
                  return (window.location.href = decodedUrl)
                }
                context.action.updateProfile(profileInfo.data)

                //--##마이페이지 Redirect
                if (mypageURL !== '') {
                  return (window.location.href = mypageURL)
                }

                //return props.history.push('/')
                return (window.location.href = '/')
              }
            } else if (loginInfo.code + '' == '1') {
              if (webview && webview === 'new') {
                //TODO: 추후 웹브릿지 연결
                window.location.replace('/signup?' + qs.stringify(google_result.data) + '&webview=new')
              } else {
                window.location.replace('/signup?' + qs.stringify(google_result.data))
              }
            } else if (loginInfo.code === '-3' || loginInfo.code === '-5') {
              let msg = loginInfo.data.opMsg
              if (msg === undefined || msg === null || msg === '') {
                msg = loginInfo.message
              }
              globalCtx.action.alert({
                title: '달빛라이브 사용 제한',
                msg: `${msg}`,
                callback: () => {
                  if (webview && webview === 'new') {
                    Hybrid('CloseLayerPopUp')
                  }
                }
              })
            } else {
              context.action.alert({
                title: '로그인 실패',
                msg: `${loginInfo.message}`
              })
            }
          } else {
            context.action.alert({
              msg: `${google_result.message}`
            })
          }
        }
        googleLogin()
        break
      case 'react-debug': //-------------------------GNB 열기
        const detail = event.detail
        /**
         * @example debug({title:'타이틀내용',msg:'메시지내용', callback: () => { alert('test')      }})
         */
        //context.action.alert(detail)
        break
      case 'react-gnb-open': //-------------------------GNB 열기
        context.action.updateGnbVisible(true)
        break
      case 'react-gnb-close': //------------------------GNB 닫기
        context.action.updateGnbVisible(false)
        break
      default:
        break
    }
  }
  function getMemNo(redirect) {
    if (_.hasIn(context, 'profile.memNo')) {
      return context.profile.memNo
    } else {
      /**
       * @비회원일때
       */
      window.location.href = '/'
      //window.location.href = `/login/?mypage_redirect=yes&mypage=${redirect}`
    }
  }
  //푸쉬서버에서 받는형태
  function pushBack(event) {
    let pushMsg = event.detail
    if (__NODE_ENV === 'dev') {
        alert('back pushMsg :' + pushMsg)
    }

    const isJsonString = (str) => {
      try {
        var parsed = JSON.parse(str)
        return typeof parsed === 'object'
      } catch (e) {
        if (__NODE_ENV === 'dev') {
          alert(e)
        }
        return false
      }
    }

    if (typeof pushMsg === 'string'){
      pushMsg = decodeURIComponent(pushMsg)
      if (isJsonString(pushMsg)) {
          pushMsg = JSON.parse(pushMsg)
      } else {
          return false
      }
    }

    /**
     * @title 네이티브 푸쉬관련
     * @push_type
        1 : 방송방 [room_no]
        2 : 메인
        31 : 마이페이지>팬 보드
        32 : 마이페이지>내 지갑
        33 : 마이페이지>캐스트>캐스트 정보 변경 페이지
        34 : 마이페이지>알림>해당 알림 글
        35 : 마이페이지
        36 : 레벨 업 DJ 마이페이지 [mem_no]
        37 : 1:1 문의 답변
        4 : 등록 된 캐스트
        5 : 스페셜 DJ 선정 페이지
        6 : 이벤트 페이지>해당 이벤트 [board_idx]
        7 : 공지사항 페이지 [board_idx]
      */
    const {isLogin} = context.token
    const {push_type} = pushMsg
    let room_no, mem_no, board_idx

    //개발쪽만 적용
    if (__NODE_ENV === 'dev') {
      alert('back isLogin :' + isLogin)
      alert('back pushMsg :' + JSON.stringify(pushMsg))
    }
    //---------------------[분기처리시작]

    switch (push_type + '') {
      case '1': //-----------------방송방 [room_no]
        room_no = pushMsg.room_no
        RoomJoin(room_no)
        break
      case '2': //------------------메인
        window.location.href = '/'
        break
      case '31': //-----------------마이페이지>팬 보드
        mem_no = pushMsg.mem_no
        if(mem_no != undefined){
            if (isLogin) window.location.href = `/mypage/${mem_no}/fanboard`
        }
        break
      case '32': //-----------------마이페이지>내 지갑
          mem_no = pushMsg.mem_no
        if(mem_no != undefined){
            if (isLogin) window.location.href = `/mypage/${mem_no}/wallet`
        }
        break
      case '33': //-----------------마이페이지>캐스트>캐스트 정보 변경 페이지(미정)
        break
      case '34': //-----------------마이페이지>알림>해당 알림 글
        mem_no = pushMsg.mem_no
        if(mem_no != undefined){
            if (isLogin) window.location.href = `/mypage/${mem_no}/alert`
        }
        break
      case '35': //-----------------마이페이지
        mem_no = pushMsg.mem_no
        if (mem_no !== undefined) {
            if (isLogin) window.location.href = `/mypage/${mem_no}/`
        }
        break
      case '36': //-----------------레벨 업 DJ 마이페이지 [mem_no]
        mem_no = pushMsg.mem_no
        if (mem_no !== undefined) {
            if (isLogin) window.location.href = `/mypage/${mem_no}/`
        }
        break
      case '37': //-----------------레벨 업 DJ 마이페이지 [mem_no]
          mem_no = pushMsg.mem_no
          if (mem_no !== undefined) {
              if (isLogin) window.location.href = `/customer/personal/qnaList`
          }
          break
      case '4': //------------------등록 된 캐스트(미정)
        window.location.href = `/`
        break
      case '5': //------------------스페셜 DJ 선정 페이지(미정)
        //window.location.href = `/event/specialDj`
        board_idx = pushMsg.board_idx
        if (board_idx !== undefined) {
          window.location.href = `/customer/notice/${board_idx}`
        }
        break
      case '6': //------------------이벤트 페이지>해당 이벤트 [board_idx](미정)
        window.location.href = `/`
        break
      case '7': //------------------공지사항 페이지 [board_idx](미정)
        board_idx = pushMsg.board_idx
        if (board_idx !== undefined) {
          window.location.href = `/customer/notice/${board_idx}`
        }
        break
      default:
        //------------------기본값
        //window.location.href = `/`
        break
    }
  }
  //---------------------------------------------------------------------
  //useEffect addEventListener
  useEffect(() => {
    /*----native----*/
    document.addEventListener('native-push-foreground', update) //완료
    document.addEventListener('native-navigator', update) //완료
    document.addEventListener('native-player-show', update) //완료
    document.addEventListener('native-start', update) //완료
    document.addEventListener('native-end', update) //완료
    document.addEventListener('native-push-background', pushBack) //native-push-background (roomJoin가능)
    document.addEventListener('native-auth-check', update) //방인증정보
    document.addEventListener('native-google-login', update) //구글로그인

    /*----react----*/
    document.addEventListener('react-debug', update)
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      /*----native----*/
      document.addEventListener('native-push-foreground', update) //완료
      document.removeEventListener('native-navigator', update)
      document.removeEventListener('native-player-show', update)
      document.removeEventListener('native-start', update)
      document.removeEventListener('native-end', update)
      document.addEventListener('native-push-background', pushBack)
      document.removeEventListener('native-auth-check', update)
      document.addEventListener('native-google-login', update) //구글로그인
      /*----react----*/
      document.removeEventListener('react-debug', update)
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  return (
    <React.Fragment>
      <Room />
    </React.Fragment>
  )
}
