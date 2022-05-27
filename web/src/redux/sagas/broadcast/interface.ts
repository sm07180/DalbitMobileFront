import {put, select, takeLatest, call, delay} from "redux-saga/effects";
import {NATIVE_END, NATIVE_PLAYER_SHOW, NATIVE_START} from "../../actions/broadcast/interface";
import {InterfaceMediaType, NativePlayerShowParamType} from "../../types/broadcast/interfaceType";
import _ from "lodash";
import {
  SET_CAST_STATE,
  SET_MEDIA_PLAYER_STATUS,
  SET_NATIVE_PLAYER, SET_NATIVE_PLAYER_INFO,
  SET_PLAYER,
} from "../../actions/globalCtx";
import {AuthType} from "../../../constant";
import Utility from "../../../components/lib/utility";
import {isIos} from "../../../context/hybrid";

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

      yield put({type: SET_MEDIA_PLAYER_STATUS, payload: true});
    }

  } catch (e) {
    console.error(`broadcast interface nativePlayerShow saga e=>`, e);
  }
}
function* nativeStart(param){
  try{
    const payload:NativePlayerShowParamType = param.payload;

    //(BJ)일경우 방송하기:방송중
    if (_.hasIn(payload, 'auth') && payload.auth === AuthType.DJ) {
      yield put({type: SET_CAST_STATE, payload: payload.roomNo});
      Utility.setCookie('isDj', true, 3);
    }

    if (payload.mediaType !== InterfaceMediaType.VIDEO) {
      yield put({type: SET_PLAYER, payload: true});
      yield put({type: SET_MEDIA_PLAYER_STATUS, payload: true});

      const _android = JSON.stringify(payload)
      Utility.setCookie('native-player-info', _android, 100)
    }else{
      yield put({type: SET_PLAYER, payload: false});
    }

    yield put({type: SET_NATIVE_PLAYER, payload: payload});
    yield put({type: SET_NATIVE_PLAYER_INFO, payload: {nativePlayerInfo:{state:'ready', roomNo:payload.roomNo}}});
  }catch(e){
    console.error(`broadcast interface nativeStart saga e=>`, e);
  }
}
function* nativeEnd(param){
  try{
    yield put({type: SET_PLAYER, payload: false});
    yield put({type: SET_MEDIA_PLAYER_STATUS, payload: false});
    yield put({type: SET_CAST_STATE, payload: null});

    const clearInfo = () => {
      sessionStorage.removeItem('room_no');
      Utility.setCookie('isDj', false, 3);
      Utility.setCookie('native-player-info', '', -1);
      Utility.setCookie('listen_room_no', null, null);
    }
    if(isIos()) {
      const currentRoomNo: string | null | undefined = sessionStorage.getItem('room_no'); // 현재 청취중인 roomNo (청취중이 아니라면 이전 roomNo)
      const endedRoomNo: string | undefined = param.payload?.roomNo; // native에서 종료하고 넘겨주는 roomNo
      if(!currentRoomNo || endedRoomNo === currentRoomNo || endedRoomNo === '0') {
        clearInfo();
      }
    }else {
      clearInfo();
    }

    // 닫기버튼 누르고 socket unsubscribe 되기까지 기다려야함
    // AOS 경우 기존에 native-end 브릿지를 웹에 보내고 unsubscribe 처리하기 때문에 강제 딜레이 줌
    // fixme 6월말 AOS 메인페이지 네이티브로 오픈하면 제거대상
    yield delay(4000);
    yield put({type: SET_NATIVE_PLAYER_INFO, payload: {nativePlayerInfo:{state:'ready'}}});
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
