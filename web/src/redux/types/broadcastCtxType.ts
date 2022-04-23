import {ActionType} from "typesafe-actions"
import * as actions from "../actions/broadcastCtx"
import {tabType} from "../../pages/broadcast/constant"
import {userBroadcastSettingType} from "../../common/realtime/chat_socket"

export type BroadcastCtxActions = ActionType<typeof actions>

export type BroadcastCtxStateType = {
  roomInfo: roomInfoType
  rightTabType: tabType
  chatAnimation: chatAnimationType
  comboAnimation: ComboAnimationType
  userMemNo: string
  userNickNm: string
  userCount: any
  realTimeValue: realTimeType | null
  giftState: GiftStateType,
  listenerList: Array<any>
  msgShortCut: Array<any>
  useBoost: boolean
  extendTime: boolean
  extendTimeOnce: boolean
  storyState: number
  noticeState: number
  likeState: number
  boost: BooleanDataType
  chatFreeze: boolean
  likeClicked: boolean
  commonBadgeList: Array<any>
  isFan: boolean
  chatCount: number
  flipIsLeft: boolean
  isWide: boolean
  videoEffect: VideoEffectType
  miniGameInfo: AnyDataType
  miniGameResult: AnyDataType
  rouletteHistory: RouletteHistoryType
  ttsActorInfo: Array<any>
  ttsActionInfo: ttsActionInfoType
  isTTSPlaying: boolean
  settingObj: userBroadcastSettingType | null
  soundVolume: number
  heartActive: boolean
  chatLimit: boolean
}

export type GiftStateType = {
  display: boolean,
  itemNo: string,
  cnt: number,
}
export type VideoEffectType = {
  makeUp: string
  filter: string
}

export type RouletteHistoryType = {
  currentPage: number
  allData: Array<rouletteHistoryDataType>
  renderingData: Array<rouletteHistoryDataType>
  pagingSize: number
  totalCnt: number
}
export type BooleanDataType = {
  [key: string]: boolean
}
export type AnyDataType = {
  [key: string]: any
}
