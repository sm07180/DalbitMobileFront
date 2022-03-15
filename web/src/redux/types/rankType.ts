import {ActionType} from "typesafe-actions";
import * as actions from "../actions/rank"


export type RankActions = ActionType<typeof actions>;

export interface RankState {
    subTab: string;
}