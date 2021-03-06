import {createAction} from "typesafe-actions";
import {ModeTabType, ReceiptType, StoreInfoType, StoreTabInfoType, UpdateVersionInfoType} from "../types/pay/storeType";
import {Action} from "history";

export const GET_INDEX_DATA = 'payStore/GET_INDEX_DATA';
export const GET_PRICE_LIST = 'payStore/GET_PRICE_LIST';
export const GET_DAL_CNT = 'payStore/GET_DAL_CNT';

export const SET_STORE_INFO = 'payStore/SET_STORE_INFO';
export const SET_STORE_TAB_INFO = 'payStore/SET_STORE_TAB_INFO';
export const SET_UPDATE_VERSION_INFO = 'payStore/SET_UPDATE_VERSION_INFO';

export const SET_STATE_HEADER_VISIBLE = 'payStore/SET_STATE_HEADER_VISIBLE';
export const GET_RECEIPT = 'payStore/GET_RECEIPT';
export const SET_RECEIPT = 'payStore/SET_RECEIPT';
export const INIT_RECEIPT = 'payStore/INIT_RECEIPT';

export const getIndexData = createAction(GET_INDEX_DATA)<Action>();
export const getPriceList = createAction(GET_PRICE_LIST)<ModeTabType>();
export const getDalCnt = createAction(GET_DAL_CNT)();

export const setStoreInfo = createAction(SET_STORE_INFO)<StoreInfoType>();
export const setStoreTabInfo = createAction(SET_STORE_TAB_INFO)<Array<StoreTabInfoType>>();
export const setUpdateVersionInfo = createAction(SET_UPDATE_VERSION_INFO)<UpdateVersionInfoType>();

export const setStateHeaderVisible = createAction(SET_STATE_HEADER_VISIBLE)<boolean>();
export const getReceipt = createAction(GET_RECEIPT)<Pick<ReceiptType, 'orderId' & 'returnType'>>();
export const setReceipt = createAction(SET_RECEIPT)<ReceiptType>();
export const initReceipt = createAction(INIT_RECEIPT)();
