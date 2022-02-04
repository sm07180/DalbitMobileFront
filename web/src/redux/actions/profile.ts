import { createAction } from "typesafe-actions";
import {IProfileState} from "../types/profileType";

export const SET_PROFILE_DATA = 'profile/SET_PROFILE_DATA';

export const setProfileData = createAction(SET_PROFILE_DATA)<IProfileState>();