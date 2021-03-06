// others
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";
import {ClipPlayFn} from 'pages/clip/components/clip_play_fn'
// Server Api
import {broadcastExit} from "common/api";
import {isDesktop} from "../../lib/agent";
import {Hybrid, isAndroid, isHybrid, isMobileWeb} from "../../context/hybrid";
import {RoomJoin} from 'context/room'
import Utility from "../../components/lib/utility";
import Api from "../../context/api";
import {
  setGlobalCtxAlertStatus, setGlobalCtxBroadcastAdminLayer, setGlobalCtxMessage,
  setGlobalCtxRtcInfoEmpty,
  setGlobalCtxUpdatePopup
} from "../../redux/actions/globalCtx";

// clipNo: string, globalState, dispatch, history, clipTable?: boolean, webview?: 'new' | '', isPush?: 'push' | '', type?: 'dal' | 'all'
// pc: clipNo, globalState, dispatch, history, clipTable
// mobile: context, data, webview, isPush, type
export const NewClipPlayerJoin = ({clipNo, globalState, dispatch, history, clipTable, webview, isPush, type='dal'}) => {
  const { rtcInfo, chatInfo } = globalState;
  if(isDesktop()) {
    if (rtcInfo !== null) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        content: `현재 ${rtcInfo.userType === UserType.HOST ? "방송" : "청취"} 중인 방송방이 있습니다. 클립을 재생하시겠습니까?`,
        callback: () => {
          const roomExit = async () => {
            const roomNo = rtcInfo!.getRoomNo();
            const { result } = await broadcastExit({ roomNo });
            if (result === "success") {
              rtcSessionClear();
              if (chatInfo && chatInfo !== null) {
                chatInfo.privateChannelDisconnect();
                if (rtcInfo !== null) rtcInfo!.stop();
                dispatch(setGlobalCtxRtcInfoEmpty());
              }
            }
          };
          if (rtcInfo !== null && rtcInfo !== undefined) {
            roomExit();
          }

          // history.push(`/clip/${clipNo }`);
          history.push({
            pathname: `/clip/${clipNo}`,
            state: "firstJoin",
          });
        },
      }));
    } else {
      if (!globalState.baseData.isLogin) {
        clipTable
          ? history.push({
            pathname: "/login",
            state: "/clip_recommend",
          })
          : history.push("/login");
      } else {
        // history.push(`/clip/${clipNo}`);
        history.push({
          pathname: `/clip/${clipNo}`,
          state: "firstJoin",
        });
      }
    }
  }else if(isHybrid()) {
    if(webview === 'new') {
      const successCallback = () => {
        const isDj = Utility.getCookie('isDj');
        if(isDj === 'true') {
          return dispatch(setGlobalCtxMessage({type:'alert',msg: '방송 중에 클립을 재생할 수 없습니다.'}));
        }else {
          const broadState = Utility.getCookie('listen_room_no')
          const isBroadPlaying = broadState != 'undefined' && broadState != 'null';
          const isClipPlaying = !!Utility.getCookie('clip-player-info');
          const playClip = () => {
            Api.postClipPlay({clipNo}).then(res => {
              let totalData = {
                playing: res.data,
                playListData: {
                  url: '',
                  isPush: false
                },
                isPlaying: isClipPlaying,
              }

              let getPlayListData = localStorage.getItem('clipPlayListInfo');
              let playListData = getPlayListData ? JSON.parse(getPlayListData) : '';
              if(!getPlayListData) {
                playListData = { slctType: 4, dateType: 0, page: 1, records: 100 } // 데이터 없을 경우 대비한 default (최근 들은 클립)
              }
              let url = ''
              let currentType = ''
              if (playListData) {
                Object.keys(playListData).forEach((key, idx) => {
                  if (idx === 0) {
                    url = url + `${key}=${playListData[key]}`
                  } else {
                    url = url + `&${key}=${playListData[key]}`
                  }
                })
                if (playListData.hasOwnProperty('listCnt')) {
                  if (playListData.hasOwnProperty('subjectType')) {
                    currentType = 'clip/main/top3/list?'
                  } else {
                    currentType = 'clip/main/pop/list?'
                  }
                } else if (playListData.hasOwnProperty('memNo')) {
                  if (playListData.hasOwnProperty('slctType')) {
                    currentType = 'clip/listen/list?'
                  } else {
                    currentType = 'clip/upload/list?'
                  }
                } else if (playListData.hasOwnProperty('recDate')) {
                  currentType = 'clip/recommend/list?'
                } else if (playListData.hasOwnProperty('rankType')) {
                  currentType = 'clip/rank?'
                } else {
                  currentType = 'clip/list?'
                }

                url = currentType + url
                totalData = {
                  ...totalData,
                  playListData: {url: encodeURIComponent(url), isPush: isPush === 'push'}
                }
              }

              Hybrid('ClipPlayerJoinFromWebViewPopup', totalData);
            })
          }

          if(isBroadPlaying) { // 청취중인 방송방이 있다
            if(isAndroid()) {

              dispatch(setGlobalCtxMessage({
                type: 'confirm',
                msg: '청취중인 방송방이 있습니다. 클립을 재생하시겠습니까?',
                callback: () => {
                  Hybrid('ExitRoom', '');
                  playClip();
                }
              }))
            }else {

              return dispatch(setGlobalCtxMessage({type: 'alert',msg: '방송중 또는 방송 청취중에\n클립을 재생할 수 없습니다.'}));
            }
          }else if(isClipPlaying) { // 청취중인 클립이 있다
            dispatch(setGlobalCtxMessage({
              type: 'confirm',
              msg: '청취중인 클립이 있습니다. 클립을 재생하시겠습니까?',
              callback: () => {
                playClip();
              }
            }))
          }else {
            playClip();
          }
        }
      }

      const failCallback = () => {
        return dispatch(setGlobalCtxMessage({type: 'alert',msg: '방송중 또는 방송 청취중에\n클립을 재생할 수 없습니다.'}));
      }

      const appVersionCheck = async () => {
        const targetVersion = isAndroid() ? '1.9.7' : '1.8.0';
        await Utility.compareAppVersion(targetVersion, successCallback, failCallback);
      }

      appVersionCheck();
    }else {
        ClipPlayFn(clipNo, type, globalState, dispatch, history);
    }
  }else {
    dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 2]}))
  }
}

