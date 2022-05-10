import { createAction } from "typesafe-actions";
import {
  IHotClipListInfoType,
  ILiveListInfoType,
  INewDjListInfoType, INewDjListParamType,
  ISearchDjListInfoType,
  ISearchResultClipInfoType,
  ISearchResultDjInfoType,
  ISearchResultInfoType,
  ISearchResultLiveInfoType,
  ISearchStateType, searchResultInfoReqType
} from "../types/searchType";

export const SET_SEARCH_DATA = 'search/SET_SEARCH_DATA';
export const setSearchData = createAction(SET_SEARCH_DATA)<ISearchStateType>();

/* 지금 핫한 라이브 */
export const SET_SEARCH_LIVE_LIST = 'search/SET_SEARCH_LIVE_LIST';
export const setSearchLiveList = createAction(SET_SEARCH_LIVE_LIST)<ILiveListInfoType>();
export const CALL_SEARCH_LIVE_LIST = 'search/CALL_SEARCH_LIVE_LIST';
export const callSearchLiveList = createAction(CALL_SEARCH_LIVE_LIST)();

/* 방금 착륙한 NEW 달린이 */
export const SET_SEARCH_NEW_DJ_LIST = 'search/SET_SEARCH_NEW_DJ_LIST';
export const setSearchNewDjList = createAction(SET_SEARCH_NEW_DJ_LIST)<INewDjListInfoType>();
export const CALL_SEARCH_NEW_DJ_LIST = 'search/CALL_SEARCH_NEW_DJ_LIST';
export const callSearchNewDjList = createAction(CALL_SEARCH_NEW_DJ_LIST)<INewDjListParamType>();

/* 오늘 인기 있는 클립 */
export const SET_SEARCH_HOT_CLIP_LIST = 'search/SET_SEARCH_HOT_CLIP_LIST';
export const setSearchHotClipList = createAction(SET_SEARCH_HOT_CLIP_LIST)<IHotClipListInfoType>();
export const CALL_SEARCH_HOT_CLIP_LIST = 'search/CALL_SEARCH_HOT_CLIP_LIST';
export const callSearchHotClipList = createAction(CALL_SEARCH_HOT_CLIP_LIST)();

/* 믿고보는 DJ */
export const SET_SEARCH_DJ_LIST = 'search/SET_SEARCH_DJ_LIST';
export const setSearchDjList = createAction(SET_SEARCH_DJ_LIST)<ISearchDjListInfoType>();
export const CALL_SEARCH_DJ_LIST = 'search/CALL_SEARCH_DJ_LIST';
export const callSearchDjList = createAction(CALL_SEARCH_DJ_LIST)();

export const SET_SEARCH_RESULT_INFO = 'search/SET_SEARCH_RESULT_INFO';
export const setSearchResultInfo = createAction(SET_SEARCH_RESULT_INFO)<ISearchResultInfoType>();

export const SET_SEARCH_RESULT_DJ_LIST = 'search/SET_SEARCH_RESULT_DJ_LIST';
export const setSearchResultDjList = createAction(SET_SEARCH_RESULT_DJ_LIST)<ISearchResultDjInfoType>();
export const CALL_SEARCH_RESULT_DJ_LIST = 'search/CALL_SEARCH_RESULT_DJ_LIST';
export const callSearchResultDjList = createAction(CALL_SEARCH_RESULT_DJ_LIST)<searchResultInfoReqType>();

export const SET_SEARCH_RESULT_LIVE_LIST = 'search/SET_SEARCH_RESULT_LIVE_LIST';
export const setSearchResultLiveList = createAction(SET_SEARCH_RESULT_LIVE_LIST)<ISearchResultLiveInfoType>();
export const CALL_SEARCH_RESULT_LIVE_LIST = 'search/CALL_SEARCH_RESULT_LIVE_LIST';
export const callSearchResultLiveList = createAction(CALL_SEARCH_RESULT_LIVE_LIST)<searchResultInfoReqType>();

export const SET_SEARCH_RESULT_CLIP_LIST = 'search/SET_SEARCH_RESULT_CLIP_LIST';
export const setSearchResultClipList = createAction(SET_SEARCH_RESULT_CLIP_LIST)<ISearchResultClipInfoType>();
export const CALL_SEARCH_RESULT_CLIP_LIST = 'search/CALL_SEARCH_RESULT_CLIP_LIST';
export const callSearchResultClipList = createAction(CALL_SEARCH_RESULT_CLIP_LIST)<searchResultInfoReqType>();