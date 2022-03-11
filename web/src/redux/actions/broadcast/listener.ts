import { createAction } from "typesafe-actions";
import {BroadcastListenerRequestType, BroadcastListenerResultType} from "../../types/broadcast/listenerType";

export const SET_LIST_PARAM = "broadcast/listener/SET_LIST_PARAM"

export const GET_LIST = "broadcast/listener/GET_LIST"
export const GET_LIST_SUCCESS = "broadcast/listener/GET_LIST_SUCCESS"

export const NEXT_LIST = "broadcast/listener/NEXT_LIST"
export const NEXT_LIST_SUCCESS = "broadcast/listener/NEXT_LIST_SUCCESS"

export const PREV_LIST = "broadcast/listener/PREV_LIST"
export const PREV_LIST_SUCCESS = "broadcast/listener/PREV_LIST_SUCCESS"

export const setListParam = createAction(SET_LIST_PARAM)<BroadcastListenerRequestType>();

export const getList = createAction(GET_LIST)<BroadcastListenerRequestType>();
export const getListSuccess = createAction(GET_LIST_SUCCESS)<BroadcastListenerResultType>();

export const nextList = createAction(NEXT_LIST)();
export const nextListSuccess = createAction(NEXT_LIST_SUCCESS)<BroadcastListenerResultType>();

export const prevList = createAction(PREV_LIST)();
export const prevListSuccess = createAction(PREV_LIST_SUCCESS)<BroadcastListenerResultType>();


// export const firstListSuccess
//   = createAction(FIRST_LIST_SUCCESS)<{type:PopularListType,result:{
//     param?:TypePaging,
//     cnt?: number,
//     list: Array<BizItem | PtnrDataType>,
//   }}>();
//
// export const nextList = createAction(NEXT_LIST)<{type:PopularListType, param?:TypePaging}>();
//
// export const nextListSuccess
//   = createAction(NEXT_LIST_SUCCESS)<{type:PopularListType,result:{
//     param?:TypePaging,
//     cnt?: number,
//     list: Array<BizItem | PtnrDataType>,
//   }}>();
