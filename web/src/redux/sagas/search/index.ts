import {call, put, select, takeLatest} from "redux-saga/effects";
import API from "../../../context/api";
import {
  CALL_SEARCH_DJ_LIST,
  CALL_SEARCH_HOT_CLIP_LIST,
  CALL_SEARCH_LIVE_LIST,
  CALL_SEARCH_NEW_DJ_LIST, CALL_SEARCH_RESULT_CLIP_LIST,
  CALL_SEARCH_RESULT_DJ_LIST,
  CALL_SEARCH_RESULT_LIVE_LIST,
  SET_SEARCH_DJ_LIST,
  SET_SEARCH_HOT_CLIP_LIST,
  SET_SEARCH_LIVE_LIST,
  SET_SEARCH_NEW_DJ_LIST,
  SET_SEARCH_RESULT_CLIP_LIST,
  SET_SEARCH_RESULT_DJ_LIST,
  SET_SEARCH_RESULT_LIVE_LIST,
} from "../../actions/search";
import {broadcastList} from "../../../common/api";
import {
  changeSubject, ISearchResultClipInfoListType,
  ISearchResultDjListType,
  ISearchResultLiveInfoListType,
  searchPagingDefault
} from "../../types/searchType";

/* 지금 핫한 라이브 */
function* getHotLiveList() {
  try {
    const res = yield call(API.getSearchRecomend, { page: 1, listCnt: 10 });
    yield put({type: SET_SEARCH_LIVE_LIST, payload: {...res.data}});
  } catch (e) {
    console.log('getHotLiveList saga => ', e);
  }
}

/* 오늘 인기 있는 클립 */
function* getHotClipList() {
  try {
    const res = yield call(API.getPopularList, { page: 1, listCnt: 10 });
    yield put({type: SET_SEARCH_HOT_CLIP_LIST, payload: {list: res.data.list}});
  } catch (e) {
    console.log('getHotClipList saga => ', e);
  }
}

/* 방금 착륙한 NEW 달린이 */
function* getNewDjList(params) {
  try {
    const res = yield call(broadcastList, params.payload);
    if (res.code === 'C001') { // 데이터 1개 이상
      yield put({type: SET_SEARCH_NEW_DJ_LIST, payload: {...res.data}})
    }else if(res.code === '0') { // 데이터 없음
      yield put({type: SET_SEARCH_NEW_DJ_LIST, payload: {list: res.data.list, paging: searchPagingDefault}})
    }
  } catch (e) {
    console.log('getNewDjList saga => ', e);
  }
}

/* 믿고보는 DJ */
function* getDjList() {
  try {
    const ageList = [1, 2, 3, 4].join('|');
    const gender = ['m', 'f'].join('|');
    const res = yield call(API.getRecommendedDJ, {ageList, gender});
    yield put({type: SET_SEARCH_DJ_LIST, payload: {list: res.data.list}});
  } catch (e) {
    console.log('getDjList saga => ', e);
  }
}

/* 검색 결과 DJ */
function* getResultDjList(params) {
  try {
    const { result, code, data } = yield call(API.member_search, {params: params.payload});
    const search = yield select(state => state.search);
    const { searchResultInfo, searchResultDjInfo } = search;
    if (result === 'success' && code === 'C001') {
      if (searchResultInfo.page !== 1) {
        let temp: Array<ISearchResultDjListType> =  [];
        data.list.forEach(value => {
          if (searchResultDjInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
            temp.push(value);
          }
        });
        yield put({type: SET_SEARCH_RESULT_DJ_LIST, payload: {...data, list: searchResultDjInfo.list.concat(temp)}});
      } else {
        yield put({type: SET_SEARCH_RESULT_DJ_LIST, payload: {...data}});
      }
    } else {
      if (searchResultInfo.page === 1) {
        yield put({type: SET_SEARCH_RESULT_DJ_LIST, payload: {list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }}});
      }
    }
  } catch (e) {
    console.log('getResultDjList saga => ', e);
  }
}

/* 검색 결과 라이브 */
function* getResultLiveList(params) {
  const { result, code, data } = yield call(API.broad_list, {params: params.payload});
  const search = yield select(state => state.search);
  const { searchResultInfo, searchResultLiveInfo } = search;
  if (result === 'success' && code === 'C001') {
    if (searchResultInfo.page !== 1) {
      let temp: Array<ISearchResultLiveInfoListType> =  [];
      data.list.forEach(value => {
        if (searchResultLiveInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
          temp.push(value);
        }
      })
      yield put({type: SET_SEARCH_RESULT_LIVE_LIST, payload: {...data, list: searchResultLiveInfo.list.concat(temp)}});
    } else {
      yield put({type: SET_SEARCH_RESULT_LIVE_LIST, payload: {...data}});
    }
  } else {
    if (searchResultInfo.page === 1) {
      yield put({type: SET_SEARCH_RESULT_LIVE_LIST, payload: {list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }}});
    }
  }
}

/* 검색 결과 클립 */
function* getResultClipList(params) {
  const res = yield call(API.getClipList, params.payload);
  const search = yield select(state => state.search);
  const { searchResultInfo, searchResultClipInfo } = search;
  if (res.result === 'success' && res.code === 'C001') {
    let tempList = res.data.list;
    tempList.map((value, index) => {
      tempList[index].subjectType = changeSubject(value.subjectType);
    });

    if (searchResultInfo.page !== 1) {
      let temp: Array<ISearchResultClipInfoListType> = [];
      tempList.forEach(value => {
        if (searchResultClipInfo.list.findIndex(target => target.memNo === value.memNo) === -1) {
          temp.push(value);
        }
      })
      yield put({type: SET_SEARCH_RESULT_CLIP_LIST, payload: {...res.data, list: searchResultClipInfo.list.concat(temp)}});
    } else {
      yield put({type: SET_SEARCH_RESULT_CLIP_LIST, payload: {...res.data, list: tempList }});
    }
  } else {
    if (searchResultInfo.page === 1) {
      yield put({type: SET_SEARCH_RESULT_CLIP_LIST, payload: {list: [], paging: { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 }}});
    }
  }
}

function* SearchSagas() {
  yield takeLatest(CALL_SEARCH_LIVE_LIST, getHotLiveList);
  yield takeLatest(CALL_SEARCH_HOT_CLIP_LIST, getHotClipList);
  yield takeLatest(CALL_SEARCH_NEW_DJ_LIST, getNewDjList);
  yield takeLatest(CALL_SEARCH_DJ_LIST, getDjList);

  yield takeLatest(CALL_SEARCH_RESULT_DJ_LIST, getResultDjList);
  yield takeLatest(CALL_SEARCH_RESULT_LIVE_LIST, getResultLiveList);
  yield takeLatest(CALL_SEARCH_RESULT_CLIP_LIST, getResultClipList);
}

const search = [
  SearchSagas()
]

export default search;