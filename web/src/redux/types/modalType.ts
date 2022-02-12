import {ActionType} from "typesafe-actions";
import * as actions from "../actions/modal";

export type ModalActions = ActionType<typeof actions>

export type ModalStateType = {
  payInfo: PayInfoType;
  mypageInfo: any;
  mypageYourMem: string;
  mypageChange: boolean;
  toggleWallet: number;
  broadcastOption: BroadcastOptionType;
  specialInfo: SpecialInfoType
};

export type PayInfoType = {
  itemName: string;
  itemPrice: string;
  itemNo: string;
  name?: string;
  bankNo?: string;
  phone?: string;
  payMethod?: string;
  orderId?: string;
  cardName?: string;
  cardPayNo?: string;
  itemCnt?: number;
  returntype?: string;
  pageCode?: string;
};
export type BroadcastOptionType = {
  title: string;
  welcome: string;
}
export type SpecialInfoType = {
  memNo: string;
  wasSpecial: boolean;
  specialDjCnt: number;
  badgeSpecial: number;
}


