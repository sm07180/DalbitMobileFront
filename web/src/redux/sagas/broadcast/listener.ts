import {call, delay, put, race, select, takeEvery, takeLatest} from "redux-saga/effects";
import {
  GET_LIST,
  GET_LIST_SUCCESS,
  NEXT_LIST,
  NEXT_LIST_SUCCESS,
  PREV_LIST, PREV_LIST_SUCCESS, SET_LIST_PARAM
} from "../../actions/broadcast/listener";
import {getBroadcastListeners} from "../../../common/api";

function* getList(param){
  try {
    const res = yield call(getBroadcastListeners, param.payload);
    const { result, data, message } = res;
    if (result === "success" && data.hasOwnProperty("list")) {
      yield put({type: SET_LIST_PARAM, payload: param.payload});
      yield put({type: GET_LIST_SUCCESS, payload: data});
    }else{

    }
  } catch (e) {
    console.error(`broadcast listener getList saga e=>`, e);
  }
}
function* getNextList(param){
  try{
    const broadcast = yield select((state)=>state.broadcast);
    console.log(`getNextList... `, broadcast)
    // const { result, data, message } = yield call(getBroadcastListeners, param.payload);
    // if (result === "success" && data.hasOwnProperty("list")) {
    //   yield put({type: SET_LIST_PARAM, payload: param.payload});
    //   yield put({type: NEXT_LIST_SUCCESS, payload: data});
    // }else{
    //
    // }

  }catch(e){
    console.error(`broadcast listener getNextList saga e=>`, e);
  }
}
function* getPrevList(param){
  try{
    //yield put({type: PREV_LIST_SUCCESS, payload: {}});
  }catch(e){
    console.error(`broadcast listener getPrevList saga e=>`, e);
  }
}

function* listenerSaga(){
  yield takeLatest(GET_LIST, getList);
  yield takeLatest(NEXT_LIST, getNextList);
  yield takeLatest(PREV_LIST, getPrevList);
}
export default listenerSaga;
