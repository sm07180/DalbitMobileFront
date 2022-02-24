import {ActionType} from "typesafe-actions";
import * as actions from "../actions/notice";

export type NoticeActions = ActionType<typeof actions>;

export const noticeNewAlarmDefaultState = {
    newAlarmList: []
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
    newAlarmList: Array<NoticeNewAlarmData>;
}