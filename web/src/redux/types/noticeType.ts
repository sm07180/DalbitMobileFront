import {ActionType} from "typesafe-actions";
import * as actions from "../actions/notice";

export type NoticeActions = ActionType<typeof actions>;

export interface NoticeState {
    tab: string;
}