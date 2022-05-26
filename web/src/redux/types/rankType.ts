import {ActionType} from "typesafe-actions";
import * as actions from "../actions/rank";

export type RankActions = ActionType<typeof actions>

export type RankStateType = {
    rankList: Array<any>
    rankData: RankDataType
    levelList: Array<any>
    likeList: Array<any>
    specialList: Array<any>
    weeklyList: Array<any>
    secondList: Array<any>
    formState: RankFormStateType
    totalPage: number
    myInfo: any
    scrollY: number
    specialPoint: any
    specialPointList: Array<any>
    rankTimeData: RankTimeDataType
    subTab: string
    cache: boolean
    paging: Paging
}
export type Paging = {
    pageNo: number,
    pagePerCnt: number,
    lastPage: number
}
export type RankDataType = {
    isRankData: boolean
}
export type RankFormStateRankingType = {
    rankType: number
    dateType: number
    currentDate: Date
}
export type RankFormStateFameType = {
    rankType: number
    dateType: number
    currentDate: Date
}
export type RankFormStateType = {
    pageType: string
    ranking: RankFormStateRankingType
    fame: RankFormStateFameType
    page: number
}
export type RankTimeDataType = {
    prevDate: string
    nextDate: string
    rankRound: number
    titleText: string
    isRankData: boolean
}
