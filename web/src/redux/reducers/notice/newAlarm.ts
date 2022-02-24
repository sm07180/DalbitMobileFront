import {createReducer} from "typesafe-actions";
import {NoticeActions, noticeNewAlarmDefaultState, NoticeNewAlarmState} from "../../types/noticeType";

const initialState:NoticeNewAlarmState = noticeNewAlarmDefaultState;

const newAlarm = createReducer<NoticeNewAlarmState, NoticeActions>(initialState, {
    "notice/SET_NOTICE_DATA": (state, {payload}) => {
        return {...payload}
    }
});

export default newAlarm;