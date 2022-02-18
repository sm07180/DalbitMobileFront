import {createAction} from "typesafe-actions";

const SET_HONOR_TAB = "honor/SET_HONOR_TAB";

export const setHonorTab = createAction(SET_HONOR_TAB)<string>();