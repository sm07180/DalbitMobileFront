import { createAction } from "typesafe-actions";
import {
  ApiResultType,
  DelVoteRequestType, GetVoteDetailListRequestType,
  GetVoteListRequestType,
  GetVoteSelRequestType,
  InsMemVoteRequestType,
  InsVoteRequestType, VoteInteractionType, VoteListResultType, VoteResultType,
} from "../types/voteType";

export const INS_VOTE = 'vote/INS_VOTE';
export const INS_MEM_VOTE = 'vote/INS_MEM_VOTE';
export const DEL_VOTE = 'vote/DEL_VOTE';
export const GET_VOTE_LIST = 'vote/GET_VOTE_LIST';
export const GET_VOTE_SEL = 'vote/GET_VOTE_SEL';
export const GET_VOTE_DETAIL_LIST = 'vote/GET_VOTE_DETAIL_LIST';

export const SET_VOTE_API_RESULT = 'vote/SET_VOTE_API_RESULT';
export const SET_VOTE_LIST = 'vote/SET_VOTE_LIST';
export const SET_VOTE_SEL = 'vote/SET_VOTE_SEL';
export const SET_VOTE_DETAIL_LIST = 'vote/SET_VOTE_DETAIL_LIST';

export const SET_TEMP_INS_VOTE = 'vote/SET_TEMP_INS_VOTE';

export const INTERACTION_VOTE = 'vote/INTERACTION_VOTE';
export const SET_VOTE_INTERACTION = 'vote/SET_VOTE_INTERACTION';

export const insVote = createAction(INS_VOTE)<InsVoteRequestType>();
export const insMemVote = createAction(INS_MEM_VOTE)<InsMemVoteRequestType>();
export const delVote = createAction(DEL_VOTE)<DelVoteRequestType>();
export const getVoteList = createAction(GET_VOTE_LIST)<GetVoteListRequestType>();
export const getVoteSel = createAction(GET_VOTE_SEL)<GetVoteSelRequestType>();
export const getVoteDetailList = createAction(GET_VOTE_DETAIL_LIST)<GetVoteDetailListRequestType>();

export const setVoteApiResult = createAction(SET_VOTE_API_RESULT)<ApiResultType>();
export const setVoteList = createAction(SET_VOTE_LIST)<VoteListResultType>();
export const setVoteSel = createAction(SET_VOTE_SEL)<VoteResultType>();
export const setVoteDetailList = createAction(SET_VOTE_DETAIL_LIST)<Array<VoteResultType>>();

export const setTempInsVote = createAction(SET_TEMP_INS_VOTE)<InsVoteRequestType>();

export const interactionVote = createAction(INTERACTION_VOTE)<VoteInteractionType>();
export const setVoteInteraction = createAction(SET_VOTE_INTERACTION)<VoteInteractionType>();
