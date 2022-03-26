import {ActionType} from "typesafe-actions";
import * as actions from "../actions/notice";

export type NoticeActions = ActionType<typeof actions>;

export const noticeNewAlarmDefaultState = {
    alarm: 0,
    broadNotice: 0,
    byeol: 0,
    dal: 0,
    fanBoard: 0,
    moveUrl: "",
    newCnt: 0,
    notice: 0,
    qna: 0
}

export interface NoticeState {
    tab: string;
}

interface NoticeNewAlarmData {
    alarm: number;
    broadNotice: number;
    byeol: number;
    dal: number;
    fanBoard: number;
    moveUrl: string;
    newCnt: number;
    notice: number;
    qna: number;
}

export interface NoticeNewAlarmState {
    alarm: number;
    broadNotice: number;
    byeol: number;
    dal: number;
    fanBoard: number;
    moveUrl: string;
    newCnt: number;
    notice: number;
    qna: number;
}

export interface NoticeTabListState {
    tabList: Array<string>;
    tabName: string;
    isRefresh: boolean;
    isReset: boolean;
}