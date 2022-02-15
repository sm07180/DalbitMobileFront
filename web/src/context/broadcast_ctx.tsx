import React, { createContext, useReducer, useState } from "react";

// constant
import { tabType } from "pages/broadcast/constant";
import {userBroadcastSettingType} from "../common/realtime/chat_socket";

type StateType = {
  roomInfo: roomInfoType | null;
  rightTabType: tabType;
  chatAnimation: chatAnimationType | null;
  comboAnimation: ComboAnimationType | null;
  userMemNo: number;
  userNickNm: string;
  userCount: any;
  realTimeValue: realTimeType | null;
  listenerList: Array<any>;
  msgShortCut: Array<any>;
  useBoost: boolean;
  extendTime: boolean;
  extendTimeOnce: boolean;
  storyState: number;
  noticeState: number;
  likeState: number;
  boost: { [key: string]: boolean };
  chatFreeze: boolean;
  likeClicked: boolean;
  commonBadgeList: Array<any>;
  isFan: boolean;

  chatCount: number;

  flipIsLeft: boolean;
  isWide: boolean;

  videoEffect: {
    makeUp: string;
    filter: string;
  };
  miniGameInfo: {
    [key: string]: any;
  };
  miniGameResult: {
    [key: string]: any;
  };
  rouletteHistory: {
    currentPage: number;
    allData: Array<rouletteHistoryDataType>;
    renderingData: Array<rouletteHistoryDataType>;
    pagingSize: number;
    totalCnt: number;
  };
  ttsActorInfo: Array<any>;
  ttsActionInfo: ttsActionInfoType;
  isTTSPlaying: boolean;
  settingObj: userBroadcastSettingType | null;
  soundVolume: number;
};
type ActionType = {
  dispatchRoomInfo(action: { type: string; data: any }): void;
  setRightTabType(data: tabType): void;
  dispatchChatAnimation(action: { type: string; data?: any }): void;
  dispatchComboAnimation(action: { type: string; data?: any }): void;
  setUserMemNo(data: number): void;
  setUserNickNm(data: string): void;
  setUserCount(data: any): void;
  dispatchRealTimeValue(action: { type: string; data: any }): void;
  setListenerList(data: any): void;
  setMsgShortCut(data: any): void;
  setUseBoost(data: boolean): void;
  setExtendTime(data: boolean): void;
  setExtendTimeOnce(data: boolean): void;
  setStoryState(data: number): void;
  setNoticeState(data: number): void;
  setLikeState(data: number): void;
  setBoost(data: { boost: boolean }): void;
  setChatFreeze(data: boolean): void;
  setLikeClicked(data: boolean): void;
  setCommonBadgeList(data: any): void;
  setIsFan(data: boolean): void;
  setChatCount(data: number): void;
  setFlipIsLeft(data: boolean): void;
  setIsWide(data: boolean): void;
  setVideoEffect(data: { makeUp: string; filter: string }): void;
  setMiniGameInfo(data: { [key: string]: any }): void;
  setMiniGameResult(data: { [key: string]: any }): void;
  setRouletteHistory(data: {
    currentPage: number,
    allData: Array<rouletteHistoryDataType>,
    renderingData: Array<rouletteHistoryDataType>;
    pagingSize: number,
    totalCnt: number,
  }): void;
  setTtsActorInfo(data: any): void;
  setTtsActionInfo(data: ttsActionInfoType): void;
  setIsTTSPlaying(data: boolean): void;
  setSettingObj?(data: userBroadcastSettingType): void;
  setSoundVolume?(data: number): void;
};

type BundleType = {
  broadcastState: StateType;
  broadcastAction: ActionType;
};

