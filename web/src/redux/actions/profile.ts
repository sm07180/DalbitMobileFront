import { createAction } from "typesafe-actions";
import {
  IProfileState,
  IProfileFeedState,
  IProfileFanBoardState,
  IProfileClipState, IProfileTabState, IProfileFeedNewState,
} from "../types/profileType";

const SET_PROFILE_DATA = 'profile/SET_PROFILE_DATA';
const SET_PROFILE_FEED_DATA = 'profile/SET_PROFILE_FEED_DATA';
const SET_PROFILE_FANBOARD_DATA = 'profile/SET_PROFILE_FANBOARD_DATA';
const SET_PROFILE_CLIP_DATA = 'profile/SET_PROFILE_CLIP_DATA';
const SET_PROFILE_TAB_DATA = 'profile/SET_PROFILE_TAB_DATA';
const SET_PROFILE_FEED_NEW_DATA = 'profile/SET_PROFILE_FEED_NEW_DATA';

export const setProfileData = createAction(SET_PROFILE_DATA)<IProfileState>();
export const setProfileFeedData = createAction(SET_PROFILE_FEED_DATA)<IProfileFeedState>();
export const setProfileFanBoardData = createAction(SET_PROFILE_FANBOARD_DATA)<IProfileFanBoardState>();
export const setProfileClipData = createAction(SET_PROFILE_CLIP_DATA)<IProfileClipState>();
export const setProfileTabData = createAction(SET_PROFILE_TAB_DATA)<IProfileTabState>();
export const setProfileFeedNewData = createAction(SET_PROFILE_FEED_NEW_DATA)<IProfileFeedNewState>();