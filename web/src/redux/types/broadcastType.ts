import {ActionType} from "typesafe-actions"
import * as actions from "../actions/broadcast"
import {IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack} from "agora-rtc-sdk-ng"
import {CanvasElement, UserType} from "../../common/realtime/rtc_socket"

export type BroadcastActionType = ActionType<typeof actions>

export type BroadcastStateType = {
  wowza: BroadcastWowzaType
  agora: BroadcastAgoraType
  roomInfo?: BroadcastRoomInfoType
  rtcInfo?: RtcInfoType
  guestPost?: GuestPostResponseType
  guest?: GuestResponseType
  guestManagement?: GuestManagementResponseType
  status:BroadcastStatusType
}
export type BroadcastStatusType = {
  clickMove: boolean
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
  videoConstraints?: VideoConstraintsType
  wsConnection?: WebSocket
  peerConnection?: RTCPeerConnection
  // private
  msgListWrapRef?: HTMLDivElement
  displayWrapRef?: HTMLDivElement
}

export type BroadcastRoomInfoType = {
  // auth 0: 일반, 1:매니저, 3: 방장
  auth: 0 | 1 | 3
  badgeFrame: {
    [key: string]: string
  }
  bgImg: {
    [key: string]: string
  }
  bjHolder: string
  bjMemNo: number
  bjNickNm: string
  bjProfImg: {
    [key: string]: string
  }
  bufferingHigh: number
  bufferingLow: number
  chatEndInterval: number
  commonBadgeList: Array<{ [key: string]: any }>

  ctrlRole: string
  djListenerIn: boolean
  djListenerOut: boolean
  entryType: number
  fanBadgeList: Array<{ [key: string]: any }>
  fanRank: Array<{ [key: string]: any }>
  guestBuffering: number
  guests: Array<{ [key: string]: any }>
  hasNotice: boolean
  hasStory: boolean
  imageType: number
  isAttendCheck: boolean
  isAttendUrl: string
  isExtend: boolean
  isFan: boolean
  isFreeze: boolean
  isGuest: boolean
  isLike: boolean
  isNew: boolean
  isPop: boolean
  isRecomm: boolean
  isSpecial: boolean
  badgeSpecial: number
  isMinigame: boolean
  kingMemNo: string
  kingNickNm: string
  kingProfImg: {
    [key: string]: string
  }
  likes: number
  listenerIn: boolean
  listenerOut: boolean
  liveBadgeList: Array<{ [key: string]: any }>
  liveBadgeView: boolean
  liveDjRank: number
  moonCheck: {
    moonStep: number
    moonStepAniFileNm: string
    moonStepFileNm: string
    dlgTitle?: string
    dlgText?: string
  }
  entryCnt: number
  newFanCnt: number
  os: number
  randomMsgList: Array<{ [key: string]: any }>
  rank: number
  remainTime: number
  roomNo: string
  roomType: string
  rtmpEdge: string
  rtmpOrigin: string
  startDt: string
  startTs: number
  state: number
  title: string
  useBoost: boolean
  useGuest: boolean
  miniGameList: Array<any>
  useFilter: boolean
  /* Agora */
  platform: 'agora' | 'wowza'
  agoraAppId: string
  agoraToken: string
  agoraAccount: string

  /* Wowza */
  webRtcAppName: string
  webRtcStreamName: string
  webRtcUrl: string

  videoFrameRate?: number
  videoResolution?: 144 | 288 | 360 | 480 | 540 | 720 | 1080 | 2160
  /* */

  welcomMsg: string
  mediaType: 'a'|'v'

  // Custom
  currentMemNo?: string
  broadState: boolean | true

  // State
  isVideo: boolean
  isMic: boolean

  // 웰컴 이벤트 객체
  eventInfoMap?: {
    imgURL?: string
    pageLink?: string
    positionX?: number
    positionY?: number
    visible: boolean
  } | null
}

