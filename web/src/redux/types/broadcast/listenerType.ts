import {ActionType} from "typesafe-actions";
import * as listenerActions from "../../actions/broadcast/listener";

export type ListenerActions = ActionType<typeof listenerActions>;

export type BroadcastListenerRequestType = {
  roomNo: string
  page: number
  records: number
}
export type BroadcastStateType = {
  listener:BroadcastListenerStateType
}
export type BroadcastListenerListStateType = {
  param: BroadcastListenerRequestType
  data: BroadcastListenerResultType
}
export type BroadcastListenerStateType = {
  list:BroadcastListenerListStateType
}

export type BroadcastListenerType = {
  age: number
  auth: number
  badgeSpecial: number
  byeolCnt: number
  commonBadgeList: Array<any>
  ctrlRole: string
  gender: 'm' | 'f'
  goodCnt: number
  isFan: boolean
  isGuest: boolean
  isNewListener: boolean
  isSpecial: boolean
  joinDt: string
  joinTs: number
  liveBadgeList: Array<any>
  liveFanRank: number
  managerType: number
  memId: string
  memNo: string
  nickNm: string
  profImg: ProfileImageType
  length: number
}
export type BroadcastListenerResultType = {
  list: Array<BroadcastListenerType>
  paging: PagingType
  noMemCnt: number
  totalMemCnt: number
}
export type ProfileImageType = {
  isDefaultImg: boolean
  path: string
  thumb50x50: string
  thumb62x62: string
  thumb80x80: string
  thumb88x88: string
  thumb100x100: string
  thumb120x120: string
  thumb150x150: string
  thumb190x190: string
  thumb292x292: string
  thumb336x336: string
  thumb500x500: string
  thumb700x700: string
  url: string
}
export type PagingType = {
  next: number
  page: number
  prev: number
  records: number
  total: number
  totalPage: number
}
