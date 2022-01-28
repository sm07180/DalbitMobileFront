import { createReducer } from "typesafe-actions";
import {MemberActions, Member, MemberState} from "../../types/memberType";

export const initialState:MemberState = {
  data : null,
  isLogin : false,
  authToken : "",
  memNo : 0
}

const member = createReducer<MemberState,MemberActions>(initialState,{
  "member/GET_MEMBER_PROFILE_SUCCESS" : (state, {payload})=>{
    return {
      ...state,
      data : payload
    }
  },
  "member/SET_MEMBER_LOGIN" : (state, {payload}) => {
    return {
      ...state,
      ...payload
    }
  }
});


export default member;

