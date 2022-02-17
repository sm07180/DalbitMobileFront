import {ActionType} from "typesafe-actions";
import * as actions from "../actions/honor";

export type HonorActions = ActionType<typeof actions>;

export interface HonorState {
    tab: string;
}