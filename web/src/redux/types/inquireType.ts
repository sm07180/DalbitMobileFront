import {ActionType} from "typesafe-actions";
import * as actions from "../actions/inquire";

export type InquireActions = ActionType<typeof actions>;

export interface InquireState {
    tab: string;
}