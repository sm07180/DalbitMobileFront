import React, { useReducer, createContext, useState } from "react";
import { BrotliDecompress } from "zlib";
import { VirtualMethods } from "swiper/types/components/virtual";

// constant
import { tabType } from "pages/clip_player/constant";

type BundleType = {
  clipState: StateType;
  clipAction: ActionType;
};

type StateType = {
  tab: number;
  clipInfo: clipInfoType | null;
  isMyClip: boolean;
  isPaused: boolean;
  rightTabType: tabType;
  clipMainSort: number;
  clipMainDate: number;
  clipMainRefresh: boolean;
  clipReplyIdx: number;
  lottieUrl: string;
  lottie: clipAnimationType | null;
  userMemNo: string;
};

type clipInfoType = {
  clipNo: string;
  clipMemNo: string;
  subjectType: string;
  title: string;
  bgImg: Array<any>;
  fileName: string;
  file: Array<any>;
  filePlay: string;
  codeLink: string;
  nickName: string;
  isGood: boolean;
  playCnt: number;
  goodCnt: number;
  byeolCnt: number;
  itemCode: string;
  itemCnt: number;
};

type clipAnimationType = {
  status: boolean;
  width?: number;
  height?: number;
  lottieUrl?: string;
  duration?: number;
  location?: string;
  isCombo?: boolean;
  count?: number;
  nickName?: string;
  profImg?: any;
  webpUrl?: string;
};

type ActionType = {
  setTab?(prop: number): void;
  dispatchClipInfo?(action: { type: string; data: any }): void;
  setIsMyClip?(prop: boolean): void;
  setRightTabType?(prop: tabType): void;
  setClipMainSort?(prop: number): void;
  setClipMainDate?(prop: number): void;
  setClipMainRefresh?(prop: boolean): void;
  setIsPaused?(prop: boolean): void;
  setClipReplyIdx?(prop: number): void;
  setlottieUrl?(prop: string): void;
  setLottie?(prop: object): void;
  setUserMemNo?(data: string): void;
};

const initialData = {
  clipState: {
    tab: 0,
    clipInfo: null,
    isPaused: true,
    isMyClip: false,
    rightTabType: tabType.PROFILE,
    giftState: {
      itemNo: "",
      cnt: 1,
    },
    clipMainSort: 6,
    clipMainDate: 0,
    clipMainRefresh: false,
    clipReplyIdx: 0,
    lottieUrl: "",
    lottie: null,
    userMemNo: "",
  },
  clipAction: {},
};

const clipInfoReducer = (state: any, action: { type: string; data: any }) => {
  const { type, data } = action;
  switch (type) {
    case "add":
      return { ...state, ...data };
    case "empty":
      return null;
    default:
      throw new Error("type is none");
  }
};

const ClipContext = createContext<BundleType>(initialData);

function ClipProvider(props: { children: JSX.Element }) {
  const [tab, setTab] = useState<number>(0);
  const [clipInfo, dispatchClipInfo] = useReducer(clipInfoReducer, initialData.clipState.clipInfo);
  const [isMyClip, setIsMyClip] = useState<boolean>(false);
  const [rightTabType, setRightTabType] = useState<tabType>(initialData.clipState.rightTabType);
  const [clipMainSort, setClipMainSort] = useState<number>(6);
  const [clipMainDate, setClipMainDate] = useState<number>(0);
  const [clipMainRefresh, setClipMainRefresh] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [clipReplyIdx, setClipReplyIdx] = useState<number>(0);
  const [lottieUrl, setlottieUrl] = useState<string>("");
  const [lottie, setLottie] = useState<any>(null);
  const [userMemNo, setUserMemNo] = useState(initialData.clipState.userMemNo);

  const clipState: StateType = {
    tab,
    clipInfo,
    isMyClip,
    isPaused,
    rightTabType,
    clipMainSort,
    clipMainDate,
    clipMainRefresh,
    clipReplyIdx,
    lottieUrl,
    lottie,
    userMemNo,
  };

  const clipAction: ActionType = {
    setTab,
    dispatchClipInfo,
    setIsMyClip,
    setIsPaused,
    setRightTabType,
    setClipMainSort,
    setClipMainDate,
    setClipMainRefresh,
    setClipReplyIdx,
    setlottieUrl,
    setLottie,
    setUserMemNo,
  };

  const bundle = {
    clipState,
    clipAction,
  };

  return <ClipContext.Provider value={bundle}>{props.children}</ClipContext.Provider>;
}

export { ClipContext, ClipProvider };
