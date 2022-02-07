import { createReducer } from "typesafe-actions";
import { IProfileFeedState, ProfileActions } from "../../types/profileType";

const initialState: IProfileFeedState = {
  feedList: [],
  fixCnt: 0,
  paging: {
    next: 0,
    page: 0,
    prev: 0,
    records: 0,
    total: 0,
    totalPage: 0
  },
  scrollPaging: {
    pageNo: 1,
    pagePerCnt: 20,
    currentCnt: 0,
  }
}

const feed = createReducer<IProfileFeedState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_FEED_DATA": (state, {payload}) => {
    console.log("SET_PROFILE_FEED_DATA payload:", payload)
    return {...payload}
  }
});


export default feed;