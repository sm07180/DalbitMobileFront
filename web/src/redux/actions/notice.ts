import {createAction} from "typesafe-actions";
import {NoticeNewAlarmState} from "../types/noticeType";

const SET_NOTICE_TAB = "notice/SET_NOTICE_TAB";
const SET_NOTICE_DATA = "notice/SET_NOTICE_DATA";

export const setNoticeTab = createAction(SET_NOTICE_TAB)<string>();
export const setNoticeData = createAction(SET_NOTICE_DATA)<NoticeNewAlarmState>();