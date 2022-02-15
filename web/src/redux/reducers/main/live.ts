import { createReducer } from "typesafe-actions";
import { MainActions, IMainLiveList } from "../../types/mainType";

const initialState:IMainLiveList = {
  list: [],
  paging: {
    next: 0,
    page: 0,
    prev: 0,
    records: 0,
    total: 0,
    totalPage: 0
  },
}

const live = createReducer<IMainLiveList,MainActions>(initialState,{
  "main/SET_MAIN_LIVE_LIST": (state,{payload}) => {
    return {...payload}
  }
});


export default live;