export function ClipPlayerJoin(clipNo: string, globalState, dispatch, history, clipTable?: boolean) {
  const { rtcInfo, chatInfo } = globalState;
  if (rtcInfo !== null) {
    dispatch(setGlobalCtxAlertStatus({
      status: true,
      type: "confirm",
      content: `현재 ${rtcInfo.userType === UserType.HOST ? "방송" : "청취"} 중인 방송방이 있습니다. 클립을 재생하시겠습니까?`,
      callback: () => {
        const roomExit = async () => {
          const roomNo = rtcInfo!.getRoomNo();
          const { result } = await broadcastExit({ roomNo });
          if (result === "success") {
            rtcSessionClear();
            if (chatInfo && chatInfo !== null) {
              chatInfo.privateChannelDisconnect();
              if (rtcInfo !== null) rtcInfo!.stop();
              dispatch(setGlobalCtxRtcInfoEmpty());
            }
          }
        };
        if (rtcInfo !== null && rtcInfo !== undefined) {
          roomExit();
        }

        // history.push(`/clip/${clipNo }`);
        history.push({
          pathname: `/clip/${clipNo}`,
          state: "firstJoin",
        });
      },
    }));
  } else {
    if (!globalState.baseData.isLogin) {
      clipTable
          ? history.push({
            pathname: "/login",
            state: "/clip_recommend",
          })
          : history.push("/login");
    } else {
      // history.push(`/clip/${clipNo}`);
      history.push({
        pathname: `/clip/${clipNo}`,
        state: "firstJoin",
      });
    }
  }
}

/* 프로필 스와이퍼 영역에 LIVE 클릭 시 */
export const RoomValidateFromProfile = ({roomNo, memNo, history, dispatch, globalState, nickNm, webview}) => {
  if(!globalState.token.isLogin) {
    return history.push('/login')
  }

  if(isDesktop()) {
    if(roomNo) {
      return RoomValidateFromClipMemNo(roomNo,memNo, dispatch, globalState, history, nickNm);
    }
  }else if(isHybrid()){
    const roomEnterAction = () => {
      if(roomNo) {
        return RoomJoin({roomNo:roomNo, memNo:memNo,nickNm:nickNm,})
      }
    }

    /*if (webview === 'new') {
      if (Utility.getCookie('clip-player-info')) {
        return context.action.alert({msg: `클립 종료 후 청취 가능합니다.\n다시 시도해주세요.`})
      }

      if (Utility.getCookie('listen_room_no') === listenRoomNo) {
        return Hybrid('CloseLayerPopup', '');
      }
    }*/
    roomEnterAction();
  }else {
    dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 2]}))
  }
}

