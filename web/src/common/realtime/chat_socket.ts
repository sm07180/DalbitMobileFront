import { CHAT_CONFIG, NODE_ENV } from "constant/define";

// constant
import { MiniGameType, tabType } from "pages/broadcast/constant";
import { AuthType } from "constant";

import { postErrorSave, splash, getItems } from "common/api";

// lib
const socketClusterClient = require("socketcluster-client");

import { NormalMsgFormat, GiftActionFormat, SystemStartMsg, ReqGood } from "pages/broadcast/lib/chat_msg_format";

// static
import MicAlarmClose from "common/static/image/mic_alarm_close.png";

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

import { MediaType } from "pages/broadcast/constant";
import { getCookie } from "common/utility/cookie";
import {rtcSessionClear} from "./rtc_socket";
import {isDesktop} from "../../lib/agent";

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

  // 로그인한 유저의 방송 설정 (패킷 받을때 설정에 맞게 대응하기 위함)
  // set 하는 곳 : /mypage/broadcast/setting, /mypage/broadcast/setting/edit
  // 사용되는 기능 : tts, sound 아이템 on/off, 외 방송설정
  public userSettingObj: userBroadcastSettingType | null = null;

  constructor(userInfo: chatUserInfoType, reConnectHandler?: any) {
    this.postErrorState =  (window as any)?.postErrorState;
    this.socket = null;
    this.chatUserInfo = userInfo;
    this.roomOwner = false;

    this.splashData = null;

    this.isConnect = false;
    this.broadcastAction = null;

    this.reConnect =
      reConnectHandler === undefined || reConnectHandler == null ? new ReConnectChat(this.chatUserInfo) : reConnectHandler;

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

  setBroadcastStateChange(key: string, setStateFn: Function){
    this.broadcastStateChange = {...this.broadcastStateChange, [key] : setStateFn};
  }

  setBroadcastStateClear(){
    this.broadcastStateChange = {};
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

        if (this.broadcastAction !== null && this.broadcastAction.setChatCount) {
          this.broadcastAction.setChatCount(this.chatCnt);
        }
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

          if (this.globalAction && this.globalAction.dispatchCurrentChatData) {
            this.globalAction.dispatchCurrentChatData({ type: "empty" });
          }
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
    if (this.globalAction && this.globalAction.setIsShowPlayer) {
      this.globalAction.setIsShowPlayer(false);
    }

    if (this.privateChannelHandle) {
      //console.log(`@@chat socket ...`, this.privateChannelHandle)
      this.privateChannelHandle.unsubscribe();
      this.privateChannelHandle.destroy();
      this.privateChannelHandle = null;
      this.privateChannelNo = "";
      this.reConnect.setPrivateChannelNo(this.privateChannelNo);

      if (this.globalAction && this.globalAction.dispatchCurrentChatData) {
        this.globalAction.dispatchCurrentChatData({ type: "empty" });
      }
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
              if (this.globalAction) {
                this.globalAction.setRealtimeBroadStatus!({
                  status: true,
                  type: "broadAlarm",
                  message: `${reqSocketPush.msg}`,
                  roomNo: `${reqSocketPush.roomNo}`,
                  profImg: `${reqSocketPush.profImg.thumb62x62}`,
                });
              }
              return null;
            }
            case "mailBoxPubChat": {
              const { mailBoxPubChat } = data;
              if (this.mailboxAction !== null) {
                this.mailboxAction.setIsMailboxNew(true);
                this.mailboxAction.dispathChatList({ type: "update", data: mailBoxPubChat });
              }
              if (this.globalAction) {
                this.globalAction.setRealtimeBroadStatus!({
                  status: true,
                  type: "MailAlarm",
                  nickNm: `${mailBoxPubChat.nickNm}`,
                  message: `${mailBoxPubChat.msg}`,
                  roomNo: `${mailBoxPubChat.chatNo}`,
                  profImg: `${mailBoxPubChat.profImg.thumb62x62}`,
                  time: `${mailBoxPubChat.sendDt}`,
                  memNo: `${mailBoxPubChat.memNo}`,
                });
              }
              return null;
            }
            case "reqMemBlack": {
              const { reqMemBlack } = data;
              const { memNo, blackMemNo } = reqMemBlack;
              if (this.globalAction) {
                this.globalAction.setMailBlockUser!({
                  memNo: memNo,
                  blackMemNo: blackMemNo,
                });
              }
              return null;
            }
            case "reqChangeItem": {
              getItems().then((resolve) => {
                if (this.globalAction && this.globalAction.setSplashData && this.splashData !== null) {
                  this.globalAction.setSplashData({
                    ...this.splashData,
                    items: [...resolve.data.items],
                  });
                }
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
                  if (this.mailboxAction !== null) {
                    if (userCount > 1) {
                      this.mailboxAction.setUserCount(true);
                    }
                  }
                  return null;
                }
                case "mailBoxChat": {
                  if (this.mailboxAction !== null) {
                    this.mailboxAction.setPushChatInfo({
                      ...mailBoxChat,
                    });
                  }
                  return null;
                }
                case "reqMailBoxImageChatDelete": {
                  this.mailboxAction.dispathImgSliderInfo &&
                    this.mailboxAction.dispathImgSliderInfo({ type: "addDeletedImg", data: reqMailBoxImageChatDelete.msgIdx });
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
                      this.globalAction &&
                      this.globalAction.setAlertStatus &&
                      this.globalAction.dispatchRtcInfo &&
                      this.globalAction.dispatchGuestInfo &&
                      this.history
                    ) {
                      this.privateChannelDisconnect();
                      this.rtcInfo.stop && this.rtcInfo.stop();
                      if (this.guestInfo && this.guestInfo !== null) {
                        this.guestInfo.stop && this.guestInfo.stop();
                        this.globalAction.dispatchGuestInfo({ type: "EMPTY" });
                      }

                      this.globalAction.dispatchRtcInfo({ type: "empty" });

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

                      this.globalAction.setIsShowPlayer && this.globalAction.setIsShowPlayer(false);
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
                          this.globalAction.setAlertStatus({
                            status: true,
                            content: "방송이 종료되었습니다.",
                          });
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
                      this.globalAction &&
                      this.globalAction.setAlertStatus &&
                      this.globalAction.dispatchRtcInfo &&
                      this.history
                    ) {
                      this.privateChannelDisconnect();
                      this.rtcInfo.stop && this.rtcInfo.stop();
                      this.globalAction.dispatchRtcInfo({ type: "empty" });
                      this.globalAction.setIsShowPlayer && this.globalAction.setIsShowPlayer(false);
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
                          this.globalAction.setAlertStatus({
                            status: true,
                            content: "방송이 종료되었습니다.",
                          });
                        }, 600);
                      }

                      // setTimeout(() => {
                      //   this.globalAction.setAlertStatus({
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

                    if (this.roomOwner === true && this.broadcastAction !== null && this.broadcastAction.setExtendTime) {
                      this.broadcastAction.setExtendTime(true);
                    }

                    return null;
                  }
                  case "chat": {
                    const { user, recvMsg } = data;
                    const { msgBorder } = user;

                    const { msg, type } = recvMsg;
                    if (type === "system") {
                      if (this.globalAction !== null && this.globalAction.setTooltipStatus) {
                        this.globalAction.setTooltipStatus({
                          status: true,
                          message: msg,
                          type: "system",
                        });
                      }

                      setTimeout(() => {
                        this.globalAction.setTooltipStatus!({
                          status: false,
                          message: "",
                          style: {},
                          type: "",
                        });
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
                    const { items, levelUp, boost } = this.splashData;
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
                        this.globalAction?.callSetToastStatus && this.globalAction.callSetToastStatus({
                          status: true,
                          message: 'DJ설정으로 소리가 나오지 않습니다'
                        });
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
                      this.globalAction.callSetToastStatus({
                        status: true,
                        message: "TTS 목소리 재생을 실패했습니다.",
                      });
                    }

                    if (lottieData && isSecret === false) {
                      const { lottieUrl, duration, width, height, location, type, webpUrl, soundFileUrl } = lottieData;
                      const isCombo = type === "sticker";

                      if (isCombo) {
                        if (this.broadcastAction !== null && this.broadcastAction.dispatchComboAnimation) {
                          this.broadcastAction.dispatchComboAnimation({
                            type: "start",
                            data: {
                              url: webpUrl || lottieUrl,
                              repeatCnt,
                              duration: duration * 1000,
                              itemNo,
                              memNo,
                              userImage,
                              userNickname,
                            },
                          });
                        }
                      } else {
                        if (this.broadcastAction !== null && this.broadcastAction.dispatchChatAnimation) {

                          this.broadcastAction.dispatchChatAnimation({
                            type: "start",
                            data: {
                              url: lottieUrl,
                              width,
                              height,
                              duration: duration * 1000 * repeatCnt,
                              location,
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
                              // repeatCnt,
                            },
                          });
                        }
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
                    if (this.broadcastAction !== null && this.broadcastAction.dispatchChatAnimation) {
                      this.broadcastAction.dispatchChatAnimation({
                        type: "start",
                        data: {
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
                        },
                      });
                    }

                    return null;
                  }

                  case "reqGiftDal": {
                    const { user, reqGiftDal } = data;
                    const { nk, image, memNo, auth, fan } = user;
                    const { itemCnt } = reqGiftDal;
                    return null;
                  }
                  case "reqBooster": {
                    if (this.broadcastAction) {
                      this.broadcastAction.dispatchRoomInfo({ type: "boosterOn" });
                      this.broadcastAction.setBoost({
                        boost: true,
                      });
                    }

                    return null;
                  }
                  case "reqBoosterEnd": {
                    if (this.broadcastAction) {
                      this.broadcastAction.dispatchRoomInfo({ type: "boosterOff" });
                      this.broadcastAction.setBoost({
                        boost: false,
                      });
                    }
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
                  case "reqChangeCount": {
                    const { reqChangeCount } = data;
                    if (this.broadcastAction !== null && this.broadcastAction.dispatchRealTimeValue) {
                      const { fanRank, likes, rank, newFanCnt } = reqChangeCount;
                      this.broadcastAction.dispatchRealTimeValue({
                        type: "setLikeFanRank",
                        data: { fanRank, likes, rank, newFanCnt },
                      });

                      if (this.broadcastAction.dispatchRoomInfo) {
                        this.broadcastAction.dispatchRoomInfo({
                          type: "newFanCnt",
                          data: newFanCnt,
                        });
                      }
                    }
                    return null;
                  }
                  //kjo 방송방 수정하기 수정
                  case "reqRoomChangeInfo": {
                    const { reqRoomChangeInfo } = data;

                    this.broadcastAction.dispatchRoomInfo({ type: "broadcastSettingUpdate", data: reqRoomChangeInfo });
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

                    if (this.broadcastAction !== null && this.broadcastAction.dispatchChatAnimation) {
                      this.broadcastAction.dispatchChatAnimation({
                        type: "start",
                        data: {
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
                        },
                      });
                    }

                    return ReqGood({
                      type: "div",
                      text: msg,
                      className: "req-good-likes",
                    });
                  }

                  case "reqStory": {
                    this.broadcastAction.setStoryState(1);
                  }
                  case "reqGrant": {
                    const { recvMsg } = data;
                    this.broadcastAction.dispatchRoomInfo &&
                      this.broadcastAction.dispatchRoomInfo({
                        type: "grantRefresh",
                        data: {
                          auth: parseInt(recvMsg.msg),
                          memNo: data.chat.memNo,
                        },
                      });

                    return null;
                  }
                  case "reqKickOut": {
                    const { user } = data;
                    const { auth } = user;

                    if (
                      this.roomOwner === false &&
                      data.reqKickOut.revMemNo === this.chatUserInfo.memNo &&
                      this.globalAction &&
                      this.globalAction.setAlertStatus
                    ) {
                      this.privateChannelDisconnect();
                      this.rtcInfo.stop && this.rtcInfo.stop();
                      this.globalAction.dispatchRtcInfo({ type: "empty" });
                      this.globalAction.setIsShowPlayer && this.globalAction.setIsShowPlayer(false);
                      rtcSessionClear();
                      this.globalAction.setMoveToAlert({
                        dest: "/",
                        alertStatus: {
                          status: true,
                          content: data.recvMsg.msg,
                        }
                      })
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
                    if (this.broadcastAction !== null && this.broadcastAction.setNoticeState) {
                      this.broadcastAction.setNoticeState(1);
                    }

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

                    if (this.broadcastAction !== null && this.broadcastAction.setUserCount) {
                      if (count) {
                        const { userCount, historyCount } = count;

                        this.broadcastAction.setUserCount((prev) => {
                          return { ...prev, current: userCount, history: historyCount };
                        });
                      }
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
                    if (this.broadcastAction !== null && this.broadcastAction.setUserCount) {
                      if (count) {
                        const { userCount, historyCount } = count;
                        if (userCount >= 0 && historyCount >= 0) {
                          this.broadcastAction.setUserCount((prev) => {
                            return { ...prev, current: userCount, history: historyCount };
                          });
                        }
                      }
                    }

                    return null;
                  }

                  case "disconnect": {
                    const { count, user, recvMsg } = data;
                    if (this.broadcastAction !== null && this.broadcastAction.setUserCount) {
                      if (count) {
                        const { userCount, historyCount } = count;
                        if (userCount >= 0 && historyCount >= 0) {
                          this.broadcastAction.setUserCount((prev) => {
                            return { ...prev, current: userCount, history: historyCount };
                          });
                        }
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
                          if (this.globalAction !== null && this.globalAction.callSetToastStatus) {
                            this.globalAction.callSetToastStatus({
                              status: true,
                              message: "게스트 초대가 거절당했습니다.",
                            });
                            if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                              this.guestAction.dispatchStatus({
                                type: "reject",
                              });
                            }
                          }
                        }

                        if (this.chatUserInfo === user.memNo) {
                          if (this.globalAction !== null && this.globalAction.callSetToastStatus) {
                            this.globalAction.callSetToastStatus({
                              status: true,
                              message: "게스트 초대를 거절했습니다.",
                            });
                            if (this.guestAction !== null && this.guestAction.dispatchStatus) {
                              this.guestAction.dispatchStatus({
                                type: "reject",
                              });
                            }
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

                        this.broadcastAction.dispatchRoomInfo &&
                          this.broadcastAction.dispatchRoomInfo({
                            type: "refresh",
                          });

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
                    if (this.broadcastAction !== null && this.broadcastAction.setCommonBadgeList) {
                      this.broadcastAction.setCommonBadgeList(commonBadgeList);
                    }
                    return null;
                  }

                  case "reqRoomLock": {
                    const { recvMsg } = data;
                    const jsonObj = JSON.parse(recvMsg.msg);
                    if (this.broadcastAction !== null && this.broadcastAction.setChatFreeze) {
                      this.broadcastAction.setChatFreeze(jsonObj.isFreeze);
                      this.setChatFreeze(jsonObj.isFreeze);
                    }
                    if (this.globalAction !== null && this.globalAction.callSetToastStatus) {
                      this.globalAction.callSetToastStatus({
                        status: true,
                        message: jsonObj.msg,
                      });
                    }
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
                      if (this.broadcastAction !== null && this.broadcastAction.dispatchRoomInfo) {
                        this.broadcastAction.dispatchRoomInfo({
                          type: "moonCheck",
                          data: { ...moonCheck, moonStepAniFileNm: "", step: moonCheck.moonStep },
                        });
                      }

                      if (this.broadcastAction !== null && this.broadcastAction.dispatchChatAnimation) {
                        setTimeout(() => {
                          this.broadcastAction.dispatchChatAnimation({
                            type: "start",
                            data: {
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
                            },
                          });
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
                      }
                    } else {
                      if (this.broadcastAction !== null && this.broadcastAction.dispatchRoomInfo) {
                        this.broadcastAction.dispatchRoomInfo({
                          type: "moonCheck",
                          data: { ...moonCheck },
                        });
                      }
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

                    this.broadcastAction !== null &&
                      this.broadcastAction.setMiniGameInfo &&
                      this.broadcastAction.setMiniGameInfo({
                        status: true,
                        gameNo: MiniGameType.ROLUTTE,
                        ...reqMiniGameAdd,
                      });

                    return null;
                  }

                  case "reqMiniGameEdit": {
                    const { reqMiniGameEdit } = data;

                    this.broadcastAction !== null &&
                      this.broadcastAction.setMiniGameInfo &&
                      this.broadcastAction.setMiniGameInfo({
                        status: true,
                        gameNo: MiniGameType.ROLUTTE,
                        ...reqMiniGameEdit,
                      });

                    this.globalAction !== null &&
                      this.globalAction.callSetToastStatus &&
                      this.globalAction.callSetToastStatus({
                        status: true,
                        message: reqMiniGameEdit.msg,
                      });

                    return null;
                  }

                  case "reqMiniGameStart": {
                    const { reqMiniGameStart } = data;
                    const { nickName, winOpt } = reqMiniGameStart;

                    this.broadcastLayerAction &&
                      this.broadcastLayerAction.dispatchDimLayer({
                        type: "ROULETTE",
                      });

                    this.broadcastAction !== null &&
                      this.broadcastAction.setMiniGameResult &&
                      this.broadcastAction.setMiniGameResult({
                        status: true,
                        gameNo: MiniGameType.ROLUTTE,
                        ...reqMiniGameStart,
                      });

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

                    this.broadcastAction !== null &&
                      this.broadcastAction.setMiniGameInfo &&
                      this.broadcastAction.setMiniGameInfo({
                        status: false,
                      });

                    return null;
                  }

                  case "reqPlayCoin": { // 달나라 동전 생성
                    // 이벤트 진행중 여부 체크
                    const {reqPlayCoin} = data;
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
                      console.error('moonLandStateFn error !!!!', this.broadcastStateChange);
                    }
                    return null;
                  }
                  case "reqPlayAni": { // 달나라 아이템 미션 성공 애니메이션
                    // 이벤트 진행중 여부 체크
                    const {reqPlayAni} = data;
                    // 아이템미션 성공 시 띄우는 달나라 뿅 애니메이션 출력여부
                    if (reqPlayAni && reqPlayAni.hasOwnProperty('aniCode')) {
                      this.broadcastAction.dispatchChatAnimation({
                        type: "start",
                        data: {
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
                        },
                      });
                    }
                    return null;
                  }
                  case "reqDjSetting": { // 방장 dj가 방송 설정을 변경했습니다. ( djTtsSound, djNormalSound )
                    const {dj_normal_sound, dj_tts_sound, text} = data?.reqDjSetting?.inOut;

                    if (dj_normal_sound !== 'undefined' && dj_tts_sound !== 'undefined') {
                      //방장 설정 정보 세팅
                      const djSetting = {djNormalSound: dj_normal_sound, djTtsSound: dj_tts_sound};
                      if(this.broadcastAction?.dispatchRoomInfo){
                        this.setRoomInfo({...this.roomInfo, ...djSetting});
                        this.broadcastAction.dispatchRoomInfo({type:'broadcastSettingUpdate', data: djSetting});

                        this.globalAction && text && !this.roomOwner &&
                        this.globalAction.callSetToastStatus({
                          status: true,
                          message: text,
                        });
                      } else {
                        console.error('reqDjSetting => this.broadcastAction.dispatchRoomInfo : null');
                      }
                    }
                    return null;
                  }
                  case "reqGetStoneByGift": {
                    console.log("reqGetStoneByGift => ", data);
                    this.broadcastStateChange['setStoneAniQueueState']({...data});
                    return null;
                  }

                  default:
                    return null;
                }
              };
              const msgElem = chatMsgElement(data);
              this.addMsgElement(msgElem);
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
              //     this.broadcastAction.setChatCount(this.chatCnt);
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
                  this.globalAction &&
                  this.globalAction.setAlertStatus &&
                  this.globalAction.dispatchRtcInfo &&
                  this.history
                ) {
                  this.privateChannelDisconnect();
                  this.rtcInfo?.stop();
                  this.globalAction.dispatchRtcInfo({ type: "empty" });
                  this.globalAction.setIsShowPlayer && this.globalAction.setIsShowPlayer(false);
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
                      this.globalAction.setAlertStatus({
                        status: true,
                        content: "방송이 종료되었습니다.",
                      });
                    }, 600);
                  }

                  // setTimeout(() => {
                  //   this.globalAction.setAlertStatus({
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
              if (this.broadcastAction !== null && this.broadcastAction.setRightTabType) {
                this.broadcastAction.setUserMemNo(memNo);
                this.broadcastAction.setRightTabType(tabType.PROFILE);
              }
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
                if (this.broadcastAction !== null && this.broadcastAction.setRightTabType) {
                  this.broadcastAction.setUserMemNo(memNo);
                  this.broadcastAction.setRightTabType(tabType.PROFILE);
                }
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
                if (this.broadcastAction !== null && this.broadcastAction.setRightTabType) {
                  this.broadcastAction.setUserMemNo(memNo);
                  this.broadcastAction.setRightTabType(tabType.PROFILE);
                }
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
    //             this.globalAction.callSetToastStatus!({
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
                this.globalAction &&
                this.globalAction.callSetToastStatus!({
                  status: true,
                  message: val.tipMsg,
                });
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
              if (this.broadcastAction !== null && this.broadcastAction.setRightTabType) {
                this.broadcastAction.setUserMemNo(memNo);
                this.broadcastAction.setRightTabType(tabType.PROFILE);
              }
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

  constructor(userInfo: chatUserInfoType) {
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
        this.globalAction &&
          this.globalAction.dispatchChatInfo &&
          this.globalAction.dispatchChatInfo({ type: "init", data: chatInfo });
      } else {
        if (this.isRetryFinish == false) {
          this.globalAction.setAlertStatus &&
            this.globalAction.setAlertStatus({
              status: true,
              type: "alert",
              content: `네트워크 접속이 원할하지 않습니다.\n다시 이용해주시기 바랍니다.`,
              callback: () => {
                window.location.href = "/";
              },
            });
        }
        this.isRetryFinish = true;
      }
    }
  }
}
