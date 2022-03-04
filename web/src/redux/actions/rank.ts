import {createAction} from "typesafe-actions";

const SET_SUB_TAB = "rank/SET_SUB_TAB";

export const setSubTab = createAction(SET_SUB_TAB)<string>();