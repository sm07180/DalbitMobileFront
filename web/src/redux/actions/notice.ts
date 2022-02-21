import {createAction} from "typesafe-actions";

const SET_NOTIC_TAB = "notice/SET_NOTICE_TAB";

export const setNoticeTab = createAction(SET_NOTIC_TAB)<string>();