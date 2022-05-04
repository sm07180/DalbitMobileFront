import { createAction } from "typesafe-actions";
import {BroadcastListenerRequestType, BroadcastListenerResultType} from "../../types/broadcast/listenerType";
import {NativePlayerShowParamType} from "../../types/broadcast/interfaceType";

export const NATIVE_PLAYER_SHOW = "broadcast/interface/NATIVE_PLAYER_SHOW"
export const NATIVE_START = "broadcast/interface/NATIVE_START"
export const NATIVE_END = "broadcast/interface/NATIVE_END"

export const nativePlayerShow = createAction(NATIVE_PLAYER_SHOW)<NativePlayerShowParamType>();
export const nativeStart = createAction(NATIVE_START)<NativePlayerShowParamType>();
export const nativeEnd = createAction(NATIVE_END)<any>();
