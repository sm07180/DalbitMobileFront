import {createAction} from "typesafe-actions";

const SET_INQUIRE_TAB = "customer/inquire/SET_INQUIRE_TAB";

export const setInquireTab = createAction(SET_INQUIRE_TAB)<string>();