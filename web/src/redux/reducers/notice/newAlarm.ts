import {createReducer} from "typesafe-actions";
import {NoticeActions, NoticeNewAlarmState} from "../../types/noticeType";

const initialState:NoticeNewAlarmState = {
    newCnt: 0
}

const newAlarm = createReducer<NoticeNewAlarmState, NoticeActions>(initialState, {
    "notice/SET_NOTICE_DATA": (state, {payload}) => {
        return {newCnt: payload}
    }
});

export default newAlarm;