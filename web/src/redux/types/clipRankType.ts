import {ActionType} from "typesafe-actions"
import * as actions from "../actions/clipRank"

export type ClipRankActions = ActionType<typeof actions>

export type ClipRankStateType = {
  clipRankList: Array<any>
  winnerRankMsgProf: any
  myInfo: any
  formState: ClipRankFromStateType
}
export type ClipRankFromStateType = {
  dateType: number
  rankingDate: string
  page: number
}
