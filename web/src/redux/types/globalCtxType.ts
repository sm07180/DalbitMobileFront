import {ActionType} from "typesafe-actions"
import * as actions from "../actions/globalCtx"
import {InterfaceMediaType, NativePlayerShowParamType} from "./broadcast/interfaceType";
import {AuthType} from "../../constant";

export type GlobalCtxActions = ActionType<typeof actions>

export type GlobalCtxStateType = {
  nativePlayerInfo: NativePlayerInfoType
  nativePlayer: null | NativePlayerType
  roomInfo?: any
  customHeader?: any
  token?: any
  popup: Array<any>
  visible?: boolean
  gnbVisible?: boolean
  login?: boolean
  mediaPlayerStatus?: boolean
  player?: boolean
  backState ?: boolean | null
  backFunction ?: any
  myInfo ?: any
  gnbState ?: any
  castState ?: any
  search ?: any
  logoChange ?: any
  myPageReport ?: any
  userReport ?: any
  myPageFanCnt ?: any
  close ?: any
  closeFanCnt ?: any
  closeStarCnt ?: any

  closeGoodCnt ?: any
  closePresent ?: any
  closeSpeical ?: any
  closeRank ?: any
  closeFanRank ?: any
  boardNumber ?: any
  noticeIndexNum ?: any
  bannerCheck ?: any
  news ?: any
  sticker ?: any
  stickerMsg ?: any
  fanBoardBigIdx ?: any
  toggleState ?: any
  replyIdx ?: any
  noticeState ?: any
  reportDate ?: any
  editImage ?: any
  tempImage ?: any
  walletIdx ?: any
  nativeTid ?: any
  fanTab ?: any
  fanEdit ?: any
  fanEditLength ?: any
  selectFanTab ?: any
  editToggle ?: any
  ctxDeleteList ?: any
  attendStamp ?: any
  adminChecker ?: any
  myPageInfo ?: any
  fanBoardReply ?: any
  fanBoardReplyNum ?: any
  clipMainSort ?: any
  clipMainDate ?: any
  clipRefresh ?: any
  clipTab ?: any
  clipType ?: any
  urlStr ?: any
  boardIdx ?: any
  boardModifyInfo ?: any
  clipState ?: any
  clipPlayerState ?: any
  clipPlayerInfo ?: any
  roomType ?: any
  selfAuth ?: any
  splash ?: any
  isMailboxNew ?: any
  useMailbox ?: any
  authRef ?: any
  appInfo ?: any
  intervalId ?: any

  baseData: BaseDataType
  message: MessageType
  alertStatus: AlertStatusType
  moveToAlert: MoveToAlertType
  layerPopStatus: LayerPopStatusType
  toastStatus: ToastStatusType
  tooltipStatus: TooltipStatusType
  userProfile: UserProfileType
  profile: UserProfileType
  layerStatus: LayerStatusType
  rtcInfo: any
  chatInfo: any
  mailChatInfo: any
  guestInfo: any
  currentChatData: Array<any>
  clipPlayer: any
  broadClipDim: boolean
  clipInfo: any
  checkDev: boolean
  checkAdmin: boolean
  shadowAdmin: 0 | 1
  imgViewerPath: string
  isShowPlayer: boolean
  clipPlayList: Array<any>
  clipPlayListTab: Array<any>
  clipPlayMode: "" | "normal" | "allLoop" | "oneLoop" | "shuffle"
  urlInfo: any
  broadcastAdminLayer: BroadcastAdminLayerType
  inBroadcast: boolean
  alarmStatus: boolean
  alarmMoveUrl: string
  realtimeBroadStatus: RealtimeBroadStatusType
  mailBlockUser: MailBlockUserType
  dateState: string
  multiViewer: MultiViewerType
  isMailboxOn: boolean
  bestDjData: Array<any>
  ageData: number
  authFormRef: HTMLFormElement | null
  noServiceInfo: NoServiceInfoType
  userReportInfo: UserReportInfoType
  exitMarbleInfo: ExitMarbleInfoType
  globalGganbuState: number
  gganbuTab: "" | "collect" | "betting"
  goToMoonTab: "" | "info" | "rank"
  walletData: WalletDataType
  backEventCallback: any
}
export type NativePlayerInfoType={
  state:'open' | 'close' | 'ready',
  roomNo: string
}
export type WalletDataType = {
  walletType: '달 내역' | '별 내역' | '환전'
  dalTotCnt: number,             //보유 달
  byeolTotCnt: number,            //보유 별
  listHistory: Array<any>,      //달, 별 내역
  popHistory: Array<any>,        //사용,획득 조건 리스트
  popHistoryCnt: number,       //누적합계 (프론트에서 직접 합산 처리)
}

