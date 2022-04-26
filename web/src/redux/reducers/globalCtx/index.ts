import {createReducer} from "typesafe-actions";
import {DAY_COOKIE_PERIOD, GlobalCtxActions, GlobalCtxStateType, WalletDataType} from "../../types/globalCtxType";
import {convertDateFormat} from "../../../lib/dalbit_moment";
import {convertMonday} from "../../../lib/rank_fn";
import Api from "../../../context/api";
import Utility from "../../../components/lib/utility";
import {CHAT_MAX_COUNT} from "../../../pages/broadcast/constant";

//baseData, mailChatInfo, mailBlockUser
const initUserProfile = {
  auth: 0,
  managerType: 0,
  profImg: '',
  holder: '',
  holderBg: '',
  isFan: false,
  grade: '',
  level: 0,
  nickNm: '',
  gender: '',
  profMsg: '',
  memId: '',
  memNo: '',
  fanCnt: 0,
  starCnt: 0,
  cupidNickNm: '',
  cupidMemNo: '',
  cupidProfImg: '',
  likeTotCnt: 0,
  fanRank: [],
  expRate: 0,
  exp: 0,
  expBegin: 0,
  expNext: 0,
  isNew: false,
  isNewListener: false,
  isSpecial: false,
  badgeSpecial: 0,
  specialDjCnt: 0,
  wasSpecial: false,
  fanBadgeList: [],
  liveBadgeList: [],
  commonBadgeList: [],
  isMailboxOn: false,
  profImgList: [],
  age: 0,
  birth: '',
  dalCnt: 0,
  byeolCnt: 0,
  badgePartner: 0,
}
const initWalletData:WalletDataType = {
  walletType: '달 내역',
  dalTotCnt: 0,
  byeolTotCnt: 0,
  listHistory: [],
  popHistory: [],
  popHistoryCnt: 0
}
const initialState: GlobalCtxStateType = {
  nativePlayer: null,
  message: {
    title: '',
    type: '',
    msg: '',
    visible:false,
    callback: ()=>{}
  },
  roomInfo: null,
  baseData: {
    authToken: null,
    isLogin: false,
    memNo: '',
  },
  alertStatus: {
    type:'',
    confirmText:'',
    subContStyle:{},
    closeType:false,
    confirmCancelText:'',
    contentStyle: {},
    subCont: '',
    title:'',
    titleStyle: {},
    status: false,
    content: '',
    callback: ()=>{},
    cancelCallback: ()=>{}
  },
  moveToAlert: {
    state: 'ready',
    dest: '',
    alertStatus: {
      type:'',
      confirmText:'',
      subContStyle:{},
      closeType:false,
      confirmCancelText:'',
      contentStyle: {},
      subCont: '',
      title:'',
      titleStyle: {},
      status: false,
      content: '',
      callback: ()=>{},
      cancelCallback: ()=>{}
    }
  },
  layerPopStatus: {
    status: false,
  },
  toastStatus: {
    message: '',
    status: false,
  },

  tooltipStatus: {
    style: {},
    type: '',
    status: false,
    message: ''
  },
  userProfile: initUserProfile,
  profile: initUserProfile,
  layerStatus: {
    rightSide: false,
    rightSideType: "user",
    searchSide: false,
  },
  rtcInfo: null,
  chatInfo: null,
  mailChatInfo: null,
  guestInfo: {
    type: "EMPTY",
  },
  currentChatData: [],
  clipPlayer: null,
  broadClipDim: false,
  clipInfo: null,
  checkDev: false,
  checkAdmin: false,
  shadowAdmin: 0,
  imgViewerPath: "",
  isShowPlayer: false,
  clipPlayList: [],
  clipPlayListTab: [],
  clipPlayMode: "normal",
  urlInfo: {},
  broadcastAdminLayer: {
    status: false,
    roomNo: "",
    nickNm: "",
    memNo: ""
  },
  inBroadcast: false,
  alarmStatus: false,
  alarmMoveUrl: "",
  realtimeBroadStatus: {
    profImg: "",
    status: false,
    message: "",
    roomNo: "",
    type: "",
    time: "",
    nickNm: "",
    memNo: "",
  },
  mailBlockUser: {
    memNo: "",
    blackMemNo: "",
  },
  dateState: convertDateFormat(convertMonday(), "YYYY-MM-DD"),
  multiViewer: {
    show: false,
    list: []
  },
  isMailboxOn: true,
  bestDjData: [],
  ageData: 14,
  authFormRef: null,
  noServiceInfo: {
    showPageYn: "",
    americanAge: 0,
    limitAge: 14,
    passed: false,
  },
  userReportInfo: {
    memNo: "",
    memNick: "",
    showState: false,
  },
  exitMarbleInfo: {
    rMarbleCnt: 0,
    yMarbleCnt: 0,
    bMarbleCnt: 0,
    vMarbleCnt: 0,
    isBjYn: "",
    marbleCnt: 0,
    pocketCnt: 0,
    showState: false,
  },
  globalGganbuState: -1,
  gganbuTab: "collect",
  goToMoonTab: "info",
  walletData:initWalletData,
  popup:[],
  backEventCallback: null
};


