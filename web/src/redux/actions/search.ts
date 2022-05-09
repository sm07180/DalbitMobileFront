import { createAction } from "typesafe-actions";
import {
  IHotClipListInfoType,
  ILiveListInfoType,
  INewDjListInfoType,
  ISearchDjListInfoType,
  ISearchResultClipInfoType,
  ISearchResultDjInfoType,
  ISearchResultInfoType,
  ISearchResultLiveInfoType,
  ISearchStateType
} from "../types/searchType";

export const SET_SEARCH_DATA = 'search/SET_SEARCH_DATA';
export const setSearchData = createAction(SET_SEARCH_DATA)<ISearchStateType>();

export const SET_SEARCH_LIVE_LIST = 'search/SET_SEARCH_LIVE_LIST';
export const setSearchLiveList = createAction(SET_SEARCH_LIVE_LIST)<ILiveListInfoType>();

export const SET_SEARCH_NEW_DJ_LIST = 'search/SET_SEARCH_NEW_DJ_LIST';
export const setSearchNewDjList = createAction(SET_SEARCH_NEW_DJ_LIST)<INewDjListInfoType>();

export const SET_SEARCH_HOT_CLIP_LIST = 'search/SET_SEARCH_HOT_CLIP_LIST';
export const setSearchHotClipList = createAction(SET_SEARCH_HOT_CLIP_LIST)<IHotClipListInfoType>();

export const SET_SEARCH_DJ_LIST = 'search/SET_SEARCH_DJ_LIST';
export const setSearchDjList = createAction(SET_SEARCH_DJ_LIST)<ISearchDjListInfoType>();

export const SET_SEARCH_RESULT_INFO = 'search/SET_SEARCH_RESULT_INFO';
export const setSearchResultInfo = createAction(SET_SEARCH_RESULT_INFO)<ISearchResultInfoType>();

export const SET_SEARCH_RESULT_DJ_LIST = 'search/SET_SEARCH_RESULT_DJ_LIST';
export const setSearchResultDjList = createAction(SET_SEARCH_RESULT_DJ_LIST)<ISearchResultDjInfoType>();

export const SET_SEARCH_RESULT_LIVE_LIST = 'search/SET_SEARCH_RESULT_LIVE_LIST';
export const setSearchResultLiveList = createAction(SET_SEARCH_RESULT_LIVE_LIST)<ISearchResultLiveInfoType>();

export const SET_SEARCH_RESULT_CLIP_LIST = 'search/SET_SEARCH_RESULT_CLIP_LIST';
export const setSearchResultClipList = createAction(SET_SEARCH_RESULT_CLIP_LIST)<ISearchResultClipInfoType>();