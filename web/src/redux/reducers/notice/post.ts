import {createReducer} from "typesafe-actions";
import {postDataState, NoticeActions, postDefaultState} from "../../types/noticeType";

const initialState: postDataState = postDefaultState;

const post = createReducer<postDataState, NoticeActions>(initialState, {
    "post/SET_POST_DATA": (state, {payload}) => {
        return {...payload}
    }
});

export default post;