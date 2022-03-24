import {createAction} from "typesafe-actions";
import {NoticeNewAlarmState, NoticeTabListState} from "../types/noticeType";

const SET_NOTICE_TAB = "notice/SET_NOTICE_TAB";
const SET_NOTICE_DATA = "notice/SET_NOTICE_DATA";
const SET_NOTICE_TABLIST = "notice/SET_NOTICE_TABLIST";

export const setNoticeTab = createAction(SET_NOTICE_TAB)<string>();
export const setNoticeData = createAction(SET_NOTICE_DATA)<NoticeNewAlarmState>();
export const setNoticeTabList = createAction(SET_NOTICE_TABLIST)<NoticeTabListState>();