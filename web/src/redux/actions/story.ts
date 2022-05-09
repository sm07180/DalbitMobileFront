import {createAction} from "typesafe-actions";

export const SET_INIT = "story/SET_INIT";
export const SET_LIST = "story/SET_LIST";
export const SET_PAGE_INFO = "story/SET_PAGE_INFO";

export const setInit = createAction(SET_INIT)<any>();
export const setList = createAction(SET_LIST)<Array<any>>();
export const setPageInfo = createAction(SET_PAGE_INFO)<{pageNo: number, pagePerCnt: number}>();