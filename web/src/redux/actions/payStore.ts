import {createAction} from "typesafe-actions";
import {ModeTabType, StoreInfoType, StoreTabInfoType} from "../types/pay/storeType";
import {Action} from "history";

export const GET_INDEX_DATA = 'payStore/GET_INDEX_DATA';
export const GET_PRICE_LIST = 'payStore/GET_PRICE_LIST';

export const SET_STORE_INFO = 'payStore/SET_STORE_INFO';
export const SET_STORE_TAB_INFO = 'payStore/SET_STORE_TAB_INFO';

export const getIndexData = createAction(GET_INDEX_DATA)<Action>();
export const getPriceList = createAction(GET_PRICE_LIST)<ModeTabType>();

export const setStoreInfo = createAction(SET_STORE_INFO)<StoreInfoType>();
export const setStoreTabInfo = createAction(SET_STORE_TAB_INFO)<Array<StoreTabInfoType>>();
