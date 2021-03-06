import React, { useContext, useCallback, useEffect } from "react";
// static
import "./alert.scss";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxBackFunction,
  setGlobalCtxBackFunctionEnd,
  setGlobalCtxBackState
} from "../../redux/actions/globalCtx";
import {isAndroid} from "../../context/hybrid";

export default function Alert() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const confirmClick = () => {
    dispatch(setGlobalCtxAlertStatus({ status: false }));
    globalState.alertStatus.callback && globalState.alertStatus.callback();
  };
  const cancelClick = () => {
    dispatch(setGlobalCtxAlertStatus({ status: false }));
    globalState.alertStatus.cancelCallback && globalState.alertStatus.cancelCallback();
  };
  const closeAlert = () => {
    dispatch(setGlobalCtxAlertStatus({ status: false }));
  };

  const addStopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if(globalState.alertStatus.status) {
      document.body.style.overflow = "hidden";
      if(isAndroid()) {
        dispatch(setGlobalCtxBackState(true));
        dispatch(setGlobalCtxBackFunction({name: 'statusAlert'}));
      }
    }else {
      document.body.style.overflow = "";
      if(isAndroid()) {
        dispatch(setGlobalCtxBackFunctionEnd(''));
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [globalState.alertStatus.status]);

  function renderContent(type: string = "common") {
    const makeTitle = () => {
      return (
        <div
          className="title"
          style={{
            ...globalState.alertStatus!.titleStyle!,
          }}
        >
          {globalState.alertStatus!.title!}
        </div>
      );
    };
    const makeContent = () => {
      return (
        <p
          className="contentText"
          style={{
            ...globalState.alertStatus!.contentStyle!,
          }}
          dangerouslySetInnerHTML={{ __html: globalState.alertStatus!.content! }}
        ></p>
      );
    };
    const makeSubCont = () => {
      return (
        <span
          className="subCont"
          style={{
            ...globalState.alertStatus.subContStyle!,
          }}
          dangerouslySetInnerHTML={{ __html: globalState.alertStatus!.subCont! }}
        ></span>
      );
    };
    switch (type) {
      case "confirm": {
        return (
          <div id="alert" onClick={closeAlert}>
            <div className="wrapper">
              {globalState.alertStatus.closeType && globalState.alertStatus.closeType === true && (
                <button className="btnClose" onClick={closeAlert}>
                  ??????
                </button>
              )}
              <div className="wrapperBg" onClick={addStopPropagation}>
                {globalState.alertStatus.title! && makeTitle()}
                <div className="content">
                  {globalState.alertStatus.content && makeContent()}
                  {globalState.alertStatus.subCont && makeSubCont()}
                </div>
                <div className="btnWrap">
                  <button className="btn btn_cancel" onClick={cancelClick}>
                    {globalState.alertStatus.confirmCancelText ? globalState.alertStatus.confirmCancelText : "??????"}
                  </button>
                  <button className="btn btn_ok" onClick={confirmClick}>
                    {globalState.alertStatus.confirmText ? globalState.alertStatus.confirmText : "??????"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default: {
        return (
          <div id="alert">
            <div className="wrapper">
              {globalState.alertStatus.closeType && globalState.alertStatus.closeType === true && (
                <button className="btnClose" onClick={closeAlert}>
                  ??????
                </button>
              )}
              <div className="wrapperBg" onClick={addStopPropagation}>
                {globalState.alertStatus.title! && makeTitle()}
                <div className="content">
                  {globalState.alertStatus.content && makeContent()}
                  {globalState.alertStatus.subCont && makeSubCont()}
                </div>
                <div className="btnWrap">
                  <button className="btn" onClick={confirmClick}>
                    ??????
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  return <>{globalState.alertStatus.status && renderContent(globalState.alertStatus.type)}</>;
}
