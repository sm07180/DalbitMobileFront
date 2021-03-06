import {createReducer} from "typesafe-actions";
import {NoticeActions, NoticeState} from "../../types/noticeType";

const initialState:NoticeState = {
    tab: "알림"
}

const notice = createReducer<NoticeState, NoticeActions>(initialState, {
    "notice/SET_NOTICE_TAB": (state, {payload}) => {
        return {tab: payload}
    }
});

export default notice;