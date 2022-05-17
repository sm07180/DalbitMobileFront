import { createReducer } from "typesafe-actions";
import { ActionType } from 'typesafe-actions';
import * as actions from "../../actions/story";
export type StoryActions = ActionType<typeof actions>;

export interface IStoryState {
  tabType: string;
  list: Array<any>;
  pageInfo: { pageNo: number, pagePerCnt: number };
  backFlag: boolean;
};

export const initialState = {
  tabType: '받은 사연',
  list: [],
  pageInfo: {pageNo: 1, pagePerCnt: 100},
  backFlag: false
};

const story = createReducer<IStoryState, StoryActions>(initialState,{
  "story/SET_INIT": () => {
    return initialState;
  },
  "story/SET_DATA": (state, {payload}) => {
    return {...state, ...payload};
  }

});

export default story;