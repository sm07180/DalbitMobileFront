import React from "react";

//component
import NoResult from "common/ui/no_result";
import UserList from "./user_list";
import {CustomHeader} from "../chat_list";
import {useDispatch, useSelector} from "react-redux";
import {setMailBoxTabState} from "../../../../redux/actions/mailBox";

export default function chatNewPage() {
  const dispatch = useDispatch();
  const mailboxState = useSelector(({mailBoxCtx}) => mailBoxCtx);
  const { chatTargetData } = mailboxState;

  return (
    <>
      <Header title="새로운 메세지" type="back"/>
      <div className="chatNewPage subContent gray">
        <div className="tabBox">
          <button className={`${mailboxState.tabState === 1 ? "active" : ""}`} onClick={() => dispatch(setMailBoxTabState(1)) }>
            팬 <span>{mailboxState.chatTargetData?.fanTotalCnt}명</span>
          </button>
          <button className={`${mailboxState.tabState === 2 ? "active" : ""}`} onClick={() => dispatch(setMailBoxTabState(2))}>
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
