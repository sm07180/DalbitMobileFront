import {ActionType} from "typesafe-actions";
import * as actions from '../actions/broadcastNotice';

export type BroadcastNoticeActions = ActionType<typeof actions>;

export const broadcastNoticeDefault = {
    auto_no: 0,
    mem_no: 0,
    conts: "",
    ins_date: "",
    upd_date: ""
}

interface IBroadcastNotice {
    auto_no: number;
    mem_no: number;
    conts: string;
    ins_date: string;
    upd_date: string;
}

export interface IBroadcastNoticeState {
    auto_no: number;
    mem_no: number;
    conts: string;
    ins_date: string;
    upd_date: string;
}