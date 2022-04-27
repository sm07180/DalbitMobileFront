import { createAction } from "typesafe-actions";

export const SET_CLIP_RANK_LIST = 'clipRank/SET_CLIP_RANK_LIST';
export const SET_WINNER_RANK_MSG_PROF = 'clipRank/SET_WINNER_RANK_MSG_PROF';
export const SET_MY_INFO = 'clipRank/SET_MY_INFO';
export const SET_FORM_DATE_TYPE = 'clipRank/SET_FORM_DATE_TYPE';
export const SET_FORM_CHANGE_DATE = 'clipRank/SET_FORM_CHANGE_DATE';


export const setClipRankList = createAction(SET_CLIP_RANK_LIST)<any>();
export const setWinnerRankMsgProf = createAction(SET_WINNER_RANK_MSG_PROF)<any>();
export const setMyInfo = createAction(SET_MY_INFO)<any>();
export const setFormDateType = createAction(SET_FORM_DATE_TYPE)<any>();
export const setFormChangeDate = createAction(SET_FORM_CHANGE_DATE)<any>();