const global = createReducer<GlobalCtxStateType, GlobalCtxActions>(initialState, {
  "global/ctx/SET_NATIVE_PLAYER": (state, {payload}) => {
    return {...state, nativePlayer: payload}
  },
  "global/ctx/SET_MESSAGE": (state, {payload}) => {
    return {...state, message: {...state.message, visible:true, ...payload}}
  },
  "global/ctx/SET_ROOM_INFO": (state, {payload}) => {
    return {...state, roomInfo: payload}
  },
  "global/ctx/UPDATE_PROFILE": (state, {payload}) => {
    return {...state, userProfile: payload, profile: payload}
  },
  "global/ctx/SET_CUSTOM_HEADER": (state, {payload}) => {
    if (payload) {
      const stringified = JSON.stringify(payload)
      Api.setCustomHeader(stringified)
      Utility.setCookie('custom-header', '', -1)
      Utility.setCookie('custom-header', stringified, DAY_COOKIE_PERIOD)
      return {...state, customHeader: payload}
    } else {
      Api.setCustomHeader(null)
      Utility.setCookie('custom-header', '', -1)
      Utility.setCookie('custom-header', '', DAY_COOKIE_PERIOD)
      return {...state, customHeader: null}
    }
  },
  "global/ctx/UPDATE_TOKEN": (state, {payload}) => {
    // to
    if (payload) {
      const {authToken, memNo} = payload
      const firstLetterOfMemNo = String(memNo)[0]
      Api.setAuthToken(authToken)
      Utility.setCookie('authToken', '', -1)
      Utility.setCookie('authToken', authToken, DAY_COOKIE_PERIOD)
      return {...state, token: payload, baseData: payload}
    } else {
      Api.setAuthToken(null)
      Utility.setCookie('authToken', '', -1)
      Utility.setCookie('authToken', '', DAY_COOKIE_PERIOD)
      return {...state, token: null}
    }
  },
  "global/ctx/SET_MY_INFO": (state, {payload}) => {
    return {...state, myInfo: payload}
  },
  "global/ctx/UPDATE_POPUP": (state, {payload}) => {
    return {...state, popup: payload.popup, visible: true};
  },
  "global/ctx/SET_VISIBLE": (state, {payload}) => {
    return {...state, visible: payload}
  },
  "global/ctx/SET_GNB_VISIBLE": (state, {payload}) => {
    if (!payload) {
      document.body.classList.remove('on')
    }
    return {...state, gnbVisible: payload};
  },
  "global/ctx/SET_GNB_STATE": (state, {payload}) => {
    return {...state, gnbState: payload}
  },
  "global/ctx/UPDATE_LOGIN": (state, {payload}) => {
    return {...state, login: payload, gnbVisible: false}
  },
  "global/ctx/SET_MEDIA_PLAYER_STATUS": (state, {payload}) => {
    if (!payload) {
      Utility.setCookie('native-player-info', '', -1)
    }
    return {...state, mediaPlayerStatus: payload}
  },
  "global/ctx/SET_CAST_STATE": (state, {payload}) => {
    return {...state, castState: payload}
  },
  "global/ctx/SET_SEARCH": (state, {payload}) => {
    return {...state, search: payload}
  },
  "global/ctx/SET_LOGO_CHANGE": (state, {payload}) => {
    return {...state, logoChange: payload}
  },
  "global/ctx/SET_PLAYER": (state, {payload}) => {
    if (!payload) {
      Utility.setCookie('native-player-info', '', -1)
    }
    return {...state, player: payload}
  },
  "global/ctx/SET_MY_PAGE_REPORT": (state, {payload}) => {
    return {...state, myPageReport: payload}
  },
  "global/ctx/SET_USER_REPORT": (state, {payload}) => {
    return {...state, userReport: payload}
  },
  "global/ctx/SET_MY_PAGE_FAN_CNT": (state, {payload}) => {
    return {...state, myPageFanCnt: payload}
  },
  "global/ctx/SET_CLOSE": (state, {payload}) => {
    return {...state, close: payload}
  },
  "global/ctx/SET_CLOSE_FAN_CNT": (state, {payload}) => {
    return {...state, closeFanCnt: payload}
  },
  "global/ctx/SET_CLOSE_STAR_CNT": (state, {payload}) => {
    return {...state, closeStarCnt: payload}
  },
  "global/ctx/SET_CLOSE_GOOD_CNT": (state, {payload}) => {
    return {...state, closeGoodCnt: payload}
  },
  "global/ctx/SET_CLOSE_PRESENT": (state, {payload}) => {
    return {...state, closePresent: payload}
  },
  "global/ctx/SET_CLOSE_SPECIAL": (state, {payload}) => {
    return {...state, closeSpeical: payload}
  },
  "global/ctx/SET_CLOSE_RANK": (state, {payload}) => {
    return {...state, closeRank: payload}
  },
  "global/ctx/SET_CLOSE_FAN_RANK": (state, {payload}) => {
    return {...state, closeFanRank: payload}
  },
  "global/ctx/SET_BOARD_NUMBER": (state, {payload}) => {
    return {...state, boardNumber: payload}
  },
  "global/ctx/SET_NOTICE_INDEX_NUM": (state, {payload}) => {
    return {...state, noticeIndexNum: payload}
  },
  "global/ctx/SET_BANNER_CHECK": (state, {payload}) => {
    return {...state, bannerCheck: payload}
  },
  "global/ctx/SET_EXIT_MARBLE_INFO": (state, {payload}) => {
    return {...state, exitMarbleInfo: payload}
  },
  "global/ctx/SET_GLOBAL_GGANBU_STATE": (state, {payload}) => {
    return {...state, globalGganbuState: payload}
  },
  "global/ctx/SET_NEWS": (state, {payload}) => {
    return {...state, news: payload}
  },
  "global/ctx/SET_STICKER": (state, {payload}) => {
    return {...state, sticker: payload}
  },
  "global/ctx/SET_STICKER_MSG": (state, {payload}) => {
    return {...state, stickerMsg: payload}
  },
  "global/ctx/SET_FAN_BOARD_BIG_IDX": (state, {payload}) => {
    return {...state, fanBoardBigIdx: payload}
  },
  "global/ctx/SET_TOGGLE_STATE": (state, {payload}) => {
    return {...state, toggleState: payload}
  },
  "global/ctx/SET_REPLY_IDX": (state, {payload}) => {
    return {...state, replyIdx: payload}
  },
  "global/ctx/SET_NOTICE_STATE": (state, {payload}) => {
    return {...state, noticeState: payload}
  },
  "global/ctx/SET_REPORT_DATE": (state, {payload}) => {
    return {...state, reportDate: payload}
  },
  "global/ctx/SET_EDIT_IMAGE": (state, {payload}) => {
    return {...state, editImage: payload}
  },
  "global/ctx/SET_TEMP_IMAGE": (state, {payload}) => {
    return {...state, tempImage: payload}
  },
  "global/ctx/SET_WALLET_IDX": (state, {payload}) => {
    return {...state, walletIdx: payload}
  },
  "global/ctx/SET_NATIVE_TID": (state, {payload}) => {
    return {...state, nativeTid: payload}
  },
  "global/ctx/SET_FAN_TAB": (state, {payload}) => {
    return {...state, fanTab: payload}
  },
  "global/ctx/SET_FAN_EDIT": (state, {payload}) => {
    return {...state, fanEdit: payload}
  },
  "global/ctx/SET_FAN_EDIT_LENGTH": (state, {payload}) => {
    return {...state, fanEditLength: payload}
  },
  "global/ctx/SET_SELECT_FAN_TAB": (state, {payload}) => {
    return {...state, selectFanTab: payload}
  },
  "global/ctx/SET_EDIT_TOGGLE": (state, {payload}) => {
    return {...state, editToggle: payload}
  },
  "global/ctx/SET_CTX_DELETE_LIST": (state, {payload}) => {
    return {...state, ctxDeleteList: payload}
  },
  "global/ctx/SET_ATTEND_STAMP": (state, {payload}) => {
    return {...state, attendStamp: payload}
  },
  "global/ctx/SET_ADMIN_CHECKER": (state, {payload}) => {
    return {...state, adminChecker: payload}
  },
  "global/ctx/SET_MY_PAGE_INFO": (state, {payload}) => {
    return {...state, myPageInfo: payload}
  },
  "global/ctx/SET_FAN_BOARD_REPLY": (state, {payload}) => {
    return {...state, fanBoardReply: payload}
  },
  "global/ctx/SET_FAN_BOARD_REPLY_NUM": (state, {payload}) => {
    return {...state, fanBoardReplyNum: payload}
  },
  "global/ctx/SET_CLIP_MAIN_SORT": (state, {payload}) => {
    return {...state, clipMainSort: payload}
  },
  "global/ctx/SET_CLIP_MAIN_DATE": (state, {payload}) => {
    return {...state, clipMainDate: payload}
  },
  "global/ctx/SET_CLIP_REFRESH": (state, {payload}) => {
    return {...state, clipRefresh: payload}
  },
  "global/ctx/SET_CLIP_TAB": (state, {payload}) => {
    return {...state, clipTab: payload}
  },
  "global/ctx/SET_CLIP_TYPE": (state, {payload}) => {
    return {...state, clipType: payload}
  },
  "global/ctx/SET_URL_STR": (state, {payload}) => {
    return {...state, urlStr: payload}
  },
  "global/ctx/SET_BOARD_IDX": (state, {payload}) => {
    return {...state, boardIdx: payload}
  },
  "global/ctx/SET_BOARD_MODIFY_INFO": (state, {payload}) => {
    return {...state, boardModifyInfo: payload}
  },
  "global/ctx/SET_CLIP_STATE": (state, {payload}) => {
    return {...state, clipState: payload}
  },
  "global/ctx/SET_CLIP_PLAYER_STATE": (state, {payload}) => {
    return {...state, clipPlayerState: payload}
  },
  "global/ctx/SET_CLIP_PLAYER_INFO": (state, {payload}) => {
    return {...state, clipPlayerInfo: payload}
  },
  "global/ctx/SET_ROOM_TYPE": (state, {payload}) => {
    return {...state, roomType: payload}
  },
  "global/ctx/SET_BACK_STATE": (state, {payload}) => {
    return {...state, backState: payload}
  },
  "global/ctx/SET_BACK_FUNCTION": (state, {payload}) => {
    return {...state, backFunction: payload}
  },
  "global/ctx/SET_SELF_AUTH": (state, {payload}) => {
    return {...state, selfAuth: payload}
  },
  "global/ctx/SET_SPLASH": (state, {payload}) => {
    return {...state, splash: payload}
  },
  "global/ctx/SET_IS_MAILBOX_NEW": (state, {payload}) => {
    return {...state, isMailboxNew: payload}
  },
  "global/ctx/SET_USE_MAILBOX": (state, {payload}) => {
    return {...state, useMailbox: payload}
  },
  "global/ctx/SET_IS_MAILBOX_ON": (state, {payload}) => {
    return {...state, isMailboxOn: payload}
  },
  "global/ctx/SET_DATE_STATE": (state, {payload}) => {
    return {...state, dateState: payload}
  },
  "global/ctx/UPDATE_MULTI_VIEWER": (state, {payload}) => {
    if (payload.show) {
      return {...state, multiViewer: payload, backState: true, backFunction: {name: 'multiViewer'}}
    } else {
      return {...state, multiViewer: payload, backState: null}
    }
  },
  "global/ctx/SET_BEST_DJ_DATA": (state, {payload}) => {
    return {...state, bestDjData: payload}
  },
  "global/ctx/SET_GGANBU_TAB": (state, {payload}) => {
    return {...state, gganbuTab: payload}
  },
  "global/ctx/SET_GO_TO_MOON_TAB": (state, {payload}) => {
    return {...state, goToMoonTab: payload}
  },
  "global/ctx/SET_AUTH_REF": (state, {payload}) => {
    return {...state, authRef: payload}
  },
  "global/ctx/SET_NO_SERVICE_INFO": (state, {payload}) => {
    return {...state, noServiceInfo: payload}
  },
  "global/ctx/SET_APP_INFO": (state, {payload}) => {
    return {...state, appInfo: payload}
  },
  "global/ctx/SET_INTERVAL_ID": (state, {payload}) => {
    return {...state, intervalId: payload}
  },
  "global/ctx/SET_ALERT_STATUS": (state, {payload}) => {
    return {...state, alertStatus: payload}
  },
  "global/ctx/SET_LAYER_POP_STATUS": (state, {payload}) => {
    return {...state, layerPopStatus: payload}
  },
  "global/ctx/SET_MOVE_TO_ALERT": (state, {payload}) => {
    return {...state, moveToAlert: payload}
  },
  "global/ctx/SET_TOAST_STATUS": (state, {payload}) => {
    return {...state, toastStatus: payload}
  },
  "global/ctx/SET_TOOLTIP_STATUS": (state, {payload}) => {
    return {...state, tooltipStatus: payload}
  },
  "global/ctx/SET_USER_PROFILE": (state, {payload}) => {
    return {...state, userProfile: payload, profile: payload}
  },
  "global/ctx/SET_BROAD_CLIP_DIM": (state, {payload}) => {
    return {...state, broadClipDim: payload}
  },
  "global/ctx/SET_CHECK_DEV": (state, {payload}) => {
    return {...state, checkDev: payload}
  },
  "global/ctx/SET_CHECK_ADMIN": (state, {payload}) => {
    return {...state, checkAdmin: payload}
  },
  "global/ctx/SET_SHADOW_ADMIN": (state, {payload}) => {
    return {...state, shadowAdmin: payload}
  },
  "global/ctx/SET_IMG_VIEWER_PATH": (state, {payload}) => {
    return {...state, imgViewerPath: payload}
  },
  "global/ctx/SET_IS_SHOW_PLAYER": (state, {payload}) => {
    return {...state, isShowPlayer: payload}
  },
  "global/ctx/SET_CLIP_PLAY_MODE": (state, {payload}) => {
    return {...state, clipPlayMode: payload.clipPlayMode}
  },
  "global/ctx/SET_URL_INFO": (state, {payload}) => {
    return {...state, urlInfo: payload}
  },
  "global/ctx/SET_BROADCAST_ADMIN_LAYER": (state, {payload}) => {
    return {...state, broadcastAdminLayer: payload}
  },
  "global/ctx/SET_IN_BROADCAST": (state, {payload}) => {
    return {...state, inBroadcast: payload}
  },
  "global/ctx/SET_ALARM_STATUS": (state, {payload}) => {
    return {...state, alarmStatus: payload}
  },
  "global/ctx/SET_ALARM_MOVE_URL": (state, {payload}) => {
    return {...state, alarmMoveUrl: payload}
  },
  "global/ctx/SET_REALTIME_BROAD_STATUS": (state, {payload}) => {
    return {...state, realtimeBroadStatus: payload}
  },
  "global/ctx/SET_MAIL_BLOCK_USER": (state, {payload}) => {
    return {...state, mailBlockUser: payload}
  },
  "global/ctx/SET_AGE_DATA": (state, {payload}) => {
    return {...state, ageData: payload}
  },
  "global/ctx/SET_AUTH_FORM_REF": (state, {payload}) => {
    return {...state, authFormRef: payload}
  },
  "global/ctx/SET_USER_REPORT_INFO": (state, {payload}) => {
    return {...state, userReportInfo: payload}
  },
  // reducer
  "global/ctx/LAYER_STATUS_OPEN_RIGHT_SIDE_USER": (state) => {
    return {...state, layerStatus: {...state.layerStatus, rightSide: true, rightSideType: "user"}}
  },
  "global/ctx/LAYER_STATUS_OPEN_RIGHT_SIDE_NAV": (state) => {
    return {...state, layerStatus: {...state.layerStatus, rightSide: true, rightSideType: "nav"}}
  },
  "global/ctx/LAYER_STATUS_OPEN_RIGHT_SIDE_ALARM": (state) => {
    return {...state, layerStatus: {...state.layerStatus, rightSide: true, rightSideType: "alarm"}}
  },
  "global/ctx/LAYER_STATUS_CLOSE_RIGHT_SIDE": (state) => {
    return {...state, layerStatus: {...state.layerStatus, rightSide: false}}
  },
  "global/ctx/LAYER_STATUS_OPEN_SEARCH_SIDE": (state) => {
    return {...state, layerStatus: {...state.layerStatus, searchSide: true}}
  },
  "global/ctx/LAYER_STATUS_CLOSE_SEARCH_SIDE": (state) => {
    return {...state, layerStatus: {...state.layerStatus, searchSide: false}}
  },
  "global/ctx/LAYER_STATUS_CLOSE_ALL_SIDE": (state) => {
    return {...state, layerStatus: {...state.layerStatus, rightSide: false, searchSide: false}}
  },
  "global/ctx/RTC_INFO_INIT": (state, {payload}) => {
    return {...state, rtcInfo: payload}
  },
  "global/ctx/RTC_INFO_EMPTY": (state) => {
    return {...state, rtcInfo: null}
  },
  "global/ctx/CHAT_INFO_INIT": (state, {payload}) => {
    return {...state, chatInfo: payload}
  },
  "global/ctx/MAIL_CHAT_INFO_INIT": (state, {payload}) => {
    return {...state, mailChatInfo: payload}
  },
  "global/ctx/GUEST_INFO_INIT": (state, {payload}) => {
    return {...state, guestInfo: {[payload.memNo]: payload.RTC}}
  },
  "global/ctx/GUEST_INFO_ADD": (state, {payload}) => {
    return {...state, guestInfo: {...state.guestInfo, [payload.memNo]: payload.RTC}}
  },
  "global/ctx/GUEST_INFO_REMOVE": (state, {payload}) => {
    // immutable
    const guestInfo = Object.assign({}, state.guestInfo);
    if (guestInfo[payload.memNo]) {
      delete guestInfo[payload.memNo]
    }
    if (Object.keys(guestInfo).length === 0) {
      return {...state, guestInfo: null}
    } else {
      return state
    }
  },
  "global/ctx/GUEST_INFO_EMPTY": (state) => {
    return {...state, guestInfo: null}
  },
  "global/ctx/CURRENT_CHAT_DATA_ADD": (state, {payload}) => {
    // immutable
    const currentChatData = [...state.currentChatData];
    if (currentChatData.length >= CHAT_MAX_COUNT) {
      return {...state, currentChatData: currentChatData.splice(CHAT_MAX_COUNT).concat(payload)}
    } else {
      return {...state, currentChatData: currentChatData.concat(payload)}
    }
  },
  "global/ctx/CURRENT_CHAT_DATA_EMPTY": (state) => {
    return {...state, currentChatData: []}
  },
  "global/ctx/CLIP_PLAYER_INIT": (state, {payload}) => {
    return {...state, clipPlayer: payload}
  },
  "global/ctx/CLIP_PLAYER_EMPTY": (state) => {
    return {...state, clipPlayer: null}
  },
  "global/ctx/CLIP_INFO_ADD": (state, {payload}) => {
    // debugger
    return {...state, clipInfo: {...state.clipInfo, ...payload}}
  },
  "global/ctx/CLIP_INFO_EMPTY": (state) => {
    return {...state, clipInfo: null}
  },
  "global/ctx/CLIP_PLAY_LIST_INIT": (state) => {
    return state
  },
  "global/ctx/CLIP_PLAY_LIST_ADD": (state, {payload}) => {
    return {...state, clipPlayList:[].concat(payload)};
  },
  "global/ctx/CLIP_PLAY_LIST_EMPTY": (state) => {
    return {...state, clipPlayList:[]}
  },
  "global/ctx/CLIP_PLAY_LIST_TAB_INIT": (state) => {
    return state
  },
  "global/ctx/CLIP_PLAY_LIST_TAB_ADD": (state, {payload}) => {
    return {...state, clipPlayListTab:[].concat(payload)};
  },
  "global/ctx/CLIP_PLAY_LIST_TAB_EMPTY": (state) => {
    return {...state, clipPlayListTab:[]}
  },
  "global/ctx/WALLET_INIT_DATA": (state) => {
    return {...state, walletData:initWalletData}
  },
  "global/ctx/WALLET_ADD_DATA": (state, {payload}) => {
    return {...state, walletData:{...state.walletData, ...payload}}
  },
  "global/ctx/WALLET_ADD_HISTORY": (state, {payload}) => {
    const {listHistory, popHistory} = payload;
    return {...state, walletData:{...state.walletData, popHistory, listHistory}};
  },
});

export default global;

