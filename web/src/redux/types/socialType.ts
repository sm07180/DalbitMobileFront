import {ActionType} from "typesafe-actions";
import * as actions from "../actions/social";

export type SocialActions = ActionType<typeof actions>;

export interface SocialState {
    tab: string;
}