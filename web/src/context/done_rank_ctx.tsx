import React, { useState, useReducer, createContext } from "react";
import { RANK_TYPE } from "pages/rank/constant";

import { dateTimeConvert } from "lib/rank_fn";

type RankState = {
  rankList: Array<any>;
  rankData: {
    isRankData: boolean;
  };
  levelList: Array<any>;
  likeList: Array<any>;
  specialList: Array<any>;
  weeklyList: Array<any>;
  secondList: Array<any>;
  formState: {
    pageType: string;
    ranking: {
      rankType: number;
      dateType: number;
      currentDate: Date;
    };
    fame: {
      rankType: number;
      dateType: number;
      currentDate: Date;
    };
    page: number;
  };
  totalPage: number;
  myInfo: any;
  scrollY: number;
  specialPoint: any;
  specialPointList: Array<any>;
  rankTimeData: {
    prevDate: string;
    nextDate: string;
    rankRound: number;
    titleText: string;
    isRankData: boolean;
  };
};

type RankAction = {
  setRankList?(data: any): void;
  setRankData?(data: any): void;
  setLevelList?(data: any): void;
  setLikeList?(data: any): void;
  setSpecialList?(data: any): void;
  formDispatch?(action: { type: string; val?: any }): void;
  setTotalPage?(data: number): void;
  setMyInfo?(data: any): void;
  setScrollY?(data: number): void;
  setSpecialPoint?(data: any): void;
  setSpecialPointList?(data: any): void;
  setWeeklyList?(data: any): void;
  setSecondList?(data: any): void;
  setRankTimeData?(data: any): void;
};

type BundleType = {
  rankState: RankState;
  rankAction: RankAction;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "PAGE_TYPE":
      return {
        ...state,
        pageType: action.val,
        page: 1,
      };
    case "RANK_TYPE":
      return {
        ...state,
        [state.pageType]: {
          rankType: action.val,
          dateType: action.val === RANK_TYPE.DJ ? 5 : 1,
          currentDate: new Date(),
        },
        page: 1,
      };
    case "DATE_TYPE":
      return {
        ...state,
        [state.pageType]: {
          ...state[state.pageType],
          dateType: action.val.dateType,
          currentDate: action.val.date,
        },
        page: 1,
      };
    case "DATE":
      return {
        ...state,
        [state.pageType]: {
          ...state[state.pageType],
          currentDate: action.val,
        },
        page: 1,
      };
    case "PAGE":
      return {
        ...state,
        page: state.page + 1,
      };
    case "INIT":
      return {
        ...state,
        page: 1,
      };
    case "RESET":
      return {
        pageType: "ranking",
        ranking: {
          rankType: 1,
          dateType: 5,
          currentDate: new Date(),
        },
        fame: {
          rankType: 4,
          dateType: 1,
          currentDate: new Date(),
        },
        page: 1,
      };
    case "SEARCH":
      return {
        pageType: "ranking",
        ranking: {
          rankType: action.val.rankType,
          dateType: action.val.dateType,
          currentDate: action.val.currentDate,
        },
        fame: {
          rankType: 4,
          dateType: 1,
          currentDate: new Date(),
        },
        page: 1,
      };
    default:
      return {
        ...state,
      };
  }
};

const formInitData = {
  pageType: "ranking",
  ranking: {
    rankType: 1,
    dateType: 5,
    currentDate: new Date(),
  },
  fame: {
    rankType: 4,
    dateType: 1,
    currentDate: new Date(),
  },
  page: 1,
};

const InitData = {
  rankState: {
    rankList: [],
    rankData: {
      isRankData: false,
    },
    levelList: [],
    likeList: [],
    specialList: [],
    weeklyList: [],
    secondList: [],
    formState: formInitData,
    myInfo: {
      isReward: false,
      myGiftPoint: 0,
      myListenerPoint: 0,
      myRank: 0,
      myUpDown: "",
      myBroadPoint: 0,
      myLikePoint: 0,
      myPoint: 0,
      myListenPoint: 0,
      time: "",
    },
    totalPage: 1,
    scrollY: 0,
    specialPoint: {
      totalPoint: 0,
      nickNm: "",
    },
    specialPointList: [],
    rankTimeData: {
      prevDate: "",
      nextDate: "",
      rankRound: 0,
      titleText: "",
      isRankData: false,
    },
  },
  rankAction: {},
};

const RankContext = createContext<BundleType>(InitData);
const { Provider } = RankContext;

function RankProvider(props) {
  const [rankList, setRankList] = useState([]);
  const [rankData, setRankData] = useState({
    isRankData: false,
  });
  const [levelList, setLevelList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [specialList, setSpecialList] = useState([]);
  const [weeklyList, setWeeklyList] = useState([]);
  const [secondList, setSecondList] = useState([]);
  const [formState, formDispatch] = useReducer(reducer, formInitData);
  const [myInfo, setMyInfo] = useState({
    isReward: false,
    myGiftPoint: 0,
    myListenerPoint: 0,
    myRank: 0,
    myUpDown: "",
    myBroadPoint: 0,
    myLikePoint: 0,
    myPoint: 0,
    myListenPoint: 0,
    time: "",
  });
  const [totalPage, setTotalPage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [specialPoint, setSpecialPoint] = useState({
    totalPoint: 0,
    nickNm: "",
  });
  const [specialPointList, setSpecialPointList] = useState([]);
  const [rankTimeData, setRankTimeData] = useState({
    prevDate: "",
    nextDate: "",
    rankRound: 0,
    titleText: "",
    isRankData: false,
  });

  const rankState: RankState = {
    rankList,
    rankData,
    formState,
    levelList,
    likeList,
    specialList,
    weeklyList,
    secondList,
    myInfo,
    totalPage,
    scrollY,
    specialPoint,
    specialPointList,
    rankTimeData,
  };

  const rankAction: RankAction = {
    setRankList,
    setRankData,
    setLevelList,
    setLikeList,
    setSpecialList,
    setWeeklyList,
    setSecondList,
    formDispatch,
    setTotalPage,
    setMyInfo,
    setScrollY,
    setSpecialPoint,
    setSpecialPointList,
    setRankTimeData,
  };

  const bundle: BundleType = {
    rankState,
    rankAction,
  };

  return <Provider value={bundle}>{props.children}</Provider>;
}

export { RankContext, RankProvider };
