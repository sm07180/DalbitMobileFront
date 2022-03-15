import {createReducer} from "typesafe-actions";
import {RankActions, RankStateType} from "../../types/rankType";
import {RANK_TYPE} from "../../../pages/rank/constant";
import {MailBoxActions, MailBoxStateType} from "../../types/mailBoxType";
import {BroadcastCtxActions, BroadcastCtxStateType} from "../../types/broadcastCtxType";
import {tabType} from "../../../pages/broadcast/constant";

const initialState: BroadcastCtxStateType = {
  roomInfo: {
    auth: 0,
    badgeFrame: {},
    bgImg: {},
    bjHolder: '',
    bjMemNo: '',
    bjNickNm: '',
    bjProfImg: {},
    bufferingHigh: 0,
    bufferingLow: 0,
    chatEndInterval: 0,
    commonBadgeList: [],
    ctrlRole: '',
    djListenerIn: false,
    djListenerOut: false,
    entryType: 0,
    fanBadgeList: [],
    fanRank: [],
    guestBuffering: 0,
    guests: [],
    hasNotice: false,
    hasStory: false,
    imageType: 0,
    isAttendCheck: false,
    isAttendUrl: '',
    isExtend: false,
    isFan: false,
    isFreeze: false,
    isGuest: false,
    isLike: false,
    isNew: false,
    isPop: false,
    isRecomm: false,
    isSpecial: false,
    badgeSpecial: 0,
    isMinigame: false,
    kingMemNo: '',
    kingNickNm: '',
    kingProfImg: {},
    likes: 0,
    listenerIn: false,
    listenerOut: false,
    liveBadgeList: [],
    liveBadgeView: false,
    liveDjRank: 0,
    moonCheck: {
      moonStep: 0,
      moonStepAniFileNm: '',
      moonStepFileNm: '',
    },
    entryCnt: 0,
    newFanCnt: 0,
    os: 0,
    randomMsgList: [],
    rank: 0,
    remainTime: 0,
    roomNo: '',
    roomType: '',
    rtmpEdge: '',
    rtmpOrigin: '',
    startDt: '',
    startTs: 0,
    state: 0,
    title: '',
    useBoost: false,
    useGuest: false,
    miniGameList: [],
    useFilter: false,
    /* Agora */
    platform: '',
    agoraAppId: '',
    agoraToken: '',
    agoraAccount: '',

    /* Wowza */
    webRtcAppName: '',
    webRtcStreamName: '',
    webRtcUrl: '',

    /* */

    welcomMsg: '',
    mediaType: '',

    // Custom
    broadState: false,

    // State
    isVideo: false,
    isMic: false,
    isListenerUpdate: false
  },
//state start
  rightTabType: tabType.LISTENER,
  chatAnimation: {
    status: false,
    itemNo: '',
    memNo: ''
  },
  comboAnimation: {
    status: false
  },
  userMemNo: "",
  userNickNm: "",
  userCount: {
    current: 0,
    history: 0,
    newFanCnt: 0,
  },
  realTimeValue: null,
  giftState: {
    display: false,
    itemNo: "",
    cnt: 1,
  },
  listenerList: [],
  msgShortCut: [],
  useBoost: false,
  extendTime: false,
  extendTimeOnce: false,
  storyState: -1,
  noticeState: -1,
  likeState: -1,
  commonBadgeList: [],
  boost: {
    boost: true,
  },
  chatFreeze: false,
  likeClicked: true,
  isFan: false,

  chatCount: 0,

  flipIsLeft: true,
  isWide: true,
  videoEffect: {
    makeUp: "Original",
    filter: "Normal",
  },

  miniGameInfo: {},
  miniGameResult: {},
  rouletteHistory: {
    currentPage: 1,
    allData: [],
    renderingData: [],
    pagingSize: 50,
    totalCnt: 0,
  },
  ttsActorInfo: [],
  ttsActionInfo: {
    showAlarm: false,
    actorId: "",
    nickNm: "",
    ttsText: "",
    fileUrl: "",
    duration: 0,
    isPlaying: false,
  },
  isTTSPlaying: false,
  settingObj: null,
  soundVolume: 1,  //tts, sound Item 볼륨조절 0 ~ 1
  heartActive: false,
};

