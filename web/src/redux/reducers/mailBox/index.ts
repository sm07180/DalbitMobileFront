import {createReducer} from "typesafe-actions";
import {RankActions, RankStateType} from "../../types/rankType";
import {RANK_TYPE} from "../../../pages/rank/constant";
import {MailBoxActions, MailBoxStateType} from "../../types/mailBoxType";

const initialState: MailBoxStateType = {
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
};

const mailBox = createReducer<MailBoxStateType, MailBoxActions>(initialState, {
  "mailBox/SET_MAILBOX_GIFT_ITEM_INFO": (state, {payload}) => {
    return {...state, mailboxInfo:payload}
  },
  "mailBox/SET_MAILBOX_CHAT_TARGET_DATA": (state, {payload}) => {
    return {...state, chatTargetData:payload}
  },
  "mailBox/SET_MAILBOX_TAB_STATE": (state, {payload}) => {
    return {...state, tabState: payload}
  },
  "mailBox/SET_MAILBOX_INFO": (state, {payload}) => {
    return {...state, mailboxInfo:payload}
  },
  "mailBox/SET_MAILBOX_PUSH_CHAT_INFO": (state, {payload}) => {
    return {...state, pushChatInfo:payload}
  },
  "mailBox/SET_MAILBOX_USER_COUNT": (state, {payload}) => {
    return {...state, userCount:payload}
  },
  "mailBox/SET_MAILBOX_IS_MAIL_BOX_NEW": (state, {payload}) => {
    return {...state, isMailboxNew: payload}
  },
  "mailBox/SET_MAILBOX_OTHER_INFO": (state, {payload}) => {
    return {...state, otherInfo: payload}
  },
  "mailBox/SET_MAILBOX_USE_MAIL_BOX": (state, {payload}) => {
    return {...state, useMailbox: payload}
  },
  "mailBox/SET_MAILBOX_CHAT_LIST_INIT": (state, {payload}) => {
    return {...state, chatList:payload}
  },
  "mailBox/SET_MAILBOX_CHAT_LIST_UPDATE": (state, {payload}) => {
    const chatList = state.chatList;
    let prevItem = chatList.find((value) => value.memNo === payload.memNo);
    if (prevItem) {
      prevItem = {
        ...prevItem,
        ...payload,
        unReadCnt: prevItem.unReadCnt + 1,
      };
      const returnChatList = chatList
        .filter((obj) => obj.memNo !== payload.memNo)
        .concat(prevItem)
        .sort((obj, nextObj) => nextObj.sendTs - obj.sendTs);
      return {...state, chatList: returnChatList};
    } else {
      const receiveData = {
        ...payload,
        title: payload.nickNm,
        unReadCnt: 1,
      };
      const returnChatList = chatList
        .concat(receiveData)
        .sort((obj, nextObj) => nextObj.sendTs - obj.sendTs);
      return {...state, chatList: returnChatList};
    }
  },
  "mailBox/SET_MAILBOX_IMG_SLIDER_INIT": (state, {payload}) => {
    return {
      ...state,
      imgSliderInfo: {
        ...state.imgSliderInfo,
        startMemNo: payload.memNo,
        currentImgIdx: payload.idx,
        startImgIdx: payload.idx,
      }
    }
  },
  "mailBox/SET_MAILBOX_IMG_SLIDER_CHANGE_CURRENT": (state, {payload}) => {
    return {...state, imgSliderInfo:{...state.imgSliderInfo, currentImgIdx: payload}}
  },
  "mailBox/SET_MAILBOX_IMG_SLIDER_ADD_DELETE_IMG": (state, {payload}) => {
    return {...state, imgSliderInfo:{...state.imgSliderInfo, deletedImgArray: state.imgSliderInfo.deletedImgArray.concat(payload)}}
  },
  "mailBox/SET_MAILBOX_IMG_SLIDER_POPUP_CLOSE": (state) => {
    return {...state, imgSliderInfo:{...state.imgSliderInfo, currentImgIdx: 0, startImgIdx: 0,}}
  },
});


export default mailBox;

