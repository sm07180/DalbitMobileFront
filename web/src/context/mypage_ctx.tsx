import React, { createContext, useState } from "react";

type BundleType = {
  MypageState: StateType;
  MypageAction: ActionType;
};

type StateType = {
  status: boolean;
  boardBtnIndex: number;
  boardfocusIndex: number;
  fanState: number;
  FanBoardList: Array<any>;
  tab: number;
  walletTab: number;
  clipTab: number;
  clipType: Array<clipType>;
  myRankTab: any;
  specialInfo: any;

  /* notice */
  noticeList: Array<any>;
  noticePage: number;
  clipDetailTotal: number;
};
type clipType = {
  cd: string;
  cdNm: string;
  value: string;
  sortNo: number;
  isUse: number;
};

type ActionType = {
  setStatus?(status: boolean): void;
  setFanboardList?(data: FanBoardList): void;
  setFanState?(prop: number): void;
  setBoardBtnIndex?(boardBtnIndex: number): void;
  setBoardfocusIndex?(boardfocusIndex: number): void;
  setTab?(prop: number): void;
  setWalletTab?(prop: number): void;
  setClipTab?(prop: number): void;
  setClipType?(data: Array<any>): void;
  setMyRankTab?(data: any): void;
  setSpecialInfo?(data: any): void;
  setNoticeList?(data: any): void;
  setNoticePage?(data: number): void;
  setClipDetailTotal?(data: number): void;
};
//obj
type FanBoardList = {};

const initialData = {
  MypageState: {
    status: false,
    boardBtnIndex: 0,
    fanState: 0,
    FanBoardList: [],
    boardfocusIndex: 0,
    tab: 0,
    walletTab: 0,
    clipTab: 0,
    clipType: [],
    myRankTab: {
      tabType: null,
      subTabType: null,
      rankTab: null,
    },
    specialInfo: {
      memNo: "",
      wasSpecial: false,
      specialDjCnt: 0,
      badgeSpecial: 0,
    },

    noticeList: [],
    noticePage: 1,
    clipDetailTotal: 0,
  },
  MypageAction: {
    // setFanState: function(prop: number) {},
  },
};

const MypageContext = createContext<BundleType>(initialData);

function MypageProvider(props: { children: JSX.Element }) {
  const [status, setStatus] = useState<boolean>(initialData.MypageState.status);
  const [boardBtnIndex, setBoardBtnIndex] = useState<number>(initialData.MypageState.boardBtnIndex);
  const [fanState, setFanState] = useState<number>(initialData.MypageState.fanState);
  const [FanBoardList, setFanboardList] = useState(initialData.MypageState.FanBoardList);
  const [boardfocusIndex, setBoardfocusIndex] = useState(initialData.MypageState.boardfocusIndex);
  const [tab, setTab] = useState<number>(0);
  const [walletTab, setWalletTab] = useState<number>(0);
  const [clipTab, setClipTab] = useState<number>(0);
  const [clipType, setClipType] = useState<Array<any>>(initialData.MypageState.clipType);
  const [myRankTab, setMyRankTab] = useState<any>(initialData.MypageState.myRankTab);
  const [specialInfo, setSpecialInfo] = useState<any>(initialData.MypageState.specialInfo);
  const [noticeList, setNoticeList] = useState<Array<any>>(initialData.MypageState.noticeList);
  const [noticePage, setNoticePage] = useState<number>(1);
  const [clipDetailTotal, setClipDetailTotal] = useState<number>(initialData.MypageState.clipDetailTotal);
  const MypageState: StateType = {
    status,
    boardBtnIndex,
    fanState,
    FanBoardList,
    boardfocusIndex,
    tab,
    walletTab,
    clipTab,
    clipType,
    myRankTab,
    specialInfo,
    noticeList,
    noticePage,
    clipDetailTotal,
  };
  const MypageAction: ActionType = {
    setStatus,
    setBoardBtnIndex,
    setFanboardList,
    setBoardfocusIndex,
    setTab,
    setFanState,
    setWalletTab,
    setClipTab,
    setClipType,
    setMyRankTab,
    setSpecialInfo,
    setNoticeList,
    setNoticePage,
    setClipDetailTotal,
  };

  const bundle: BundleType = {
    MypageState,
    MypageAction,
  };

  return <MypageContext.Provider value={bundle}>{props.children}</MypageContext.Provider>;
}

export { MypageContext, MypageProvider };
