import {createReducer} from "typesafe-actions";
import {ClipCtxActions, ClipCtxStateType} from "../../types/clipCtxType";
import {tabType} from "../../../pages/clip_player/constant";

const initialState: ClipCtxStateType = {
  tab: 0,
  clipInfo: null,
  isPaused: true,
  isMyClip: false,
  rightTabType: tabType.PROFILE,
  giftState: {
    display: false,
    itemNo: "",
    cnt: 1,
  },
  clipMainSort: 6,
  clipMainDate: 0,
  clipMainRefresh: false,
  clipReplyIdx: 0,
  lottieUrl: "",
  lottie: null,
  userMemNo: "",
};


const global = createReducer<ClipCtxStateType, ClipCtxActions>(initialState, {
  "clip/ctx/SET_TAB": (state, {payload}) => {
    return {...state, tab: payload}
  },
  "clip/ctx/SET_IS_MY_CLIP": (state, {payload}) => {
    return {...state, isMyClip: payload}
  },
  "clip/ctx/SET_RIGHT_TAB_TYPE": (state, {payload}) => {
    return {...state, rightTabType: payload}
  },
  "clip/ctx/SET_MAIN_SORT": (state, {payload}) => {
    return {...state, clipMainSort: payload}
  },
  "clip/ctx/SET_MAIN_DATE": (state, {payload}) => {
    return {...state, clipMainDate: payload}
  },
  "clip/ctx/SET_MAIN_REFRESH": (state, {payload}) => {
    return {...state, clipMainRefresh: payload}
  },
  "clip/ctx/SET_IS_PAUSED": (state, {payload}) => {
    return {...state, isPaused: payload}
  },
  "clip/ctx/SET_REPLY_IDX": (state, {payload}) => {
    return {...state, clipReplyIdx: payload}
  },
  "clip/ctx/SET_LOTTIE_URL": (state, {payload}) => {
    return {...state, lottieUrl: payload}
  },
  "clip/ctx/SET_LOTTIE": (state, {payload}) => {
    return {...state, lottie: payload}
  },
  "clip/ctx/SET_USER_MEM_NO": (state, {payload}) => {
    return {...state, userMemNo: payload}
  },
  "clip/ctx/CLIP_INFO_ADD": (state, {payload}) => {
    return {...state, clipInfo: {...state.clipInfo, ...payload}}
  },
  "clip/ctx/CLIP_INFO_EMPTY": (state) => {
    return {...state, clipInfo: null}
  },
});

export default global;

