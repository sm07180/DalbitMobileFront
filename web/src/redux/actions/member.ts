import { createAction } from "typesafe-actions";
import {LoginToken, Member} from "../types/memberType";

export const GET_MEMBER_PROFILE = 'member/GET_MEMBER_PROFILE';
export const GET_MEMBER_PROFILE_SUCCESS = 'member/GET_MEMBER_PROFILE_SUCCESS';
export const SET_MEMBER_LOGIN = 'member/SET_MEMBER_LOGIN';

export const setMemberLogin = createAction(SET_MEMBER_LOGIN)<LoginToken>();
export const getMemberProfile = createAction(GET_MEMBER_PROFILE)<LoginToken>();
export const getMemberProfileSuccess = createAction(GET_MEMBER_PROFILE_SUCCESS)<Member>();