import { createAction } from "typesafe-actions";
import {
  ApiResultType,
  DelVoteRequestType, EndVoteRequestType, GetVoteDetailListRequestType,
  GetVoteListRequestType,
  GetVoteSelRequestType,
  InsMemVoteRequestType,
  InsVoteRequestType, VoteListResultType, VoteResultType, VoteStateType, VoteStepType,
} from "../types/voteType";

export const SET_VOTE_ACTIVE = 'vote/SET_VOTE_ACTIVE';
export const INS_VOTE = 'vote/INS_VOTE';
export const INS_MEM_VOTE = 'vote/INS_MEM_VOTE';
export const DEL_VOTE = 'vote/DEL_VOTE';
export const END_VOTE = 'vote/END_VOTE';
export const GET_VOTE_LIST = 'vote/GET_VOTE_LIST';
export const GET_VOTE_SEL = 'vote/GET_VOTE_SEL';
export const GET_VOTE_DETAIL_LIST = 'vote/GET_VOTE_DETAIL_LIST';

export const SET_VOTE_API_RESULT = 'vote/SET_VOTE_API_RESULT';
export const SET_VOTE_LIST = 'vote/SET_VOTE_LIST';
export const SET_VOTE_SEL = 'vote/SET_VOTE_SEL';
export const SET_VOTE_DETAIL_LIST = 'vote/SET_VOTE_DETAIL_LIST';

export const SET_TEMP_INS_VOTE = 'vote/SET_TEMP_INS_VOTE';

export const SET_SEL_VOTE_ITEM = 'vote/SET_SEL_VOTE_ITEM';
//'list' | 'vote' | 'ins'
export const MOVE_VOTE_LIST_STEP = 'vote/MOVE_VOTE_LIST_STEP';
export const MOVE_VOTE_STEP = 'vote/MOVE_VOTE_STEP';
export const MOVE_VOTE_INS_STEP = 'vote/MOVE_VOTE_INS_STEP';
export const SET_VOTE_STEP = 'vote/SET_VOTE_STEP';

export const setVoteActive = createAction(SET_VOTE_ACTIVE)<boolean>();
export const insVote = createAction(INS_VOTE)<InsVoteRequestType>();
export const insMemVote = createAction(INS_MEM_VOTE)<InsMemVoteRequestType>();
export const delVote = createAction(DEL_VOTE)<DelVoteRequestType>();
export const endVote = createAction(END_VOTE)<EndVoteRequestType>();
export const getVoteList = createAction(GET_VOTE_LIST)<GetVoteListRequestType>();
export const getVoteSel = createAction(GET_VOTE_SEL)<GetVoteSelRequestType>();
export const getVoteDetailList = createAction(GET_VOTE_DETAIL_LIST)<GetVoteDetailListRequestType>();

export const setVoteApiResult = createAction(SET_VOTE_API_RESULT)<ApiResultType>();
export const setVoteList = createAction(SET_VOTE_LIST)<VoteListResultType>();
export const setVoteSel = createAction(SET_VOTE_SEL)<VoteResultType>();
export const setVoteDetailList = createAction(SET_VOTE_DETAIL_LIST)<Array<VoteResultType>>();

export const setTempInsVote = createAction(SET_TEMP_INS_VOTE)<InsVoteRequestType>();

export const setSelVoteItem = createAction(SET_SEL_VOTE_ITEM)<VoteResultType>();
export const setVoteStep = createAction(SET_VOTE_STEP)<VoteStepType>();
export const moveVoteListStep = createAction(MOVE_VOTE_LIST_STEP)<GetVoteListRequestType>();
export const moveVoteStep = createAction(MOVE_VOTE_STEP)<GetVoteSelRequestType>();
export const moveVoteInsStep = createAction(MOVE_VOTE_INS_STEP)();