export type UserProfileType = {
  auth: number
  managerType: number
  profImg: any
  holder: string
  holderBg: string
  isFan: boolean
  grade: string
  level: number
  nickNm: string
  gender: string
  profMsg: string
  memId: string
  memNo: string
  fanCnt: number
  starCnt: number
  cupidNickNm: string
  cupidMemNo: string
  cupidProfImg: any
  likeTotCnt: number
  fanRank: Array<any>
  expRate: number
  exp: number
  expBegin: number
  expNext: number
  isNew: boolean
  isNewListener: boolean
  isSpecial: boolean
  badgeSpecial: number
  specialDjCnt: number
  wasSpecial: boolean
  fanBadgeList: Array<any>
  liveBadgeList: Array<any>
  commonBadgeList: Array<any>
  isMailboxOn: boolean
  profImgList: Array<any>
  age: number
  birth: string
  dalCnt: number
  byeolCnt: number
  badgePartner: number
}

export type MessageType = {
  title?: string,
  type: '' | 'alert' | 'layerPop' | 'alert_no_close' | 'toast' | 'confirm' | 'confirm_admin'
  buttonMsg?: string
  buttonText?:ButtonTextType
  msg?: string
  remsg?: string
  subMsg?: string
  content?: string
  callback?: any
  cancelCallback?: any
  btnCloseCallback?: any
  visible?: boolean
  status?: boolean
}
export type ButtonTextType = {
  left?: string
  right?: string
}
export type ExitMarbleInfoType = {
  rMarbleCnt: number
  yMarbleCnt: number
  bMarbleCnt: number
  vMarbleCnt: number
  isBjYn: string
  marbleCnt: number
  pocketCnt: number
  showState: boolean
}
export type UserReportInfoType = {
  memNo: string
  memNick: string
  showState: boolean
}
export type NoServiceInfoType = {
  showPageYn: string
  americanAge: number
  limitAge: number
  passed: boolean
}
export type MultiViewerType = {
  show?: boolean
  list?: Array<any>
  initSlide?: number
}
export type MailBlockUserType = {
  memNo: string
  blackMemNo: string
}
export type RealtimeBroadStatusType = {
  profImg: string
  status: boolean
  message: string
  roomNo: string
  type: string
  time: string
  nickNm: string
  memNo: string
}
export type BroadcastAdminLayerType = {
  status: boolean
  roomNo: string
  nickNm: string
  memNo: string
}
export type LayerStatusType = {
  rightSide: boolean
  rightSideType: "" | "user" | "nav" | "alarm"
  searchSide: boolean
}
export type TooltipStatusType = {
  style: any
  type: string
  status: boolean
  message: string
}
export type ToastStatusType = {
  message: string
  status: boolean
}
export type LayerPopStatusType = {
  status: boolean
}
export type MoveToAlertType = {
  state: 'ready' | 'moved'
  dest: string
  alertStatus: AlertStatusType
}
export type AlertStatusType = {
  status: boolean
  content: any
  callback: any
  cancelCallback: any
  titleStyle: any
  title:string
  contentStyle:any
  subCont:any
  closeType:boolean
  confirmCancelText:string
  confirmText:string
  type:string
  subContStyle:any
}
export type BaseDataType = {
  authToken: string | null
  isLogin: boolean
  memNo: string
}

export type NativePlayerType = {
  auth: AuthType
  bjNickNm: string
  bjProfImg: string
  mediaType: InterfaceMediaType
  roomNo: string
  title: string
}
export const DAY_COOKIE_PERIOD = 100
