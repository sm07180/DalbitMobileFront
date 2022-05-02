import {put, select, takeLatest, call, delay} from "redux-saga/effects";
import {NATIVE_END, NATIVE_PLAYER_SHOW, NATIVE_START} from "../../actions/broadcast/interface";
import {InterfaceMediaType, NativePlayerShowParamType} from "../../types/broadcast/interfaceType";
import _ from "lodash";
import {
  SET_CAST_STATE,
  SET_MEDIA_PLAYER_STATUS,
  SET_NATIVE_PLAYER,
  SET_NATIVE_PLAYER_STATE,
  SET_PLAYER,
  setGlobalCtxCastState,
  setGlobalCtxMediaPlayerStatus,
  setGlobalCtxNativePlayer,
  setGlobalCtxPlayer
} from "../../actions/globalCtx";
import {AuthType} from "../../../constant";
import Utility from "../../../components/lib/utility";

function* nativePlayerShow(param){
  try {
    const payload:NativePlayerShowParamType = param.payload;

    //(BJ)일경우 방송하기:방송중
    if (_.hasIn(payload, 'auth') && payload.auth === AuthType.DJ) {
      yield put({type: SET_CAST_STATE, payload: payload.roomNo});
    }

    if (payload.mediaType !== InterfaceMediaType.VIDEO) {
      const _ios = JSON.stringify(payload)
      Utility.setCookie('native-player-info', _ios, 100);

      yield put({type: SET_PLAYER, payload: true});
      yield put({type: SET_MEDIA_PLAYER_STATUS, payload: true});
      yield put({type: SET_NATIVE_PLAYER, payload: payload});
    }

  } catch (e) {
    console.error(`broadcast interface nativePlayerShow saga e=>`, e);
  }
}
function* nativeStart(param){
  try{
    //alert('@@nativeStart')
    const payload:NativePlayerShowParamType = param.payload;

    //App에서 방송종료 알림경우
    sessionStorage.removeItem('room_active')

    //(BJ)일경우 방송하기:방송중
    if (_.hasIn(payload, 'auth') && payload.auth === AuthType.DJ) {
      yield put({type: SET_CAST_STATE, payload: payload.roomNo});
      Utility.setCookie('isDj', true, 3);
    }

    if (payload.mediaType !== InterfaceMediaType.VIDEO) {
      const _android = JSON.stringify(payload)
      Utility.setCookie('native-player-info', _android, 100)
      yield put({type: SET_PLAYER, payload: true});
      yield put({type: SET_MEDIA_PLAYER_STATUS, payload: true});
      yield put({type: SET_NATIVE_PLAYER, payload: payload});
    }

  }catch(e){
    console.error(`broadcast interface nativeStart saga e=>`, e);
  }
}
function* nativeEnd(param){
  try{
    //alert('@@nativeEnd')
    //쿠키삭제
    Utility.setCookie('native-player-info', '', -1)
    yield put({type: SET_PLAYER, payload: false});
    yield put({type: SET_MEDIA_PLAYER_STATUS, payload: false});
    yield put({type: SET_CAST_STATE, payload: null});

    //App에서 방송종료 알림경우
    sessionStorage.removeItem('room_no')
    Utility.setCookie('listen_room_no', null, null)
    sessionStorage.removeItem('room_active')
    Utility.setCookie('isDj', false, 3);
    yield call(delay, 4000);
    yield put({type: SET_NATIVE_PLAYER_STATE, payload: {nativePlayerState:'ready'}});
  }catch(e){
    console.error(`broadcast interface nativeEnd saga e=>`, e);
  }
}

function* interfaceSaga(){
  yield takeLatest(NATIVE_PLAYER_SHOW, nativePlayerShow);
  yield takeLatest(NATIVE_START, nativeStart);
  yield takeLatest(NATIVE_END, nativeEnd);
}
export default interfaceSaga;
