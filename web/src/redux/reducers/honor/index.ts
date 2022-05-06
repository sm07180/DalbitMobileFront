import {createReducer} from "typesafe-actions";
import {HonorActions, HonorState} from "../../types/honorType";
import UtilityCommon from "common/utility/utilityCommon";

const initialState:HonorState = UtilityCommon.eventDateCheck("20220501") ? {
    tab: "스타DJ"
} : {tab: "스페셜DJ"};

const honor = createReducer<HonorState, HonorActions>(initialState, {
    "honor/SET_HONOR_TAB": (state, {payload}) => {
        return {tab: payload}
    }
});

export default honor;