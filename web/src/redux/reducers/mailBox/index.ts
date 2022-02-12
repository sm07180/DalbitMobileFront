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
});


export default mailBox;

