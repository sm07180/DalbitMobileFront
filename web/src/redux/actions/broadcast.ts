import { createAction } from "typesafe-actions";
import {ClientConfig, IAgoraRTCClient} from "agora-rtc-sdk-ng";
import {
  BroadcastAgoraLocalTrackType,
  BroadcastCreateRoomParamType,
  BroadcastRoomInfoType
} from "../types/broadcastType";

// common
export const BROADCAST_CREATE = 'broadcast/CREATE';
export const SET_ROOM_INFO = 'broadcast/SET_ROOM_INFO';

export const broadcastCreate = createAction(BROADCAST_CREATE)<BroadcastCreateRoomParamType>();
export const setRoomInfo = createAction(SET_ROOM_INFO)<BroadcastRoomInfoType>();

// agora
export const CREATE_CLIENT = 'broadcast/agora/CREATE_CLIENT';
export const SET_CLIENT = 'broadcast/agora/SET_CLIENT';
export const SET_CLIENT_STATE = 'broadcast/agora/SET_CLIENT_STATE';
export const AGORA_JOIN = 'broadcast/agora/JOIN';
export const SET_LOCAL_TRACK = 'broadcast/agora/SET_LOCAL_TRACK';

export const createAgoraClient = createAction(CREATE_CLIENT)();
export const setAgoraClient = createAction(SET_CLIENT)<IAgoraRTCClient>();
export const setAgoraClientState = createAction(SET_CLIENT_STATE)<any>();
export const agoraJoin = createAction(AGORA_JOIN)();
export const setLocalTrack = createAction(SET_LOCAL_TRACK)<BroadcastAgoraLocalTrackType>();

