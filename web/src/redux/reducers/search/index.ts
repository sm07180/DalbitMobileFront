import {createReducer} from "typesafe-actions";
import {ISearchStateType, SearchActions, searchPagingDefault} from "../../types/searchType";

const initialState: ISearchStateType = {
  searchVal: '', // 검색 value 값
  searchParam: '', // child로 넘길 검색 값
  searching: false, // 검색 결과창 접근 여부

  // 검색 전
  liveListInfo: {list: [], paging: searchPagingDefault}, // 지금 핫한 라이브 정보
  newDjListInfo: {list: [], paging: searchPagingDefault}, // 방금 착륙한 NEW 달린이
  hotClipListInfo: { list: [] }, // 오늘 인기 있는 클립 정보
  djListInfo: {list: []}, // 믿고 보는 DJ 정보

  // 검색 결과
  searchResultTabMenuList: ['전체','DJ','라이브', '클립'], // 검색 결과 탭 메뉴
  searchResultInfo: {tabType: 0, page: 1, records: 5}, // 검색 결과 정보 (탭 타입, 페이징 정보)
  searchResultDjInfo: {list: [], paging: searchPagingDefault},  // DJ 리스트
  searchResultLiveInfo: {list: [], paging: searchPagingDefault}, // 라이브 리스트
  searchResultClipInfo: {list: [], paging: searchPagingDefault}, // 클립 리스트
}

const search = createReducer<ISearchStateType, SearchActions>(initialState, {
  "search/SET_SEARCH_DATA": (state, {payload}) => {
    return {...state, ...payload}
  },
  "search/SET_SEARCH_LIVE_LIST": (state, {payload}) => {
    return {...state, liveListInfo: payload}
  },
  "search/SET_SEARCH_NEW_DJ_LIST": (state, {payload}) => {
    return {...state, newDjListInfo: payload}
  },
  "search/SET_SEARCH_HOT_CLIP_LIST": (state, {payload}) => {
    return {...state, hotClipListInfo: payload}
  },
  "search/SET_SEARCH_DJ_LIST": (state, {payload}) => {
    return {...state, djListInfo: payload}
  },
  "search/SET_SEARCH_RESULT_INFO": (state, {payload}) => {
    return {...state, searchResultInfo: payload}
  },
  "search/SET_SEARCH_RESULT_DJ_LIST": (state, {payload}) => {
    return {...state, searchResultDjInfo: payload}
  },
  "search/SET_SEARCH_RESULT_LIVE_LIST": (state, {payload}) => {
    return {...state, searchResultLiveInfo: payload}
  },
  "search/SET_SEARCH_RESULT_CLIP_LIST": (state, {payload}) => {
    return {...state, searchResultClipInfo: payload}
  },
});

export default search;