import React, { createContext, useState, useReducer } from "react";

// constant
type StateType = {
  chatList: Array<any>;
  chatTargetData: chatTargetType | null;
  tabState: number;
  mailboxInfo: mailBoxInfoType | null;
  pushChatInfo: PushCahtInfoType | null;
  userCount: any;
  isMailboxNew: boolean;
  giftItemInfo: any;
  otherInfo: any;
  imgSliderInfo: any;
  useMailbox: boolean;
};

type PushCahtInfoType = {
  chatType: number;
  gender: string;
  imageInfo: {
    [key: string]: any;
  };
  itemInfo: {
    [key: string]: any;
  };
  memNo: string;
  msg: string;
  msgIdx: string;
  nickNm: string;
  os: number;
  profImg: {
    [key: string]: any;
  };
  readYn: number;
  sendDt: string;
  sendTs: number;
  isRead: boolean;
};

type ActionType = {
  dispathChatList?(data: any): void;
  setChatTargetData?(data: any): void;
  setTabState?(data: number): void;
  setMailboxInfo?(data: mailBoxInfoType): void;
  setPushChatInfo?(data: PushCahtInfoType | null): void;
  setUserCount?(data: any): void;
  setIsMailboxNew?(data: boolean): void;
  setGiftItemInfo?(data: any): void;
  setOtherInfo?(data: any): void;
  dispathImgSliderInfo?(data: any): void;
  setUseMailbox?(data: boolean): void;
};

type BundleType = {
  mailboxState: StateType;
  mailboxAction: ActionType;
};

const initialData = {
  mailboxState: {
    chatList: [],
    giftItemInfo: null,
    chatTargetData: null,
    tabState: 1,
    userCount: null,
    otherInfo: {},
    mailboxInfo: {
      memNo: "",
      title: "",
      chatNo: "",
      lastMsgIdx: "",
      isNewChat: true,
      targetMemNo: "",
      targetNickNm: "",
      targetGender: "",
      targetProfImg: [],
      readCnt: 0,
    },

    pushChatInfo: null,
    isMailboxNew: false,
    imgSliderInfo: {
      startMemNo: "",
      startImgIdx: 0,
      currentImgIdx: 0,
      deletedImgArray: [],
    },
    useMailbox: false,
  },

  mailboxAction: {},
};

type mailBoxInfoType = {
  memNo: string;
  title: string;
  chatNo: string;
  lastMsgIdx: string;
  isNewChat: boolean;
  targetMemNo: string;
  targetNickNm: string;
  targetGender: string;
  targetProfImg: any;
  readCnt: number;
};

type chatTargetType = {
  fanTotalCnt: 0;
  starTotalCnt: 0;
  list: Array<any>;
};

const chatListReducer = (state: any, action: { type: string; data?: any }) => {
  const { type, data } = action;
  switch (type) {
    case "init":
      return data;
    case "update":
      if (state) {
        let prevItem = state.find((value) => value.memNo === data.memNo);
        if (prevItem) {
          prevItem = {
            ...prevItem,
            ...data,
            unReadCnt: prevItem.unReadCnt + 1,
          };
          state = state
            .filter((obj) => {
              return obj.memNo !== data.memNo;
            })
            .concat(prevItem);
          state = state.sort((obj, nextObj) => {
            return nextObj.sendTs - obj.sendTs;
          });
          return state;
        } else {
          let receiveData = {
            ...data,
            title: data.nickNm,
            unReadCnt: 1,
          };
          state = state.concat(receiveData).sort((obj, nextObj) => {
            return nextObj.sendTs - obj.sendTs;
          });
          return state;
        }
      }

    default:
      break;
  }
};

const imgSliderReducer = (state: any, action: { type: string; data?: any }) => {
  const { type, data } = action;
  switch (type) {
    case "init":
      return {
        ...state,
        startMemNo: data.memNo,
        currentImgIdx: data.idx,
        startImgIdx: data.idx,
      };
    case "changeCurrnet":
      return {
        ...state,
        currentImgIdx: data,
      };
    case "addDeletedImg":
      return {
        ...state,
        deletedImgArray: state.deletedImgArray.concat(data),
      };
    case "popupClose":
      return {
        ...state,
        currentImgIdx: 0,
        startImgIdx: 0,
      };
    default:
      break;
  }
};

const MailboxContext = createContext<BundleType>(initialData);
function MailboxProvider(props: { children: JSX.Element }) {
  const [chatList, dispathChatList] = useReducer(chatListReducer, initialData.mailboxState.chatList);
  const [giftItemInfo, setGiftItemInfo] = useState(initialData.mailboxState.giftItemInfo);
  const [chatTargetData, setChatTargetData] = useState(initialData.mailboxState.chatTargetData);
  const [tabState, setTabState] = useState(initialData.mailboxState.tabState);
  const [mailboxInfo, setMailboxInfo] = useState(initialData.mailboxState.mailboxInfo);
  const [pushChatInfo, setPushChatInfo] = useState<PushCahtInfoType | null>(initialData.mailboxState.pushChatInfo);
  const [userCount, setUserCount] = useState(initialData.mailboxState.userCount);
  const [isMailboxNew, setIsMailboxNew] = useState(initialData.mailboxState.isMailboxNew);
  const [otherInfo, setOtherInfo] = useState(initialData.mailboxState.otherInfo);
  const [imgSliderInfo, dispathImgSliderInfo] = useReducer(imgSliderReducer, initialData.mailboxState.imgSliderInfo);
  const [useMailbox, setUseMailbox] = useState(initialData.mailboxState.useMailbox);
  const mailboxState: StateType = {
    chatList,
    chatTargetData,
    tabState,
    mailboxInfo,
    pushChatInfo,
    userCount,
    isMailboxNew,
    giftItemInfo,
    otherInfo,
    imgSliderInfo,
    useMailbox,
  };

  const mailboxAction: ActionType = {
    dispathChatList,
    setChatTargetData,
    setTabState,
    setMailboxInfo,
    setPushChatInfo,
    setUserCount,
    setIsMailboxNew,
    setGiftItemInfo,
    setOtherInfo,
    dispathImgSliderInfo,
    setUseMailbox,
  };

  const bundle: BundleType = {
    mailboxState,
    mailboxAction,
  };

  return <MailboxContext.Provider value={bundle}>{props.children}</MailboxContext.Provider>;
}

export { MailboxContext, MailboxProvider };