/* 청취자 따라가기 아이콘 클릭 시
* 메인페이지 랭킹영역, 랭킹페이지, 프로필페이지에서 사용
*  */
export async function RoomValidateFromListenerFollow({listenRoomNo, memNo, nickNm, history, globalState, dispatch}) {
  const ownerSel = await Api.roomOwnerSel(listenRoomNo, memNo);

  if(ownerSel.data.listenOpen === '0'){
    if(history.location.pathname.startsWith("/profile")){
      return;
    }
    history.push(`/profile/${memNo}`);
    return;
  }else if(ownerSel.data.listenOpen === '2'){
    return;
  }

  dispatch(setGlobalCtxAlertStatus({
    status: true,
    type: "confirm",
    content: `${nickNm}님이 참여중인 방송방에 입장하시겠습니까?`,
    callback: () => {
      RoomValidateFromClipMemNo(listenRoomNo, memNo, dispatch, globalState, history, nickNm, 'listener')
    },
  }));
}

export async function RoomValidateFromClipMemNo(roomNo, memNo, dispatch, globalState, history, nickNm?, listener?) {

  if (isDesktop()) {
    if (!globalState.baseData.isLogin) {
      return history.push("/login");
    }
    const {clipInfo, clipPlayer, rtcInfo} = globalState;
    if (clipInfo !== null) { // 클립 청취 중?
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "confirm",
        content: `현재 재생 중인 클립이 있습니다. \n 방송에 입장하시겠습니까?`,
        callback: () => {
          clipPlayer.clipExit();
          if (globalState.adminChecker === true && globalState.baseData.isLogin) {
            dispatch(setGlobalCtxBroadcastAdminLayer({
              ...globalState.broadcastAdminLayer,
              status: `broadcast`,
              roomNo: roomNo,
              memNo:memNo,
              nickNm: nickNm,
            }))
          } else {
            history.push(`/broadcast/${roomNo}`);
          }
        },
      }));
    } else {
      if (!globalState.adminChecker) { // 어드민?
        if (listener === "listener") {
          history.push(`/broadcast/${roomNo}`);
        } else {
          const listenRoomNo = rtcInfo && rtcInfo.roomInfo.roomNo;
          if (rtcInfo !== null && listenRoomNo !== roomNo) { // 방송 청취중이며 다른방 입장 시도

            dispatch(setGlobalCtxAlertStatus({
              status: true,
              type: "confirm",
              content: '현재 청취 중인 방송이 있습니다. \n 방송에 입장하시겠습니까?',
              callback: () => {
                history.push(`/broadcast/${roomNo}`);
              },
            }));
          } else {
            if(listenRoomNo !== roomNo) {
              dispatch(setGlobalCtxAlertStatus({
                status: true,
                type: "confirm",
                content: `${nickNm ? `${nickNm}님의 ` : ''}방송방에 입장하시겠습니까?`,
                callback: () => {
                  history.push(`/broadcast/${roomNo}`);
                },
              }));
            }else {
              history.push(`/broadcast/${roomNo}`);
            }
          }
        }
      } else {
        dispatch(setGlobalCtxBroadcastAdminLayer({
          ...globalState.broadcastAdminLayer,
          status: `broadcast`,
          roomNo: roomNo,
          memNo: memNo,
          nickNm: nickNm === "noName" ? "" : nickNm,
        }))
      }
    }
  } else if (isMobileWeb()) {
    if (globalState.baseData.isLogin) {
      return dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 2]}))
    } else {
      return history.push('/login');
    }
  } else {
    RoomJoin({roomNo: roomNo,  memNo:memNo, nickNm: nickNm === "noName" ? "" : nickNm, listener})
  }
}

export function RoomValidateFromClip(roomNo, dispatch, globalState, history, nickNm?, listener?) {
  return RoomValidateFromClipMemNo(roomNo,0, dispatch, globalState, history, nickNm, listener);
}
