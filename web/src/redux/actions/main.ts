import { createAction } from "typesafe-actions";
import {IMainState, IMainLiveList} from "../types/mainType";

export const SET_MAIN_DATA = 'main/SET_MAIN_DATA';
export const SET_MAIN_DATA_SUCCESS = 'main/SET_MAIN_DATA_SUCCESS';
export const SET_MAIN_LIVE_LIST = 'main/SET_MAIN_LIVE_LIST';

export const setMainData = createAction(SET_MAIN_DATA)();
export const setMainDataSuccess = createAction(SET_MAIN_DATA_SUCCESS)<IMainState>();
export const setMainLiveList = createAction(SET_MAIN_LIVE_LIST)<IMainLiveList>();