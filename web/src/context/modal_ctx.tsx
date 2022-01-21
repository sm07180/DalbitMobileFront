import React, { useReducer, createContext, useState } from "react";

type BundleType = {
  modalState: StateType;
  modalAction: ActionType;
};

type payInfoType = {
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

type StateType = {
  payInfo: payInfoType;
  mypageInfo: any;
  mypageYourMem: string;
  mypageChange: boolean;
  toggleWallet: number;
  broadcastOption: {
    title: string;
    welcome: string;
  };
  specialInfo: {
    memNo: string;
    wasSpecial: boolean;
    specialDjCnt: number;
    badgeSpecial: number;
  };
};

type ActionType = {
  setPayInfo?(props: any): void;
  setMypageInfo(prop: any): void;
  setMypageYourMem(prop: string): void;
  setMypageChange?(prop: boolean): void;
  setToggleWallet?(prop: number): void;
  setBroadcastOption?(prop: any): void;
  setSpecialInfo?(prop: any): void;
};
//obj
const initialData = {
  modalState: {
    payInfo: {
      itemName: "",
      itemPrice: "",
      itemNo: "",
      pageCode: "",
    },
    mypageInfo: {},
    mypageYourMem: "",
    mypageChange: false,
    toggleWallet: 0,
    broadcastOption: {
      title: "",
      welcome: "",
    },
    specialInfo: {
      memNo: "",
      wasSpecial: false,
      specialDjCnt: 0,
      badgeSpecial: 0,
    },
  },
  modalAction: {
    setPayInfo: function(props: any) {},
    setMypageInfo: function(prop: any) {},
    setMypageYourMem: function(prop: string) {},
    setToggleWallet: function(prop: number) {},
    setSpecialInfo: function(prop: any) {},
  },
};

const ModalContext = createContext<BundleType>(initialData);

function ModalProvider(props: { children: JSX.Element }) {
  const [payInfo, setPayInfo] = useState<payInfoType>(initialData.modalState.payInfo);
  const [mypageInfo, setMypageInfo] = useState<any>(initialData.modalState.mypageInfo);
  const [mypageYourMem, setMypageYourMem] = useState<string>("");
  const [mypageChange, setMypageChange] = useState<boolean>(false);
  const [toggleWallet, setToggleWallet] = useState<number>(0);
  const [broadcastOption, setBroadcastOption] = useState({
    title: "",
    welcome: "",
  });
  const [specialInfo, setSpecialInfo] = useState({
    memNo: "",
    specialDjCnt: 0,
    wasSpecial: false,
    badgeSpecial: 0,
  });
  const modalState: StateType = {
    payInfo,
    mypageInfo,
    mypageYourMem,
    mypageChange,
    toggleWallet,
    broadcastOption,
    specialInfo,
  };

  const modalAction: ActionType = {
    setPayInfo,
    setMypageInfo,
    setMypageYourMem,
    setMypageChange,
    setToggleWallet,
    setBroadcastOption,
    setSpecialInfo,
  };

  const bundle = {
    modalState,
    modalAction,
  };

  return <ModalContext.Provider value={bundle}>{props.children}</ModalContext.Provider>;
}

export { ModalContext, ModalProvider };
