import { createReducer } from "typesafe-actions";
import { NoticeTabListState, NoticeActions } from "../../types/noticeType";

const initialState: NoticeTabListState = {
    tabList: ["알림", "공지사항", "1:1문의"],
    tabName: "공지사항",
    isRefresh: true,
    isReset: true,
    inquireTabList: ['문의하기','나의 문의내역'],
    inquireTab: '문의하기',
}

const noticeTabList = createReducer<NoticeTabListState, NoticeActions>(initialState, {
    "notice/SET_NOTICE_TABLIST": (state, {payload}) => {
        return {...state, ...payload}
    }
});

export default noticeTabList;