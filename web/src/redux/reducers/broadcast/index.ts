import {createReducer} from "typesafe-actions";
import {BroadcastStateType, ListenerActions} from "../../types/broadcast/listenerType";
import {GET_LIST_SUCCESS} from "../../actions/broadcast/listener";

export const initialState: BroadcastStateType = {
  listener: {
    list: {
      param: {roomNo: '', page: 1, records: 1000},
      data: {
        paging: {page: 0, records: 0, next: 0, prev: 0, totalPage: 0, total: 0},
        list: [],
        noMemCnt: 0,
        totalMemCnt: 0,
      }
    }
  }
}

const vote = createReducer<BroadcastStateType, ListenerActions>(initialState,{
  "broadcast/listener/SET_LIST_PARAM" : (state, {payload})=>{
    return {...state, listener: {...state.listener, list:{...state.listener.list, param: payload}}}
  },
  "broadcast/listener/GET_LIST_SUCCESS" : (state, {payload})=>{

    return {...state, listener: {...state.listener, list:{...state.listener.list, data: {...payload, list:[...payload.list]}}}}
  },
  "broadcast/listener/NEXT_LIST_SUCCESS" : (state, {payload})=>{
    return {...state, listener: {...state.listener, list:{...state.listener.list, data: payload}}}
  },
  "broadcast/listener/PREV_LIST_SUCCESS" : (state, {payload})=>{
    return {...state, listener: {...state.listener, list:{...state.listener.list, data: payload}}}
  },
});


export default vote;

