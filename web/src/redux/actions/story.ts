import {createAction} from "typesafe-actions";

export const SET_INIT = "story/SET_INIT";
export const SET_DATA = "story/SET_DATA";

export const setInit = createAction(SET_INIT)<any>();
export const setData = createAction(SET_DATA)<any>();