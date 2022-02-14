/**
 * @brief : mailbox/index.tsx
 * @role : route 분기 및 초기렌더링에 필요한 작용
 */
import React, { Fragment, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
//context
import { MailboxContext } from "context/mailbox_ctx";
import { GlobalContext } from "context";
//api
import { getMailboxChatTargetList } from "common/api";
//scss
import "./mailbox.scss";
//component
import Layout from "common/layout";
import ChatList from "./content/chat_list";
import ChatNew from "./content/chat_new";
import Chatting from "./content/chatting";

export default function mailBoxContent() {
  const params = useParams();
  const history = useHistory();
  // gtx
  const { globalState, globalAction } = useContext(GlobalContext);
  const { mailboxAction, mailboxState } = useContext(MailboxContext);
  // param
  const category = params instanceof Object ? params["category"] : "";
  const mailNo = params instanceof Object ? params["mailNo"] : "";
  // makeview
  const createContent = () => {
    if (category === "chat_new") {
      return <ChatNew />;
    } else if (category === "chatting") {
      if (mailNo) {
        return <Chatting />;
      } else {
        history.push(`/mailbox`);
      }
    } else {
      return <ChatList />;
    }
  };
  // api Call

  async function feachMailboxChatTargetList() {
    const { result, data, message } = await getMailboxChatTargetList({
      slctType: mailboxState.tabState,
      page: 1,
      records: 100,
    });
    if (result === "success") {
      mailboxAction.setChatTargetData!(data);
    } else {
      //실패
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: message,
        });
    }
  }
  // checkLogin and first list call
  useEffect(() => {
    if (!globalState.baseData.isLogin) {
      history.push("/login");
    }
  }, [globalState.baseData.isLogin]);
  // chat_new locate
  useEffect(() => {
    if (category == "chat_new") {
      feachMailboxChatTargetList();
    }
  }, [mailboxState.tabState, category]);
  // ---------------------------------------------------------
  return (
    <Fragment>
        {/* view */}
        <div id="mailBoxPage">{createContent()}</div>
    </Fragment>
  );
}
