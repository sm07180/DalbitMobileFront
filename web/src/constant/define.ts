declare const __NODE_ENV: string;
declare const __API_SERVER_URL: string;
declare const __STATIC_PHOTO_SERVER_URL: string;
declare const __USER_PHOTO_SERVER_URL: string;
declare const __PAY_SERVER_URL: string;
declare const __WEBRTC_SOCKET_URL: string;
declare const __CHAT_SOCKET_URL: string;
declare const __SOCIAL_URL: string;

export const API_SERVER = __API_SERVER_URL;
export const IMG_SERVER = __STATIC_PHOTO_SERVER_URL;
export const PHOTO_SERVER = __USER_PHOTO_SERVER_URL;
export const PAY_SERVER = __PAY_SERVER_URL;
export const WEBRTC_SOCKET_URL = __WEBRTC_SOCKET_URL;
export const CHAT_SOCKET_URL = __CHAT_SOCKET_URL;
export const SOCIAL_URL = __SOCIAL_URL;
export const NODE_ENV = __NODE_ENV;
export const CHAT_CONFIG = {
  socketServerPort: 8000,
  socketServerHost: CHAT_SOCKET_URL,
  // socketServerSecure: __NODE_ENV === "dev" ? false : true,
  socketServerSecure: true,

  locale: {
    ko_KR: "koKR",
    en_US: "enUS",
  },

  channel: {
    public: "channel.public.dalbit", //public channel
  },

  packet: {
    send: {
      PACKET_SEND_CHAT: "chat", //채팅 메세지
      PACKET_SEND_USRES: "users",
      PACKET_SEND_LOGIN: "login",
      PACKET_SEND_LOGIN_TK: "loginToken",
      PACKET_SEND_EMIT: "emit",
      PACKET_SEND_RECONNECT_BJ: "bjReconnect", //BJ재접속
      PACKET_SEND_CHAT_END: "chatEnd", //BJ/채팅종료
      PACKET_SEND_CHAT_END_MSG: "chatEndMsg", //채팅종료 메세지
      PACKET_SEND_CHAT_END_RED: "chatEndRed", //중복접속 채팅종료 메세지

      PACKET_SEND_REQ_PLAYTOKEN: "reqPlayToken", //playToken 생성 요청
      PACKET_SEND_REQ_MIC_ON: "reqMicOn", //마이크 On
      PACKET_SEND_REQ_MIC_OFF: "reqMicOff", //마이크 Off
      PACKET_SEND_REQ_CALLING: "reqCalling", //통화중
      PACKET_SEND_REQ_ENDCALL: "reqEndCall", //통화종료

      PACKET_SEND_REQ_MEDIA_ON: "reqMediaOn", //Ant미디어서버정상
      PACKET_SEND_REQ_MEDIA_OFF: "reqMediaOff", //Ant미디어서버오류
      PACKET_SEND_REQ_ANT_CONNECT: "reqBjAntConnect",
      PACKET_SEND_REQ_ANT_DISSCONNECT: "reqBjAntDisconnect",

      PACKET_SEND_REQ_GRANT: "reqGrant", //매니져 지정/해제
      PACKET_SEND_REQ_ROOMCHANGEINFO: "reqRoomChangeInfo", //채팅방 정보수정
      PACKET_SEND_REQ_ROOMTIME: "reqRoomChangeTime", //채팅방 방송시간 연장
      PACKET_SEND_REQ_COUNT: "reqChangeCount", //랭킹,좋아요수 변경

      PACKET_SEND_REQ_STORY: "reqStory", //사연작성
      PACKET_SEND_REQ_NOTICE: "reqNotice", //공지사항작성
      PACKET_SEND_REQ_BOOSTER: "reqBooster", //부스터
      PACKET_SEND_REQ_BOOSTER_END: "reqBoosterEnd", //부스터종료
      PACKET_SEND_REQ_GOOD: "reqGood", //좋아요
      PACKET_SEND_REQ_GOOD_FIRST: "reqGoodFirst", //최초좋아요
      PACKET_SEND_REQ_FAN: "reqFan", //팬등록/해제
      PACKET_SEND_REQ_GUEST: "reqGuest", //게스트 초대/취소/승락/거절
      PACKET_SEND_REQ_GIFT_DAL: "reqGiftDal", //달선물
      PACKET_SEND_REQ_GIFT_IMG: "reqGiftImg", //이미지선물
      PACKET_SEND_REQ_KICKOUT: "reqKickOut", //강퇴
      PACKET_SEND_REQ_WELCOME: "reqWelcome", //인사말
      PACKET_SEND_REQ_BC_START: "reqBcStart", //방송시작

      PACKET_SEND_REQ_ALERT: "reqAlert", //알림메세지
      PACKET_SEND_REQ_MYINFO: "reqMyInfo", //내정보수정
      PACKET_SEND_REQ_BANWORD: "reqBanWord", //금칙어 업데이트
      PACKET_SEND_REQ_ITEM: "reqChangeItem", //아이템목록변경
      PACKET_SEND_REQ_LEVELUP_BJ: "reqLevelUpBj", //레벨변경
      PACKET_SEND_REQ_LEVELUP_SELF: "reqLevelUpSelf", //레벨변경
    },
    recv: {
      PACKET_RECV_CHAT: "chat", //채팅 메세지
      PACKET_RECV_USERS: "users",
      PACKET_RECV_LOGIN: "login",
      PACKET_RECV_LOGIN_TK: "loginToken",
      PACKET_RECV_EMIT: "emit",
      PACKET_RECV_TIME: "time", //서버시간
      PACKET_RECV_TOKEN: "token", //Ant Media Server Token
      PACKET_RECV_CONNECT: "connect", //다른 접속자 접속 알림 메세지
      PACKET_RECV_RECONNECT_BJ: "bjReconnect", //BJ재접속
      PACKET_RECV_DISCONNECT: "disconnect", //다른 접속자 접속해제 알림 메세지
      PACKET_RECV_CHAT_END: "chatEnd", //BJ/채팅종료
      PACKET_RECV_CHAT_END_MSG: "chatEndMsg", //채팅종료 메세지
      PACKET_RECV_CHAT_END_RED: "chatEndRed", //중복접속 채팅종료 메세지

      PACKET_RECV_REQ_PLAYTOKEN: "reqPlayToken", //playToken 생성 요청
      PACKET_RECV_REQ_MIC_ON: "reqMicOn", //마이크 On
      PACKET_RECV_REQ_MIC_OFF: "reqMicOff", //마이크 Off
      PACKET_RECV_REQ_CALLING: "reqCalling", //통화중
      PACKET_RECV_REQ_ENDCALL: "reqEndCall", //통화종료

      PACKET_RECV_REQ_MEDIA_ON: "reqMediaOn", //Ant미디어서버정상
      PACKET_RECV_REQ_MEDIA_OFF: "reqMediaOff", //Ant미디어서버오류
      PACKET_RECV_REQ_ANT_CONNECT: "reqBjAntConnect",
      PACKET_RECV_REQ_ANT_DISSCONNECT: "reqBjAntDisconnect",

      PACKET_RECV_REQ_GRANT: "reqGrant", //매니져 지정/해제
      PACKET_RECV_REQ_ROOMCHANGEINFO: "reqRoomChangeInfo", //채팅방 정보수정
      PACKET_RECV_REQ_ROOMTIME: "reqRoomChangeTime", //채팅방 방송시간 연장
      PACKET_RECV_REQ_COUNT: "reqChangeCount", //랭킹,좋아요수 변경

      PACKET_RECV_REQ_STORY: "reqStory", //사연작성
      PACKET_RECV_REQ_NOTICE: "reqNotice", //공지사항작성
      PACKET_RECV_REQ_BOOSTER: "reqBooster", //부스터
      PACKET_RECV_REQ_BOOSTER_END: "reqBoosterEnd", //부스터종료
      PACKET_RECV_REQ_GOOD: "reqGood", //좋아요
      PACKET_RECV_REQ_GOOD_FIRST: "reqGoodFirst", //최초좋아요
      PACKET_RECV_REQ_FAN: "reqFan", //팬등록/해제
      PACKET_RECV_REQ_GUEST: "reqGuest", //게스트 초대/취소/승락/거절
      PACKET_RECV_REQ_GIFT_DAL: "reqGiftDal", //달선물
      PACKET_RECV_REQ_GIFT_IMG: "reqGiftImg", //이미지선물
      PACKET_RECV_REQ_KICKOUT: "reqKickOut", //강퇴
      PACKET_RECV_REQ_WELCOME: "reqWelcome", //인사말
      PACKET_RECV_REQ_BC_START: "reqBcStart", //방송시작

      PACKET_RECV_REQ_ALERT: "reqAlert", //알림메세지
      PACKET_RECV_REQ_MYINFO: "reqMyInfo", //내정보수정
      PACKET_RECV_REQ_BANWORD: "reqBanWord", //금칙어 업데이트
      PACKET_RECV_REQ_ITEM: "reqChangeItem", //아이템목록변경
      PACKET_RECV_REQ_LEVELUP_BJ: "reqLevelUpBj", //레벨변경
      PACKET_RECV_REQ_LEVELUP_SELF: "reqLevelUpSelf", //레벨변경
    },
  },

  event: {
    socket: {
      CONNECT: "connect",
      SUBSCRIBE: "subscribe",
      SUBSCRIBEFAIL: "subscribeFail",
      UNSUBSCRIBE: "unsubscribe",
      SUBSCRIBESTATECHANGE: "subscribeStateChange",
      DISCONNECT: "disconnect",
      ERROR: "error",
      MESSAGE: "message",

      CONNECTABORT: "connectAbort",
      CLOSE: "close",
      OPEN: "open",
      CONNECTING: "connecting",
      RAW: "raw",
      KICKOUT: "kickOut",
      AUTHSTATECHANGE: "authStateChange",
      SUBSCRIBEREQUEST: "subscribeRequest",
      AUTHENTICATE: "authenticate",
      DEAUTHENTICATE: "deauthenticate",
    },
    channel: {
      SUBSCRIBE: "subscribe",
      SUBSCRIBEFAIL: "subscribeFail",

      DROPOUT: "dropOut",
      UNSUBSCRIBE: "unsubscribe",
      SUBSCRIBESTATECHANGE: "subscribeStateChange",
    },
  },

  command: {
    CHATROOM_OUT_USER: "userOut", //BJ아닌접속자방나감 - 구독해제
    CHATROOM_OUT_BJ: "bjOut", //BJ방나감 - 구독해제(채팅방종료)
    CHATROOM_OUT: "roomOut", //채팅방 종료 - 구독해제(채팅방종료)
    CHATROOM_OUT_END: "roomExpectedOut", //서버에서 채팅방 종료 - expected_end_date
    CHATROOM_OUT_END_BJ: "roomExceptionOut", //서버에서 채팅방 종료 - exception_date
    CHATROOM_JOIN: "roomJoin",
    CHATROOM_JOIN_HELLO: "roomJoinHello",
  },

  error: {
    4600: "",
    4601: "",
    4602: "",
    4603: "NONE",
    4604: "",
    4605: "",
    4606: "",
    4607: "",
    4608: "TERMINATE",
    4609: "KICKOUT",
  },
};
CHAT_CONFIG["restServer"] = `${
  CHAT_CONFIG["socketServerSecure"] === true ? "https" : "http"
}://${CHAT_SOCKET_URL}:${CHAT_CONFIG["socketServerPort"]}`;
