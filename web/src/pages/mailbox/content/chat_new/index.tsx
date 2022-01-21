import React, { useState, useContext, useEffect } from "react";

import { MailboxContext } from "context/mailbox_ctx";

//component
import Header from "common/ui/header";
import NoResult from "common/ui/no_result";
import UserList from "./user_list";

export default function chatNewPage() {
  const { mailboxAction, mailboxState } = useContext(MailboxContext);
  const { chatTargetData } = mailboxState;

  return (
    <>
      <Header title="새로운 메세지" />
      <div className="chatNewPage subContent gray">
        <div className="tabBox">
          <button className={`${mailboxState.tabState === 1 ? "active" : ""}`} onClick={() => mailboxAction.setTabState!(1)}>
            팬 <span>{mailboxState.chatTargetData?.fanTotalCnt}명</span>
          </button>
          <button className={`${mailboxState.tabState === 2 ? "active" : ""}`} onClick={() => mailboxAction.setTabState!(2)}>
            스타 <span>{mailboxState.chatTargetData?.starTotalCnt}명</span>
          </button>
        </div>

        {chatTargetData?.list.length! > 0 ? (
          <UserList />
        ) : (
          <NoResult type="default" text={`등록 된 ${mailboxState.tabState === 1 ? "팬이" : "스타가"} 없습니다.`} />
        )}
      </div>
    </>
  );
}
