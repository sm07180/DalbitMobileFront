import { createAction } from "typesafe-actions";

export const SET_RANK_LIST                = 'mailBox/SET_MAILBOX_GIFT_ITEM_INFO';
export const SET_RANK_DATA                = 'mailBox/SET_MAILBOX_';
export const SET_RANK_LEVEL_LIST          = 'mailBox/SET_MAILBOX_';
export const SET_RANK_LIKE_LIST           = 'mailBox/SET_MAILBOX_';
export const SET_RANK_SPECIAL_LIST        = 'mailBox/SET_MAILBOX_';
export const SET_RANK_WEEKLY_LIST         = 'mailBox/SET_MAILBOX_';
export const SET_RANK_SECOND_LIST         = 'mailBox/SET_MAILBOX_';
export const SET_RANK_MY_INFO             = 'mailBox/SET_MAILBOX_';
export const SET_RANK_TOTAL_PAGE          = 'mailBox/SET_MAILBOX_';
export const SET_RANK_SCROLL_Y            = 'mailBox/SET_MAILBOX_';
export const SET_RANK_SPECIAL_POINT       = 'mailBox/SET_MAILBOX_';
export const SET_RANK_SPECIAL_POINT_LIST  = 'mailBox/SET_MAILBOX_';
export const SET_RANK_TIME_DATA           = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_PAGE_TYPE      = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_RANK_TYPE      = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_DATE_TYPE      = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_DATE           = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_PAGE           = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_INIT           = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_RESET          = 'mailBox/SET_MAILBOX_';
export const SET_RANK_FROM_SEARCH         = 'mailBox/SET_MAILBOX_';

export const setRankList = createAction(SET_RANK_LIST)<any>();
export const setRankData = createAction(SET_RANK_DATA)<any>();
export const setRankLevelList = createAction(SET_RANK_LEVEL_LIST)<any>();
export const setRankLikeList = createAction(SET_RANK_LIKE_LIST)<any>();
export const setRankSpecialList = createAction(SET_RANK_SPECIAL_LIST)<any>();
export const setRankWeeklyList = createAction(SET_RANK_WEEKLY_LIST)<any>();
export const setRankSecondList = createAction(SET_RANK_SECOND_LIST)<any>();
export const setRankMyInfo = createAction(SET_RANK_MY_INFO)<any>();
export const setRankTotalPage = createAction(SET_RANK_TOTAL_PAGE)<number>();
export const setRankScrollY = createAction(SET_RANK_SCROLL_Y)<number>();
export const setRankSpecialPoint = createAction(SET_RANK_SPECIAL_POINT)<any>();
export const setRankSpecialPointList = createAction(SET_RANK_SPECIAL_POINT_LIST)<any>();
export const setRankTimeData = createAction(SET_RANK_TIME_DATA)<any>();
export const setRankFormPageType = createAction(SET_RANK_FROM_PAGE_TYPE)<any>();
export const setRankFormRankType = createAction(SET_RANK_FROM_RANK_TYPE)<any>();
export const setRankFormDateType = createAction(SET_RANK_FROM_DATE_TYPE)<any>();
export const setRankFormDate = createAction(SET_RANK_FROM_DATE)<any>();
export const setRankFormPage = createAction(SET_RANK_FROM_PAGE)();
export const setRankFormInit = createAction(SET_RANK_FROM_INIT)();
export const setRankFormReset = createAction(SET_RANK_FROM_RESET)();
export const setRankFormSearch = createAction(SET_RANK_FROM_SEARCH)<any>();



