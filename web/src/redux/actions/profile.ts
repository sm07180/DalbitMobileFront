import { createAction } from "typesafe-actions";
import {IProfileState, IProfileFeedState, IProfileFanBoardState, IProfileClipState} from "../types/profileType";

export const SET_PROFILE_DATA = 'profile/SET_PROFILE_DATA';
export const SET_PROFILE_FEED_DATA = 'profile/SET_PROFILE_FEED_DATA';
export const SET_PROFILE_FANBOARD_DATA = 'profile/SET_PROFILE_FANBOARD_DATA';
export const SET_PROFILE_CLIP_DATA = 'profile/SET_PROFILE_CLIP_DATA';

export const setProfileData = createAction(SET_PROFILE_DATA)<IProfileState>();
export const setProfileFeedData = createAction(SET_PROFILE_FEED_DATA)<IProfileFeedState>();
export const setProfileFanBoardData = createAction(SET_PROFILE_FANBOARD_DATA)<IProfileFanBoardState>();
export const setProfileClipData = createAction(SET_PROFILE_CLIP_DATA)<IProfileClipState>();