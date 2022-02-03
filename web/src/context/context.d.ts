/** global context type */
type MoveToAlertType = {
  state: 'ready' | 'moved';
  dest: string;
  alertStatus: AlertStatusType;
};
type AlertStatusType = {
  status: boolean;
  type?: string;
  width?: number;
  height?: number;
  title?:
      | string
      | {
    text?: string;
    color?: string;
    border?: string;
  };
  titleStyle?: {
    [key: string]: any;
  };
  subTitle?: string;
  content?: string;
  contentStyle?: {
    [key: string]: any;
  };
  subcont?: string;
  subcontStyle?: {
    [key: string]: any;
  };
  closeType?: boolean;
  image?: string;
  btnCon?: string;
  confirmCancelText?: string;
  confirmText?: string;
  recontent?: string;
  callback?(): void;
  cancelCallback?(): void;
};

type ToastStatusType = {
  status: boolean;
  message?: string;
};
type TooltipStatusType = {
  status: boolean;
  message?: string;
  callback?(): void;
  cancelCallback?(): void;
  style?: {
    [key: string]: any;
  };
  type?: string;
};

type LayerStatusType = {
  rightSide: boolean;
  rightSideType: string;
  searchSide: boolean;
};

type UserInfo = {
  authToken: string | null;
  isLogin: boolean;
  memNo: string;
};
type SplashDataInfo = {
  [key: string]: any;
} | null;

/** broadcast context type */
type chatAnimationType = {
  status: boolean;
  width?: number;
  height?: number;
  url?: string;
  duration?: number;
  location?: string;
  isCombo?: boolean;
  count?: number;
  userNickname?: string;
  userImage?: string;
  webpUrl?: string;
  backgroundImg?: string;
  backgroundColor?: Array<string>;
  soundFileUrl?: string;
  repeatCnt?: number;
  itemNo: string;
  memNo: string;
  ttsItemInfo?: any;
  isTTSItem?: boolean;
  soundOffLocationFlag?: string | null;
};

type userCountType = {
  current: number;
  history: number;
  newFanCnt: number;
};

type realTimeType = {
  likes: number;
  fanRank: Array<any>;
  rank: number;
};

type roomInfoType = {
  auth: number;
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
  eventInfoMap?: { imgURL ?: string; pageLink ?: string; positionX ?: number; positionY ?: number; visible : boolean;} | null;
  // state: boolean;

  // bjMemNo: string;

  // title: string;
  // bgImage: any;
  // bjImage: any;

  // bjMemId: string;
  // bjStreamId: string;
  // bjPubToken?: string;
  // bjPlayToken?: string;

  // link?: string;
  // likes: number;
  // isLike: boolean;
  // isFan: boolean;
  // useBoost: boolean;
  // isNew: boolean;
  // isPop: boolean;
  // isRecomm: boolean;
  // isSpecial: boolean;
  // auth: number;

  // commonBadgeList: Array<any>;

  // roomType: string;
  // entryType: number;
  // welcomMsg: string;

  // startDt?: string;

  // /** Wowza */
  // webRtcUrl?: string;
  // webRtcAppName?: string;
  // webRtcStreamName?: string;

  // micState: boolean | true;
  // isAttendCheck?: boolean | false;

  // rank?: number;
  // fanRank?: Array<any>;
  // likes?: number;

  // isFreeze?: boolean;
  // isExtend?: boolean;

  // imageType?: number;

  // badgeFrame: {
  //   frameAni: string;
  //   frameChat: string;
  //   frameTop: string;
  // };

  // randomMsgList: Array<{ [key: string]: any }>;
  // moonStep: number;
  // moonStepAniFileNm: string;
};

type NormalChatDataType = {
  fan: boolean;
  image: string;
  memNo: string;
  bj: boolean;
  auth: number;
  fanBadge: any;
  badgeLists: Array<any>;
  nk: string;
  msg: string;
};

type ClipPlayListType = {
  clipNo: string;
  subjectType: string;
  title: string;
  bgImg: Array<any>;
  filePlay?: string;
  filePlayTime?: string;
  memNo: string;
  nickName: string;
  gender: string;
  playCnt: number;
  goodCnt: number;
  byeolCnt: number;
  insDt: string;
  insTs: number;
};

type ComboAnimationType = {
  status: boolean;
  repeatCnt?: number;
  itemNo?: string;
  memNo?: string;
  url?: string;
  duration?: number;
  userImage?: string;
  userNickname?: string;
};

type GiftStateType = {
  display: boolean;
  itemNo: string;
  cnt: number;
  guestClicked?: boolean;
};

type RealtimeBroadStatusType = {
  message: string;
  roomNo: string;
  profImg?: {
    [key: string]: string;
  };
  type: string;
  time: string;
  nickNm: string;
  memNo: string;
  status: boolean;
};

type MultiViewType = {
  show: boolean;
  list?: Array<any>;
  initSlide?: number;
};

type rouletteHistoryDataType = {
  roomNo: string;
  memNo: string;
  memNick: string;
  memSex: string;
  memBirthYear: string;
  payAmt: number;
  opt: string;
  lastUpdDate: string;
}

type ttsActionInfoType = {
  showAlarm: boolean;
  actorId: string;
  nickNm: string;
  ttsText: string;
  fileUrl: string;
  duration: number;
  isPlaying: boolean;
}