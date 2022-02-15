import {createAction} from "typesafe-actions";
import {IAgoraRTCClient} from "agora-rtc-sdk-ng";
import {
  BroadcastAgoraLocalTrackType,
  BroadcastCreateRoomParamType,
  BroadcastRoomInfoType, BroadcastStatusType,
  GuestManagementResponseType,
  GuestPostPayloadType,
  GuestPostResponseType,
  GuestResponseType,
  RtcInfoType
} from "../types/broadcastType";

// common
export const BROADCAST_CREATE = 'broadcast/CREATE';
export const GET_ROOM_INFO = 'broadcast/GET_ROOM_INFO';
export const SET_ROOM_INFO = 'broadcast/SET_ROOM_INFO';
export const CREATE_RTC_INFO = 'broadcast/CREATE_RTC_INFO';
export const SET_RTC_INFO = 'broadcast/SET_RTC_INFO';
export const SET_STATUS = 'broadcast/SET_STATUS';
export const HISTORY_PUSH_BROADCAST = 'broadcast/HISTORY_PUSH_BROADCAST';

export const broadcastCreate = createAction(BROADCAST_CREATE)<BroadcastCreateRoomParamType>();
export const getRoomInfo = createAction(GET_ROOM_INFO)<{roomNo:string}>();
export const setRoomInfo = createAction(SET_ROOM_INFO)<BroadcastRoomInfoType>();
export const createRtcInfo = createAction(CREATE_RTC_INFO)();
export const setRtcInfo = createAction(SET_RTC_INFO)<RtcInfoType>();
export const setBroadcastStatus = createAction(SET_STATUS)<BroadcastStatusType>();
export const historyPushBroadcast = createAction(HISTORY_PUSH_BROADCAST)();

// guest
export const POST_GUEST = 'broadcast/guest/POST';
export const SET_POST_GUEST = 'broadcast/guest/SET_POST';
export const SET_GUEST = 'broadcast/guest/SET';
export const SET_GUEST_MANAGEMENT = 'broadcast/guest/SET_MANAGEMENT';
export const GET_GUEST = 'broadcast/guest/GET';
export const GET_GUEST_MANAGEMENT = 'broadcast/guest/GET_MANAGEMENT';

export const postGuest = createAction(POST_GUEST)<GuestPostPayloadType>();
export const setPostGuest = createAction(SET_POST_GUEST)<GuestPostResponseType>();
export const setGuest = createAction(SET_GUEST)<GuestResponseType>();
export const setGuestManagement = createAction(SET_GUEST_MANAGEMENT)<GuestManagementResponseType>();
export const getGuest = createAction(GET_GUEST)<{ roomNo: string }>();
export const getGuestManagement = createAction(GET_GUEST_MANAGEMENT)<{ roomNo: string }>();

// agora
export const CREATE_AGORA_CLIENT = 'broadcast/agora/CREATE_AGORA_CLIENT';
export const SET_CLIENT = 'broadcast/agora/SET_CLIENT';
export const SET_CLIENT_STATE = 'broadcast/agora/SET_CLIENT_STATE';
export const AGORA_JOIN = 'broadcast/agora/JOIN';
export const SET_LOCAL_TRACK = 'broadcast/agora/SET_LOCAL_TRACK';

export const createAgoraClient = createAction(CREATE_AGORA_CLIENT)();
export const setAgoraClient = createAction(SET_CLIENT)<IAgoraRTCClient>();
export const setAgoraClientState = createAction(SET_CLIENT_STATE)<any>();
export const agoraJoin = createAction(AGORA_JOIN)();
export const setLocalTrack = createAction(SET_LOCAL_TRACK)<BroadcastAgoraLocalTrackType>();

