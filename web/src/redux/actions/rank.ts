import {createAction} from "typesafe-actions";

export const SET_SUB_TAB = "rank/SET_SUB_TAB";

export const SET_RANK_LIST                = 'rank/SET_RANK_LIST';
export const SET_RANK_DATA                = 'rank/SET_RANK_DATA';
export const SET_RANK_LEVEL_LIST          = 'rank/SET_RANK_LEVEL_LIST';
export const SET_RANK_LIKE_LIST           = 'rank/SET_RANK_LIKE_LIST';
export const SET_RANK_SPECIAL_LIST        = 'rank/SET_RANK_SPECIAL_LIST';
export const SET_RANK_WEEKLY_LIST         = 'rank/SET_RANK_WEEKLY_LIST';
export const SET_RANK_SECOND_LIST         = 'rank/SET_RANK_SECOND_LIST';
export const SET_RANK_MY_INFO             = 'rank/SET_RANK_MY_INFO';
export const SET_RANK_TOTAL_PAGE          = 'rank/SET_RANK_TOTAL_PAGE';
export const SET_RANK_SCROLL_Y            = 'rank/SET_RANK_SCROLL_Y';
export const SET_RANK_SPECIAL_POINT       = 'rank/SET_RANK_SPECIAL_POINT';
export const SET_RANK_SPECIAL_POINT_LIST  = 'rank/SET_RANK_SPECIAL_POINT_LIST';
export const SET_RANK_TIME_DATA           = 'rank/SET_RANK_TIME_DATA';
export const SET_RANK_FROM_PAGE_TYPE      = 'rank/SET_RANK_FROM_PAGE_TYPE';
export const SET_RANK_FROM_RANK_TYPE      = 'rank/SET_RANK_FROM_RANK_TYPE';
export const SET_RANK_FROM_DATE_TYPE      = 'rank/SET_RANK_FROM_DATE_TYPE';
export const SET_RANK_FROM_DATE           = 'rank/SET_RANK_FROM_DATE';
export const SET_RANK_FROM_PAGE           = 'rank/SET_RANK_FROM_PAGE';
export const SET_RANK_FROM_INIT           = 'rank/SET_RANK_FROM_INIT';
export const SET_RANK_FROM_RESET          = 'rank/SET_RANK_FROM_RESET';
export const SET_RANK_FROM_SEARCH         = 'rank/SET_RANK_FROM_SEARCH';

export const setSubTab = createAction(SET_SUB_TAB)<string>();

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
