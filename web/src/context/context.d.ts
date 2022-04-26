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

  isListenerUpdate: boolean
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
