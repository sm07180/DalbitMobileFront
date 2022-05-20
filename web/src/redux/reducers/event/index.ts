import { createReducer } from "typesafe-actions";
import {EventActions, IDallaGroundState, teamStateDefault} from "../../types/eventType";

const initialState: IDallaGroundState = {
  dallaGroundTabType: 0
  , rankingListInfo: {list: [], cnt: 0} // 달라그라운드 랭킹 리스트
  , myTeamInfo: teamStateDefault // 달라그라운드 내 팀 정보
}

const event = createReducer<IDallaGroundState, EventActions>(initialState,{
  "event/SET_DALLA_GROUND_TAB_SET": (state, {payload}) => {
    return {...state, dallaGroundTabType: payload}
  },
  "event/SET_DALLA_GROUND_LIST_SET": (state, {payload}) => {
    return {...state, rankingListInfo: payload}
  },
  "event/SET_DALLA_GROUND_MY_TEAM_INFO_SET": (state, {payload}) => {
    return {...state, myTeamInfo: payload}
  },
})

export default event;