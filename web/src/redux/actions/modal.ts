import { createAction } from "typesafe-actions";

export const SET_PAY_INFO = 'modal/SET_PAY_INFO';
export const SET_MY_PAGE_INFO = 'modal/SET_MY_PAGE_INFO';
export const SET_MY_PAGE_YOUR_MEM = 'modal/SET_MY_PAGE_YOUR_MEM';
export const SET_MY_PAGE_CHANGE = 'modal/SET_MY_PAGE_CHANGE';
export const SET_TOGGLE_WALLET = 'modal/SET_TOGGLE_WALLET';
export const SET_BROADCAST_OPTION = 'modal/SET_BROADCAST_OPTION';
export const SET_SPECIAL_INFO = 'modal/SET_SPECIAL_INFO';

export const setPayInfo = createAction(SET_PAY_INFO)<any>();
export const setMyPageInfo = createAction(SET_MY_PAGE_INFO)<any>();
export const setMyPageYourMem = createAction(SET_MY_PAGE_YOUR_MEM)<string>();
export const setMyPageChange = createAction(SET_MY_PAGE_CHANGE)<boolean>();
export const setToggleWallet = createAction(SET_TOGGLE_WALLET)<number>();
export const setBroadcastOption = createAction(SET_BROADCAST_OPTION)<any>();
export const setSpecialInfo = createAction(SET_SPECIAL_INFO)<any>();

