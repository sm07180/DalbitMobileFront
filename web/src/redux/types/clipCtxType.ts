import {ActionType} from "typesafe-actions";
import * as actions from "../actions/clipCtx";
import {tabType} from "../../pages/clip_player/constant";

export type ClipCtxActions = ActionType<typeof actions>

export type ClipCtxStateType = {
  tab: number
  clipInfo: ClipInfoType | null
  isMyClip: boolean
  isPaused: boolean
  rightTabType: tabType
  clipMainSort: number
  clipMainDate: number
  clipMainRefresh: boolean
  clipReplyIdx: number
  lottieUrl: string
  lottie: ClipAnimationType | null
  userMemNo: string
  giftState: GiftStateType
}
export type ClipInfoType = {
  clipNo: string
  clipMemNo: string
  subjectType: string
  title: string
  bgImg: Array<any>
  fileName: string
  file: Array<any>
  filePlay: string
  codeLink: string
  nickName: string
  isGood: boolean
  playCnt: number
  goodCnt: number
  byeolCnt: number
  itemCode: string
  itemCnt: number
}
export type ClipAnimationType = {
  status: boolean
  width?: number
  height?: number
  lottieUrl?: string
  duration?: number
  location?: string
  isCombo?: boolean
  count?: number
  nickName?: string
  profImg?: any
  webpUrl?: string
}

export type GiftStateType = {
  display: boolean,
  itemNo: string,
  cnt: number,
}
