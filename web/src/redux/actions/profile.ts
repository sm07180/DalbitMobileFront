import { createAction } from "typesafe-actions";
import {
  IProfileState,
  IProfileNoticeState,
  IProfileFanBoardState,
  IProfileClipState, IProfileTabState, IProfileFeedState, IProfileNoticeFixState, IProfileDetailState
} from "../types/profileType";

const SET_PROFILE_DATA = 'profile/SET_PROFILE_DATA';
const SET_PROFILE_NOTICE_DATA = 'profile/SET_PROFILE_NOTICE_DATA';
const SET_PROFILE_FANBOARD_DATA = 'profile/SET_PROFILE_FANBOARD_DATA';
const SET_PROFILE_CLIP_DATA = 'profile/SET_PROFILE_CLIP_DATA';
const SET_PROFILE_TAB_DATA = 'profile/SET_PROFILE_TAB_DATA';
const SET_PROFILE_FEED_NEW_DATA = 'profile/SET_PROFILE_FEED_NEW_DATA';
const SET_PROFILE_NOTICE_FIX_DATA = 'profile/SET_PROFILE_NOTICE_FIX_DATA';
const SET_PROFILE_DETAIL_DATA = 'profile/SET_PROFILE_DETAIL_DATA';

export const setProfileData = createAction(SET_PROFILE_DATA)<IProfileState>();
export const setProfileNoticeData = createAction(SET_PROFILE_NOTICE_DATA)<IProfileNoticeState>();
export const setProfileFanBoardData = createAction(SET_PROFILE_FANBOARD_DATA)<IProfileFanBoardState>();
export const setProfileClipData = createAction(SET_PROFILE_CLIP_DATA)<IProfileClipState>();
export const setProfileTabData = createAction(SET_PROFILE_TAB_DATA)<IProfileTabState>();
export const setProfileFeedNewData = createAction(SET_PROFILE_FEED_NEW_DATA)<IProfileFeedState>();
export const setProfileNoticeFixData = createAction(SET_PROFILE_NOTICE_FIX_DATA)<IProfileNoticeFixState>();
export const setProfileDetailData = createAction(SET_PROFILE_DETAIL_DATA)<IProfileDetailState>();