const mailBox = createReducer<BroadcastCtxStateType, BroadcastCtxActions>(initialState, {
  "broadcast/ctx/SET_RIGHT_TAB_TYPE": (state, {payload}) => {
    return {...state, rightTabType: payload}
  },
  "broadcast/ctx/SET_USER_MEM_NO": (state, {payload}) => {
    return {...state, userMemNo: payload}
  },
  "broadcast/ctx/SET_USER_NICK_NAME": (state, {payload}) => {
    return {...state, userNickNm: payload}
  },
  "broadcast/ctx/SET_USER_COUNT": (state, {payload}) => {
    return {...state, userCount: payload}
  },
  "broadcast/ctx/SET_USER_COUNT2": (state, {payload}) => {
    return {...state, userCount: {...state.userCount, ...payload}}
  },
  "broadcast/ctx/SET_LISTENER_LIST": (state, {payload}) => {
    return {...state, listenerList: payload}
  },
  "broadcast/ctx/SET_MSG_SHORT_CUT": (state, {payload}) => {
    return {...state, userCount: payload}
  },
  "broadcast/ctx/SET_USE_BOOST": (state, {payload}) => {
    return {...state, useBoost: payload}
  },
  "broadcast/ctx/SET_EXTEND_TIME": (state, {payload}) => {
    return {...state, extendTime: payload}
  },
  "broadcast/ctx/SET_EXTEND_TIME_ONCE": (state, {payload}) => {
    return {...state, extendTimeOnce: payload}
  },
  "broadcast/ctx/SET_STORY_STATE": (state, {payload}) => {
    return {...state, storyState: payload}
  },
  "broadcast/ctx/SET_NOTICE_STATE": (state, {payload}) => {
    return {...state, noticeState: payload}
  },
  "broadcast/ctx/SET_LIKE_STATE": (state, {payload}) => {
    return {...state, likeState: payload}
  },
  "broadcast/ctx/SET_COMMON_BADGE_LIST": (state, {payload}) => {
    return {...state, commonBadgeList: payload}
  },
  "broadcast/ctx/SET_BOOST": (state, {payload}) => {
    return {...state, boost: payload}
  },
  "broadcast/ctx/SET_CHAT_FREEZE": (state, {payload}) => {
    return {...state, chatFreeze: payload}
  },
  "broadcast/ctx/SET_LIKE_CLICKED": (state, {payload}) => {
    return {...state, likeClicked: payload}
  },
  "broadcast/ctx/SET_IS_FAN": (state, {payload}) => {
    return {...state, isFan: payload}
  },
  "broadcast/ctx/SET_CHAT_COUNT": (state, {payload}) => {
    return {...state, chatCount: payload}
  },
  "broadcast/ctx/SET_FLIP_IS_LEFT": (state, {payload}) => {
    return {...state, flipIsLeft: payload}
  },
  "broadcast/ctx/SET_IS_WIDE": (state, {payload}) => {
    return {...state, isWide: payload}
  },
  "broadcast/ctx/SET_VIDEO_EFFECT": (state, {payload}) => {
    return {...state, videoEffect: payload}
  },
  "broadcast/ctx/SET_MINI_GAME_INFO": (state, {payload}) => {
    return {...state, miniGameInfo: payload}
  },
  "broadcast/ctx/SET_MINI_GAME_RESULT": (state, {payload}) => {
    return {...state, miniGameResult: payload}
  },
  "broadcast/ctx/SET_ROULETTE_HISTORY": (state, {payload}) => {
    return {...state, rouletteHistory: payload}
  },
  "broadcast/ctx/SET_TTS_ACTOR_INFO": (state, {payload}) => {
    return {...state, ttsActorInfo: payload}
  },
  "broadcast/ctx/SET_TTS_ACTION_INFO": (state, {payload}) => {
    return {...state, ttsActionInfo: payload}
  },
  "broadcast/ctx/SET_IS_TTS_PLAYING": (state, {payload}) => {
    return {...state, isTTSPlaying: payload}
  },
  "broadcast/ctx/SET_SETTING_OBJECT": (state, {payload}) => {
    return {...state, settingObj: payload}
  },
  "broadcast/ctx/SET_SOUND_VOLUME": (state, {payload}) => {
    return {...state, soundVolume: payload}
  },
  "broadcast/ctx/SET_HEART_ACTIVE": (state, {payload}) => {
    return {...state, heartActive: payload}
  },
  "broadcast/ctx/SET_ROOM_INFO_SETTING_UPDATE": (state, {payload}) => {
    return {...state, roomInfo: {...state.roomInfo, ...payload}};
  },
  "broadcast/ctx/SET_ROOM_INFO_BOOSTER_ON": (state) => {
    return {...state, roomInfo: {...state.roomInfo, useBoost: true}};
  },
  "broadcast/ctx/SET_ROOM_INFO_BOOSTER_OFF": (state) => {
    return {...state, roomInfo: {...state.roomInfo, useBoost: false}};
  },
  "broadcast/ctx/SET_ROOM_INFO_IS_LISTENER_UPDATE": (state) => {
    return {...state, roomInfo: {...state.roomInfo, isListenerUpdate: !state.roomInfo.isListenerUpdate}};
  },
  "broadcast/ctx/SET_ROOM_INFO_GRANT_REFRESH": (state, {payload}) => {
    if(state.roomInfo.currentMemNo === payload.memNo){
      return {...state, roomInfo: {...state.roomInfo, auth: payload.auth}};
    }else{
      return state;
    }
  },
  "broadcast/ctx/SET_ROOM_INFO_FREEZE": (state, {payload}) => {
    return {...state, roomInfo: {...state.roomInfo, isFreeze: payload}};
  },
  "broadcast/ctx/SET_ROOM_INFO_LIKES": (state, {payload}) => {
    return {...state, roomInfo: {...state.roomInfo, isLike: payload}};
  },
  "broadcast/ctx/SET_ROOM_INFO_MOON_CHECK": (state, {payload}) => {
    return {
      ...state, roomInfo: {
        ...state.roomInfo, moonCheck: {
          ...state.roomInfo.moonCheck,
          ...payload,
        }
      }
    };
  },
  "broadcast/ctx/SET_ROOM_INFO_MIC_STATE": (state, {payload}) => {
    return {...state, roomInfo: {...state.roomInfo, isMic: payload}};
  },
  "broadcast/ctx/SET_ROOM_INFO_VIDEO_STATE": (state, {payload}) => {
    return {...state, roomInfo: {...state.roomInfo, isVideo: payload}};
  },
  "broadcast/ctx/SET_ROOM_INFO_NEW_FAN_CNT": (state, {payload}) => {
    return {...state, roomInfo: {...state.roomInfo, newFanCnt: payload}};if (state.roomInfo) {

    } else {
      return state;
    }
  },
  "broadcast/ctx/SET_ROOM_INFO_RESET": (state, {payload}) => {
    return {...state, roomInfo: payload};
  },
  "broadcast/ctx/SET_ROOM_INFO_REFRESH": (state) => {
    return state
  },
  "broadcast/ctx/SET_CHAT_ANIMATION_START": (state, {payload}) => {
    return {...state, chatAnimation:{...state.chatAnimation, ...payload, status:true }};
  },
  "broadcast/ctx/SET_CHAT_ANIMATION_END": (state) => {
    return {...state, chatAnimation:{status: false, itemNo: '', memNo: ''}};
  },
  "broadcast/ctx/SET_COMBO_ANIMATION_START": (state, {payload}) => {
    return {...state, comboAnimation:{...state.comboAnimation, ...payload, status:true}}
  },
  "broadcast/ctx/SET_COMBO_ANIMATION_END": (state) => {
    return {...state, comboAnimation:{status:false}}
  },
  "broadcast/ctx/SET_REAL_TIME_VALUE_SET_LIKE_FAN_RANK": (state, {payload}) => {
    return {...state, realTimeValue:payload}
  },
});


export default mailBox;

