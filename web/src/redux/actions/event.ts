import { createAction } from "typesafe-actions";
import {IRankingListType, ITeamType} from "../types/eventType";

export const SET_DALL_GROUND_TAB_SET = 'event/SET_DALLA_GROUND_TAB_SET';
export const setDallaGroundTabSet = createAction(SET_DALL_GROUND_TAB_SET)<number>();

export const SET_DALL_GROUND_LIST_SET = 'event/SET_DALLA_GROUND_LIST_SET';
export const setDallaGroundListSet = createAction(SET_DALL_GROUND_LIST_SET)<IRankingListType>();

export const SET_DALL_GROUND_MY_TEAM_INFO_SET = 'event/SET_DALLA_GROUND_MY_TEAM_INFO_SET';
export const setDallaGroundMyTeamInfoSet = createAction(SET_DALL_GROUND_MY_TEAM_INFO_SET)<ITeamType>();