import React, { useReducer, createContext, useState } from "react";

type BundleType = {
  customerState: StateType;
  customerAction: ActionType;
};

type StateType = {
  tab: number;
  noticeType: number;
};

type ActionType = {
  setTab?(prop: number): void;
  setNoticeType?(prop: number): void;
};

const initialData = {
  customerState: {
    tab: 0,
    noticeType: 0,
  },
  customerAction: {},
};

const CustomerContext = createContext<BundleType>(initialData);

function CustomerProvider(props: { children: JSX.Element }) {
  const [tab, setTab] = useState<number>(0);
  const [noticeType, setNoticeType] = useState<number>(0);
  const customerState: StateType = {
    tab,
    noticeType,
  };

  const customerAction: ActionType = {
    setTab,
    setNoticeType,
  };

  const bundle = {
    customerState,
    customerAction,
  };

  return <CustomerContext.Provider value={bundle}>{props.children}</CustomerContext.Provider>;
}

export { CustomerContext, CustomerProvider };
