import { createAction } from "typesafe-actions";
import {IProfileState, IProfileFeedState} from "../types/profileType";

export const SET_PROFILE_DATA = 'profile/SET_PROFILE_DATA';
export const SET_PROFILE_FEED_DATA = 'profile/SET_PROFILE_FEED_DATA';

export const setProfileData = createAction(SET_PROFILE_DATA)<IProfileState>();
export const setProfileFeedData = createAction(SET_PROFILE_FEED_DATA)<IProfileFeedState>();