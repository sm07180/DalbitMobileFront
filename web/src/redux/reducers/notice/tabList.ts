import { createReducer } from "typesafe-actions";
import { NoticeTabListState, NoticeActions } from "../../types/noticeType";

const initialState: NoticeTabListState = {
    tabList: ["알림", "공지사항"],
    tabName: "공지사항",
    isRefresh: true,
    isReset: true
}

const noticeTabList = createReducer<NoticeTabListState, NoticeActions>(initialState, {
    "notice/SET_NOTICE_TABLIST": (state, {payload}) => {
        return {...payload}
    }
});

export default noticeTabList;