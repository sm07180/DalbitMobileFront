/**
 * @file Interface.js
 * @brief Native,Windows ->React로 Interface
 * @notice
 * @code document.dispatchEvent(new CustomEvent('native-goLogin', {detail:{info:'someDate'}}))
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import _ from 'lodash'
//context
import {OS_TYPE} from 'context/config.js'
import {Hybrid, isAndroid} from 'context/hybrid'
import Api from 'context/api'
import {Context} from 'context'
import Room, {RoomJoin, RoomMake} from 'context/room'
import {clipJoin, clipExit} from 'pages/common/clipPlayer/clip_func'
import {backFunc} from 'components/lib/back_func'
//util
import Utility from 'components/lib/utility'

import qs from 'query-string'
import {authReq} from "pages/self_auth";
import {useDispatch, useSelector} from "react-redux";
import {setIsRefresh, setIsWebView} from "redux/actions/common";
import {MailboxContext} from "context/mailbox_ctx";

export const FOOTER_VIEW_PAGES = {
  '/': 'main',
  '/clip': 'clip',
  '/search': 'search',
  '/mypage': 'mypage',
  '/login': 'mypage',
};

export default () => {
  //context
  const context = useContext(Context)
  const { mailboxAction } = useContext(MailboxContext);
  //history
  let history = useHistory()
  const dispatch = useDispatch();
  const webView = useSelector(state => state.common).isWebView;
  const uLocation = useLocation();

  const doAuthCheck = () => {
    Api.certificationCheck().then(res => {
      if(res.message === "SUCCESS") {
        if(res.data === 'y') {
          context.action.confirm({
            msg: `방송하기, 클립 녹음, 클립 업로드를 하기 위해 본인인증을 완료해주세요.`,
            callback: () => {
              authReq({code: '9', formTagRef: context.authRef, context: context});
            }
          })
        }else {
          context.action.alert({
            msg: '본인인증을 이미 완료했습니다.<br/>1일 1회만 가능합니다.'
          })
        }
      }
    });
  };

  // 플레이가공
  const clipPlay = async (clipNum) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      localStorage.removeItem('clipPlayListInfo')
      const oneClipPlayList = {
        clipNo: data.clipNo,
        bgImg: data.bgImg,
        title: data.title,
        nickName: data.nickName,
        subjectType: data.subjectType,
        isNew: data.isNew,
        filePlayTime: data.filePlay,
        isSpecial: data.isSpecial,
        badgeSpecial: data.badgeSpecial,
        gender: data.gender,
        replyCnt: data.replyCnt,
        goodCnt: data.goodCnt,
        playCnt: data.playCnt
      }
      localStorage.setItem('oneClipPlayList', JSON.stringify(oneClipPlayList))
      clipJoin(data, context, 'none', 'push')
    } else {
      if (code === '-99') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
  }

  async function pushClick(pushIdx) {
    const res = await Api.push_click({
      data: {
        pushIdx: pushIdx
      }
    })
    if (res.result === 'success') {
    } else if (res.result === 'fail') {
    }
  }

  const [authState, setAuthState] = useState(false)

  //auth 상태체크
  const checkSelfAuth = async () => {
    const selfAuth = await Api.self_auth_check({})
    if (selfAuth.result === 'fail') {
      setAuthState(false)
      context.action.updateSelfAuth(false)
    } else {
      setAuthState(true)
      context.action.updateSelfAuth(true)
    }
  }

  // 구글, 페이스북 로그인
  const socialLogin = async (inputData, type) => {
    const customHeader = JSON.parse(Api.customHeader)
    const {webview, redirect} = qs.parse(location.search)
    let social_result;
    if (customHeader['os'] === OS_TYPE['IOS']) {
      inputData = JSON.parse(decodeURIComponent(inputData))
    }

    if(type === 'google') {
      social_result = await Api.google_login({data: inputData});
    }else if(type === 'facebook') {
      social_result = await Api.facebook_login({data: inputData});
    }

    let sessionRoomNo = sessionStorage.getItem('room_no')
    if (sessionRoomNo === undefined || sessionRoomNo === null) {
      sessionRoomNo = Utility.getCookie('listen_room_no')
      if (sessionRoomNo === undefined || sessionRoomNo === null) {
        sessionRoomNo = ''
      }
    }
    social_result.data['room_no'] = sessionRoomNo
    if (social_result.result === 'success') {
      const loginInfo = await Api.member_login({
        data: social_result.data
      })

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
          window.location.replace('/socialSignup?' + qs.stringify(social_result.data) + '&webview=new')
        } else {
          window.location.replace('/socialSignup?' + qs.stringify(social_result.data))
        }
      } else if (loginInfo.code === '-3' || loginInfo.code === '-5') {
        let msg = loginInfo.data.opMsg
        if (msg === undefined || msg === null || msg === '') {
          msg = loginInfo.message
        }
        context.action.alert({
          title: '달라 사용 제한',
          msg: `${msg}`,
          callback: () => {
            if (webview && webview === 'new') {
              Hybrid('CloseLayerPopup')
            }
          }
        })
      } else if (loginInfo.code === '-6') {
        context.action.confirm({
          msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
          callback: () => {
            const callResetListen = async (mem_no) => {
              const fetchResetListen = await Api.postResetListen({
                memNo: mem_no
              })
              if (fetchResetListen.result === 'success') {
                setTimeout(() => {
                  socialLogin(inputData, type);
                }, 700)
              } else {
                context.action.alert({
                  msg: `${loginInfo.message}`
                })
              }
            }
            callResetListen(loginInfo.data.memNo)
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
        msg: `${social_result.message}`
      })
    }
  }

  const newSocialLogin = async (inputData) => {

    const {webview, redirect} = qs.parse(location.search)
    let social_result = await Api.new_social_login(inputData);
    let sessionRoomNo = sessionStorage.getItem('room_no');

    if (sessionRoomNo === undefined || sessionRoomNo === null) {
      sessionRoomNo = Utility.getCookie('listen_room_no')
      if (sessionRoomNo === undefined || sessionRoomNo === null) {
        sessionRoomNo = ''
      }
    }
    social_result.data['room_no'] = sessionRoomNo
    if (social_result.result === 'success') {
      const loginInfo = await Api.member_login({
        data: social_result.data
      })
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

          return window.location.href = '/'
        }
      } else if (loginInfo.code + '' == '1') {
        if (webview && webview === 'new') {
          //TODO: 추후 웹브릿지 연결
          window.location.replace('/socialSignup?' + qs.stringify(social_result.data) + '&webview=new')
        } else {
          window.location.replace('/socialSignup?' + qs.stringify(social_result.data))
        }
      } else if (loginInfo.code === '-3' || loginInfo.code === '-5') {
        let msg = loginInfo.data.opMsg
        if (msg === undefined || msg === null || msg === '') {
          msg = loginInfo.message
        }
        context.action.alert({
          title: '달라 사용 제한',
          msg: `${msg}`,
          callback: () => {
            if (webview && webview === 'new') {
              Hybrid('CloseLayerPopup')
            }
          }
        })
      } else if (loginInfo.code === '-6') {
        context.action.confirm({
          msg: '이미 로그인 된 기기가 있습니다.\n방송 입장 시 기존기기의 연결이 종료됩니다.\n그래도 입장하시겠습니까?',
          callback: () => {
            const callResetListen = async (mem_no) => {
              const fetchResetListen = await Api.postResetListen({
                memNo: mem_no
              })
              if (fetchResetListen.result === 'success') {
                setTimeout(() => {
                  socialLogin(inputData, type);
                }, 700)
              } else {
                context.action.alert({
                  msg: `${loginInfo.message}`
                })
              }
            }
            callResetListen(loginInfo.data.memNo)
          }
        })
      } else if (loginInfo.code === '-8') {
        return history.push({pathname: '/event/customer_clear', state: {memNo: loginInfo.data.memNo}});
      } else {
        context.action.alert({
          title: '로그인 실패',
          msg: `${loginInfo.message}`
        })
      }
    } else {
      context.action.alert({
        msg: `${social_result.message}`
      })
    }
  }

  //
  //---------------------------------------------------------------------
  function update(event) {
    const agePassYn = context.noServiceInfo.americanAge >= context.noServiceInfo.limitAge ? 'y' : 'n'; // 14세 미만 본인인증 받아야됨

    switch (event.type) {
      case 'native-push-foreground': //----------------------native-push-foreground
        let pushMsg = event.detail
        // if (__NODE_ENV === 'dev') {
        //   alert('fore pushMsg :' + pushMsg)
        // }

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

        if (typeof pushMsg === 'string') {
          pushMsg = decodeURIComponent(pushMsg)
          if (isJsonString(pushMsg)) {
            pushMsg = JSON.parse(pushMsg)
          } else {
            return false
          }
        }

        const {isLogin} = context.token
        const {push_type} = pushMsg
        //let room_no, mem_no, board_idx

        //개발쪽만 적용
        // if (__NODE_ENV === 'dev') {
        //   alert('fore isLogin :' + isLogin)
        //   alert('fore push_type :' + JSON.stringify(pushMsg))
        // }

        if (pushMsg.push_idx && pushMsg.push_idx !== undefined && pushMsg.push_idx !== null && pushMsg.push_idx !== '') {
          pushClick(pushMsg.push_idx)
        }

        switch (push_type + '') {
          case '1': //-----------------방송방 [room_no]
            pushMsg.title = pushMsg.title.trim() ? pushMsg.title.trim() : pushMsg.contents;
            context.action.updateStickerMsg(pushMsg)
            context.action.updateSticker(true) //true,false
            break
          case '2': //------------------메인
            window.location.href = '/'
            break
          case '31': //-----------------마이페이지>팬 보드
            //context.action.updateNews(true) //true,false
            break
          case '32': //-----------------마이페이지>내 지갑
            //context.action.updateNews(true) //true,false
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
            //context.action.updateNews(true) //true,false
            break
          case '38': //------------------스타의 방송공지 등록
            //context.action.updateNews(true) //true,false
            break
          case '4': //------------------등록 된 캐스트(미정)
            //window.location.href = `/`
            break
          case '5': //------------------스페셜 DJ 선정 페이지(미정)
            //context.action.updateNews(true) //true,false
            break
          case '6': //------------------이벤트 페이지>해당 이벤트 [board_idx](미정)
            break
          case '7': //------------------공지사항 페이지 [board_idx](미정)
            context.action.alert({msg: pushMsg.contents})
            break
          case '65': // 깐부 수락 / 신청
            history.push('/event/gganbu');
            // window.location.href = '/event/gganbu';
            break;
          default:
            //------------------기본값
            //window.location.href = `/`
            break
        }
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
          })()
          async function logout() {
            const res = await Api.member_logout()
            if (res.result === 'success') {
              context.action.updateToken(res.data)
              Hybrid('GetLogoutToken', res.data)
              setTimeout(() => {
                window.location.href = '/'
              }, 500)
              context.action.updateAdminChecker(false)
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
        if (event.detail.mediaType !== 'v') {
          const _ios = JSON.stringify(event.detail)
          Utility.setCookie('native-player-info', _ios, 100)
          context.action.updatePlayer(true)
          context.action.updateMediaPlayerStatus(true)
          context.action.updateNativePlayer(event.detail)
        }
        break
      case 'native-start': //---------------------------Native player-show (Android & IOS)
        //시작
        //App에서 방송종료 알림경우
        sessionStorage.removeItem('room_active')
        //(BJ)일경우 방송하기:방송중
        const isDj = _.hasIn(event.detail, 'auth') && event.detail.auth === 3;
        if (isDj) {
          context.action.updateCastState(event.detail.roomNo)
          Utility.setCookie('isDj', isDj, 3);
        }

        if (event.detail.mediaType !== 'v') {
          const _android = JSON.stringify(event.detail)
          Utility.setCookie('native-player-info', _android, 100)
          context.action.updatePlayer(true)
          context.action.updateMediaPlayerStatus(true)
          context.action.updateNativePlayer(event.detail)
        }
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
        Utility.setCookie('listen_room_no', null)
        sessionStorage.removeItem('room_active')
        Utility.setCookie('isDj', false, 3);
        break
      case 'native-non-member-end':
        context.action.confirm({
          buttonText: {right: '로그인'},
          msg: `<div id="nonMemberPopup"><p>이 방송이 즐거우셨나요~?<br/>로그인 후 DJ와 소통해보세요!<br>DJ가 당신을 기다립니다 ^^</p><img src="https://image.dalbitlive.com/images/popup/non-member-popup.png" /></div>`,
          callback: () => {
            localStorage.setItem(
              'prevRoomInfo',
              JSON.stringify({
                roomNo: event.detail.roomNo,
                bjNickNm: event.detail.bjNickNm
              })
            )
            history.push('/login')
          }
        })

        break
      case 'native-google-login': //-------------------------Google 로그인
        socialLogin(event.detail, 'google');
        break
      case 'native-facebook-login':
        socialLogin(event.detail, 'facebook');
        break;
      case 'resSocialToken': // 소셜로그인을 native에서 처리하면서 통합 됨
        const customHeader = JSON.parse(Api.customHeader)
        let param = event.detail;
        if (customHeader['os'] === OS_TYPE['IOS']) {
          param = JSON.parse(decodeURIComponent(param))
        }

        if(param.token && param.token !== '0') {
          newSocialLogin(param);
        }
        break;
      case 'native-room-make':
        if (!context.token.isLogin) return (window.location.href = '/login');
        if(authState) {
          if(agePassYn === 'y') {
            if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
              if (Utility.getCookie('clip-player-info')) {
                context.action.confirm({
                  msg: `현재 재생 중인 클립이 있습니다.\n방송을 생성하시겠습니까?`,
                  callback: () => {
                    clipExit(context)
                    RoomMake(context)
                  }
                })
              } else {
                RoomMake(context)
              }
            } else {
              context.action.confirm({
                msg: `현재 청취 중인 방송방이 있습니다.\n방송을 생성하시겠습니까?`,
                callback: () => {
                  sessionStorage.removeItem('room_no')
                  Utility.setCookie('listen_room_no', null)
                  Hybrid('ExitRoom', '')
                  context.action.updatePlayer(false)
                  RoomMake(context)
                }
              })
            }
          }else {
            doAuthCheck();
          }
        }else {
          doAuthCheck();
        }

        break
      case 'react-debug': //-------------------------GNB 열기
        const detail = event.detail
        /**
         * @example debug({title:'타이틀내용',msg:'메시지내용', callback: () => { alert('test')      }})
         */
        break
      case 'react-gnb-open': //-------------------------GNB 열기
        context.action.updateGnbVisible(true)
        break
      case 'react-gnb-close': //------------------------GNB 닫기
        context.action.updateGnbVisible(false)
        break

      case 'clip-player-show': //------------------------클립플레이어 show
        let dataString = JSON.stringify({...event.detail, ...{playerState: 'paused'}})
        Utility.setCookie('clip-player-info', dataString, 100)
        sessionStorage.setItem('clip_info', dataString)
        localStorage.setItem('play_clip_no', event.detail.clipNo)
        context.action.updateClipState(true)
        context.action.updateClipPlayerInfo(event.detail)
        context.action.updatePlayer(true)
        sessionStorage.removeItem('clip_active')
        context.action.alert({visible: false})
        sessionStorage.setItem('listening', 'N')
        break
      case 'clip-player-end': //------------------------클립플레이어 end(플로팅 바 삭제)
        Utility.setCookie('clip-player-info', '', -1)
        context.action.updateClipState(null)
        context.action.updateClipPlayerState(null)
        context.action.updateClipState(null)
        context.action.updatePlayer(false)
        sessionStorage.setItem('listening', 'N')
        sessionStorage.removeItem('clip_active')
        break
      case 'clip-player-audio-end': //-----------------------클립플레이어 오디오 재생 종료
        sessionStorage.removeItem('clip_active')
        settingSessionInfo('ended')
        break

      case 'clip-player-start': //-----------------------클립 재생
        settingSessionInfo('playing')
        break
      case 'clip-player-pause': //-----------------------클립 멈춤
        settingSessionInfo('paused')
        break
      case 'clip-upload-end': //------------- 네이티브 클립 녹음, 업로드 후
        localStorage.removeItem('clipPlayListInfo')
        const oneClipPlayList = {
          clipNo: event.detail.clipNo
        }
        localStorage.setItem('oneClipPlayList', JSON.stringify(oneClipPlayList))
        break
      case 'native-clip-upload': //-----------------------네이티브 딤 메뉴에서 클립 업로드 클릭 시
        if (!context.token.isLogin) return (window.location.href = '/login')
        //2020-10-13 본인인증 임시 막기
        // if (!authState) return (window.location.href = '/selfauth?type=create')
        if(authState) {
          if(agePassYn === 'y') {
            if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
              if (Utility.getCookie('clip-player-info')) {
                context.action.confirm({
                  msg: `현재 재생 중인 클립이 있습니다.\n클립을 업로드하시겠습니까?`,
                  callback: () => {
                    clipExit(context)
                    Hybrid('ClipUploadJoin')
                  }
                })
              } else {
                Hybrid('ClipUploadJoin')
              }
            } else {
              context.action.confirm({
                msg: `현재 청취 중인 방송방이 있습니다.\n클립을 업로드하시겠습니까?`,
                callback: () => {
                  sessionStorage.removeItem('room_no')
                  Utility.setCookie('listen_room_no', null)
                  Hybrid('ExitRoom', '')
                  context.action.updatePlayer(false)
                  Hybrid('ClipUploadJoin')
                }
              })
            }
          }else {
            doAuthCheck();
          }
        }else {
          doAuthCheck();
        }

        break
      case 'native-clip-record': //-----------------------네이티브 딤 메뉴에서 클립 녹음 클릭 시
        if (!context.token.isLogin) return (window.location.href = '/login')
        //2020-10-13 본인인증 임시 막기
        // if (!authState) return (window.location.href = '/selfauth?type=create')
        if(authState) {
          if(agePassYn === 'y') {
            if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
              if (Utility.getCookie('clip-player-info')) {
                context.action.confirm({
                  msg: `현재 재생 중인 클립이 있습니다.\n클립을 녹음하시겠습니까?`,
                  callback: () => {
                    clipExit(context)
                    Hybrid('EnterClipRecord')
                  }
                })
              } else {
                Hybrid('EnterClipRecord')
              }
            } else {
              context.action.confirm({
                msg: `현재 청취 중인 방송방이 있습니다.\n클립을 녹음하시겠습니까?`,
                callback: () => {
                  sessionStorage.removeItem('room_no')
                  Utility.setCookie('listen_room_no', null)
                  Hybrid('ExitRoom', '')
                  context.action.updatePlayer(false)
                  Hybrid('EnterClipRecord')
                }
              })
            }
          }else {
            doAuthCheck();
          }
        }else {
          doAuthCheck();
        }

        break
      case 'native-close-layer-popup': //---------- 안드로이드 물리 백키로 새창 닫았을때
        sessionStorage.removeItem('webview')
        break
      case 'native-back-click': //---------- 안드로이드 물리 백키 클릭 이벤트 발생
        //TODO:레이어닫는지?백이동인지 확인 백이동일경우 Hybrid('goBack') 호출
        // if (__NODE_ENV === 'dev') {
        //   alert('event:native-back-click')
        // }
        if(webView === 'new' && context.backState === null) {
          if(uLocation.key) {
            history.goBack();
          }else {
            Hybrid('goBack')
            dispatch(setIsWebView(''));
          }
        }else if (context.backState === null) {
          Hybrid('goBack')
        } else {
          backFunc(context, dispatch)
        }
        // break
        break
      case 'native-call-state': //---------- 안드로이드 전화 on/off 발생
        const {onCall} = event.detail
        if (onCall === true) {
          sessionStorage.setItem('onCall', 'on')
        } else if (onCall === false) {
          sessionStorage.removeItem('onCall')
        }
        break
      case 'native-goto-fanboard': //----- 청취자요약정보 팬보드이동
        const {memNo} = event.detail
        history.push(`/profile/${memNo}`)
        break
      case 'native-join-room': //----- 청취자요양정보 방조인
        const {roomNo} = event.detail
        RoomJoin({roomNo: roomNo})
        break
      case 'native-goto-rank': //----- 청취자요약정보 랭킹이동
        history.push(`/rank`)
        break
      case 'native-broad-summary': //요약정보에서 이동
        history.push(`/`)
        break
      case 'mailbox-state':
        mailboxAction.setIsMailboxNew(event.detail.new)
        context.action.updateIsMailboxNew(event.detail.new)
        break

      case 'mailbox-use-state':
        console.log(JSON.stringify(event.detail))
        context.action.updateIsMailboxOn(event.detail.isMailboxOn)
        break

      case 'native-footer': // native footer 이동
        const type = event.detail.type.toLowerCase();
        const prevPath = location.pathname.toLowerCase();
        const prevType = FOOTER_VIEW_PAGES[prevPath];

        if(type === prevType) {
          if(prevPath !== '/login') {
            dispatch(setIsRefresh(true))
          }
        }else {
          const pushUrl = Object.keys(FOOTER_VIEW_PAGES).find(key => FOOTER_VIEW_PAGES[key] === type);
          history.push(pushUrl);
        }
        break;
      default:
        break
    }
  }

  const settingSessionInfo = (type) => {
    let data = Utility.getCookie('clip-player-info')
    if (data === undefined) return null
    data = JSON.parse(data)
    data = {...data, playerState: type}
    Utility.setCookie('clip-player-info', JSON.stringify(data))
    context.action.updateClipPlayerState(type)
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

    if (typeof pushMsg === 'string') {
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
        4 : 등록 된 캐스트
        5 : 스페셜 DJ 선정 페이지
        6 : 이벤트 페이지>해당 이벤트 [board_idx]
        7 : 공지사항 페이지 [board_idx]
        31 : 마이페이지>팬 보드
        32 : 마이페이지>내 지갑
        33 : 마이페이지>캐스트>캐스트 정보 변경 페이지
        34 : 마이페이지>알림>해당 알림 글
        35 : 마이페이지
        36 : 레벨 업 DJ 마이페이지 [mem_no]
        37 : 1:1 문의 답변

      */
    const {isLogin} = context.token
    const {push_type} = pushMsg
    let room_no, mem_no, board_idx, redirect_url

    //개발쪽만 적용
    if (__NODE_ENV === 'dev') {
      alert('back isLogin :' + isLogin)
      alert('back pushMsg :' + JSON.stringify(pushMsg))
    }
    //---------------------[분기처리시작]

    if (pushMsg.push_idx && pushMsg.push_idx !== undefined && pushMsg.push_idx !== null && pushMsg.push_idx !== '') {
      pushClick(pushMsg.push_idx)
    }

    switch ((push_type + '').trim()) {
      case '1': //-----------------방송방 [room_no]
        room_no = pushMsg.room_no
        RoomJoin({roomNo: room_no})
        break
      case '2': //------------------메인
        window.location.href = '/'
        break
      case '31': //-----------------마이페이지>팬 보드
        mem_no = pushMsg.mem_no
        if (mem_no != undefined) {
          if (isLogin) {
            history.push(`/profile/${context.profile.memNo}?tab=1`)
          }
        }
        break
      case '32': //-----------------마이페이지>내 지갑
        mem_no = pushMsg.mem_no
        if (mem_no != undefined) {
          // if (isLogin) window.location.href = `/mypage/${mem_no}/wallet`
          if (isLogin) {
            history.push('/wallet')
          }
        }
        break
      case '33': //-----------------마이페이지>캐스트>캐스트 정보 변경 페이지(미정)
        break
      case '34': //-----------------마이페이지>알림>해당 알림 글
        mem_no = pushMsg.mem_no
        if (mem_no != undefined) {
          // if (isLogin) window.location.href = `/mypage/${mem_no}/alert`
          // if (isLogin) window.location.href = `/menu/alarm`
          if (isLogin) {
            history.push('/notice');
          }
        }
        break
      case '35': //-----------------마이페이지
        mem_no = pushMsg.mem_no
        if (mem_no !== undefined) {
          // if (isLogin) window.location.href = `/mypage/${mem_no}/`
          // if (isLogin) window.location.href = `/menu/profile`
          if (isLogin) {
            history.push('/mypage');
          }
        }
        break
      case '36': //-----------------레벨 업 DJ 마이페이지 [mem_no]
        mem_no = pushMsg.mem_no
        if (mem_no !== undefined) {
          // if (isLogin) window.location.href = `/mypage/${mem_no}/`
          if (isLogin) {
            history.push(`/profile/${mem_no}`);
          }
        }
        break
      case '37': //-----------------1:1 문의 답변
        mem_no = pushMsg.mem_no
        if (mem_no !== undefined) {
          if (isLogin) window.location.href = `/customer/qnaList`
        }
        break
      case '38': //-----------------스타의 방송공지
        mem_no = pushMsg.mem_no
        if (mem_no !== undefined) {
          // if (isLogin) window.location.href = `/mypage/${mem_no}?tab=0`
          if (isLogin) {
            history.push(`/profile/${mem_no}?tab=0`)
          }
        }
        break
      case '39': //-----------------좋아요
        if (isLogin) window.location.href = `/rank?rankType=3&dateType=2`
        break
      case '40': //-----------------좋아요 랭킹 일간
        if (isLogin) window.location.href = `/rank?rankType=3&dateType=1`
        break
      case '41': //-----------------랭킹 > DJ > 일간
        if (isLogin) window.location.href = `/rank?rankType=1&dateType=1`
        break
      case '42': //-----------------랭킹 > DJ > 주간
        if (isLogin) window.location.href = `/rank?rankType=1&dateType=2`
        break
      case '43': //-----------------랭킹 > FAN > 일간
        if (isLogin) window.location.href = `/rank?rankType=2&dateType=1`
        break
      case '44': //-----------------랭킹 > FAN > 주간
        if (isLogin) window.location.href = `/rank?rankType=2&dateType=2`
        break
      case '45': //-----------------Clip PLay
        room_no = pushMsg.room_no
        if (room_no) clipPlay(room_no)
        break
      case '46': //-----------------Clip PLay
        room_no = pushMsg.room_no
        if (room_no) clipPlay(room_no)
        break
      case '47': //-----------------Clip PLay
        room_no = pushMsg.room_no
        if (room_no) clipPlay(room_no)
        break
      case '48': //-----------------마이클립
        if (isLogin) {
          // window.location.href = `/mypage/${context.profile.memNo}/my_clip`
          if (isLogin) {
            history.push(`/myProfile?tab=2`)
          }
        }
        break
      case '50': //-----------------직접입력 URL
        redirect_url = pushMsg.link
        if (redirect_url !== undefined) {
          if (isLogin) window.location.href = redirect_url
        }
        break
      case '52': //------------------메시지알람
        const memNo = pushMsg.mem_no
        if (memNo !== undefined) {
          // if (__NODE_ENV === 'dev') {
          //   alert('JoinMailBox ' + memNo)
          //   alert('useMailbox ' + context.useMailbox)
          // }
          if (context.useMailbox) {
            if (
              (context.customHeader['os'] === OS_TYPE['IOS'] && context.customHeader['appBuild'] >= 284) ||
              (context.customHeader['os'] === OS_TYPE['Android'] && context.customHeader['appBuild'] >= 52)
            ) {
              Hybrid('PushMailboxJoin', memNo)
            } else {
              Hybrid('JoinMailBox', memNo)
            }
          }
        }
        break
      case '53': //-----------------마이클립
        if (isLogin) {
          window.location.href = `/event/attend_event`
        }
        break
      case '4': //------------------등록 된 캐스트(미정)
        window.location.href = `/`
        break
      case '5': //------------------스페셜 DJ 선정 페이지(미정)
        //window.location.href = `/event/specialDj`
        board_idx = pushMsg.board_idx
        if (board_idx !== undefined) {
          // window.location.href = `/customer/notice/${board_idx}`
          history.push({
            pathname: `/notice/${board_idx}`,
            state: board_idx,
          })
        }
        break
      case '6': //------------------이벤트 페이지>해당 이벤트 [board_idx](미정)
        window.location.href = `/`
        break
      case '7': //------------------공지사항 페이지 [board_idx](미정)
        board_idx = pushMsg.board_idx
        if (board_idx !== undefined) {
          // window.location.href = `/customer/notice/${board_idx}`
          history.push({
            pathname: `/notice/${board_idx}`,
            state: board_idx,
          })
        }
        break
      case '65': // 깐부 수락 / 신청
        history.push('/event/gganbu');
        // window.location.href = '/event/gganbu';
        break;
      default:
        //------------------기본값
        //window.location.href = `/`
        break
    }
  }

  function nativeGetTid(event) {
    let nativeTid = event.detail
    if (event.detail.isExist == null) {
      //IOS
    } else {
      //ANDROID
      if (event.detail.isExist || event.detail.isExist == 'true') {
        if (event.detail.tid == '') {
          nativeTid = 'adbrix'
        } else {
          nativeTid = event.detail.tid
        }
      } else {
        nativeTid = ''
      }
    }
    context.action.updateNativeTid(nativeTid)
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
    document.addEventListener('native-non-member-end', update)

    document.addEventListener('native-push-background', pushBack) //native-push-background (roomJoin가능)
    document.addEventListener('native-auth-check', update) //방인증정보
    document.addEventListener('native-google-login', update) //구글로그인
    document.addEventListener('native-get-tid', nativeGetTid) //tid 가져오기
    document.addEventListener('native-facebook-login', update); // 페이스북 로그인
    document.addEventListener('resSocialToken', update); // 소셜로그인 통합

    /*----react----*/
    document.addEventListener('react-debug', update)
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    document.addEventListener('native-back-click', update)
    document.addEventListener('native-call-state', update)

    /*----clip----*/
    document.addEventListener('clip-player-show', update)
    document.addEventListener('clip-player-end', update)
    document.addEventListener('clip-player-audio-end', update)
    document.addEventListener('clip-player-start', update)
    document.addEventListener('clip-player-pause', update)
    // document.addEventListener('clip-upload-end', update)
    document.addEventListener('native-close-layer-popup', update)

    /* ------ 요약정보에서 요청 : 팬보드이동, 방조인 ----- */
    document.addEventListener('native-goto-fanboard', update)
    document.addEventListener('native-goto-rank', update)
    document.addEventListener('native-join-room', update)
    document.addEventListener('native-broad-summary', update)

    /*----mailbox----*/
    document.addEventListener('mailbox-state', update)
    document.addEventListener('mailbox-use-state', update)

    /* native footer */
    document.addEventListener('native-footer', update)

    return () => {
      /*----native----*/
      document.addEventListener('native-push-foreground', update) //완료
      document.removeEventListener('native-navigator', update)
      document.removeEventListener('native-player-show', update)
      document.removeEventListener('native-start', update)
      document.removeEventListener('native-end', update)
      document.removeEventListener('native-non-member-end', update)
      document.addEventListener('native-push-background', pushBack)
      document.removeEventListener('native-auth-check', update)
      document.addEventListener('native-google-login', update) //구글로그인
      document.addEventListener('native-get-tid', nativeGetTid) //tid 가져오기
      document.removeEventListener('native-facebook-login', update); // 페이스북 로그인
      document.removeEventListener('resSocialToken', update); // 소셜로그인 통합
      /*----react----*/
      document.removeEventListener('react-debug', update)
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
      document.addEventListener('native-call-state', update)
      /*----clip----*/
      document.removeEventListener('clip-player-show', update)
      document.removeEventListener('clip-player-end', update)
      document.removeEventListener('clip-player-audio-end', update)
      document.removeEventListener('clip-player-start', update)
      document.removeEventListener('clip-player-pause', update)
      // document.removeEventListener('clip-upload-end', update)
      document.removeEventListener('native-close-layer-popup', update)

      /* ------ 요약정보에서 요청 : 팬보드이동, 방조인 ----- */
      document.removeEventListener('native-goto-fanboard', update)
      document.removeEventListener('native-goto-rank', update)
      document.removeEventListener('native-join-room', update)
      document.removeEventListener('native-broad-summary', update)

      /*----mailbox----*/
      document.removeEventListener('mailbox-state', update)
      document.removeEventListener('mailbox-use-state', update)

      /* native footer */
      document.removeEventListener('native-footer', update)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('native-room-make', update)
    document.addEventListener('native-clip-upload', update)
    document.addEventListener('native-clip-record', update)

    return () => {
      document.removeEventListener('native-room-make', update)
      document.removeEventListener('native-clip-upload', update)
      document.removeEventListener('native-clip-record', update)
    }
  }, [context.token, authState, context.noServiceInfo.americanAge])

  useEffect(() => {
    checkSelfAuth()
  }, [context.token])

  useEffect(() => {
    if(isAndroid()) {
      document.addEventListener('native-back-click', update)
      return () => {
        document.removeEventListener('native-back-click', update)
      }
    }
  }, [context.backFunction, context.backState, uLocation.pathname, webView])

  return (
    <React.Fragment>
      <Room />
    </React.Fragment>
  )
}
