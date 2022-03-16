import { CHAT_CONFIG } from "constant/define";

// constant

import { splash } from "common/api";
import {
  setMailBoxImgSliderAddDeleteImg,
  setMailBoxPushChatInfo,
  setMailBoxUserCount
} from "../../redux/actions/mailBox";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxChatInfoInit,
  setGlobalCtxCurrentChatDataEmpty,
  setGlobalCtxIsShowPlayer
} from "../../redux/actions/globalCtx";

// lib
const socketClusterClient = require("socketcluster-client");

type chatUserInfoType = { authToken: string; memNo: string; locale: string; roomNo: string | null };

export class MailChatSocketHandler {
  public socket: any;
  public chatUserInfo: chatUserInfoType;
  public roomOwner: boolean;
  public globalAction: any | null;
  public broadcastAction: any | null;
  public mailboxAction: any | null;
  public guestAction: any | null;
  public dispatch: any | null;

  private publicChannelNo: string;
  public publicChannelHandle: any;
  public privateChannelNo: string;
  public privateChannelHandle: any;

  private splashData: any;
  private msgListWrapRef: any;
  private mailMsgListWrapRef: any;

  public rtcInfo: any;
  public history: any;

  public isConnect: any;
  public reConnect: any;

  public freeze: boolean | undefined;

  public chatCnt: number;

  constructor(userInfo: chatUserInfoType, reConnectHandler?: any, dispatch?:any) {
    this.dispatch = dispatch;
    this.socket = null;
    this.chatUserInfo = userInfo;
    this.roomOwner = false;

    this.splashData = null;

    this.isConnect = false;
    this.reConnect =
      reConnectHandler === undefined || reConnectHandler == null ? new ReConnectChat(this.chatUserInfo, dispatch) : reConnectHandler;

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

    this.connect((result: any) => {
      const { error } = result;
      if (error === false) {
        if (this.socket.getState() === "open") {
          this.connected();
        }
      }
    });
  }

  setUserInfo(userInfo: chatUserInfoType) {
    this.chatUserInfo = userInfo;
    console.log(userInfo);
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

  setGuestAction(action: any) {
    this.guestAction = action;
  }

  setMailboxAction(action: any) {
    this.mailboxAction = action;
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

  setDefaultData(data: { history: any }) {
    const { history } = data;
    this.history = history;
  }

  setChatFreeze(freeze: boolean) {
    this.freeze = freeze;
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
      callback({ error: false, cmd: CHAT_CONFIG.event.socket.CONNECT, msg: msg });
    });
    this.socket.on(CHAT_CONFIG.event.socket.ERROR, (errorCode: number) => {
      this.disconnected(true);
      //this.reConnect.reConnect();
    });
    this.socket.on(CHAT_CONFIG.event.socket.CLOSE, (errorCode: number) => {
      this.disconnected(true);
      //this.reConnect.reConnect();
    });
    this.socket.on(CHAT_CONFIG.event.socket.DISCONNECT, (errorCode: number) => {
      this.disconnected(true);
      //this.reConnect.reConnect();
    });
  }

  destroy(status: { isdestroySocket: boolean; destroyChannelName?: string; isReConnect?: any }) {
    const { isdestroySocket, destroyChannelName, isReConnect } = status;

    const channeldestroy = (channelName: string) => {
      if (this.isPublicChannel(channelName)) {
        if (this.publicChannelHandle !== null) {
          this.publicChannelHandle.unsubscribe();
          this.publicChannelHandle.destroy();
          this.publicChannelHandle = null;
          this.publicChannelNo = "";
        }
      } else {
        if (this.privateChannelHandle !== null) {
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

    if (this.privateChannelHandle !== null) {
      this.privateChannelHandle.unsubscribe();
      this.privateChannelHandle.destroy();
      this.privateChannelHandle = null;
      this.privateChannelNo = "";
      this.reConnect.setPrivateChannelNo(this.privateChannelNo);

      this.dispatch(setGlobalCtxCurrentChatDataEmpty());
    }
  }

  binding(channelName: string, callback: (name: string) => void) {
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
          console.log("감지만할뿐");
        });
      } else {
        //채널 바인딩 (지역채널)
        this.privateChannelNo = channelName;
        this.reConnect.setPrivateChannelNo(this.privateChannelNo);
        this.privateChannelHandle = this.channelBinding(this.privateChannelHandle, channelName);

        this.privateChannelHandle.watch((data: any) => {
          // if (this.splashData === null) {
          //   splash().then((resolve) => {
          //     this.setSplashData(resolve.data);
          //   });
          // }
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
                  this.dispatch(setMailBoxPushChatInfo({
                    ...mailBoxChat,
                  }));
                  return null;
                }
                case "reqMailBoxImageChatDelete": {
                  this.dispatch(setMailBoxImgSliderAddDeleteImg(reqMailBoxImageChatDelete.msgIdx));
                  return null;
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
  public dispatch: any | null;

  constructor(userInfo: chatUserInfoType, dispatch:any) {
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
        const chatInfo = new MailChatSocketHandler(this.chatUserInfo, this, this.dispatch);
        this.dispatch(setGlobalCtxChatInfoInit(chatInfo));
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
