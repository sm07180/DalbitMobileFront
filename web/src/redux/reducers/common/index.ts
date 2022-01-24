import { createReducer } from "typesafe-actions";
import { CommonActions, CommonState } from "../../types/commonType";

const initialState:CommonState = {
  isLoading:false
}

const common = createReducer<CommonState,CommonActions>(initialState,{
  "common/SET_IS_LOADING_SUCCESS": (state,{payload}) => {
    if(typeof payload === "boolean"){
      return {...state,isLoading:payload}
    }else{
      return {...state,isLoading:payload.isLoading}
    }
  }
});


export default common;

