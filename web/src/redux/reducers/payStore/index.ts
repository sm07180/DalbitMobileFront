import {createReducer} from "typesafe-actions";
import {
  ModeTabType,
  ModeType,
  PAYMENT_TAB,
  PayStoreActions,
  PayStoreStateType,
  ReceiptType
} from "../../types/pay/storeType";

export const initReceipt:ReceiptType = {
  visible: false,
  returnType:'store',
  orderId: "",
  payWay: "",
  payAmt: "",
  itemAmt: "",
  payCode: "",
}
export const initialState:PayStoreStateType = {
  storeInfo:{
    dalCnt: 0, defaultNum: 0, dalPriceList: [], mode:ModeType.all, modeTab:ModeTabType.none,
    deviceInfo:{}, state: 'ready'
  },
  storeTabInfo:PAYMENT_TAB,
  updateVersionInfo:{
    aos:'', ios:''
  },
  stateHeader:{
    title: '달 충전하기',
    visible: false
  },
  receipt: initReceipt
}
const payStore = createReducer<PayStoreStateType, PayStoreActions>(initialState,{
  "payStore/SET_STORE_INFO" : (state, {payload})=>{
    return {...state, storeInfo:{...state.storeInfo, ...payload}}
  },
  "payStore/SET_STORE_TAB_INFO" : (state, {payload})=>{
    return {...state, storeTabInfo:payload}
  },
  "payStore/SET_UPDATE_VERSION_INFO" : (state, {payload})=>{
    return {...state, updateVersionInfo:payload}
  },
  "payStore/SET_STATE_HEADER_VISIBLE" : (state, {payload})=>{
    return {...state, stateHeader: {...state.stateHeader, visible: payload}}
  },
  "payStore/SET_RECEIPT" : (state, {payload})=>{
    return {...state, receipt: payload}
  },
  "payStore/INIT_RECEIPT" : (state)=>{
    return {...state, receipt: initReceipt}
  },
});


export default payStore;

