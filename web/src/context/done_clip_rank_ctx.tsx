import React, { useState, useReducer, createContext } from "react";

import { convertDateFormat } from "../lib/dalbit_moment";
import { convertMonday } from "../lib/rank_fn";
import { DATE_TYPE } from "pages/clip_rank/constant";

type ClipRankState = {
  clipRankList: Array<any>;
  winnerRankMsgProf: any;
  myInfo: any;
  formState: {
    dateType: number;
    rankingDate: string;
    page: number;
  };
};

type ClipRankAction = {
  setClipRankList?(data: any): void;
  setWinnerRankMsgProf?(data: any): void;
  setMyInfo?(data: any): void;
  formDispatch?(action: { type: string; val?: any }): void;
};

type BundleType = {
  clipRankState: ClipRankState;
  clipRankAction: ClipRankAction;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "DATE_TYPE":
      return {
        ...state,
        dateType: action.val,
        rankingDate: convertDateFormat(
          (() => {
            switch (action.val) {
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
      };
    case "CHANGE_DATE":
      return {
        ...state,
        rankingDate: action.val,
        page: 1,
      };
    default:
      return {
        ...state,
      };
  }
};

const formInitData = {
  dateType: DATE_TYPE.DAY,
  rankingDate: convertDateFormat(new Date(), "YYYY-MM-DD"),
  page: 1,
};

const InitData = {
  clipRankState: {
    clipRankList: [],
    winnerRankMsgProf: [],
    myInfo: [],
    formState: formInitData,
  },
  clipRankAction: {},
};

const ClipRankContext = createContext<BundleType>(InitData);
const { Provider } = ClipRankContext;

function ClipRankProvider(props) {
  const [clipRankList, setClipRankList] = useState([]);
  const [myInfo, setMyInfo] = useState({
    // isReward: false,
    // rewardRank: 0,
    myRank: 0,
    myUpDown: 0,
    myClipPoint: 0,
    myGiftPoint: 0,
    myGoodPoint: 0,
    // myReplyPoint: 0,
    myListenPoint: 0,
    // winnerMsg: "",
    subjectType: 0,
    subjectName: "",
    title: "",
    bgImg: {
      thumb150x150: "",
    },
    // rewardImage: {thumb120x120: "",},
    myClipNo: "",
    myGender: "",
    myProfImg: {
      thumb190x190: "",
    },
  });
  const [formState, formDispatch] = useReducer(reducer, formInitData);
  const [winnerRankMsgProf, setWinnerRankMsgProf] = useState([]);

  const clipRankState: ClipRankState = {
    clipRankList,
    winnerRankMsgProf,
    myInfo,
    formState,
  };

  const clipRankAction: ClipRankAction = {
    setClipRankList,
    setWinnerRankMsgProf,
    setMyInfo,
    formDispatch,
  };

  const bundle: BundleType = {
    clipRankState,
    clipRankAction,
  };

  return <Provider value={bundle}>{props.children}</Provider>;
}

export { ClipRankContext, ClipRankProvider };