export type BroadcastCreateRoomParamType = {
  roomType: string
  title: string
  bgImg: string
  welcomMsg: string
  notice: string
  // 입장 (0:전체, 1:팬 , 2:20세이상)
  entryType: number
  // 스페셜 DJ일 경우 실시간 live 이미지 노출선택(1:프로필, 2:배경)
  imageType: number
  mediaType: 'a' | 'v'
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

export type RtcInfoType = {
  userType: UserType
  // roomInfo?: BroadcastRoomInfoType
  audioTag?: HTMLAudioElement
  videoTag?: HTMLVideoElement
  canvasTag?: CanvasElement

  socketUrl: string
  appName: string
  streamName: string
  sessionId?: string
  // roomNo: string
  // isMono?: boolean
  videoConstraints: VideoConstraintsType

  wsConnection: WebSocket | null;
  peerConnection?: RTCPeerConnection

  msgListWrapRef?: any
  displayWrapRef?: any
}

export type VideoConstraintsType = {
  isVideo?: boolean
  videoFrameRate?: number
  videoResolution?: 144 | 288 | 360 | 480 | 540 | 720 | 1080 | 2160
}

export type RoomInfoResponseDataType = {
  broadNotice: number
  moveUrl: string
  newCnt: number
  qna: number
  byeol: number
  alarm: number
  fanBoard: number
  dal: number
  notice: number
}
export type RoomInfoResponseType = {
  code: string
  data?: RoomInfoResponseDataType
  alarm: number
  broadNotice: number
  byeol: number
  dal: number
  fanBoard: number
  moveUrl: string
  newCnt: number
  notice: number
  qna: number
  message: string
  messageKey: string
  methodName: string
  result: string
  timestamp: string
  validationMessageDetail: Array<any>
}

export type GuestPostPayloadType = {
  roomNo: string
  memNo: string
  mode: string
}
export type GuestPostResponseDataType = {
  mode: number
  memNo: string
  profImg: GuestProfileImageType
  nickNm: string
  proposeCnt: number
  msg: string
  rtmpOrigin: string
  rtmpEdge: string
  webRtcUrl: string
  webRtcAppName: string
  webRtcStreamName: string
}
export type GuestPostResponseType = {
  result: string
  code: string
  messageKey: string
  message: string
  data: GuestPostResponseDataType
  timestamp: string
  validationMessageDetail: Array<any>
  methodName: string
}

export type GuestPagingType = {
  total: number
  records: number
  page: number
  prev: number
  next: number
  totalPage: number
}
export type GuestProfileImageType = {
  url: string
  path: string
  thumb50x50: string
  thumb62x62: string
  thumb80x80: string
  thumb88x88: string
  thumb100x100: string
  thumb120x120: string
  thumb150x150: string
  thumb190x190: string
  thumb292x292: string
  thumb336x336: string
  thumb500x500: string
  thumb700x700: string
}
export type GuestType = {
  memNo: number
  nickNm: string
  memId: string
  gender: 'm' | 'f'
  age: number
  profImg: GuestProfileImageType
  auth: number
  ctrlRole: string
  joinDt: string
  joinTs: number
  isFan: boolean
  byeolCnt: number
  isNewListener: boolean
  isSpecial: boolean
  badgeSpecial: number
  liveFanRank: number
  liveBadgeList: Array<any>
  commonBadgeList: Array<any>
  goodCnt: number
  isGuest: boolean
  managerType: number
}
export type GuestResponseType = {
  result: string
  code: string
  messageKey: string
  message: string
  data: {
    paging: GuestPagingType
    list: Array<GuestType>
    totalMemCnt: number
    noMemCnt: number
  }
  timestamp: string
  validationMessageDetail: Array<any>
  methodName: string
}
export type ManagementGuestType = {
  memNo: string
  nickNm: string
  gender: 'm' | 'f'
  profImg: GuestProfileImageType
  gstState: number
  gstStartDt: string
  gstStartTs: number
  gstProposeState: number
  isFan: boolean
  gstTime: number
  os: OSType
}
export type GuestManagementResponseType = {
  result: string
  code: string
  messageKey: string
  message: string
  data: {
    paging: GuestPagingType
    gstCnt: number
    list: Array<ManagementGuestType>
    proposeCnt: number
  }
  timestamp: string
  validationMessageDetail: Array<any>
  methodName: string
}

export enum OSType {
  Android = 1,
  IOS = 2,
  Desktop = 3
}

