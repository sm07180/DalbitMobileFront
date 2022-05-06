import {ActionType} from "typesafe-actions";
import * as actions from "../actions/notice";

export type NoticeActions = ActionType<typeof actions>;

export const noticePagingDefault = {
    next: 2,
    page: 1,
    prev: 0,
    records: 20,
    total: 0,
    totalPage: 0
}

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

export const postDefaultState = {
    list: [],
    cnt: 0,
    paging: noticePagingDefault,
    isLastPage: false,
}

interface postData {
    noticeIdx: number;
    noticeType: number;
    title: string;
    contents: string;
    read_yn: string;
    writeDt: string;
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

export interface Paging {
    next: number;
    page: number;
    prev: number;
    records: number;
    total: number;
    totalPage: number;
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

type noticeTabNameType = "알림" | "공지사항" | "1:1문의";
type inquireTabType = "문의하기" | "나의문의내역";
export interface NoticeTabListState {
    tabList: Array<string>;
    tabName: noticeTabNameType;
    isRefresh: boolean;
    isReset: boolean;
    inquireTabList: Array<string>;
    inquireTab: inquireTabType, // 1:1문의 하위 탭
}

export interface postDataState {
    list: Array<postData>;
    cnt: number;
    paging: Paging;
    isLastPage: boolean;
}