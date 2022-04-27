import {ActionType} from "typesafe-actions"
import * as actions from "../actions/mailBox"

export type MailBoxActions = ActionType<typeof actions>

export type MailBoxStateType = {
  chatList: Array<any>;
  chatTargetData: ChatTargetType | null;
  tabState: number;
  mailboxInfo: MailBoxInfoType | null;
  pushChatInfo: PushChatInfoType | null;
  userCount: any;
  isMailboxNew: boolean;
  giftItemInfo: any;
  otherInfo: any;
  imgSliderInfo: any;
  useMailbox: boolean;
}
export type ChatTargetType = {
  fanTotalCnt: 0;
  starTotalCnt: 0;
  list: Array<any>;
};

export type MailBoxInfoType = {
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

export type PushChatInfoType = {
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
