import {createReducer} from "typesafe-actions";
import {InquireActions, InquireState} from "../../types/inquireType";

const initialState:InquireState= {
    tab: "문의하기"
}

const inquire = createReducer<InquireState, InquireActions>(initialState, {
    "customer/inquire/SET_INQUIRE_TAB": (state, {payload}) => {
        return {tab: payload}
    }
});

export default inquire;