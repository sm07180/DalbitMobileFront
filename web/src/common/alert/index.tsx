import React, { useContext, useCallback, useEffect } from "react";
// context
import { GlobalContext } from "context";
// static
import "./alert.scss";

export default function Alert() {
  const { globalState, globalAction } = useContext(GlobalContext);

  const confirmClick = () => {
    globalAction.setAlertStatus && globalAction.setAlertStatus({ status: false });
    globalState.alertStatus.callback && globalState.alertStatus.callback();
  };
  const cancelClick = () => {
    globalAction.setAlertStatus && globalAction.setAlertStatus({ status: false });
    globalState.alertStatus.cancelCallback && globalState.alertStatus.cancelCallback();
  };
  const closeAlert = () => {
    globalAction.setAlertStatus && globalAction.setAlertStatus({ status: false });
  };

  const addStopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  // useEffect(() => {
  //   /* popup떳을시 scroll 막는 코드 */
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, []);

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
            ...globalState.alertStatus.subcontStyle!,
          }}
          dangerouslySetInnerHTML={{ __html: globalState.alertStatus!.subcont! }}
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
                  닫기
                </button>
              )}
              <div className="wrapperBg" onClick={addStopPropagation}>
                {globalState.alertStatus.title! && makeTitle()}
                <div className="content">
                  {globalState.alertStatus.content && makeContent()}
                  {globalState.alertStatus.subcont && makeSubCont()}
                </div>
                <div className="btnWrap">
                  <button className="btn btn_cancel" onClick={cancelClick}>
                    {globalState.alertStatus.confirmCancelText ? globalState.alertStatus.confirmCancelText : "취소"}
                  </button>
                  <button className="btn btn_ok" onClick={confirmClick}>
                    {globalState.alertStatus.confirmText ? globalState.alertStatus.confirmText : "확인"}
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
                  닫기
                </button>
              )}
              <div className="wrapperBg" onClick={addStopPropagation}>
                {globalState.alertStatus.title! && makeTitle()}
                <div className="content">
                  {globalState.alertStatus.content && makeContent()}
                  {globalState.alertStatus.subcont && makeSubCont()}
                </div>
                <div className="btnWrap">
                  <button className="btn" onClick={confirmClick}>
                    확인
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
