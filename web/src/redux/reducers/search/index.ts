import {createReducer} from "typesafe-actions";
import {ISearchStateType, SearchActions} from "../../types/searchType";

const initialState: ISearchStateType = {
  searchVal: '', // 검색 value 값
  searchParam: '', // child로 넘길 검색 값
  searching: false, // 검색 결과창 접근 여부
  liveListInfo: {list: [], paging: {}, totalCnt: 0}, // 지금 핫한 라이브 정보
  hotClipListInfo: { checkDate: '', list: [], totalCnt: 0, type: 0}, // 오늘 인기 있는 클립 정보
  djListInfo: {list: []}, // 믿고 보는 DJ 정보
  newBjListInfo: {list: [], paging: {}, totalCnt: 0}, // 방금 착륙한 NEW 달린이

}

const search = createReducer<ISearchStateType, SearchActions>(initialState, {
  "search/SET_SEARCH_DATA": (state, {payload}) => {
    return {...state, ...payload}
  },
});

export default search;