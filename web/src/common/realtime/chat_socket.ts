import {CHAT_CONFIG, NODE_ENV} from "constant/define";

// constant
import {MediaType, MiniGameType, tabType} from "pages/broadcast/constant";
import {AuthType} from "constant";

import {getItems, postErrorSave, splash} from "common/api";
import {
  GiftActionFormat,
  NormalMsgFormat,
  ReqGood,
  SystemEventMsg,
  SystemStartMsg
} from "pages/broadcast/lib/chat_msg_format";

// static
import MicAlarmClose from "common/static/image/mic_alarm_close.png";
import {getCookie} from "common/utility/cookie";
import {rtcSessionClear} from "./rtc_socket";
import {moveVoteListStep, moveVoteStep, setVoteActive, setVoteCallback,} from "../../redux/actions/vote";
import {VoteCallbackPromisePropsType,} from "../../redux/types/voteType";

import {isDesktop} from "../../lib/agent";
import {
  setMailBoxChatListUpdate,
  setMailBoxImgSliderAddDeleteImg,
  setMailBoxIsMailBoxNew,
  setMailBoxPushChatInfo,
  setMailBoxUserCount
} from "../../redux/actions/mailBox";
import {
  setBroadcastCtxBoost,
  setBroadcastCtxChatAnimationStart,
  setBroadcastCtxChatCount,
  setBroadcastCtxChatFreeze,
  setBroadcastCtxChatLimit,
  setBroadcastCtxComboAnimationStart,
  setBroadcastCtxCommonBadgeList,
  setBroadcastCtxExtendTime,
  setBroadcastCtxMiniGameInfo,
  setBroadcastCtxMiniGameResult,
  setBroadcastCtxNoticeState,
  setBroadcastCtxRealTimeValueSetLikeFanRank,
  setBroadcastCtxRightTabType,
  setBroadcastCtxRoomInfoBoosterOn,
  setBroadcastCtxRoomInfoGrantRefresh,
  setBroadcastCtxRoomInfoIsListenerUpdate,
  setBroadcastCtxRoomInfoMoonCheck,
  setBroadcastCtxRoomInfoNewFanCnt,
  setBroadcastCtxRoomInfoRefresh,
  setBroadcastCtxRoomInfoSettingUpdate,
  setBroadcastCtxStoryState,
  setBroadcastCtxUserCount,
  setBroadcastCtxUserMemNo
} from "../../redux/actions/broadcastCtx";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxChatInfoInit,
  setGlobalCtxCurrentChatDataEmpty,
  setGlobalCtxGuestInfoEmpty,
  setGlobalCtxIsShowPlayer,
  setGlobalCtxMailBlockUser,
  setGlobalCtxMoveToAlert,
  setGlobalCtxRealtimeBroadStatus,
  setGlobalCtxRtcInfoEmpty,
  setGlobalCtxSetToastStatus,
  setGlobalCtxSplash,
  setGlobalCtxTooltipStatus
} from "../../redux/actions/globalCtx";

// lib
const socketClusterClient = require("socketcluster-client");

type chatUserInfoType = { authToken: string; memNo: string; locale: string; roomNo: string | null };

// 로그인한 유저 방송 설정 타입 (방장 or 유저)
export type userBroadcastSettingType = {
  djTtsSound?: boolean | null;
  djNormalSound?: boolean | null;
  djListenerIn?: boolean;
  djListenerOut?: boolean;
  listenerIn?: boolean;
  listenerOut?: boolean;
  liveBadgeView?: boolean;
  ttsSound?: boolean;
  normalSound?: boolean;
};

export class ChatSocketHandler {
  public socket: any;
  public chatUserInfo: chatUserInfoType;
  public roomOwner: boolean;
  public globalAction: any | null;
  public broadcastAction: any | null;
  public mailboxAction: any | null;
  public guestAction: any | null;
  public broadcastLayerAction: any | null;

  private publicChannelNo: string;
  public publicChannelHandle: any;
  public privateChannelNo: string;
  public privateChannelHandle: any;

  private splashData: any;
  private msgListWrapRef: any;
  private mailMsgListWrapRef: any;

  public rtcInfo: any;
  public guestInfo: any;
  public roomInfo: any;

  public history: any;

  public isConnect: any;
  public reConnect: any;

  public freeze: boolean | undefined;

  public chatCnt: number;

  public broadcastStateChange: any;
  public postErrorState : boolean

  public dispatch: any;
  public memNo: string = '';

  // 로그인한 유저의 방송 설정 (패킷 받을때 설정에 맞게 대응하기 위함)
  // set 하는 곳 : /mypage/broadcast/setting, /mypage/broadcast/setting/edit
  // 사용되는 기능 : tts, sound 아이템 on/off, 외 방송설정
  public userSettingObj: userBroadcastSettingType | null = null;

  public chatLimit: { cnt: number, timeArray: Array<number | null> } = {cnt: 0, timeArray: []};

  constructor(userInfo: chatUserInfoType, reConnectHandler?: any, dispatch?: any) {
    this.dispatch = dispatch;
    this.postErrorState =  (window as any)?.postErrorState;
    this.socket = null;
    this.chatUserInfo = userInfo;
    this.roomOwner = false;

    this.splashData = null;

    this.isConnect = false;
    this.broadcastAction = null;

    this.reConnect =
      reConnectHandler === undefined || reConnectHandler == null ?
        new ReConnectChat(this.chatUserInfo, this.dispatch) : reConnectHandler;

    this.publicChannelNo = "";
    this.publicChannelHandle = null;
    this.privateChannelNo = this.reConnect.privateChannelNo;
    this.privateChannelHandle = null;
    this.msgListWrapRef = this.reConnect.msgListWrapRef;
    // dividing MailBox
    this.mailMsgListWrapRef = this.reConnect.mailMsgListWrapRef;

    this.chatCnt = 0;

    if (reConnectHandler !== undefined && reConnectHandler !== null) {
      this.setGlobalAction(this.reConnect.globalAction);
      this.setBroadcastAction(this.reConnect.broadcastAction);
      this.setRoomOwner(this.reConnect.roomOwner);
      this.setMemNo(this.memNo);
    }

    // PC만 커넥트 연결
    if (isDesktop()) {
      this.connect((result: any) => {
        const { error } = result;
        if (error === false) {
          if (this.socket.getState() === "open") {
            this.connected();
          }
        }
      });
    }

    // if (this.splashData === null) {
    //   splash().then((resolve) => {
    //     this.setSplashData(resolve.data);
    //   });
    // }

    this.broadcastStateChange = {};
  }