const roomInfoReducer = (state: roomInfoType, action: { type: string; data?: any }) => {
  const { type, data } = action;

  switch (type) {
    case "broadcastSettingUpdate": {
      console.log('@@ broadcastSettingUpdate', data)
      return {
        ...state,
        ...action.data,
      };
    }
    case "boosterOn": {
      return {
        ...state,
        useBoost: true,
      };
    }
    case "boosterOff": {
      return {
        ...state,
        useBoost: false,
      };
    }
    case "grantRefresh": {
      if (state.currentMemNo === action.data.memNo) {
        return {
          ...state,
          auth: action.data.auth,
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case "freeze": {
      return {
        ...state,
        isFreeze: data,
      };
    }

    case "likes": {
      return {
        ...state,
        isLike: data,
      };
    }

    case "moonCheck": {
      return {
        ...state,
        moonCheck: {
          ...state.moonCheck,
          ...data,
        },
      };
    }

    case "micState": {
      return {
        ...state,
        isMic: data,
      };
    }

    case "videoState": {
      return {
        ...state,
        isVideo: data,
      };
    }

    case "newFanCnt": {
      return {
        ...state,
        newFanCnt: data,
      };
    }

    case "reset": {
      return { ...data };
    }
    case "refresh": {
      return { ...state };
    }
  }
};

const chatAnimationReducer = (state: any, action: { type: string; data: any }) => {
  const { type, data } = action;
  switch (type) {
    case "start": {
      return { ...state, status: true, ...data };
    }
    case "end": {
      return { status: false };
    }
    default: {
      throw new Error("Chat animation dipatch Error");
    }
  }
};

const comboAnimationReducer = (state: AudioNode, action: { type: string; data: any }) => {
  const { type, data } = action;
  switch (type) {
    case "start": {
      return { ...state, status: true, ...data };
    }
    case "end": {
      return {
        status: false,
      };
    }

    default: {
      throw new Error("not defined by ComboAnimation Reudcer");
    }
  }
};

const realTimeValueReducer = (state: any, action: { type: string; data: any }) => {
  const { type, data } = action;

  switch (type) {
    case "setLikeFanRank": {
      return { ...data };
    }
    default: {
      throw new Error("Not type in real time value setting.");
    }
  }
};

const initialData = {
  broadcastState: {
    roomInfo: null,
    rightTabType: tabType.LISTENER,
    chatAnimation: null,
    comboAnimation: null,
    userMemNo: 0,
    userNickNm: "",
    userCount: {
      current: 0,
      history: 0,
      newFanCnt: 0,
    },
    realTimeValue: null,
    giftState: {
      display: false,
      itemNo: "",
      cnt: 1,
    },
    listenerList: [],
    msgShortCut: [],
    useBoost: false,
    extendTime: false,
    extendTimeOnce: false,
    storyState: -1,
    noticeState: -1,
    likeState: -1,
    commonBadgeList: [],
    boost: {
      boost: true,
    },
    chatFreeze: false,
    likeClicked: true,
    isFan: false,

    chatCount: 0,

    flipIsLeft: true,
    isWide: true,
    videoEffect: {
      makeUp: "Original",
      filter: "Normal",
    },

    miniGameInfo: {},
    miniGameResult: {},
    rouletteHistory: {
      currentPage: 1,
      allData: [],
      renderingData: [],
      pagingSize: 50,
      totalCnt: 0,
    },
    ttsActorInfo: [],
    ttsActionInfo: {
      showAlarm: false,
      actorId: "",
      nickNm: "",
      ttsText: "",
      fileUrl: "",
      duration: 0,
      isPlaying: false,
    },
    isTTSPlaying: false,
    settingObj: null,
    soundVolume: 1  //tts, sound Item 볼륨조절 0 ~ 1
  },

  broadcastAction: {
    dispatchRoomInfo:()=>{},
    setRightTabType:()=>{},
    dispatchChatAnimation:()=>{},
    dispatchComboAnimation:()=>{},
    setUserMemNo:()=>{},
    setUserNickNm:()=>{},
    setUserCount:()=>{},
    dispatchRealTimeValue:()=>{},
    setListenerList:()=>{},
    setMsgShortCut:()=>{},
    setUseBoost:()=>{},
    setExtendTime:()=>{},
    setExtendTimeOnce:()=>{},
    setStoryState:()=>{},
    setNoticeState:()=>{},
    setLikeState:()=>{},
    setBoost:()=>{},
    setChatFreeze:()=>{},
    setLikeClicked:()=>{},
    setCommonBadgeList:()=>{},
    setIsFan:()=>{},
    setChatCount:()=>{},
    setFlipIsLeft:()=>{},
    setIsWide:()=>{},
    setVideoEffect:()=>{},
    setMiniGameInfo:()=>{},
    setMiniGameResult:()=>{},
    setRouletteHistory:()=>{},
    setTtsActorInfo:()=>{},
    setTtsActionInfo:()=>{},
    setIsTTSPlaying:()=>{},
  },
};

const BroadcastContext = createContext<BundleType>(initialData);

function BroadcastProvider(props: { children: JSX.Element }) {
  const [roomInfo, dispatchRoomInfo] = useReducer(roomInfoReducer, initialData.broadcastState.roomInfo);
  const [rightTabType, setRightTabType] = useState<tabType>(initialData.broadcastState.rightTabType);
  const [chatAnimation, dispatchChatAnimation] = useReducer(chatAnimationReducer, initialData.broadcastState.chatAnimation);
  const [comboAnimation, dispatchComboAnimation] = useReducer(comboAnimationReducer, initialData.broadcastState.comboAnimation);

  const [userMemNo, setUserMemNo] = useState(initialData.broadcastState.userMemNo);
  const [userNickNm, setUserNickNm] = useState(initialData.broadcastState.userNickNm);
  const [userCount, setUserCount] = useState(initialData.broadcastState.userCount);
  const [realTimeValue, dispatchRealTimeValue] = useReducer(realTimeValueReducer, initialData.broadcastState.realTimeValue);
  const [listenerList, setListenerList] = useState(initialData.broadcastState.listenerList);
  const [msgShortCut, setMsgShortCut] = useState(initialData.broadcastState.msgShortCut);
  const [useBoost, setUseBoost] = useState(initialData.broadcastState.useBoost);
  const [extendTime, setExtendTime] = useState(initialData.broadcastState.extendTime);
  const [extendTimeOnce, setExtendTimeOnce] = useState(initialData.broadcastState.extendTimeOnce);
  const [storyState, setStoryState] = useState(initialData.broadcastState.storyState);
  const [noticeState, setNoticeState] = useState(initialData.broadcastState.noticeState);
  const [likeState, setLikeState] = useState(initialData.broadcastState.likeState);
  const [commonBadgeList, setCommonBadgeList] = useState(initialData.broadcastState.commonBadgeList);
  const [boost, setBoost] = useState({ boost: false });
  const [chatFreeze, setChatFreeze] = useState<boolean>(initialData.broadcastState.chatFreeze);
  const [likeClicked, setLikeClicked] = useState<boolean>(initialData.broadcastState.likeClicked);

  const [isFan, setIsFan] = useState<boolean>(initialData.broadcastState.isFan);

  const [chatCount, setChatCount] = useState<number>(initialData.broadcastState.chatCount);

  const [flipIsLeft, setFlipIsLeft] = useState<boolean>(initialData.broadcastState.flipIsLeft);
  const [isWide, setIsWide] = useState<boolean>(initialData.broadcastState.isWide);

  const [videoEffect, setVideoEffect] = useState<{
    makeUp: string;
    filter: string;
  }>(initialData.broadcastState.videoEffect);
  const [miniGameInfo, setMiniGameInfo] = useState(initialData.broadcastState.miniGameInfo);
  const [miniGameResult, setMiniGameResult] = useState(initialData.broadcastState.miniGameResult);

  const [rouletteHistory, setRouletteHistory] = useState<{
    currentPage: number;
    allData: Array<rouletteHistoryDataType>
    renderingData: Array<rouletteHistoryDataType>
    pagingSize: number;
    totalCnt: number;
  }>(initialData.broadcastState.rouletteHistory);

  const [ttsActorInfo, setTtsActorInfo] = useState(initialData.broadcastState.ttsActorInfo);
  const [ttsActionInfo, setTtsActionInfo] = useState<ttsActionInfoType>(initialData.broadcastState.ttsActionInfo);
  const [isTTSPlaying, setIsTTSPlaying] = useState<boolean>(false);

  //방송 설정
  const [settingObj, setSettingObj] = useState<userBroadcastSettingType | null>(null);
  const [soundVolume, setSoundVolume] = useState<number>(initialData.broadcastState.soundVolume);
  const broadcastState: StateType = {
    roomInfo,
    rightTabType,
    chatAnimation,
    comboAnimation,
    userMemNo,
    userNickNm,
    userCount,
    realTimeValue,
    listenerList,
    msgShortCut,
    useBoost,
    extendTime,
    extendTimeOnce,
    storyState,
    noticeState,
    likeState,
    commonBadgeList,
    boost,
    chatFreeze,
    likeClicked,
    isFan,

    chatCount,

    flipIsLeft,
    isWide,

    videoEffect,
    miniGameInfo,
    miniGameResult,

    rouletteHistory,
    ttsActorInfo,
    ttsActionInfo,
    isTTSPlaying,
    settingObj,
    soundVolume
  };

  const broadcastAction: ActionType = {
    dispatchRoomInfo,
    setRightTabType,
    dispatchChatAnimation,
    dispatchComboAnimation,
    setUserMemNo,
    setUserNickNm,
    setUserCount,
    dispatchRealTimeValue,
    setListenerList,
    setMsgShortCut,
    setUseBoost,
    setExtendTime,
    setExtendTimeOnce,
    setStoryState,
    setNoticeState,
    setLikeState,
    setCommonBadgeList,
    setBoost,
    setChatFreeze,
    setLikeClicked,
    setIsFan,

    setChatCount,

    setFlipIsLeft,
    setIsWide,

    setVideoEffect,
    setMiniGameInfo,
    setMiniGameResult,

    setRouletteHistory,
    setTtsActorInfo,
    setTtsActionInfo,
    setIsTTSPlaying,
    setSettingObj,
    setSoundVolume
  };

  const bundle: BundleType = {
    broadcastState,
    broadcastAction,
  };

  return <BroadcastContext.Provider value={bundle}>{props.children}</BroadcastContext.Provider>;
}

export { BroadcastContext, BroadcastProvider };
