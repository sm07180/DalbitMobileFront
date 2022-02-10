import {createReducer} from "typesafe-actions";
import {BroadcastActions, BroadcastState} from "../../types/broadcastType";
import AgoraRTC from "agora-rtc-sdk-ng";

const initialState: BroadcastState = {
  wowza:{},
  agora:{},
  roomInfo:null
}

const broadcast = createReducer<BroadcastState, BroadcastActions>(initialState, {
  "broadcast/agora/SET_CLIENT": (state, {payload}) => {
    return {...state, agora: {...state.agora, client: payload, state: 'created'}}
  },
  "broadcast/agora/SET_CLIENT_STATE": (state, {payload}) => {
    return {...state, agora: {...state.agora, state: payload}}
  },
  "broadcast/agora/SET_LOCAL_TRACK": (state, {payload}) => {
    return {...state, agora: {...state.agora, localTrack: payload}}
  },
  "broadcast/SET_ROOM_INFO": (state, {payload}) => {
    return {...state, roomInfo: payload}
  },
});


export default broadcast;

