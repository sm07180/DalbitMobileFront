import { createAction } from "typesafe-actions";
import {
  IProfileState,
  IProfileFeedState,
  IProfileFanBoardState,
  IProfileClipState,
  IProfilePopupState
} from "../types/profileType";

const SET_PROFILE_DATA = 'profile/SET_PROFILE_DATA';
const SET_PROFILE_FEED_DATA = 'profile/SET_PROFILE_FEED_DATA';
const SET_PROFILE_FANBOARD_DATA = 'profile/SET_PROFILE_FANBOARD_DATA';
const SET_PROFILE_CLIP_DATA = 'profile/SET_PROFILE_CLIP_DATA';
const SET_PROFILE_POPUP_OPEN_DATA = 'profile/SET_PROFILE_POPUP_OPEN_DATA';
const SET_PROFILE_POPUP_CLOSE = 'profile/SET_PROFILE_POPUP_CLOSE';

export const setProfileData = createAction(SET_PROFILE_DATA)<IProfileState>();
export const setProfileFeedData = createAction(SET_PROFILE_FEED_DATA)<IProfileFeedState>();
export const setProfileFanBoardData = createAction(SET_PROFILE_FANBOARD_DATA)<IProfileFanBoardState>();
export const setProfileClipData = createAction(SET_PROFILE_CLIP_DATA)<IProfileClipState>();
export const setProfilePopupOpenData = createAction(SET_PROFILE_POPUP_OPEN_DATA)<IProfilePopupState>();
export const setProfilePopupClose = createAction(SET_PROFILE_POPUP_CLOSE)<void>();