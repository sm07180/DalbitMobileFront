import {createReducer} from "typesafe-actions";
import {RankActions, RankState} from "../../types/rankType";

const initialState:RankState = {
    subTab: "FAN"
}

const rank = createReducer<RankState, RankActions>(initialState, {
    "rank/SET_SUB_TAB": (state,{payload}) => {
        return {subTab: payload}
    }
});

export default rank;