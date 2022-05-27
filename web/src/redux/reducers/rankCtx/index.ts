import {createReducer} from "typesafe-actions";
import {RankActions, RankStateType} from "../../types/rankType";
import {RANK_TYPE} from "../../../pages/rank/constant";

const initialState:RankStateType = {
    subTab: "FAN",
    cache: true,
    paging: {
        pageNo: 1,
        pagePerCnt: 20,
        lastPage: 0
    },
    rankList: [],
    rankTopList: [],
    rankTopSwiperNum:1,

    rankData: {
        isRankData: false,
    },
    levelList: [],
    likeList: [],
    specialList: [],
    weeklyList: [],
    secondList: [],
    formState: {
        pageType: "ranking",
        ranking: {
            rankType: 1,
            dateType: 5,
            currentDate: new Date(),
        },
        fame: {
            rankType: 4,
            dateType: 1,
            currentDate: new Date(),
        },
        page: 1,
    },
    myInfo: {
        isReward: false,
        myGiftPoint: 0,
        myListenerPoint: 0,
        myRank: 0,
        myUpDown: "",
        myBroadPoint: 0,
        myLikePoint: 0,
        myPoint: 0,
        myListenPoint: 0,
        time: "",
    },
    totalPage: 1,
    scrollY: 0,
    specialPoint: {
        totalPoint: 0,
        nickNm: "",
    },
    specialPointList: [],
    rankTimeData: {
        prevDate: "",
        nextDate: "",
        rankRound: 0,
        titleText: "",
        isRankData: false,
    },
}

const rank = createReducer<RankStateType, RankActions>(initialState, {
    "rank/SET_SUB_TAB": (state,{payload}) => {
        return {...state, subTab: payload}
    },
    "rank/SET_CACHE": (state,{payload}) => {
        return {...state, cache: payload}
    },
    "rank/SET_PAGING": (state, {payload}) => {
        return {...state, paging: payload}
    },
    "rank/SET_RANK_LIST": (state, {payload}) => {
        return {...state, rankList: payload}
    },
    "rank/SET_RANK_TOP_LIST": (state, {payload}) => {
        return {...state, rankTopList: payload}
    },
    "rank/SET_RANK_TOP_SWIPER_NUM": (state, {payload}) => {
        return {...state, rankTopSwiperNum: payload}
    },
    "rank/SET_RANK_DATA": (state, {payload}) => {
        return {...state, rankData: payload}
    },
    "rank/SET_RANK_LEVEL_LIST": (state, {payload}) => {
        return {...state, levelList: payload}
    },
    "rank/SET_RANK_LIKE_LIST": (state, {payload}) => {
        return {...state, likeList: payload}
    },
    "rank/SET_RANK_SPECIAL_LIST": (state, {payload}) => {
        return {...state, specialList: payload}
    },
    "rank/SET_RANK_WEEKLY_LIST": (state, {payload}) => {
        return {...state, weeklyList: payload}
    },
    "rank/SET_RANK_SECOND_LIST": (state, {payload}) => {
        return {...state, secondList: payload}
    },
    "rank/SET_RANK_MY_INFO": (state, {payload}) => {
        return {...state, myInfo: payload}
    },
    "rank/SET_RANK_TOTAL_PAGE": (state, {payload}) => {
        return {...state, totalPage: payload}
    },
    "rank/SET_RANK_SCROLL_Y": (state, {payload}) => {
        return {...state, scrollY: payload}
    },
    "rank/SET_RANK_SPECIAL_POINT": (state, {payload}) => {
        return {...state, specialPoint: payload}
    },
    "rank/SET_RANK_SPECIAL_POINT_LIST": (state, {payload}) => {
        return {...state, specialPoint: payload}
    },
    "rank/SET_RANK_TIME_DATA": (state, {payload}) => {
        return {...state, rankTimeData: payload}
    },
    "rank/SET_RANK_FROM_PAGE_TYPE": (state, {payload}) => {
        return {
            ...state,
            formState:{...state.formState, pageType: payload, page: 1,}
        };
    },
    "rank/SET_RANK_FROM_RANK_TYPE": (state, {payload}) => {
        return {
            ...state,
            formState:{
                ...state.formState,
                [state.formState.pageType]: {
                    rankType: payload,
                    dateType: payload === RANK_TYPE.DJ ? 5 : 1,
                    currentDate: new Date(),
                },
                page: 1
            },
        };
    },

    "rank/SET_RANK_FROM_DATE_TYPE": (state, {payload}) => {
        return {
            ...state,
            formState:{
                ...state.formState,
                [state.formState.pageType]: {
                    ...state[state.formState.pageType],
                    dateType: payload.dateType,
                    currentDate: payload.date,
                },
                page: 1,
            },
        };
    },
    "rank/SET_RANK_FROM_DATE": (state, {payload}) => {
        return {
            ...state,
            formState: {
                ...state.formState,
                [state.formState.pageType]: {
                    ...state[state.formState.pageType],
                    currentDate: payload,
                },
                page: 1,
            }
        };
    },
    "rank/SET_RANK_FROM_PAGE": (state) => {
        return {
            ...state,
            formState: {
                ...state.formState,
                page: state.formState.page + 1,
            }
        };
    },
    "rank/SET_RANK_FROM_INIT": (state) => {
        return {
            ...state,
            formState: {
                ...state.formState,
                page: 1,
            }
        };
    },
    "rank/SET_RANK_FROM_RESET": (state) => {
        return {
            ...state,
            formState: {
                pageType: "ranking",
                ranking: {
                    rankType: 1,
                    dateType: 5,
                    currentDate: new Date(),
                },
                fame: {
                    rankType: 4,
                    dateType: 1,
                    currentDate: new Date(),
                },
                page: 1,
            }
        };
    },
    "rank/SET_RANK_FROM_SEARCH": (state, {payload}) => {
        return {
            ...state,
            formState: {
                pageType: "ranking",
                ranking: {
                    rankType: payload.rankType,
                    dateType: payload.dateType,
                    currentDate: payload.currentDate,
                },
                fame: {
                    rankType: 4,
                    dateType: 1,
                    currentDate: new Date(),
                },
                page: 1,
            }
        };
    },
});

export default rank;
