import {ActionType} from 'typesafe-actions'
import * as actions from '../actions/broadcast'
import {
  IAgoraRTCClient,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack
} from "agora-rtc-sdk-ng";
import {MediaType} from "../../pages/broadcast/constant";

export type BroadcastActions = ActionType<typeof actions>

export type BroadcastState = {
  wowza: BroadcastWowzaType
  agora: BroadcastAgoraType
  roomInfo: BroadcastRoomInfoType | null;
}
export type BroadcastAgoraType = {
  client?: IAgoraRTCClient
  localTrack?: BroadcastAgoraLocalTrackType
  state?: any
}
export type BroadcastAgoraLocalTrackType = {
  videoTrack: ILocalVideoTrack
  audioTrack: ILocalAudioTrack
}
export type BroadcastWowzaType = {
  isLoading?: boolean
  // public
  userType?: BroadcastUserType
  roomInfo?: BroadcastRoomInfoType
  audioTag?: HTMLAudioElement
  videoTag?: HTMLVideoElement
  canvasTag?: HTMLCanvasElement
  attendClicked?: boolean
  // protected
  socketUrl?: string
  appName?: string
  streamName?: string
  sessionId?: string
  roomNo?: string
  isMono?: boolean
  videoConstraints?: {
    isVideo?: boolean
    videoFrameRate?: number
    videoResolution?: 144 | 288 | 360 | 480 | 540 | 720 | 1080 | 2160
  }
  wsConnection?: WebSocket
  peerConnection?: RTCPeerConnection
  // private
  msgListWrapRef?: HTMLDivElement
  displayWrapRef?: HTMLDivElement
}

export type BroadcastRoomInfoType = {
  // auth 0: 일반, 1:매니저, 3: 방장
  auth: 0 | 1 | 3;
  badgeFrame: {
    [key: string]: string;
  };
  bgImg: {
    [key: string]: string;
  };
  bjHolder: string;
  bjMemNo: string;
  bjNickNm: string;
  bjProfImg: {
    [key: string]: string;
  };
  bufferingHigh: number;
  bufferingLow: number;
  chatEndInterval: number;
  commonBadgeList: Array<{ [key: string]: any }>;

  ctrlRole: string;
  djListenerIn: boolean;
  djListenerOut: boolean;
  entryType: number;
  fanBadgeList: Array<{ [key: string]: any }>;
  fanRank: Array<{ [key: string]: any }>;
  guestBuffering: number;
  guests: Array<{ [key: string]: any }>;
  hasNotice: boolean;
  hasStory: boolean;
  imageType: number;
  isAttendCheck: boolean;
  isAttendUrl: string;
  isExtend: boolean;
  isFan: boolean;
  isFreeze: boolean;
  isGuest: boolean;
  isLike: boolean;
  isNew: boolean;
  isPop: boolean;
  isRecomm: boolean;
  isSpecial: boolean;
  badgeSpecial: number;
  isMinigame: boolean;
  kingMemNo: string;
  kingNickNm: string;
  kingProfImg: {
    [key: string]: string;
  };
  likes: number;
  listenerIn: boolean;
  listenerOut: boolean;
  liveBadgeList: Array<{ [key: string]: any }>;
  liveBadgeView: boolean;
  liveDjRank: number;
  moonCheck: {
    moonStep: number;
    moonStepAniFileNm: string;
    moonStepFileNm: string;
    dlgTitle?: string;
    dlgText?: string;
  };
  entryCnt: number;
  newFanCnt: number;
  os: number;
  randomMsgList: Array<{ [key: string]: any }>;
  rank: number;
  remainTime: number;
  roomNo: string;
  roomType: string;
  rtmpEdge: string;
  rtmpOrigin: string;
  startDt: string;
  startTs: number;
  state: number;
  title: string;
  useBoost: boolean;
  useGuest: boolean;
  miniGameList: Array<any>;
  useFilter: boolean;
  /* Agora */
  platform:string;
  agoraAppId:string;
  agoraToken:string;
  agoraAccount:string;

  /* Wowza */
  webRtcAppName: string;
  webRtcStreamName: string;
  webRtcUrl: string;

  videoFrameRate?: number;
  videoResolution?: number;
  /* */

  welcomMsg: string;
  mediaType: string;

  // Custom
  currentMemNo?: string;
  broadState: boolean | true;

  // State
  isVideo: boolean;
  isMic: boolean;

  // 웰컴 이벤트 객체
  eventInfoMap?: {
    imgURL?: string;
    pageLink?: string;
    positionX?: number;
    positionY?: number;
    visible: boolean;
  } | null;
}

export type BroadcastCreateRoomParamType = {
  roomType : string
  title : string
  bgImg : string
  welcomMsg : string
  notice : string
  // 입장 (0:전체, 1:팬 , 2:20세이상)
  entryType : number
  // 스페셜 DJ일 경우 실시간 live 이미지 노출선택(1:프로필, 2:배경)
  imageType : number
  mediaType : 'a' | 'v'
}
export type BroadcastSettingType = {
  djListenerIn: boolean
  djListenerOut: boolean
  djNormalSound: boolean
  djTtsSound: boolean
  giftFanReg: boolean
  isSpecial: boolean
  listenOpen: number
  listenerIn: boolean
  listenerOut: boolean
  liveBadgeView: boolean
  normalSound: boolean
  specialBadge: number
  ttsSound: boolean
}
export enum BroadcastUserType {
  HOST = 0,
  GUEST = 1,
  LISTENER = 2,
  GUEST_LISTENER = 3,
}
