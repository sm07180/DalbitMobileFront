import {createReducer} from "typesafe-actions";
import {NoticeActions, noticeNewAlarmDefaultState, NoticeNewAlarmState} from "../../types/noticeType";

const initialState:{ broadNotice: number; moveUrl: string; newCnt: number; qna: number; byeol: number; alarm: number; fanBoard: number; dal: number; notice: number } = noticeNewAlarmDefaultState;

const newAlarm = createReducer<NoticeNewAlarmState, NoticeActions>(initialState, {
    "notice/SET_NOTICE_DATA": (state, {payload}) => {
        return {...payload}
    }
});

export default newAlarm;