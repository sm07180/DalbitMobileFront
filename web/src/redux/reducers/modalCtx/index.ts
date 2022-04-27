import {createReducer} from "typesafe-actions";
import {ModalActions, ModalStateType} from "../../types/modalType";

const initialState:ModalStateType = {
  payInfo: {
    itemName: "",
    itemPrice: "",
    itemNo: "",
    pageCode: "",
  },
  mypageInfo: {},
  mypageYourMem: "",
  mypageChange: false,
  toggleWallet: 0,
  broadcastOption: {
    title: "",
    welcome: "",
  },
  specialInfo: {
    memNo: "",
    wasSpecial: false,
    specialDjCnt: 0,
    badgeSpecial: 0,
  },
};

const modal = createReducer<ModalStateType, ModalActions>(initialState, {
  "modal/SET_PAY_INFO": (state, {payload}) => {
    return {...state, payInfo: payload}
  },
  "modal/SET_MY_PAGE_INFO": (state, {payload}) => {
    return {...state, mypageInfo: payload}
  },
  "modal/SET_MY_PAGE_YOUR_MEM": (state, {payload}) => {
    return {...state, mypageYourMem: payload}
  },
  "modal/SET_MY_PAGE_CHANGE": (state, {payload}) => {
    return {...state, mypageChange: payload}
  },
  "modal/SET_TOGGLE_WALLET": (state, {payload}) => {
    return {...state, toggleWallet: payload}
  },
  "modal/SET_BROADCAST_OPTION": (state, {payload}) => {
    return {...state, broadcastOption: payload}
  },
  "modal/SET_SPECIAL_INFO": (state, {payload}) => {
    return {...state, specialInfo: payload}
  },
});


export default modal;

