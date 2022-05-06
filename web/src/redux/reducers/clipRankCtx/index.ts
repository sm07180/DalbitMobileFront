import {createReducer} from "typesafe-actions";
import {ClipRankActions, ClipRankStateType} from "../../types/clipRankType";
import {convertDateFormat} from "../../../lib/dalbit_moment";
import {DATE_TYPE} from "../../../pages/rank/constant";
import {convertMonday} from "../../../lib/rank_fn";

const initialState:ClipRankStateType = {
  clipRankList: [],
  winnerRankMsgProf: [],
  myInfo: [],
  formState: {
    dateType: DATE_TYPE.DAY,
    rankingDate: convertDateFormat(new Date(), "YYYY-MM-DD"),
    page: 1,
  },
};

const clipRank = createReducer<ClipRankStateType, ClipRankActions>(initialState, {
  "clipRank/SET_CLIP_RANK_LIST": (state, {payload}) => {
    return {...state, clipRankList: payload}
  },
  "clipRank/SET_WINNER_RANK_MSG_PROF": (state, {payload}) => {
    return {...state, winnerRankMsgProf: payload}
  },
  "clipRank/SET_MY_INFO": (state, {payload}) => {
    return {...state, myInfo: payload}
  },
  "clipRank/SET_FORM_DATE_TYPE": (state, {payload}) => {
    return {
      ...state,
      dateType: payload,
      formState:{
        ...state.formState,
        rankingDate: convertDateFormat(
          (() => {
            switch (payload) {
              case DATE_TYPE.DAY:
                return new Date();
              case DATE_TYPE.WEEK:
                return convertMonday();
              default:
                return new Date();
            }
          })(),
          "YYYY-MM-DD"
        ),
        page: 1,
      }
    };
  },
  "clipRank/SET_FORM_CHANGE_DATE": (state, {payload}) => {
    return {
      ...state,
      formState: {
        ...state.formState,
        rankingDate: payload,
        page: 1,
      }
    };
  },
});


export default clipRank;

