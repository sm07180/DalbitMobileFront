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

// clipNo: string, gtx, history, clipTable?: boolean, webview?: 'new' | '', isPush?: 'push' | '', type?: 'dal' | 'all'
// pc: clipNo, gtx, history, clipTable
// mobile: context, data, webview, isPush, type
export const NewClipPlayerJoin = ({clipNo, gtx, history, clipTable, webview, isPush, type='dal'}) => {
  const { globalState, globalAction } = gtx;
  const { rtcInfo, chatInfo } = globalState;
  if(isDesktop()) {
    if (rtcInfo !== null) {
      globalAction.setAlertStatus!({
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
                globalAction.dispatchRtcInfo!({ type: "empty" });
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
      });
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
          return gtx.action.alert({msg: '방송 중에 클립을 재생할 수 없습니다.'});
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

              Hybrid('ClipPlayerJoinFromWebViewPopup', totalData);
            })
          }

          if(isBroadPlaying) { // 청취중인 방송방이 있다
            if(isAndroid()) {
              gtx.action.alert({
                type: 'confirm',
                msg: '청취중인 방송방이 있습니다. 클립을 재생하시겠습니까?',
                callback: () => {
                  Hybrid('ExitRoom', '');
                  playClip();
                }
              })
            }else {
              return gtx.action.alert({msg: '방송중 또는 방송 청취중에\n클립을 재생할 수 없습니다.'});
            }
          }else if(isClipPlaying) { // 청취중인 클립이 있다
            gtx.action.alert({
              type: 'confirm',
              msg: '청취중인 클립이 있습니다. 클립을 재생하시겠습니까?',
              callback: () => {
                playClip();
              }
            })
          }else {
            playClip();
          }
        }
      }

      const failCallback = () => {
        return gtx.action.alert({msg: '방송중 또는 방송 청취중에\n클립을 재생할 수 없습니다.'});
      }

      const appVersionCheck = async () => {
        const targetVersion = isAndroid() ? '1.9.7' : '1.8.0';
        await Utility.compareAppVersion(targetVersion, successCallback, failCallback);
      }

      appVersionCheck();
    }else {
        ClipPlayFn(clipNo, type, gtx, history);
    }
  }else {
    gtx.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
  }
}

export function ClipPlayerJoin(clipNo: string, gtx, history, clipTable?: boolean) {
  const { globalState, globalAction } = gtx;
  const { rtcInfo, chatInfo } = globalState;
  if (rtcInfo !== null) {
    globalAction.setAlertStatus!({
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
              globalAction.dispatchRtcInfo!({ type: "empty" });
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
    });
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

/* 방송 따라가기 있는 경우 */
export const RoomValidateFromProfile = ({roomNo, memNo, history, context, nickNm, listenRoomNo, webview}) => {
  if(!context.token.isLogin) {
    return history.push('/login')
  }

  if(isDesktop()) {
    if(roomNo) {
      return RoomValidateFromClipMemNo(roomNo,memNo, context, history, nickNm);
    }else if(listenRoomNo) {
      if(isNaN(listenRoomNo)) {
        return context.action.alert({
          type: 'alert',
          msg: `${nickNm} 님이 어딘가에서 청취중입니다. \n위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
        })
      }else {
        context.action.confirm({
          type: 'confirm',
          msg: `해당 청취자가 있는 방송으로 입장하시겠습니까?`,
          callback: () => {
            return RoomValidateFromClipMemNo(listenRoomNo,memNo, context, history, nickNm);
          }
        })
      }
    }
  }else if(isHybrid()){
    const roomEnterAction = () => {
      if(roomNo) {
        return RoomJoin({roomNo:roomNo, memNo:memNo,nickNm:nickNm,})
      }else {
        let alertMsg
        if (isNaN(listenRoomNo)) {
          alertMsg = `${nickNm} 님이 어딘가에서 청취중입니다. \n위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
          context.action.alert({
            type: 'alert',
            msg: alertMsg
          })
        } else {
          alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
          context.action.confirm({
            type: 'confirm',
            msg: alertMsg,
            callback: () => {
              return RoomJoin({roomNo: listenRoomNo, memNo:memNo,nickNm:nickNm,listener: 'listener'})
            }
          })
        }
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
    context.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
  }
}

export function RoomValidateFromClipMemNo(roomNo, memNo,gtx, history, nickNm?, listener?) {
  const {globalState, globalAction} = gtx;
  if (isDesktop()) {
    if (!globalState.baseData.isLogin) {
      return history.push("/login");
    }
    const {clipInfo, clipPlayer, rtcInfo} = globalState;
    if (clipInfo !== null) {
      globalAction.setAlertStatus!({
        status: true,
        type: "confirm",
        content: `현재 재생 중인 클립이 있습니다. \n 방송에 입장하시겠습니까?`,
        callback: () => {
          clipPlayer.clipExit();
          if (gtx.adminChecker === true && globalState.baseData.isLogin) {
            globalAction.setBroadcastAdminLayer!((prevState) => ({
              ...prevState,
              status: `broadcast`,
              roomNo: roomNo,
              memNo:memNo,
              nickNm: nickNm,
            }));
          } else {
            history.push(`/broadcast/${roomNo}`);
          }
        },
      });
    } else {
      if (gtx.adminChecker !== true && globalState.baseData.isLogin) {
        if (listener === "listener") {
          history.push(`/broadcast/${roomNo}`);
        } else {
          const listenRoomNo = rtcInfo && rtcInfo.roomInfo.roomNo;
          if (rtcInfo !== null && listenRoomNo !== roomNo) { // 방송 청취중이며 다른방 입장 시도
            globalAction.setAlertStatus &&
            globalAction.setAlertStatus({
              status: true,
              type: "confirm",
              content: '현재 청취 중인 방송이 있습니다. \n 방송에 입장하시겠습니까?',
              callback: () => {
                history.push(`/broadcast/${roomNo}`);
              },
            });
          } else {
            history.push(`/broadcast/${roomNo}`);
          }
        }
      } else {
        if (gtx.adminChecker === true && globalState.baseData.isLogin) {
          globalAction.setBroadcastAdminLayer!((prevState) => ({
            ...prevState,
            status: `broadcast`,
            roomNo: roomNo,
            memNo:memNo,
            nickNm: nickNm === "noName" ? "" : nickNm,
          }));
          //history.push(`/broadcast/${roomNo}`);
        }
      }
    }
  } else if (isMobileWeb()) {
    if (globalState.baseData.isLogin) {
      return gtx.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
    } else {
      return history.push('/login');
    }
  } else {
    RoomJoin({roomNo: roomNo,  memNo:memNo, nickNm: nickNm === "noName" ? "" : nickNm})
  }
}

export function RoomValidateFromClip(roomNo, gtx, history, nickNm?, listener?) {
  return RoomValidateFromClipMemNo(roomNo,0, gtx, history, nickNm, listener);
}
