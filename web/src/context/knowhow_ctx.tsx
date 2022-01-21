import React, { useState, createContext } from "react";

type KnowHowStateType = {
  list: Array<any>;
  tab: number;
  condition: number;
  order: number;
  mine: number;
  myCnt: number;
};

type KnowHowActionType = {
  setList?(props: Array<any>): void;
  setTab?(props: number): void;
  setCondition?(props: number): void;
  setOrder?(props: number): void;
  setMine?(props: number): void;
  setMyCnt?(props: number): void;
};

type BundleType = {
  KnowHowState: KnowHowStateType;
  KnowHowAction: KnowHowActionType;
};

const initData = {
  KnowHowState: {
    list: [],
    tab: 0,
    condition: 0,
    order: 0,
    mine: 0,
    myCnt: 0,
  },
  KnowHowAction: {},
};

const KnowHowContext = createContext<BundleType>(initData);
const { Provider } = KnowHowContext;
function KnowHowProvider(props) {
  const [list, setList] = useState<any>([]);
  const [tab, setTab] = useState(0);
  const [condition, setCondition] = useState(0);
  const [order, setOrder] = useState(0);
  const [mine, setMine] = useState(0);
  const [myCnt, setMyCnt] = useState(0);
  const KnowHowState: KnowHowStateType = {
    list,
    tab,
    condition,
    order,
    mine,
    myCnt,
  };

  const KnowHowAction: KnowHowActionType = {
    setList,
    setTab,
    setCondition,
    setOrder,
    setMine,
    setMyCnt,
  };

  const bundle = {
    KnowHowState,
    KnowHowAction,
  };

  return <Provider value={bundle}>{props.children}</Provider>;
}

export { KnowHowContext, KnowHowProvider };
