import { createReducer } from "typesafe-actions";
import { ActionType } from 'typesafe-actions';
import * as actions from "../../actions/story";
export type StoryActions = ActionType<typeof actions>;

export interface IStoryState {
  list: Array<any>
  pageInfo: { pageNo: number, pagePerCnt: number }
};

export const initialState = {
  list: [],
  pageInfo: {pageNo: 1, pagePerCnt: 20}
};

const story = createReducer<IStoryState, StoryActions>(initialState,{
  "story/SET_INIT": () => {
    return initialState;
  },
  "story/SET_LIST": (state, {payload}) => {
    console.log("setList", {...state, list: payload });
    return {...state, list: payload };
  },
  "story/SET_PAGE_INFO": (state, {payload}) => {
    console.log("setPageInfo", {...state, pageInfo: payload });
    return {...state, pageInfo: payload};
  }

});

export default story;