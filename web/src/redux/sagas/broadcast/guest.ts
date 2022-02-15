import {call, fork, put, select, take, takeLatest} from "redux-saga/effects";
import {
  GET_GUEST,
  GET_GUEST_MANAGEMENT,
  POST_GUEST,
  SET_GUEST,
  SET_GUEST_MANAGEMENT,
  SET_POST_GUEST
} from "../../actions/broadcast";
import {BroadcastRoomInfoType} from "../../types/broadcastType";
import {guestList, guestManagement} from "../../../common/api";

function* guestPost() {
  while (true) {
    const action = yield take(POST_GUEST);
    const guestResult = yield call(guest, action.payload);
    yield put({type:SET_POST_GUEST, payload:guestResult})

    const guestListResult = yield call(guestList, {roomNo: action.payload.roomNo});
    yield put({type:SET_GUEST, payload:guestListResult})

    const guestManagementResult = yield call(guestManagement, {roomNo: action.payload.roomNo, page: 1, records: 1000});
    yield put({type:SET_GUEST_MANAGEMENT, payload:guestManagementResult})
  }
}

function* getGeust(action) {
  try{
    const roomInfo:BroadcastRoomInfoType = yield select(({broadcast})=> broadcast.roomInfo);
    const roomNo = action.payload.roomNo || roomInfo.roomNo
    const guestListResult = yield call(guestList, {roomNo: roomNo});
    yield put({type:SET_GUEST, payload:guestListResult})

    const guestManagementResult = yield call(guestManagement, {roomNo: roomNo, page: 1, records: 1000});
    yield put({type:SET_GUEST_MANAGEMENT, payload:guestManagementResult})
  }catch (e){
    // 에러처리..
    console.error(`getGeust error =>`, e);
  }
}

function * getSagas() {
  yield takeLatest(GET_GUEST, getGeust)
  yield takeLatest(GET_GUEST_MANAGEMENT, getGeust)
}

const guest = [
  fork(guestPost),
  getSagas()
]

export default guest
