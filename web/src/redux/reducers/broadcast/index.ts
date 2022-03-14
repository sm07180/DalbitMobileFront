import {createReducer} from "typesafe-actions";
import {BroadcastActionType, BroadcastStateType} from "../../types/broadcastType";

const initialState: BroadcastStateType = {
  wowza: {},
  agora: {},
  status: {
    clickMove: false
  }
}

const broadcast = createReducer<BroadcastStateType, BroadcastActionType>(initialState, {
  "broadcast/SET_ROOM_INFO": (state, {payload}) => {
    return {...state, roomInfo: payload}
  },
  "broadcast/SET_RTC_INFO": (state, {payload}) => {
    return {...state, rtcInfo: payload}
  },
  "broadcast/SET_STATUS": (state, {payload}) => {
    return {...state, status: {...state.status, ...payload}}
  },
  "broadcast/agora/SET_CLIENT": (state, {payload}) => {
    return {...state, agora: {...state.agora, client: payload, state: 'created'}}
  },
  "broadcast/agora/SET_CLIENT_STATE": (state, {payload}) => {
    return {...state, agora: {...state.agora, state: payload}}
  },
  "broadcast/agora/SET_LOCAL_TRACK": (state, {payload}) => {
    return {...state, agora: {...state.agora, localTrack: payload}}
  },
  "broadcast/guest/SET_POST": (state, {payload}) => {
    return {...state, guestPost: payload}
  },
  "broadcast/guest/SET": (state, {payload}) => {
    return {...state, guest: payload}
  },
  "broadcast/guest/SET_MANAGEMENT": (state, {payload}) => {
    return {...state, guestManagement: payload}
  },
});

export default broadcast;

