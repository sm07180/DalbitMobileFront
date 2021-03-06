import {createReducer} from "typesafe-actions";
import {InsVoteRequestType, VoteActions, VoteResultType, VoteSlctKor, VoteStateType} from "../../types/voteType";

const initDate ={
  date: {
    day: 0,
    month: 0,
    year: 0,
  },
  time: {
    minute: 0,
    hour: 0,
    nano: 0,
    second: 0
  }
}

export const MAX_END_TIME = 60
export const MAX_VOTE_ITEM = 10
export const initVoteSel: VoteResultType = {
  voteNo: '',
  memNo: '',
  roomNo: '',
  voteTitle: '',
  voteEndSlct:'s',
  voteAnonyYn: 'y',
  voteDupliYn: 'n',
  voteMemCnt:0,
  voteItemCnt: 0,
  endTime: 0,
  startDate:initDate,
  endDate : initDate,
  insDate:initDate,
  updDate:initDate,
  itemNo: '',
  voteItemName: '',
  memVoteYn : 'n',
  rank:0,
}
export const initTempInsVoteVoteItemNames = ['','',''];
export const initTempInsVote:InsVoteRequestType = {
  memNo:'',
  roomNo:'',
  voteItemNames:initTempInsVoteVoteItemNames,
  endTime:0,
  voteItemCnt:initTempInsVoteVoteItemNames.length,
  voteDupliYn:'n',
  voteAnonyYn:'y',
  voteTitle:''
}
export const initialState:VoteStateType = {
  active: false,

  result: '',
  code: '',
  messageKey: '',
  message: '',
  timestamp: '',
  validationMessageDetail: [],
  methodName:'',

  voteSel:initVoteSel,
  voteList: {
    cnt: 0,
    list: []
  },
  voteDetailList:[],
  tempInsVote: initTempInsVote,
  selVoteItem: initVoteSel,
  step: 'list',

  voteTab: VoteSlctKor.S,
  callback: null
}

const vote = createReducer<VoteStateType, VoteActions>(initialState,{
  "vote/SET_VOTE_ACTIVE" : (state, {payload})=>{
    return {...state, active:payload}
  },
  "vote/SET_VOTE_API_RESULT" : (state, {payload})=>{
    return {...state, ...payload}
  },
  "vote/SET_VOTE_LIST" : (state, {payload})=>{
    return {...state, voteList:payload}
  },
  "vote/SET_VOTE_SEL" : (state, {payload})=>{
    return {...state, voteSel:payload}
  },
  "vote/SET_VOTE_DETAIL_LIST" : (state, {payload})=>{
    return {...state, voteDetailList:payload}
  },
  "vote/SET_TEMP_INS_VOTE" : (state, {payload})=>{
    return {...state, tempInsVote:payload}
  },
  "vote/SET_SEL_VOTE_ITEM" : (state, {payload})=>{
    return {...state, selVoteItem:payload}
  },
  "vote/SET_VOTE_STEP" : (state, {payload})=>{
    return {...state, step:payload}
  },
  "vote/SET_VOTE_TAB" : (state, {payload})=>{
    return {...state, voteTab:payload}
  },
  "vote/SET_VOTE_CALLBACK" : (state, {payload})=>{
    return {...state, callback:payload}
  },
});


export default vote;

