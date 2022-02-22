import { createReducer } from "typesafe-actions";
import {VoteActions, VoteStateType} from "../../types/voteType";

export const initialState:VoteStateType = {
  result: '',
  code: '',
  messageKey: '',
  message: '',
  timestamp: '',
  validationMessageDetail: [],
  methodName:''
}

const member = createReducer<VoteStateType, VoteActions>(initialState,{
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
});


export default member;

