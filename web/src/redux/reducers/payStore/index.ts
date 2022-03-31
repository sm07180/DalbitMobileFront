import {createReducer} from "typesafe-actions";
import {ModeTabType, ModeType, PAYMENT_TAB, PayStoreActions, PayStoreStateType} from "../../types/pay/storeType";

export const initialState:PayStoreStateType = {
  storeInfo:{
    dalCnt: 0, defaultNum: 0, dalPriceList: [], mode:ModeType.all, modeTab:ModeTabType.none,
    deviceInfo:{}
  },
  storeTabInfo:PAYMENT_TAB
}
const payStore = createReducer<PayStoreStateType, PayStoreActions>(initialState,{
  "payStore/SET_STORE_INFO" : (state, {payload})=>{
    return {...state, storeInfo:{...state.storeInfo, ...payload}}
  },
  "payStore/SET_STORE_TAB_INFO" : (state, {payload})=>{
    return {...state, storeTabInfo:payload}
  },
});


export default payStore;

