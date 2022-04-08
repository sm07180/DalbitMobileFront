import {createAction} from "typesafe-actions";
import {IBroadcastNoticeState} from "../types/broadcastNoticeType";

const SET_BROADCASTNOTICE_DATA = "broadcastNotice/SET_BROADCASTNOTICE_DATA";

export const setBroadcastNoticeData = createAction(SET_BROADCASTNOTICE_DATA)<IBroadcastNoticeState>();