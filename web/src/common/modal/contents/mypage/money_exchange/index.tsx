import React, { useState, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { DalbitScroll } from "common/ui/dalbit_scroll";
import DoExchange from "./content/do_exchange";
import Guidance from "./content/guidance";
import Result from "./content/result";

import "./index.scss";

type StatusType = {
  status: number;
  test?: number;
  data?: any;
};

type ActionType = {
  type: string;
  value: number;
};

function exchangeReducer(state: StatusType, action: ActionType): StatusType {
  switch (action.type) {
    case "status":
      return {
        ...state,
        status: action.value,
      };
    case "result":
      return {
        ...state,
        status: 2,
        data: action.value,
      };
    default:
      throw new Error();
  }
}

export default function MoneyExchange() {
  const history = useHistory();
  const [exchangeState, exchangeDispatch] = useReducer(exchangeReducer, { status: 0 });

  return (
    <>
      <div className="exchange-modal">
        <button className="closeBtn" onClick={() => history.goBack()} />
        <DalbitScroll width={400} height={700}>
          <div className="exchangeWrap">
            {exchangeState.status === 0 && <DoExchange state={exchangeState} dispatch={exchangeDispatch} />}
            {exchangeState.status === 1 && <Guidance state={exchangeState} dispatch={exchangeDispatch} />}
            {exchangeState.status === 2 && <Result state={exchangeState} dispatch={exchangeDispatch} />}
          </div>
        </DalbitScroll>
      </div>
    </>
  );
}
