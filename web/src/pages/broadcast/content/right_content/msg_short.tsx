import React, {useContext, useReducer, useEffect, useRef, DispatchWithoutAction} from "react";
import { GlobalContext } from "context";

import { getBroadcastShortCut, broadcastShortCutModify } from "common/api";

import { DalbitScroll } from "common/ui/dalbit_scroll";

// constant
import { tabType } from "pages/broadcast/constant";

import MsgContent from "./msg_short_item";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxMsgShortCut} from "../../../../redux/actions/broadcastCtx";
type ActionType = {
  type: string;
  val: any;
  idx?: number;
};

const reducer = (state: Array<any>, action: ActionType) => {
  switch (action.type) {
    case "order":
      return state.map((v, i) => {
        if (i === action.idx) {
          v.order = action.val;
        }
        return v;
      });
    case "text":
      return state.map((v, i) => {
        if (i === action.idx) {
          v.text = action.val;
        }
        return v;
      });
    case "init":
      return [...action.val];
    default:
      return state;
  }
};

export default function MsgShort() {
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const { globalAction, globalState } = useContext(GlobalContext);

  const [state, dispatchWithoutAction] = useReducer(reducer, []);

  const modifyState = async (idx: number) => {
    if (state[idx] instanceof Object) {
      const param = {
        orderNo: state[idx].orderNo,
        order: state[idx].order,
        text: state[idx].text,
        isOn: true,
      };

      const res = await broadcastShortCutModify(param);

      if (res.result === "success") {
        if (res.data instanceof Array) {
          dispatch(setBroadcastCtxMsgShortCut(res.data));
        } else {
          dispatch(setBroadcastCtxMsgShortCut(res.data.list));
        }

        globalAction.callSetToastStatus &&
          globalAction.callSetToastStatus({
            status: true,
            message: res.message,
          });
      }
    }
  };

  useEffect(() => {
    async function getShortcut() {
      const res = await getBroadcastShortCut();
      if (res.result === "success") {
        if (res.data instanceof Array) {
          if (broadcastState.msgShortCut !== res.data) {
            dispatchWithoutAction({ type: "init", val: res.data });
          }
        } else {
          if (broadcastState.msgShortCut !== res.data.list) {
            dispatchWithoutAction({ type: "init", val: res.data.list });
          }
        }
      }
    }
    getShortcut();
  }, []);

  return (
    <>
      <h3 className="tabTitle">퀵 메시지 설정</h3>
      <div className="msgContents">
        <DalbitScroll>
          <>
            <p>명령어는 2글자, 내용은 최대 200글자까지 입력 가능</p>
            <p>내용은 최대 200글자까지 사용할 수 있습니다.</p>
            <div className="msgContentsWrap">
              {state.length > 0 &&
                state.map((item, idx) => {
                  return (
                    <div className="msgContents__wrap" key={idx}>
                      <MsgContent item={item} idx={idx} state={state} dispatch={dispatchWithoutAction} modifyState={modifyState} />
                    </div>
                  );
                })}
            </div>
          </>
        </DalbitScroll>
      </div>
    </>
  );
}
