import {createAction} from "typesafe-actions";
import {tabType} from "../../pages/clip_player/constant";

// ctx_state
export const SET_TAB 					      = 'clip/ctx/SET_TAB';
export const SET_IS_MY_CLIP 				= 'clip/ctx/SET_IS_MY_CLIP';
export const SET_RIGHT_TAB_TYPE 		= 'clip/ctx/SET_RIGHT_TAB_TYPE';
export const SET_MAIN_SORT 					= 'clip/ctx/SET_MAIN_SORT';
export const SET_MAIN_DATE 					= 'clip/ctx/SET_MAIN_DATE';
export const SET_MAIN_REFRESH 			= 'clip/ctx/SET_MAIN_REFRESH';
export const SET_IS_PAUSED 					= 'clip/ctx/SET_IS_PAUSED';
export const SET_REPLY_IDX 					= 'clip/ctx/SET_REPLY_IDX';
export const SET_LOTTIE_URL 				= 'clip/ctx/SET_LOTTIE_URL';
export const SET_LOTTIE 					  = 'clip/ctx/SET_LOTTIE';
export const SET_USER_MEM_NO 					  = 'clip/ctx/SET_USER_MEM_NO';

// ctx_reducer
export const CLIP_INFO_ADD 			    = 'clip/ctx/CLIP_INFO_ADD';
export const CLIP_INFO_EMPTY 			  = 'clip/ctx/CLIP_INFO_EMPTY';

export const setClipCtxTab = createAction(SET_TAB)<number>();
export const setClipCtxIsMyClip = createAction(SET_IS_MY_CLIP)<boolean>();
export const setClipCtxRightTabType = createAction(SET_RIGHT_TAB_TYPE)<tabType>();
export const setClipCtxMainSort = createAction(SET_MAIN_SORT)<number>();
export const setClipCtxMainDate = createAction(SET_MAIN_DATE)<number>();
export const setClipCtxMainRefresh = createAction(SET_MAIN_REFRESH)<boolean>();
export const setClipCtxIsPaused = createAction(SET_IS_PAUSED)<boolean>();
export const setClipCtxReplyIdx = createAction(SET_REPLY_IDX)<number>();
export const setClipCtxLottieUrl = createAction(SET_LOTTIE_URL)<string>();
export const setClipCtxLottie = createAction(SET_LOTTIE)<any>();
export const setClipCtxUserMemNo = createAction(SET_USER_MEM_NO)<string>();
export const setClipCtxInfoAdd = createAction(CLIP_INFO_ADD)<any>();
export const setClipCtxInfoEmpty = createAction(CLIP_INFO_EMPTY)();