  chatLimitCheck(setStateFn = (v) => {}){
    let chatLimit = false;
    const {timeArray} = this.chatLimit;
    const now = new Date().getTime();
    const recentTime = timeArray.concat([])[0];

    if(!recentTime || now - recentTime <= 3000) { // 가장 최근 채팅시간이 3초 이내
      this.chatLimit.cnt ++;
      this.chatLimit.timeArray.push(now);

      // 채팅 5회 발송
      if(this.chatLimit.timeArray.length >= 5) {
        this.chatLimit.timeArray = [];
      }
      if(this.chatLimit.cnt >= 5){
        chatLimit = true;
        this.chatLimit.cnt = 0;
      }

    } else if(now - recentTime > 3000) { // 첫번째 요소 시간차이 3초 초과
      this.chatLimit.cnt = 1;
      this.chatLimit.timeArray = [];
      this.chatLimit.timeArray.push(now);
    }

    if(chatLimit) {
      this.dispatch(setBroadcastCtxChatLimit(true));
      setTimeout(() => {
        this.dispatch(setBroadcastCtxChatLimit(false));
      }, 3000);

      this.dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "채팅 도배로 인해 3초간 채팅 이용이 제한됩니다.",
      }));

      try {
        // 간헐적으로 채팅 내용이 남아있어서 초기화
        setStateFn("");
      } catch (e) {
        console.warn(e);
      }

      /* this.addMsgElement(
         SystemStartMsg({
           type: "div",
           text: '채팅 도배로 인해 3초간 채팅 이용이 제한됩니다.',
           className: "system-start-msg",
         }));
       */
    }

    return chatLimit;
  }

  setMemNo(memNo){
    this.memNo = memNo;
  }

  setBroadcastStateChange(key: string, setStateFn: Function){
    this.broadcastStateChange = {...this.broadcastStateChange, [key] : setStateFn};
  }

  setBroadcastStateClear(keyName){
    if(this.broadcastStateChange[keyName]) {
      delete this.broadcastStateChange[keyName];
    }
  }
  /*
   선물시 누적 선물 달 (roomInfo.sendDalCnt)에 저장
   방 재입장시 API: "/broad/vw/info", "/broad/vw/join"에서 roomInfo.sendDalCnt 값 세팅
  */
  addRoomInfoDalCnt(addDal: number){
    if(typeof this.roomInfo?.sendDalCnt === 'number'){
      this.roomInfo.sendDalCnt += addDal;
    }
  }

  setUserSettingObj(obj: userBroadcastSettingType) {
    this.userSettingObj = obj;
  }

  setUserInfo(userInfo: chatUserInfoType) {
    this.chatUserInfo = userInfo;
    this.reConnect.setUserInfo(this.chatUserInfo);
  }

  setGlobalAction(action: any) {
    this.globalAction = action;
    this.reConnect.setGlobalAction(this.globalAction);
  }

  setBroadcastAction(action: any) {
    this.broadcastAction = action;
    this.reConnect.setBroadcastAction(this.broadcastAction);
  }

  setRoomInfo(action: any) {
    this.roomInfo = action;
  }

  setGuestAction(action: any) {
    this.guestAction = action;
  }

  setMailboxAction(action: any) {
    this.mailboxAction = action;
  }

  setBroadcastLayerAction(action: any) {
    this.broadcastLayerAction = action;
  }

  setSplashData(data: any) {
    this.splashData = data;
  }

  setMsgListWrapRef(ref: any) {
    this.msgListWrapRef = ref;
    this.reConnect.setMsgListWrapRef(this.msgListWrapRef);
  }
  // mailBox dividing
  setMailMsgListWrapRef(ref: any) {
    this.mailMsgListWrapRef = ref;
    this.reConnect.setMailMsgListWrapRef(this.mailMsgListWrapRef);
  }

  setRoomNo(roomNo: string) {
    this.chatUserInfo["roomNo"] = roomNo;
    this.reConnect.setUserInfo(this.chatUserInfo);
  }

  setRoomOwner(owner: boolean) {
    this.roomOwner = owner;
    this.reConnect.setRoomOwner(this.roomOwner);
  }

  setRtcInfo(rtcInfo: any) {
    this.rtcInfo = rtcInfo;
  }

  setGuestInfo(guestInfo: any) {
    this.guestInfo = guestInfo;
  }

  setDefaultData(data: { history: any }) {
    const { history } = data;
    this.history = history;
  }

  setChatFreeze(freeze: boolean) {
    this.freeze = freeze;
  }

  addMsgElement(msgElem: any) {
    try { //에러 나서 해둠

    this.chatCnt = this.chatCnt + 1;
    if (this.msgListWrapRef !== null) {
      const msgListWrapElem = this.msgListWrapRef.current;
      if (msgListWrapElem && msgElem !== null) {
        if (msgListWrapElem.children.length === 2000) {
          msgListWrapElem.removeChild(msgListWrapElem.children[0]);
        }

        if (this.chatCnt === 2000) {
          this.chatCnt = 0;
        }

        msgListWrapElem.appendChild(msgElem);
        this.dispatch(setBroadcastCtxChatCount(this.chatCnt));
      }
    }
    }catch(e){
      console.log('error catch', e);
    }
  }

  connect(callback: (result: any) => void) {
    const options = {
      path: "/socketcluster/?data=" + JSON.stringify(this.chatUserInfo),
      port: CHAT_CONFIG.socketServerPort,
      hostname: CHAT_CONFIG.socketServerHost,
      autoConnect: true,
      secure: CHAT_CONFIG.socketServerSecure,
      rejectUnauthorized: false,
      connectTimeout: 5000, //milliseconds
      ackTimeout: 500, //milliseconds
      channelPrefix: null,
      disconnectOnUnload: true, //Only necessary during debug if using a self-signed certificate
      multiplex: true,
      autoReconnect: false,
      autoReconnectOptions: {
        initialDelay: 1000, //milliseconds
        randomness: 10000, //milliseconds
        multiplier: 1.5, //decimal
        maxDelay: 60000, //milliseconds
      },
      authEngine: null,
      codecEngine: null,
      subscriptionRetryOptions: {},
    };

    this.disconnected();
    this.isConnect = true;
    this.socket = socketClusterClient.connect(options);
    this.socket.on(CHAT_CONFIG.event.socket.CONNECT, (msg: string) => {
      (window as any).postErrorState = false;
      this.postErrorState = false;
      callback({ error: false, cmd: CHAT_CONFIG.event.socket.CONNECT, msg: msg });
    });
    this.socket.on(CHAT_CONFIG.event.socket.ERROR, (errorCode: number) => {
      this.disconnected(true);
      const authToken = getCookie("authToken");
      if (authToken) {
        this.setUserInfo({
          ...this.chatUserInfo,
          authToken,
        });
      }

      this.reConnect.reConnect();
      if(!this.postErrorState){
        this.postErrorState = true;
        (window as any).postErrorState = true;
        postErrorSave({
          os: "pc",
          appVer: "pc",
          dataType: NODE_ENV,
          commandType: window.location.pathname,
          desc: "CHAT_SOCKET_ERROR" + errorCode,
        });
      }
    });
    /*this.socket.on(CHAT_CONFIG.event.socket.CLOSE, (errorCode: number) => {
      this.disconnected(true);
      // this.reConnect.reConnect();
    });*/
    this.socket.on(CHAT_CONFIG.event.socket.DISCONNECT, (errorCode: number) => {
      this.disconnected(true);
      // this.reConnect.reConnect();
    });
  }

  destroy(status: { isdestroySocket: boolean; destroyChannelName?: string; isReConnect?: any }) {
    const { isdestroySocket, destroyChannelName, isReConnect } = status;

    const channeldestroy = (channelName: string) => {
      if (this.isPublicChannel(channelName)) {
        if (this.publicChannelHandle !== null && this.publicChannelHandle) {
          this.publicChannelHandle.unsubscribe();
          this.publicChannelHandle.destroy();
          this.publicChannelHandle = null;
          this.publicChannelNo = "";
        }
      } else {
        if (this.privateChannelHandle !== null && this.privateChannelHandle) {
          this.privateChannelHandle.unsubscribe();
          this.privateChannelHandle.destroy();
          this.privateChannelHandle = null;
          this.privateChannelNo = "";
          if (isReConnect === false) {
            this.reConnect.setPrivateChannelNo(this.privateChannelNo);
          }

          this.dispatch(setGlobalCtxCurrentChatDataEmpty());
        }
      }
    };

    if (destroyChannelName === "ALL") {
      channeldestroy(this.publicChannelNo);
      channeldestroy(this.privateChannelNo);
    } else if (destroyChannelName !== undefined) {
      channeldestroy(destroyChannelName);
    }

    if (isdestroySocket === true) {
      if (this.socket !== null) {
        this.socket.destroy();
        this.socket = null;
      }
    }
  }

  connected() {
    this.reConnect.setDefault();

    this.binding(this.getPublicChannel(), (channelName: string) => {
      // fail
      if (channelName === "") {
      }
      if (this.privateChannelNo != "") {
        this.binding(this.getPrivateChannel(), (channelName: string) => {});
      }
    });
  }

  disconnected(isReConnect?: any) {
    isReConnect = isReConnect === undefined || isReConnect == null ? true : isReConnect;
    this.destroy({ isdestroySocket: true, destroyChannelName: "ALL", isReConnect: isReConnect });
  }

  privateChannelDisconnect() {
    this.dispatch(setGlobalCtxIsShowPlayer(false));

    if (this.privateChannelHandle) {
      //console.log(`@@chat socket ...`, this.privateChannelHandle)
      this.privateChannelHandle.unsubscribe();
      this.privateChannelHandle.destroy();
      this.privateChannelHandle = null;
      this.privateChannelNo = "";
      this.reConnect.setPrivateChannelNo(this.privateChannelNo);

      this.dispatch(setGlobalCtxCurrentChatDataEmpty());
    }
  }

  binding(channelName: string, callback: (name: string) => void) {
    //console.log(`chat_socket channelName`, channelName)
    let isConnected: boolean = false;
    let scState: string = "";

    try {
      scState = this.socket.getState() || "nothing"; //connecting, open, closed
      if (scState === "open") {
        isConnected = true;
      }
    } catch (e) {
      scState = "nothing";
    }

    if (isConnected === false) {
      // fail callback
      callback("");
    } else {
      if (this.isPublicChannel(channelName)) {
        //채널 바인딩 (전역채널)
        this.publicChannelNo = channelName;
        this.publicChannelHandle = this.channelBinding(this.publicChannelHandle, channelName);
        this.publicChannelHandle.watch((data: any) => {
          const { cmd } = data;
          switch (cmd) {
            case "reqSocketPush": {
              const { reqSocketPush } = data;
              this.dispatch(setGlobalCtxRealtimeBroadStatus({
                status: true,
                type: "broadAlarm",
                message: `${reqSocketPush.msg}`,
                roomNo: `${reqSocketPush.roomNo}`,
                profImg: `${reqSocketPush.profImg.thumb62x62}`,
              }));
              return null;
            }
            case "mailBoxPubChat": {
              const { mailBoxPubChat } = data;
              this.dispatch(setMailBoxIsMailBoxNew(true));
              this.dispatch(setMailBoxChatListUpdate(mailBoxPubChat));
              this.dispatch(setGlobalCtxRealtimeBroadStatus({
                status: true,
                type: "MailAlarm",
                nickNm: `${mailBoxPubChat.nickNm}`,
                message: `${mailBoxPubChat.msg}`,
                roomNo: `${mailBoxPubChat.chatNo}`,
                profImg: `${mailBoxPubChat.profImg.thumb62x62}`,
                time: `${mailBoxPubChat.sendDt}`,
                memNo: `${mailBoxPubChat.memNo}`,
              }));
              return null;
            }
            case "reqMemBlack": {
              const { reqMemBlack } = data;
              const { memNo, blackMemNo } = reqMemBlack;
              this.dispatch(setGlobalCtxMailBlockUser({
                memNo: memNo,
                blackMemNo: blackMemNo,
              }))
              return null;
            }
            case "reqChangeItem": {
              getItems().then((resolve) => {
                this.dispatch(setGlobalCtxSplash({
                  ...this.splashData,
                  items: [...resolve.data.items],
                }))
              });
              break;
            }
            case "reqForceLogout": // 회원 정지/탈퇴 시 강제 로그아웃 처리
              window.location.reload();
              break;
          }
        });
      } else {
        //채널 바인딩 (지역채널)
        this.privateChannelNo = channelName;
        this.reConnect.setPrivateChannelNo(this.privateChannelNo);
        this.privateChannelHandle = this.channelBinding(this.privateChannelHandle, channelName);

        // 나는 모르겠다. 이게 왜 undefined가 걸리는지.
        this.privateChannelHandle.watch((data: any) => {
          if (this.splashData === null) {
            splash().then((resolve) => {
              this.setSplashData(resolve.data);
            });
          }
          //메시지 :메시지방에 룸넘버는 1로시작 그외 방송방은 9
          if (channelName.startsWith("1")) {
            if (this.mailMsgListWrapRef !== null) {
              const { cmd, mailBoxChat, reqMailBoxImageChatDelete } = data;
              switch (cmd) {
                case "mailBoxConnect": {
                  const { count } = data;
                  const { userCount, maxUserCount } = count;
                  if (userCount > 1) {
                    this.dispatch(setMailBoxUserCount(true));
                  }
                  return null;
                }
                case "mailBoxChat": {
                  this.dispatch(setMailBoxPushChatInfo({...mailBoxChat}));
                  return null;
                }
                case "reqMailBoxImageChatDelete": {
                  this.dispatch(setMailBoxImgSliderAddDeleteImg(reqMailBoxImageChatDelete.msgIdx));
                  return null;
                }
              }
            }
          } else {
            // 방송방
            if (this.msgListWrapRef !== null) {
              const msgListWrapElem = this.msgListWrapRef.current;
              const chatMsgElement = (data: any) => {
                const { cmd } = data;
                switch (cmd) {
                  case "time": {
                    return null;
                  }
                  case "chatEnd": {
                    if (this.chatUserInfo["roomNo"] !== null) {
                      this.destroy({ isdestroySocket: false, destroyChannelName: this.chatUserInfo["roomNo"] });
                    }
                    if (
                      this.rtcInfo &&
                      this.rtcInfo !== null &&
                      this.history
                    ) {
                      this.privateChannelDisconnect();
                      this.rtcInfo.stop && this.rtcInfo.stop();
                      if (this.guestInfo && this.guestInfo !== null) {
                        this.guestInfo.stop && this.guestInfo.stop();
                        this.dispatch(setGlobalCtxGuestInfoEmpty());
                      }

                      this.dispatch(setGlobalCtxRtcInfoEmpty());

                      if (
                        this.guestAction &&
                        this.guestAction.dispatchStatus &&
                        this.guestAction.setNewApplyGuest &&
                        this.guestAction.setGuestConnectStatus
                      ) {
                        this.guestAction.dispatchStatus({ type: "INIT" });
                        this.guestAction.setNewApplyGuest(false);
                        this.guestAction.setGuestConnectStatus(false);
                      }

                      this.dispatch(setGlobalCtxIsShowPlayer(false));
                      rtcSessionClear();

                      if (this.history.location.pathname.match("/broadcast/")) {
                        if (this.broadcastLayerAction && this.broadcastLayerAction.dispatchDimLayer) {
                          this.broadcastLayerAction.dispatchDimLayer({
                            type: "BROAD_END",
                            others: {
                              roomOwner: this.roomOwner,
                              roomNo: this.chatUserInfo["roomNo"],
                            },
                          });
                        }
                      } else {
                        setTimeout(() => {
                          this.dispatch(setGlobalCtxAlertStatus({
                            status: true,
                            content: "방송이 종료되었습니다.",
                          }));
                        }, 600);
                      }
                      // setTimeout(() => {
                      //   // this.history.push("/");
                      // });
                    }
                    return null;
                  }

                  case "chatEndRed": {
                    if (this.chatUserInfo["roomNo"] !== null) {
                      this.destroy({ isdestroySocket: false, destroyChannelName: this.chatUserInfo["roomNo"] });
                    }
                    if (
                      this.rtcInfo !== null &&
                      this.history
                    ) {
                      this.privateChannelDisconnect();
                      this.rtcInfo.stop && this.rtcInfo.stop();
                      this.dispatch(setGlobalCtxRtcInfoEmpty());
                      this.dispatch(setGlobalCtxIsShowPlayer(false));
                      rtcSessionClear();

                      if (this.history.location.pathname.match("/broadcast/")) {
                        if (this.broadcastLayerAction && this.broadcastLayerAction.dispatchDimLayer) {
                          this.broadcastLayerAction.dispatchDimLayer({
                            type: "BROAD_END",
                            others: {
                              roomOwner: this.roomOwner,
                              roomNo: this.chatUserInfo["roomNo"],
                            },
                          });
                        }
                      } else {
                        setTimeout(() => {
                          this.dispatch(setGlobalCtxAlertStatus({
                            status: true,
                            content: "방송이 종료되었습니다.",
                          }));
                        }, 600);
                      }

                      // setTimeout(() => {
                      //   this.dispatch(setGlobalCtxAlertStatus({
                      //     status: true,
                      //     content: "방송이 종료되었습니다.",
                      //   });
                      // }, 600);
                    }

                    return null;
                  }
                  case "chatEndMsg": {
                    const noticeDisplay = document.getElementById("broadcast-notice-display");
                    if (noticeDisplay) {
                      noticeDisplay.style.display = "block";

                      const elem = document.createElement("div");

                      elem.textContent = data.recvMsg.msg;

                      const closeImg = document.createElement("img");

                      closeImg.className = "close-img";
                      closeImg.src = MicAlarmClose;

                      elem.append(closeImg);

                      noticeDisplay.appendChild(elem);
                      closeImg.addEventListener("click", () => {
                        noticeDisplay.removeChild(elem);
                        // noticeDisplay.style.display = "none";
                      });
                      setTimeout(() => {
                        noticeDisplay.removeChild(elem);
                        // noticeDisplay.style.display = "none";
                      }, 4000);
                    }

                    if (this.roomOwner === true) {
                      this.dispatch(setBroadcastCtxExtendTime(true));
                    }

                    return null;
                  }
                  case "chat": {
                    const { user, recvMsg } = data;
                    const { msgBorder } = user;

                    const { msg, type } = recvMsg;
                    if (type === "system") {
                      this.dispatch(setGlobalCtxTooltipStatus({
                        status: true,
                        message: msg,
                        type: "system",
                      }));


                      setTimeout(() => {
                        this.dispatch(setGlobalCtxTooltipStatus({
                          status: false,
                          message: "",
                          style: {},
                          type: "",
                        }));
                      }, 4000);

                      return null;
                    } else {
                      return NormalMsgFormat({
                        type: "div",
                        className: "msg-wrap",
                        children: [
                          this.setChatUserImg(user),
                          {
                            type: "div",
                            className: "nickname-msg-wrap",

                            children: [
                              this.roomInfo?.mediaType === MediaType.VIDEO &&
                              msgBorder &&
                              msgBorder.msgBorderSrtColor &&
                              msgBorder.msgBorderEndColor
                                ? {
                                    type: "div",
                                    className: "nickname-wrap video",
                                    children: this.setChatUser(user),
                                  }
                                : {
                                    type: "div",
                                    className: "nickname-wrap",
                                    children: this.setChatUser(user),
                                  },

                              {
                                type: "div",
                                text: msg,
                                style:
                                  msgBorder && msgBorder.msgBorderSrtColor && msgBorder.msgBorderEndColor
                                    ? {
                                        backgroundImage: `url('data:image/svg+xml;utf8,<svg   xmlns="http://www.w3.org/2000/svg" ><defs><linearGradient id="Gradient" x1="0" x2="100" y1="0" y2="0" gradientTransform="rotate(2)" gradientUnits="userSpaceOnUse"><stop stop-color="${msgBorder.msgBorderSrtColor.replaceAll(
                                          "#",
                                          "%23"
                                        )}" offset="0.08"/><stop stop-color="${msgBorder.msgBorderEndColor.replaceAll(
                                          "#",
                                          "%23"
                                        )}" offset="1.02"/></linearGradient></defs><rect x="2" y="2" width="100%" height="100%" style="height:calc(100% - 4px);width:calc(100% - 4px)" rx="10" ry="10" stroke-width="2" fill="transparent" stroke="url(%23Gradient)"/></svg>')`,
                                        padding: `8px 10px`,
                                      }
                                    : {},
                                className: "msg",
                              },
                            ],
                          },
                        ],
                      });
                    }

                    // }
                  }
                  case "reqGiftImg": {
                    let { items, levelUp, boost, story } = this.splashData;
                    // items : 시그니처 아이템 추가
                    items = items.concat(this.roomInfo?.signatureItem?.items || []);

                    const { user, reqGiftImg, recvMsg } = data;
                    const { nk, image, memNo, auth, fan } = user;
                    const {
                      itemType,
                      itemImg,
                      itemNm,
                      itemCnt,
                      itemNo,
                      authName,
                      nickNm,
                      dalCnt,
                      isSecret,
                      repeatCnt,
                      storyText
                    } = reqGiftImg;
                    const count = itemCnt;
                    const userNickname = nk;
                    const userImage = image;
                    const isDirect = itemType === "direct";
                    const lottieData = (() => {
                      if (itemType === "items" || itemType === "direct") {
                        return items.find((item: any) => item.itemNo === itemNo);
                      } else if (itemType === "levelUp") {
                        return levelUp.find((item: any) => item.itemNo === itemNo);
                      } else if (itemType === "boost") {
                        return boost.find((item: any) => item.itemNo === itemNo);
                      } else if(itemType === 'story'){
                        return story.find((item: any)=> item.itemNo === itemNo);
                      }

                    })();
                    let isTTSItem = typeof reqGiftImg.ttsText !== 'undefined' && reqGiftImg.ttsText !== "";
                    let isSoundItem = true;

                    const ttsItemInfo = {
                      showAlarm: true,
                      isPlaying: true,
                      actorId: reqGiftImg.actorId,
                      nickNm: userNickname,
                      ttsText: reqGiftImg.ttsText,
                      fileUrl: reqGiftImg.ttsData ? reqGiftImg.ttsData.fileURL : "",
                      duration: reqGiftImg.ttsData ? reqGiftImg.ttsData.duration * 1000 : 0,
                    }

                    // 방장 tts, sound 아이템 설정에 따라서 토스트 메시지 출력
                    // 청취자인 경우 본인의 설정(tts, sound)이 true일때만 토스트 문구 출력 조건
                    // 방장의 조건에 따른 출력하기 조건
                    if(this.roomOwner || ( (!this.roomOwner && lottieData?.ttsUseYn === 'y' && isTTSItem && this.userSettingObj?.ttsSound) ||
                        (!this.roomOwner && lottieData?.soundFileUrl && this.userSettingObj?.normalSound) )) {
                      if ((lottieData?.ttsUseYn === 'y' && isTTSItem && this.roomInfo?.djTtsSound === false) ||
                          (lottieData?.soundFileUrl && this.roomInfo?.djNormalSound === false)) {
                        this.dispatch(setGlobalCtxSetToastStatus({
                          status: true,
                          message: 'DJ설정으로 소리가 나오지 않습니다'
                        }));
                      }
                    }
                    // tts : 방장설정이 off이면 재생 x, on이면 청취자 개인설정에 따라 재생
                    if ( ((!this.roomOwner && this.userSettingObj?.ttsSound === false) || this.roomInfo?.djTtsSound === false ) || (this.roomOwner && this.userSettingObj?.djTtsSound === false) ){
                      isTTSItem = false;
                    }
                    // sound : 방장설정이 off이면 재생 x, on이면 청취자 개인설정에 따라 재생
                    if( ((!this.roomOwner && this.userSettingObj?.normalSound === false) || this.roomInfo?.djNormalSound === false ) || (this.roomOwner && this.userSettingObj?.djNormalSound === false) ) {
                      isSoundItem = false;
                    }
                    if(memNo === this.chatUserInfo.memNo && isTTSItem && (reqGiftImg.ttsData && reqGiftImg.ttsData.error)) {
                      console.log('chat_socket : ', reqGiftImg.ttsData.error);
                      this.dispatch(setGlobalCtxSetToastStatus({
                        status: true,
                        message: "TTS 목소리 재생을 실패했습니다.",
                      }));
                    }

                    if (lottieData && isSecret === false) {
                      const { lottieUrl, duration, width, height, location, type, webpUrl, soundFileUrl } = lottieData;
                      const isCombo = type === "sticker";

                      if (isCombo) {
                        this.dispatch(setBroadcastCtxComboAnimationStart({
                          url: webpUrl || lottieUrl,
                          repeatCnt,
                          duration: duration * 1000,
                          itemNo,
                          memNo,
                          userImage,
                          userNickname,
                        }))
                      } else {
                        // 사연 플러스 아이템 추가
                        this.dispatch(setBroadcastCtxChatAnimationStart({
                          url: lottieUrl,
                          width,
                          height,
                          duration: duration * 1000 * repeatCnt,
                          location : storyText? 'center': location,
                          soundOffLocationFlag: soundFileUrl? (!isSoundItem? 'soundOffLocation': '') : '',
                          count,
                          isCombo,
                          userNickname,
                          userImage,
                          webpUrl,
                          soundFileUrl : isSoundItem? soundFileUrl : '',
                          itemNo,
                          memNo,
                          ttsItemInfo,
                          isTTSItem,
                          storyText
                          // repeatCnt,
                        }))
                      }
                    }

                    if (itemType === "levelUp") {
                      return null;
                    }

                    const giftText = (() => {
                      if (itemType === "boost") {
                        if (count > 1) {
                          return `부스터 X ${count}개를 `;
                        } else {
                          return `부스터를 `;
                        }
                      }
                      if (isDirect) {
                        return `달 ${dalCnt}개를`;
                      }

                      /*if (auth === AuthType.LISTENER) {
                        if (itemCnt > 1) {
                          return `${itemNm} X ${itemCnt}개를 `;
                        }
                        return `${itemNm}을(를) `;
                      } else if (auth === AuthType.DJ || auth === AuthType.GUEST) {
                        if (itemCnt > 1) {
                          return `${itemNm} X ${itemCnt}개 (달 ${dalCnt}개)를 `;
                        }
                        return `${itemNm}(달 ${dalCnt}개)을(를) `;
                      }*/
                      return `${itemNm} X ${itemCnt}개 (달 ${dalCnt}개)를 `;

                      //return "";
                    })();

                    if ((itemType === "items" || itemType === "direct") && isSecret) {
                      return ReqGood({
                        type: "div",
                        text: recvMsg.msg,
                        className: "req-good-likes",
                      });
                    } else {
                      return GiftActionFormat({
                        type: "div",
                        className: "msg-wrap",
                        children: [
                          this.setChatUserImg(user),
                          {
                            type: "div",
                            className: "nickname-msg-wrap",
                            children: [
                              this.roomInfo?.mediaType === MediaType.VIDEO
                                ? // this.rtcInfo?.getMediaType()
                                  {
                                    type: "span",
                                  }
                                : {
                                    type: "div",
                                    className: "nickname-wrap",
                                    children: this.setChatUser(user),
                                  },
                              {
                                type: "div",
                                className: `${reqGiftImg.auth === 3 ? "msg-image" : "msg-image guest"}`,
                                children: [
                                  {
                                    type: "div",
                                    className: "icon-image",
                                    style: { backgroundImage: `url(${itemImg})` },
                                    event: [
                                      {
                                        type: "click",
                                        callback: (e) => {
                                          e.stopPropagation();
                                          if (
                                            this.broadcastLayerAction &&
                                            this.broadcastLayerAction !== null &&
                                            this.broadcastLayerAction.dispatchLayer
                                          ) {
                                            if (this.roomOwner === false) {
                                              if (itemType === "items") {
                                                this.broadcastLayerAction.dispatchLayer({
                                                  type: "GIFT",
                                                  others: {
                                                    itemNo: data.reqGiftImg.itemNo,
                                                    cnt: data.reqGiftImg.itemCnt,
                                                  },
                                                });
                                              } else if (itemType === "boost") {
                                                this.broadcastLayerAction.dispatchLayer({
                                                  type: "BOOST",
                                                });
                                              }
                                            }
                                          }

                                          // if (this.broadcastAction !== null && this.broadcastAction.setRightTabType) {
                                          //   if (this.roomOwner === false) {
                                          //     if (itemType === "items") {
                                          //       this.broadcastLayerAction

                                          //       this.broadcastAction.setGiftState &&
                                          //         this.broadcastAction.setGiftState({
                                          //           display: true,
                                          //           itemNo: data.reqGiftImg.itemNo,
                                          //           cnt: data.reqGiftImg.itemCnt,
                                          //         });
                                          //     } else if (itemType === "boost") {
                                          //       this.broadcastAction.setRightTabType(tabType.BOOST);
                                          //     }
                                          //   }
                                          // }
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    type: "div",
                                    className: `${reqGiftImg.auth === 3 ? "text" : "guest-text"}`,
                                    children: [
                                      {
                                        type: "span",
                                        className: "bold",
                                        text: `${reqGiftImg.auth === 3 ? `${userNickname} 님이 ` : `게스트 ${nickNm} 님에게 `}`,
                                      },
                                      // {
                                      //   type: "span",
                                      //   className: "bold",
                                      //   text: `님이 `,
                                      // },
                                      {
                                        type: "span",
                                        className: "bold",
                                        text: giftText,
                                      },
                                      {
                                        type: "span",
                                        className: "",
                                        text: "선물하였습니다.",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      });
                    }
                  }

                  case "enterAni": {
                    const { user } = data;
                    const { commonBadgeList, nk, image, enterAniInfo } = user;
                    const enterInfo = commonBadgeList[0];
                    const { startColor, endColor } = enterInfo;
                    const { enterAni, enterBgImg } = enterAniInfo;
                    if(enterAni.indexOf('NULL') > -1){
                      return null;
                    }
                    this.dispatch(setBroadcastCtxChatAnimationStart({
                      url: "",
                      width: 300,
                      height: 200,
                      duration: 6 * 1000,
                      location: "topRight",
                      count: 1,
                      isCombo: false,
                      userNickname: nk,
                      userImage: image,
                      webpUrl: enterAni,
                      backgroundImg: enterBgImg,
                      backgroundColor: [startColor, endColor],
                      soundFileUrl: "",
                      ttsItemInfo: {},
                      isTTSItem: false,
                    }))

                    return null;
                  }

                  case "reqGiftDal": {
                    const { user, reqGiftDal } = data;
                    const { nk, image, memNo, auth, fan } = user;
                    const { itemCnt } = reqGiftDal;
                    return null;
                  }
                  case "reqBooster": {
                    this.dispatch(setBroadcastCtxRoomInfoBoosterOn())
                    this.dispatch(setBroadcastCtxBoost(true));
                    return null;
                  }
                  case "reqBoosterEnd": {
                    this.dispatch(setBroadcastCtxRoomInfoBoosterOn())
                    this.dispatch(setBroadcastCtxBoost(false));
                    return null;
                  }
                  case "reqBcStart": {
                    const { recvMsg } = data;
                    const { msg } = recvMsg;
                    return SystemStartMsg({
                      type: "div",
                      text: msg,
                      className: "system-start-msg",
                    });
                  }
                  case "reqEventMsg": {
                    const {recvMsg} = data;
                    const message = JSON.parse(recvMsg.msg);
                    const msg = {
                      title:message.title,
                      content:message.content.replace("{nickName}", `<span>${message.nickName}</span>`),
                      linkTitle:message.linkTitle,
                      linkUrl:message.linkUrl
                    }
                    return SystemEventMsg({
                      type: "div",
                      className: "common-event-msg",
                      children: [
                        {
                          type: "div",
                          className: "content",
                          children: [
                            {
                              type: "div",
                              className: "title",
                              text: msg.title,
                            },
                            {
                              type: "div",
                              className:"text",
                              text:msg.content,
                            }
                          ]
                        },
                        {
                          type: "button",
                          className: "button",
                          text: msg.linkTitle,
                          event: [
                            {
                              type: "click",
                              callback: () => {
                                this.history.push(msg.linkUrl)
                              },
                            }
                            ]
                        }
                      ]
                    });
                  }
                  case "reqChangeCount": {
                    const { reqChangeCount } = data;
                    const { fanRank, likes, rank, newFanCnt } = reqChangeCount;
                    this.dispatch(setBroadcastCtxRealTimeValueSetLikeFanRank({ fanRank, likes, rank, newFanCnt }))
                    this.dispatch(setBroadcastCtxRoomInfoNewFanCnt(newFanCnt));
                    return null;
                  }
                  //kjo 방송방 수정하기 수정
                  case "reqRoomChangeInfo": {
                    const { reqRoomChangeInfo } = data;
                    this.dispatch(setBroadcastCtxRoomInfoSettingUpdate(reqRoomChangeInfo));
                    return null;
                  }
                  case "reqGoodFirst": {
                    return null;
                  }
                  case "reqGood": {
                    const { recvMsg, reqGood } = data;
                    const { msg } = recvMsg;

                    const { particles, loveGood } = this.splashData;

                    const particleIdx = Math.floor(Math.random() * 10) % particles.length;
                    const lottieData = reqGood.goodRank === 0 ? particles[particleIdx] : loveGood[reqGood.goodRank - 1];

                    const { webpUrl, duration, width, height, location, type } = lottieData;

                    this.dispatch(setBroadcastCtxChatAnimationStart({
                      webpUrl: webpUrl,
                      url: "",
                      width,
                      height,
                      duration: duration * 1000,
                      location,
                      soundFileUrl: "",
                      count: 1,
                      isCombo: false,
                      userNickname: "'",
                      userImage: "",
                      backgroundImg: "",
                      ttsItemInfo: {},
                      isTTSItem: false,
                    }))

                    return ReqGood({
                      type: "div",
                      text: msg,
                      className: "req-good-likes",
                    });
                  }

                  case "reqStory": {
                    this.dispatch(setBroadcastCtxStoryState(1));
                  }
                  case "reqGrant": {
                    const { recvMsg } = data;
                    this.dispatch(setBroadcastCtxRoomInfoGrantRefresh({
                      auth: parseInt(recvMsg.msg),
                      memNo: data.chat.memNo,
                    }));
                    this.dispatch(setBroadcastCtxRoomInfoIsListenerUpdate());
                    return null;
                  }
                  case "reqKickOut": {
                    const { user } = data;
                    const { auth } = user;

                    if (
                      this.roomOwner === false &&
                      data.reqKickOut.revMemNo === this.chatUserInfo.memNo
                    ) {
                      this.privateChannelDisconnect();
                      this.rtcInfo.stop && this.rtcInfo.stop();
                      this.dispatch(setGlobalCtxRtcInfoEmpty());
                      this.dispatch(setGlobalCtxIsShowPlayer(false));
                      rtcSessionClear();
                      this.dispatch(setGlobalCtxMoveToAlert({
                        dest: "/",
                        alertStatus: {
                          status: true,
                          content: data.recvMsg.msg,
                        }
                      }))
                    }

                    if (auth === AuthType.DJ || auth === AuthType.MANAGER) {
                      return NormalMsgFormat({
                        type: "div",
                        className: "connect-wrap",
                        children: [
                          {
                            type: "div",
                            className: "connect-line-left",
                          },
                          {
                            type: "div",
                            className: "connect-alarm",
                            text: data.recvMsg.msg,
                          },
                          {
                            type: "div",
                            className: "connect-line-right",
                          },
                        ],
                      });
                    }

                    return null;
                  }
                  case "reqBanWord": {
                    return null;
                  }
                  case "reqNotice": {
                    this.dispatch(setBroadcastCtxNoticeState(1))

                    return null;
                  }
                  case "reqLevelUpSelf": {
                    const { reqLevelUpSelf } = data;
                    const { dal, byul, frameColor, frameImg, frameName, level, grade, image } = reqLevelUpSelf;
                    if (this.broadcastLayerAction && this.broadcastLayerAction !== null) {
                      this.broadcastLayerAction.dispatchDimLayer({
                        type: "LEVEL_UP",
                        others: {
                          dal,
                          byul,
                          frameColor,
                          frameImg,
                          frameName,
                          level,
                          grade,
                          image,
                        },
                      });
                    }
                    return null;
                  }
                  case "connect": {
                    const { count, user, recvMsg } = data;

                    if (count) {
                      const { userCount, historyCount } = count;
                      this.dispatch(setBroadcastCtxUserCount({current: userCount, history: historyCount}))
                    }
                    if (recvMsg.msg !== "") {
                      // if (user.auth === AuthType.MANAGER || this.roomOwner === true) {
                      return NormalMsgFormat({
                        type: "div",
                        className: "connect-wrap",
                        children: [
                          {
                            type: "div",
                            className: "connect-line-left",
                          },
                          {
                            type: "div",
                            className: "connect-alarm",
                            text: recvMsg.msg,
                          },
                          {
                            type: "div",
                            className: "connect-line-right",
                          },
                        ],
                      });
                      // }
                    }
                  }
                  //kjo 방송방 bjReConnect 추가
                  case "bjReconnect": {
                    const { count, user, recvMsg } = data;
                    if (count) {
                      const { userCount, historyCount } = count;
                      if (userCount >= 0 && historyCount >= 0) {
                        this.dispatch(setBroadcastCtxUserCount({current: userCount, history: historyCount}))
                      }
                    }

                    return null;
                  }

                  case "disconnect": {
                    const { count, user, recvMsg } = data;
                    if (count) {
                      const { userCount, historyCount } = count;
                      if (userCount >= 0 && historyCount >= 0) {
                        this.dispatch(setBroadcastCtxUserCount({current: userCount, history: historyCount}))
                      }
                    }

                    if (recvMsg.msg !== "") {
                      // if (this.roomOwner === true || user.auth === AuthType.MANAGER) {
                      return NormalMsgFormat({
                        type: "div",
                        className: "connect-wrap",
                        children: [
                          {
                            type: "div",
                            className: "connect-line-left",
                          },
                          {
                            type: "div",
                            className: "connect-alarm",
                            text: recvMsg.msg,
                          },
                          {
                            type: "div",
                            className: "connect-line-right",
                          },
                        ],
                      });
                      // }
                    }

                    return null;
                  }

                  case "reqMicOn": {
                    const noticeDisplay = document.getElementById("broadcast-notice-display");
                    if (noticeDisplay) {
                      noticeDisplay.style.display = "block";

                      const elem = document.createElement("div");

                      elem.textContent = data.recvMsg.msg;

                      const closeImg = document.createElement("img");

                      closeImg.className = "close-img";
                      closeImg.src = MicAlarmClose;

                      elem.append(closeImg);

                      noticeDisplay.appendChild(elem);
                      closeImg.addEventListener("click", () => {
                        noticeDisplay.removeChild(elem);
                        // noticeDisplay.style.display = "none";
                      });

                      setTimeout(() => {
                        noticeDisplay.removeChild(elem);
                      }, 4000);
                    }

                    // const noticeDisplay = document.getElementById("broadcast-notice-display");
                    // if (noticeDisplay) {
                    //   noticeDisplay.style.display = "block";
                    //   // noticeDisplay.textContent = recvMsg.msg;
                    //   const closeImg = document.createElement("img");
                    //   closeImg.className = "close-img";
                    //   closeImg.src = MicAlarmClose;
                    //   noticeDisplay.appendChild(closeImg);
                    //   closeImg.addEventListener("click", () => {
                    //     noticeDisplay.removeChild(closeImg);
                    //     noticeDisplay.style.display = "none";
                    //   });

                    //   setTimeout(() => {
                    //     noticeDisplay.style.display = "none";
                    //   }, 4000);
                    // }

                    return null;
                  }

                  case "reqMicOff": {
                    const { recvMsg } = data;
                    const noticeDisplay = document.getElementById("broadcast-notice-display");
                    if (noticeDisplay) {
                      noticeDisplay.style.display = "block";

                      const elem = document.createElement("div");

                      elem.textContent = data.recvMsg.msg;

                      const closeImg = document.createElement("img");

                      closeImg.className = "close-img";
                      closeImg.src = MicAlarmClose;

                      elem.append(closeImg);

                      noticeDisplay.appendChild(elem);
                      closeImg.addEventListener("click", () => {
                        noticeDisplay.removeChild(elem);
                        // noticeDisplay.style.display = "none";
                      });
                      if (this.roomOwner === true) {
                        setTimeout(() => {
                          noticeDisplay.removeChild(elem);
                        }, 4000);
                      }
                    }

                    // if (noticeDisplay) {
                    //   noticeDisplay.style.display = "block";
                    //   noticeDisplay.textContent = recvMsg.msg;
                    //   const closeImg = document.createElement("img");
                    //   closeImg.className = "close-img";
                    //   closeImg.src = MicAlarmClose;
                    //   noticeDisplay.appendChild(closeImg);
                    //   closeImg.addEventListener("click", () => {
                    //     noticeDisplay.removeChild(closeImg);
                    //     noticeDisplay.style.display = "none";
                    //   });
                    //   if (this.roomOwner === true) {
                    //     setTimeout(() => {
                    //       noticeDisplay.style.display = "none";
                    //     }, 4000);
                    //   }
                    // }

                    return null;
                  }

                  case "reqGuest": {
                    const { user, recvMsg } = data;
                    const msg = JSON.parse(recvMsg.msg);

                    switch (msg.mode) {
                      // 게스트 초대
                      case 1:
                        if (user.memNo === this.chatUserInfo.memNo || this.roomOwner === true) {
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "invite",
                            });
                          }
                        }
                        return null;
                      // 초대 취소
                      case 2:
                        if (user.memNo === this.chatUserInfo.memNo || this.roomOwner === true) {
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "inviteCancle",
                            });
                          }
                        }
                        return null;
                      // 초대 수락
                      case 3:
                        if (this.roomOwner === true || user.memNo === this.chatUserInfo.memNo) {
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "accept",
                            });
                          }
                        }
                        return null;
                      // 초대 거절
                      case 4:
                        if (this.roomOwner === true) {
                          this.dispatch(setGlobalCtxSetToastStatus({
                            status: true,
                            message: "게스트 초대가 거절당했습니다.",
                          }));
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "reject",
                            });
                          }
                        }

                        if (this.chatUserInfo === user.memNo) {
                          this.dispatch(setGlobalCtxSetToastStatus({
                            status: true,
                            message: "게스트 초대를 거절했습니다.",
                          }));
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "reject",
                            });
                          }
                        }
                        return null;
                      // 게스트 신청
                      case 5:
                        if (this.roomOwner === true) {
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "apply",
                            });
                          }
                          if (this.guestAction !== null && this.guestAction.setNewApplyGuest) {
                            this.guestAction.setNewApplyGuest(true);
                          }

                          return NormalMsgFormat({
                            type: "div",
                            className: "guest-wrap",
                            text: `${user.nk} 님이 게스트 참여를 원합니다. 수락해주세요!`,
                          });
                        } else if (user.memNo === this.chatUserInfo.memNo) {
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "apply",
                            });
                          }
                          if (this.guestAction !== null && this.guestAction.setNewApplyGuest) {
                            this.guestAction.setNewApplyGuest(true);
                          }
                        }
                        return null;
                      // 게스트 신청 취소
                      case 7:
                        if (this.roomOwner === true || user.memNo === this.chatUserInfo.memNo) {
                          if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                            this.guestAction.dispatchStatus({
                              type: "applyCancle",
                            });
                          }
                        }

                        return null;
                      // 게스트 방송연결
                      case 8:
                        if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                          this.guestAction.dispatchStatus({
                            type: "connect",
                          });
                        }

                        this.dispatch(setBroadcastCtxRoomInfoRefresh());

                        return NormalMsgFormat({
                          type: "div",
                          className: "connect-wrap",
                          children: [
                            {
                              type: "div",
                              className: "connect-line-left",
                            },
                            {
                              type: "div",
                              className: "connect-alarm",
                              text: `${user.nk} 님께서 게스트로 방송에 참여하였습니다.`,
                            },
                            {
                              type: "div",
                              className: "connect-line-right",
                            },
                          ],
                        });
                      // 게스트 퇴장(종료)
                      case 6:
                        if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                          this.guestAction.dispatchStatus({
                            type: "exit",
                          });
                        }
                        if (this.guestAction !== null && this.guestAction.setGuestConnectStatus) {
                          this.guestAction.setGuestConnectStatus(false);
                        }

                        if (this.guestInfo && this.guestInfo !== null) {
                          this.guestInfo.stop && this.guestInfo.stop();
                        }

                        return NormalMsgFormat({
                          type: "div",
                          className: "connect-wrap",
                          children: [
                            {
                              type: "div",
                              className: "connect-line-left",
                            },
                            {
                              type: "div",
                              className: "connect-alarm",
                              text: `${user.nk} 님의 게스트 연결이 종료되었습니다.`,
                            },
                            {
                              type: "div",
                              className: "connect-line-right",
                            },
                          ],
                        });
                      // 게스트 비정상 종료
                      case 9:
                        if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                          this.guestAction.dispatchStatus({
                            type: "end",
                          });
                        }

                        if (this.guestInfo && this.guestInfo !== null) {
                          this.guestInfo.stop && this.guestInfo.stop();
                        }

                        if (this.guestAction !== null && this.guestAction.setGuestConnectStatus) {
                          this.guestAction.setGuestConnectStatus(false);
                        }

                        return NormalMsgFormat({
                          type: "div",
                          className: "connect-wrap",
                          children: [
                            {
                              type: "div",
                              className: "connect-line-left",
                            },
                            {
                              type: "div",
                              className: "connect-alarm",
                              text: `게스트 비정상 종료되었습니다.`,
                            },
                            {
                              type: "div",
                              className: "connect-line-right",
                            },
                          ],
                        });
                      default:
                        return null;
                    }
                  }

                  case "reqRankingDj": {
                    const { user } = data;
                    const { commonBadgeList } = user;
                    this.dispatch(setBroadcastCtxCommonBadgeList(commonBadgeList));
                    return null;
                  }

                  case "reqRoomLock": {
                    const { recvMsg } = data;
                    const jsonObj = JSON.parse(recvMsg.msg);
                    this.dispatch(setBroadcastCtxChatFreeze(jsonObj.isFreeze));
                    this.setChatFreeze(jsonObj.isFreeze);
                    this.dispatch(setGlobalCtxSetToastStatus({
                      status: true,
                      message: jsonObj.msg,
                    }));
                    // if (this.broadcastAction !== null && this.broadcastAction.dispatchRoomInfo) {
                    //   this.broadcastAction.dispatchRoomInfo({
                    //     type: "freeze",
                    //     data: jsonObj.isFreeze,
                    //   });
                    // }

                    return null;
                  }

                  case "moonCheck": {
                    const { moonCheck } = data;
                    const { dlgTitle, dlgText } = moonCheck;
                    if (moonCheck.moonStep === 4) {
                      this.dispatch(setBroadcastCtxRoomInfoMoonCheck({ ...moonCheck, moonStepAniFileNm: "", step: moonCheck.moonStep }));

                      setTimeout(() => {
                        this.dispatch(setBroadcastCtxChatAnimationStart({
                          url: "",
                          width: "",
                          height: "",
                          duration: moonCheck.aniDuration ? moonCheck.aniDuration * 1000 : 6000,
                          location: "topLeft",
                          count: 1,
                          isCombo: false,
                          userNickname: "'",
                          userImage: "",
                          webpUrl: moonCheck.moonStepAniFileNm,
                          soundFileUrl: "",
                          ttsItemInfo: {},
                          isTTSItem: false,
                        }))
                      }, 1000);

                      setTimeout(() => {
                        if (
                          this.broadcastLayerAction &&
                          this.broadcastLayerAction !== null &&
                          this.broadcastLayerAction.dispatchDimLayer
                        ) {
                          this.broadcastLayerAction.dispatchDimLayer({
                            type: "FULL_MOON",
                            others: {
                              dlgTitle,
                              dlgText,
                            },
                          });
                        }
                      }, 1200 + moonCheck.aniDuration * 1000);
                    } else {
                      this.dispatch(setBroadcastCtxRoomInfoMoonCheck(moonCheck));
                    }

                    return null;
                  }

                  case "reqRoomState": {
                    const { reqRoomState } = data;
                    const noticeDisplay = document.getElementById("broadcast-notice-display");
                    const elem = document.createElement("div");
                    const closeImg = document.createElement("img");
                    const player = document.getElementById("local-player");
                    let msgYn = false; // 메시지 표출 여부 값;

                    if (!noticeDisplay) return null;
                    noticeDisplay.innerHTML = ''; // 기존 알림 삭제

                    // 영상 소리 제거, 화면 제거 또는 살리기
                    if (player){
                      if (reqRoomState.mediaState === 'mic') {
                        this.rtcInfo?.audioMute(!reqRoomState.mediaOn); // 영상 OFF 할지 말지 정하는 변수, true 면 영상 틀고, false이면 영상 꺼야한다.
                      }

                      if (reqRoomState.mediaState === 'call' || reqRoomState.mediaState === 'server') {
                        this.rtcInfo?.audioMute(!reqRoomState.mediaOn); // 영상 OFF 할지 말지 정하는 변수, true 면 영상 틀고, false이면 영상 꺼야한다.
                        this.rtcInfo?.videoMute(!reqRoomState.mediaOn); // 영상 OFF 할지 말지 정하는 변수, true 면 영상 틀고, false이면 영상 꺼야한다.
                      }

                      if (reqRoomState.mediaState === 'video') {
                        player.style.display = reqRoomState.mediaOn ? '' : 'none';
                        this.rtcInfo?.videoMute(!reqRoomState.mediaOn); // 영상 OFF 할지 말지 정하는 변수, true 면 영상 틀고, false이면 영상 꺼야한다.
                      }

                    }

                    // 영상 OFF일때 메시지 삭제
                    if (reqRoomState.mediaOn) return null;

                    // 새로운 알림 DOM 생성 및 이벤트 부여
                    elem.id = "isMediaNotice";
                    elem.textContent = data.recvMsg.msg;

                    closeImg.className = "close-img";
                    closeImg.src = MicAlarmClose;

                    elem.append(closeImg);

                    noticeDisplay.appendChild(elem);
                    closeImg.addEventListener("click", () => {
                      noticeDisplay.removeChild(elem);
                    });

                    return null;
                  }

                  case "reqMiniGameAdd": {
                    const { reqMiniGameAdd } = data;
                    this.dispatch(setBroadcastCtxMiniGameInfo({
                      status: true,
                      gameNo: MiniGameType.ROLUTTE,
                      ...reqMiniGameAdd,
                    }));

                    return null;
                  }

                  case "reqMiniGameEdit": {
                    const { reqMiniGameEdit } = data;
                    this.dispatch(setBroadcastCtxMiniGameInfo({
                      status: true,
                      gameNo: MiniGameType.ROLUTTE,
                      ...reqMiniGameEdit,
                    }));

                    this.dispatch(setGlobalCtxSetToastStatus({
                      status: true,
                      message: reqMiniGameEdit.msg,
                    }));

                    return null;
                  }

                  case "reqMiniGameStart": {
                    const { reqMiniGameStart } = data;
                    const { nickName, winOpt } = reqMiniGameStart;

                    this.broadcastLayerAction &&
                      this.broadcastLayerAction.dispatchDimLayer({
                        type: "ROULETTE",
                      });

                    this.dispatch(setBroadcastCtxMiniGameResult({
                      status: true,
                      gameNo: MiniGameType.ROLUTTE,
                      ...reqMiniGameStart,
                    }))

                    setTimeout(() => {
                      this.addMsgElement(
                        NormalMsgFormat({
                          type: "div",
                          className: "minigame_msg_wrap",
                          children: [
                            {
                              type: "div",
                              className: "minigame_image",
                              children: [
                                {
                                  type: "div",
                                  className: "icon_image",
                                },
                              ],
                            },
                            {
                              type: "div",
                              className: "text",
                              children: [
                                {
                                  type: "span",
                                  text: `${nickName}님`,
                                },
                                {
                                  type: "br",
                                },
                                {
                                  type: "span",
                                  text: `${winOpt} 당첨입니다.`,
                                },
                              ],
                            },
                          ],
                        })
                      );
                    }, 5000);

                    return NormalMsgFormat({
                      type: "div",
                      className: "minigame_msg_wrap",
                      children: [
                        {
                          type: "div",
                          className: "minigame_image",
                          children: [
                            {
                              type: "div",
                              className: "icon_image",
                            },
                          ],
                        },
                        {
                          type: "div",
                          className: "text",
                          children: [
                            {
                              type: "span",
                              text: `${nickName}의 룰렛 START`,
                            },
                            {
                              type: "br",
                            },
                            {
                              type: "span",
                              text: "과연 결과는!!!",
                            },
                          ],
                        },
                      ],
                    });
                  }
                  case "reqMiniGameEnd": {
                    const { reqMiniGameEnd } = data;

                    this.dispatch(setBroadcastCtxMiniGameInfo({
                      status: false,
                    }))

                    return null;
                  }
                  case "reqInsVote": {
                    // 투표 생성
                    if(this.memNo === data.reqInsVote.memNo){
                      this.dispatch(setBroadcastCtxRightTabType(tabType.VOTE));
                      this.dispatch(setVoteActive(true));
                    }else if(this.memNo !== data.reqInsVote.memNo){
                      this.dispatch(setBroadcastCtxRightTabType(tabType.VOTE));
                      this.dispatch(setVoteActive(true));
                      this.dispatch(moveVoteListStep({
                        memNo: data.reqInsVote.memNo
                        , roomNo: data.reqInsVote.roomNo
                        , voteSlct: "s"
                      }));

                      // this.dispatch(getVoteList(data.reqInsVote));
                      this.dispatch(setGlobalCtxAlertStatus({
                        status: true,
                        type: "confirm",
                        content: `새로운 투표가 등록됐어요!<br/><br/>${data.reqInsVote.voteTitle}`,
                        confirmCancelText: "닫기",
                        confirmText: "참여하기",
                        callback: () => {
                          this.dispatch(moveVoteStep({
                            // memNo: this.memNo
                            memNo: data.reqInsVote.memNo
                            , roomNo: data.reqInsVote.roomNo
                            , voteNo: data.reqInsVote.voteNo
                          }));
                        },
                      }));
                    }

                    return null;
                  }
                  case "reqInsMemVote": {
                    // 투표
                    // if(this.memNo !== data.reqInsMemVote.pmemNo){
                    //   const getCallback = new Promise<VoteCallbackPromisePropsType>((resolve, reject)=>{
                    //     const voteResult:VoteCallbackPromisePropsType = [{
                    //       step: 'vote',
                    //       data: data.reqInsMemVote,
                    //       callback: ()=>{
                    //         this.dispatch(getVoteDetailList(data.reqInsMemVote));
                    //       }
                    //     }];
                    //     resolve(voteResult)
                    //   })
                    //   this.dispatch(setVoteCallback(getCallback));
                    // }
                    return null;
                  }
                  case "reqDelVote": {
                    // 투표 삭제
                    if(this.memNo === data.reqDelVote.memNo){
                      this.dispatch(moveVoteListStep({
                        memNo: data.reqDelVote.memNo,
                        roomNo: data.reqDelVote.roomNo,
                        voteSlct: 's'
                      }))
                    }else{
                      this.dispatch(setGlobalCtxAlertStatus({
                        status: false,
                        type: "confirm",
                      }))
                      const getCallback = new Promise<VoteCallbackPromisePropsType>((resolve, reject)=>{
                        const voteResult:VoteCallbackPromisePropsType = [{
                          step: 'vote',
                          data: data.reqDelVote,
                          callback: ()=>{
                            this.dispatch(setGlobalCtxSetToastStatus({
                              status: true,
                              message: `해당 투표가 삭제되어 투표 목록으로 이동합니다.`,
                            }));
                            this.dispatch(moveVoteListStep({
                              memNo: data.reqDelVote.memNo,
                              roomNo: data.reqDelVote.roomNo,
                              voteSlct: 's'
                            }));
                          }
                        }, {
                          step: 'list',
                          data: data.reqDelVote,
                          callback: ()=>{
                            this.dispatch(moveVoteListStep({
                              memNo: data.reqDelVote.memNo,
                              roomNo: data.reqDelVote.roomNo,
                              voteSlct: 's'
                            }));
                          }
                        }];
                        resolve(voteResult)
                      })
                      this.dispatch(setVoteCallback(getCallback));
                    }
                    return null;
                  }
                  case "reqEndVote": {
                    // 투표 마감
                    if(data.reqEndVote.endSlct === 'a'){
                      this.dispatch(setBroadcastCtxRightTabType(tabType.LISTENER))
                      this.dispatch(setVoteActive(false))
                    }else if(data.reqEndVote.endSlct === 'o'){
                      if(this.memNo === data.reqEndVote.memNo){
                        this.dispatch(moveVoteListStep({
                          memNo: data.reqEndVote.memNo,
                          roomNo: data.reqEndVote.roomNo,
                          voteSlct: 's'
                        }))
                      }else{
                        const getCallback = new Promise<VoteCallbackPromisePropsType>((resolve, reject)=>{
                          const voteResult:VoteCallbackPromisePropsType = [{
                            step: 'vote',
                            data: data.reqEndVote,
                            callback: ()=>{
                              this.dispatch(setGlobalCtxSetToastStatus({
                                status: true,
                                message: `해당 투표가 마감되어 투표 목록으로 이동합니다.`,
                              }));
                              this.dispatch(moveVoteListStep({
                                memNo: data.reqEndVote.memNo,
                                roomNo: data.reqEndVote.roomNo,
                                voteSlct: 's'
                              }));
                            }
                          }, {
                            step: 'list',
                            data: data.reqEndVote,
                            callback: ()=>{
                              this.dispatch(moveVoteListStep({
                                memNo: data.reqEndVote.memNo,
                                roomNo: data.reqEndVote.roomNo,
                                voteSlct: 's'
                              }));
                            }
                          }];
                          resolve(voteResult)
                        })
                        this.dispatch(setVoteCallback(getCallback));
                      }
                    }
                    return null;
                  }

                  case "reqPlayCoin": { // 달나라 동전 생성
                    const {reqPlayCoin} = data;

                    //달나라 이벤트 진행중 여부
                    if(!this.roomInfo?.moonLandEvent) return null;

                    /* 일반코인은 누적선물달을 체크 하지 않음 ( 그 외 보너스코인은 모두 10달 이상이여야 화면에 노출 ) */
                    const isNormalCoin = reqPlayCoin?.normal?.score > 0 && reqPlayCoin?.character?.score === 0 && reqPlayCoin?.gold?.score === 0;

                    if (this.roomOwner || isNormalCoin || this.roomInfo?.sendDalCnt >= this.roomInfo?.sendDalFix ) {  // 보낸달 10달 이상 체크
                      // 동전 애니메이션 생성 ( moon_land_animation_component에서 사용하는 setState 함수 )
                      if (this.broadcastStateChange.hasOwnProperty('moonLandStateFn')) {
                        if (typeof window !== 'undefined') {
                          if (localStorage.getItem('toTheMoonOnOff') === 'true') {
                            this.broadcastStateChange['moonLandStateFn']({...reqPlayCoin});
                          } else if (!localStorage.getItem('toTheMoonOnOff')) { //초기 값이 없으면 디폴트값 세팅
                            localStorage.setItem('toTheMoonOnOff', 'true');
                            this.broadcastStateChange['moonLandStateFn']({...reqPlayCoin});
                          }
                        }
                      } else {
                        console.warn('moonLandStateFn error !!!!', this.broadcastStateChange);
                      }
                    }
                    return null;
                  }
                  case "reqPlayAni": { // 달나라 아이템 미션 성공 애니메이션
                    // 이벤트 진행중 여부 체크
                    const {reqPlayAni} = data;
                    // 아이템미션 성공 시 띄우는 달나라 뿅 애니메이션 출력여부
                    if (reqPlayAni && reqPlayAni.hasOwnProperty('aniCode')) {
                      this.dispatch(setBroadcastCtxChatAnimationStart({
                        url: '',
                        width: 360,
                        height: 540,
                        duration: 12000,
                        location: 'midTop',
                        count: 1,
                        isCombo: false,
                        userNickname: '',
                        userImage: '',
                        webpUrl: `${reqPlayAni.aniCode}?${Date.now()}`,
                        soundFileUrl: '',
                        itemNo: '',
                        memNo: '',
                        ttsItemInfo: null,
                        isTTSItem: false,
                        // repeatCnt,
                      }))
                    }
                    return null;
                  }
                  case "reqDjSetting": { // 방장 dj가 방송 설정을 변경했습니다. ( djTtsSound, djNormalSound )
                    const {dj_normal_sound, dj_tts_sound, text} = data?.reqDjSetting?.inOut;

                    if (dj_normal_sound !== 'undefined' && dj_tts_sound !== 'undefined') {
                      //방장 설정 정보 세팅
                      const djSetting = {djNormalSound: dj_normal_sound, djTtsSound: dj_tts_sound};
                      this.setRoomInfo({...this.roomInfo, ...djSetting});
                      this.dispatch(setBroadcastCtxRoomInfoSettingUpdate(djSetting));
                      text && !this.roomOwner &&
                      this.dispatch(setGlobalCtxSetToastStatus({
                        status: true,
                        message: text,
                      }));
                    }
                    return null;
                  }
                  case "reqGetStoneByBV" :  // 방송/청취 20분당: 소켓-> DB/프론트
                  case "reqGetStoneByGift" :  // 선물보내기,받기시: api -> 소켓 -> 프론트
                    //타입 갯수에 따라서 다수개의 속성을 1개의 속성으로 쪼개서 배열로 만들어 전달 ex) {d: 1, a: 1, l: 1} => [{d: 1}, {a: 1}, {l: 1}]
                    let dCnt = 0;
                    let aCnt = 0;
                    let lCnt = 0;
                    const {dStone, aStone, lStone} = data?.reqGetStoneByGift || data?.reqGetStoneByBV;
                    if(dStone > 0) dCnt++;
                    if(aStone > 0) aCnt++;
                    if(lStone > 0) lCnt++;

                    let arr: any = [];
                    if(dCnt> 0) arr.push({dStone});
                    if(aCnt> 0) arr.push({aStone});
                    if(lCnt> 0) arr.push({lStone});
                    this.broadcastStateChange['setStoneAniQueueState'](arr);

                    return null;
                  case "reqStartFeverTime": { // 피버타임 시작
                    /*
                    1. 달5000개: api -> 소켓 -> 프론트
                    2. 10명 이하, 30분 이상, 선물시: api -> 소켓 -> 프론트
                    */
                    //reqStartFeverTime: {type 1: 선물, 2: 인원+방송시간+선물, time 진행시간}
                    const {type, time} = data?.reqStartFeverTime;
                    this.broadcastStateChange['setFeverTimeState'](true);
                    return null;
                  }
                  case "reqStopFeverTime": { // 피버타임 종료
                    this.broadcastStateChange['setFeverTimeState'](false);
                    return null;
                  }

                  default:
                    return null;
                }
              };
              const msgElem = chatMsgElement(data);
              this.addMsgElement(msgElem);
              if (this.msgListWrapRef) {
                const msgListWrapElem = this.msgListWrapRef.current;
                if(msgListWrapElem && msgListWrapElem.children){
                  if(msgListWrapElem.children.length >= 1000){
                    msgListWrapElem.children[0].remove();
                  }
                }
              }

              // this.chatCnt = this.chatCnt + 1;
              // if (msgListWrapElem && msgElem !== null) {
              //   if (msgListWrapElem.children.length === 2000) {
              //     msgListWrapElem.removeChild(msgListWrapElem.children[0]);
              //   }

              //   if (this.chatCnt === 2000) {
              //     this.chatCnt = 0;
              //   }

              //   msgListWrapElem.appendChild(msgElem);

              //   if (this.broadcastAction !== null && this.broadcastAction.setChatCount) {
              //     this.dispatch(setBroadcastCtxChatCount(this.chatCnt);
              //   }
              // }
            } else {
              const { cmd } = data;
              if (cmd === "chatEnd" || cmd === "chatEndRed") {
                if (this.chatUserInfo["roomNo"] !== null) {
                  this.destroy({ isdestroySocket: false, destroyChannelName: this.chatUserInfo["roomNo"] });
                }

                if (
                  this.rtcInfo !== null &&
                  this.history
                ) {
                  this.privateChannelDisconnect();
                  this.rtcInfo?.stop();
                  this.dispatch(setGlobalCtxRtcInfoEmpty());
                  this.dispatch(setGlobalCtxIsShowPlayer(false));
                  rtcSessionClear();
                  if (window.location.pathname.match("/broadcast/")) {
                    if (this.broadcastLayerAction && this.broadcastLayerAction.dispatchDimLayer) {
                      this.broadcastLayerAction.dispatchDimLayer({
                        type: "BROAD_END",
                        others: {
                          roomOwner: this.roomOwner,
                          roomNo: this.chatUserInfo["roomNo"],
                        },
                      });
                    }
                  } else {
                    setTimeout(() => {
                      this.dispatch(setGlobalCtxAlertStatus({
                        status: true,
                        content: "방송이 종료되었습니다.",
                      }));
                    }, 600);
                  }

                  // setTimeout(() => {
                  //   this.dispatch(setGlobalCtxAlertStatus({
                  //     status: true,
                  //     content: "방송이 종료되었습니다.",
                  //   });
                  // }, 600);
                }
              }
            }
          }
        });
      }
      // success callback
      callback(channelName);
    }
  }

  channelBinding(channelHandler: any, channelName: string) {
    if (channelHandler !== null) {
      this.destroy({ isdestroySocket: false, destroyChannelName: channelName });
      channelHandler = null;
    }

    if (channelHandler === null) {
      //channel 구독 요청
      channelHandler = this.socket.subscribe(channelName);

      channelHandler["channel_name"] = channelName;

      //   //subscribe 구독 성공
      //   channelHandler.on(CHAT_CONFIG.event.channel.SUBSCRIBE, (channel: string) => {});

      //subscribeFail 구독(채팅방입장) 실패
      channelHandler.on(CHAT_CONFIG.event.channel.SUBSCRIBEFAIL, (errCode: number, channel: string) => {
        if (CHAT_CONFIG.error[errCode] !== undefined) {
          // alert(CHAT_CONFIG.error[errCode]);
        }
      });

      //subscribeFail 구독(채팅방입장) 실패
      channelHandler.on(CHAT_CONFIG.event.channel.DROPOUT, (err: any, data: any) => {});

      //   //unsubscribe 구독 해제
      //   channelHandler.on(CHAT_CONFIG.event.channel.UNSUBSCRIBE, (data) => {});

      //   //subscribe 상태 변경
      //   channelHandler.on(CHAT_CONFIG.event.channel.SUBSCRIBESTATECHANGE, (data: any) => {});

      //   //subscribe 메세지 수신

      return channelHandler;
    }
  }
  getPublicChannel(): string {
    return CHAT_CONFIG.channel.public;
  }

  getPrivateChannel(): string {
    return this.privateChannelNo;
  }

  isPublicChannel(channelName: string) {
    return channelName === CHAT_CONFIG.channel.public;
  }

  //메세지 전송 - 특정 채널에 메세지 전송
  sendSocketMessage(channelName: string, command: string, memNo: string, message: string, callback: (status: boolean) => void) {
    const messageJSon = {
      cmd: command,
      chat: { memNo },
      sendMsg: message,
    };

    this.socket.publish(channelName, messageJSon, (err: any) => {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }
  //메시지 메세지 전송
  sendSocketMessageMail(
    channelName: string,
    command: string,
    chatType: number,
    os: number,
    message: string,
    callback: (status: boolean) => void
  ) {
    const messageJSon = {
      cmd: command,
      mailBoxChat: { chatType, os },
      sendMsg: message,
    };
    this.socket.publish(channelName, messageJSon, (err: any) => {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }
  //메세지 전송 - public 채널에 메세지 전송
  sendPublicMessage(command: string, memNo: string, message: string, callback: (status: boolean) => void) {
    if (this.publicChannelHandle == null) {
      callback(false);
      return;
    }

    const messageJSon = {
      cmd: command,
      chat: { memNo },
      sendMsg: message,
    };

    this.publicChannelHandle.publish(messageJSon, (err: any) => {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  //메세지 전송 - private 채널에 메세지 전송
  sendPrivateMessage(command: string, memNo: string, message: string, callback: (status: boolean) => void) {
    if (this.privateChannelHandle == null) {
      callback(false);
      return;
    }

    var messageJSon = {
      cmd: command,
      chat: { memNo },
      sendMsg: message,
    };

    this.privateChannelHandle.publish(messageJSon, (err: any) => {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }
  // check Logout
  sendLogoutCheck(command: string, loginJson: any, message: string) {
    let loginInfo = {
      cmd: command,
      login: loginJson,
      sendMsg: message,
    };
    this.socket.emit("login", loginInfo, (errCode, success: boolean) => {
      if (errCode) {
        //로그인 실패
      } else {
        if (success === true) {
          console.log("로그인 소켓 성공");
        } else {
          //로그인 실패
          console.log("로그인 소켓 실패");
        }
      }
    });
  }

  sendLogin() {
    const loginMessageJSon = {
      cmd: CHAT_CONFIG.packet.send.PACKET_SEND_LOGIN,
      login: this.chatUserInfo,
      sendMsg: "",
    };

    this.socket.emit("login", loginMessageJSon, (errCode, success: boolean) => {
      if (errCode) {
        //로그인 실패
      } else {
        if (success === true) {
          console.log("로그인 소켓 성공");
        } else {
          //로그인 실패
          console.log("로그인 소켓 실패");
        }
      }
    });
  }

  setChatUserImg(user) {
    const { fan, image, memNo } = user;
    let { badgeFrame } = user;
    if (!badgeFrame) {
      badgeFrame = {
        frameChat: "",
        frameAni: "",
      };
    }

    const { frameChat, frameAni } = badgeFrame;

    if (!frameChat) {
      return {
        type: "div",
        className: `profile-img ${fan && "fan"}`,
        style: {
          backgroundImage: `url(${image})`,
        },
        event: [
          {
            type: "click",
            callback: () => {
              this.dispatch(setBroadcastCtxUserMemNo(memNo));
              this.dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
            },
          },
        ],
      };
    } else {
      const arrProfImg = new Array();
      arrProfImg.push({
        type: "div",
        className: "profile-img",
        style: {
          backgroundImage: `url(${image})`,
        },
      });
      if (!frameAni) {
        arrProfImg.push({
          type: "div",
          className: `live-rank-frame ${fan && "fan"}`,
          style: {
            backgroundImage: `url(${frameChat})`,
          },
          event: [
            {
              type: "click",
              callback: () => {
                this.dispatch(setBroadcastCtxUserMemNo(memNo));
                this.dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
              },
            },
          ],
        });
      } else {
        arrProfImg.push({
          type: "div",
          className: `live-rank-frame`,
          style: {
            backgroundImage: `url(${frameChat})`,
          },
        });
        arrProfImg.push({
          type: "dev",
          className: `live-rank-frame ${fan && "fan"}`,
          style: {
            backgroundImage: `url(${frameAni})`,
          },
          event: [
            {
              type: "click",
              callback: () => {
                this.dispatch(setBroadcastCtxUserMemNo(memNo));
                this.dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
              },
            },
          ],
        });
      }
      return {
        type: "div",
        className: `live-rank-profile ${fan && "fan"}`,
        children: arrProfImg,
      };
    }
  }

  setChatUser(user) {
    const { nk, image, memNo, bj, fan, auth, fanBadge, badgeList, newDj, newListener, commonBadgeList } = user;
    // const badgeLists = badgeList.map((val: any) => {
    //   return {
    //     type: "span",
    //     className: "badgeList",
    //     style: {
    //       backgroundImage: `url(${val.imageSmall})`,
    //     },
    //     event: [
    //       {
    //         type: "click",
    //         callback: () => {
    //           val.tipMsg &&
    //             this.globalAction &&
    //             this.dispatch(setGlobalCtxSetToastStatus({
    //               status: true,
    //               message: val.tipMsg,
    //             });
    //         },
    //       },
    //     ],
    //   };
    // });
    const liveBadgeLists = commonBadgeList.map((val: any) => {
      return {
        type: "span",
        className: `liveBadgeWrap view`,
        style: {
          backgroundImage: `${`url("${val.chatImg}")`}`,
          width: `${val.chatImgWidth}px`,
          height: `${val.chatImgHeight}px`,
          backgroundSize: `contain`,
        },
        // children: [
        //   {
        //     type: "span",
        //     className: "badgeBg",
        //     style: {
        //       backgroundImage: `${
        //         val.bgImg !== ""
        //           ? `url("${val.bgImg}")`
        //           : `linear-gradient(to right, ${val.startColor} ${val.bgAlpha * 100}%, ${val.endColor} ${val.bgAlpha * 100}%)`
        //       } `,
        //       border: val.borderColor ? `1px solid ${val.borderColor}` : "none",
        //       backgroundSize: "contain",
        //     },
        //   },
        //   {
        //     type: "span",
        //     className: `badgeIcon ${val.icon ? "view" : "none"}`,
        //     style: {
        //       backgroundImage: `url(${val.icon})`,
        //     },
        //   },
        //   {
        //     type: "span",
        //     className: "badgeText",
        //     text: val.text,
        //     style: {
        //       color: `${val.textColor}`,
        //     },
        //   },
        // ],
        event: [
          {
            type: "click",
            callback: () => {
              val.tipMsg &&
                this.dispatch(setGlobalCtxSetToastStatus({
                  status: true,
                  message: val.tipMsg,
                }));
            },
          },
        ],
      };
    });

    return [
      // {
      //   type: "span",
      //   text: `${
      //     bj
      //       ? newDj === true
      //         ? "신입DJ"
      //         : "DJ"
      //       : auth === AuthType.MANAGER
      //       ? "매니저"
      //       : newListener === true
      //       ? "신입청취자"
      //       : ""
      //   }`,
      //   className: `label ${
      //     bj
      //       ? newDj === true
      //         ? "bj new"
      //         : "bj"
      //       : auth === AuthType.MANAGER
      //       ? "manager"
      //       : newListener === true
      //       ? "new-listener"
      //       : "none"
      //   }`,
      // },
      ...liveBadgeLists,
      // {
      //   type: "span",
      //   text: fanBadge.text,
      //   className: `${fanBadge.text ? "fanbadge" : "none"}`,
      //   style: {
      //     backgroundImage: `linear-gradient(to right, ${fanBadge.startColor}, ${fanBadge.endColor})`,
      //   },
      //   children: [
      //     {
      //       type: "span",
      //       style: {
      //         backgroundImage: `url(${fanBadge.icon})`,
      //       },
      //     },
      //   ],
      // },
      // ...badgeLists,
      {
        type: "span",
        text: nk,
        className: "nickname",
        event: [
          {
            type: "click",
            callback: () => {
              this.dispatch(setBroadcastCtxUserMemNo(memNo));
              this.dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
            },
          },
        ],
      },
    ];
  }
}

export class ReConnectChat {
  public reTryCnt: any;
  public isRetry: any;
  public chatUserInfo: chatUserInfoType;
  public globalAction: any | null;
  public isRetryFinish: any;
  public lastRetryTime: any;
  public privateChannelNo: string;
  public intervalReConnect: any;
  //dividing mailbox
  private msgListWrapRef: any;
  private mailMsgListWrapRef: any;
  public roomOwner: boolean;
  public broadcastAction: any | null;

  public dispatch: any;
  public memNo: string = '';

  constructor(userInfo: chatUserInfoType, dispatch?: any) {
    this.dispatch = dispatch;

    this.chatUserInfo = userInfo;
    this.reTryCnt = 0;
    this.isRetry = false;
    this.isRetryFinish = false;
    this.lastRetryTime = new Date().getTime();
    this.privateChannelNo = "";
    this.intervalReConnect = null;
    this.msgListWrapRef = null;
    this.mailMsgListWrapRef = null;
    this.roomOwner = false;
  }

  setMemNo(memNo){
    this.memNo = memNo
  }

  setUserInfo(userInfo: chatUserInfoType) {
    this.chatUserInfo = userInfo;
  }

  setPrivateChannelNo(chanelNo: string) {
    this.privateChannelNo = chanelNo;
  }

  setBroadcastAction(action: any) {
    this.broadcastAction = action;
  }

  setGlobalAction(action: any) {
    this.globalAction = action;
  }

  setMsgListWrapRef(msgListWrap: any) {
    this.msgListWrapRef = msgListWrap;
  }
  // mailBox dividing
  setMailMsgListWrapRef(mailMsgListWrap: any) {
    this.mailMsgListWrapRef = mailMsgListWrap;
  }

  setRoomOwner(owner: boolean) {
    this.roomOwner = owner;
  }

  setDefault() {
    if (this.intervalReConnect !== null) {
      window.clearInterval(this.intervalReConnect);
    }
    this.intervalReConnect = null;
    this.reTryCnt = 0;
    this.isRetry = false;
    this.isRetryFinish = false;
  }

  reConnect() {
    if (this.intervalReConnect !== null) {
      window.clearInterval(this.intervalReConnect);
    }

    this.isRetry = this.isRetry === false ? true : this.isRetry;
    const now = new Date().getTime();
    if (this.reTryCnt > 0 && now - this.lastRetryTime < (this.reTryCnt < 10 ? 500 : 1000)) {
      this.intervalReConnect = window.setInterval(() => {
        this.reConnect();
      }, now - this.lastRetryTime);
    } else {
      this.lastRetryTime = now;
      if (this.isRetry == true && this.reTryCnt < 21) {
        this.reTryCnt++;
        const chatInfo = new ChatSocketHandler(this.chatUserInfo, this);
        this.dispatch(setGlobalCtxChatInfoInit(chatInfo))
      } else {
        if (this.isRetryFinish == false) {
          this.dispatch(setGlobalCtxAlertStatus({
            status: true,
            type: "alert",
            content: `네트워크 접속이 원할하지 않습니다.\n다시 이용해주시기 바랍니다.`,
            callback: () => {
              window.location.href = "/";
            },
          }));
        }
        this.isRetryFinish = true;
      }
    }
  }
}
