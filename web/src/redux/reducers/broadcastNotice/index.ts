import {createReducer} from "typesafe-actions";
import {IBroadcastNoticeState, BroadcastNoticeActions ,broadcastNoticeDefault} from "../../types/broadcastNoticeType";

const initialState: IBroadcastNoticeState = broadcastNoticeDefault;

const broadcastNotice = createReducer<IBroadcastNoticeState, BroadcastNoticeActions>(initialState, {
    "broadcastNotice/SET_BROADCASTNOTICE_DATA": (state, {payload}) => {
        return {...payload}
    }
});

export default broadcastNotice;