import {createReducer} from "typesafe-actions";
import {HonorActions, HonorState} from "../../types/honorType";

const initialState:HonorState = {
    tab: "스페셜DJ"
}

const honor = createReducer<HonorState, HonorActions>(initialState, {
    "honor/SET_HONOR_TAB": (state, {payload}) => {
        return {tab: payload}
    }
});

export default honor;