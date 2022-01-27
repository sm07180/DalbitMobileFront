import React, { useContext, useEffect } from "react";
import { dateFormatterKorDay, makeHourMinute } from "lib/common_fn";

import { GlobalContext } from "context";
import { MailboxContext } from "context/mailbox_ctx";

function timeCheck(time: Date) {
  return time.getMinutes() + "분" + time.getSeconds() + "초" + time.getMilliseconds() + "밀리초";
}

function ChatList({ prevObj }) {
  const { globalState } = useContext(GlobalContext);
  const { baseData } = globalState;

  const { mailboxState } = useContext(MailboxContext);

  useEffect(() => {
    if (prevObj !== null) {
      console.log("Prev side Effect", timeCheck(new Date()));
    }
  }, [prevObj]);

  return (
    <>
      {prevObj !== null
        ? Object.keys(prevObj).map((chatItemDt, idx) => {
            const arr = prevObj[chatItemDt];
            console.log("Prev rendering Start", timeCheck(new Date()));
            return (
              <React.Fragment key={idx}>
                <div className="dayLine">{dateFormatterKorDay(chatItemDt)}</div>
                {arr instanceof Array &&
                  arr.map((msgGroup, idxInnerItem, self) => {
                    const { memNo, nickNm, msg, msgIdx } = msgGroup;
                    const myChat = memNo === baseData.memNo;
                    let { sendDt } = msgGroup;
                    sendDt = sendDt.substring(8, 12);
                    let msgClassName = "middle";

                    const prevMsgMemNo = self[idxInnerItem - 1]?.memNo;
                    const nextMsgMemNo = self[idxInnerItem + 1]?.memNo;
                    if (memNo !== prevMsgMemNo && memNo !== nextMsgMemNo) {
                      msgClassName = "firstLast";
                    } else if (memNo !== prevMsgMemNo && memNo === nextMsgMemNo) {
                      msgClassName = "first";
                    } else if (memNo === prevMsgMemNo && memNo !== nextMsgMemNo) {
                      msgClassName = "last";
                    } else {
                      msgClassName = "middle";
                    }

                    console.log(sendDt);

                    return (
                      <div className="msgBox" key={idxInnerItem}>
                        <div
                          className={`chatPreviousItem ${myChat ? "myChat" : ""} ${msgClassName}`}
                          key={`chatPrevIdx-${msgIdx}`}
                        >
                          <div className="thumb">
                            <img src={mailboxState.mailboxInfo?.targetProfImg.thumb80x80} />
                          </div>
                          <div className="textBox">
                            {myChat !== true && <p className="textBox__nick">{nickNm}</p>}
                            <p className="textBox__msg">
                              {msg} <span className="textBox__msg--time">{makeHourMinute(sendDt)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </React.Fragment>
            );
          })
        : ""}
    </>
  );
}

export default React.memo(ChatList, (prev, cur) => {
  return prev.prevObj === cur.prevObj;
});
