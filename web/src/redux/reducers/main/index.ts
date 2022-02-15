import { createReducer } from "typesafe-actions";
import { MainActions, IMainState } from "../../types/mainType";

const initialState:IMainState = {
  topBanner: [],
  myStar: [],
  dayRanking: {
    djRank: [],
    fanRank: [],
    loverRank: [],
  },
  newBjList: [],
  centerBanner: [],
  newAlarmCnt: 0,
  popupLevel: 0,
}

const main = createReducer<IMainState,MainActions>(initialState,{
  "main/SET_MAIN_DATA_SUCCESS": (state,{payload}) => {
    return {...payload}
  }
});


export default main;

