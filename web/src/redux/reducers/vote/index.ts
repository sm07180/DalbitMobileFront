import { createReducer } from "typesafe-actions";
import {VoteActions, VoteStateType} from "../../types/voteType";
import {SET_VOTE_INTERACTION} from "../../actions/vote";

// const [tabType, setTabType] = useState(tabMenu[0])
// const [makeVote, setMakeVote] = useState<boolean>(false);
// const [temp, setTemp] = useState("list");
export const initialState:VoteStateType = {
  result: '',
  code: '',
  messageKey: '',
  message: '',
  timestamp: '',
  validationMessageDetail: [],
  methodName:'',
  interaction:{
    tab : 's',
    step : 'list'
  }
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
  "vote/SET_TEMP_INS_VOTE" : (state, {payload})=>{
    return {...state, tempInsVote:payload}
  },
  "vote/SET_VOTE_INTERACTION" : (state, {payload})=>{
    return {...state, interaction:{...state.interaction, ...payload}}
  },

});


export default member;

