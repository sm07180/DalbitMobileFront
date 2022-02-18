import React, {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
//util
import {debounceFn, getWindowBottom, makeHourMinute} from "lib/common_fn";
import Toggle from "common/toggle";

//Context
import {GlobalContext} from "context";
import {MailboxContext} from "context/mailbox_ctx";
import {mailBoxJoin} from "common/mailbox/mail_func";
//api
import {getMailboxChatList, PostMailboxChatUse} from "common/api";

//component
import Header from "components/ui/header/Header";

import '../../mailbox.scss';

let totalPage = 1;

export default function chatListPage() {
  const history = useHistory();
  const { globalAction, globalState } = useContext(GlobalContext);
  const { mailboxAction, mailboxState } = useContext(MailboxContext);
  const { chatList } = mailboxState;
  const { isMailboxOn } = globalState;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const makeMonthDay = (date) => {
    return `${date.slice(0, 2)}월 ${date.slice(2, 4)}일`;
  };

  const settingDateTime = (sendDt) => {
    const today = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    const isToday = sendDt.slice(0, 8) === today;
    let date;
    if (isToday) {
      date = makeHourMinute(sendDt.slice(8, 12));
    } else {
      date = makeMonthDay(sendDt.slice(4, 8));
    }
    return date;
  };

  const createList = () => {
    return chatList.map((item, idx) => {
      const { memNo, profImg, nickNm, msg, sendDt, unReadCnt } = item;
      const date = settingDateTime(sendDt);
      return (
        <li
          className="chatListItem"
          onClick={() => {
            mailBoxJoin(memNo, mailboxAction, globalAction, history);
          }}
          key={idx}
        >
          <div className="thumb">
            <img src={profImg.thumb120x120} />
          </div>
          <div className="info">
            <p className="info__nick">{nickNm}</p>
            <p className="info__message">{msg}</p>
          </div>

          <span className="time">{date}</span>
          {unReadCnt > 0 && <span className="count">{unReadCnt < 100 ? <>{unReadCnt}</> : "99+"}</span>}
        </li>
      );
    });
  };

  async function feachMailboxChatList() {
    const { result, data, message } = await getMailboxChatList({
      page: currentPage,
      records: 20,
    });
    if (result === "success") {
      const { list, paging, isMailboxOn } = data;
      globalAction.setIsMailboxOn!(isMailboxOn);
      mailboxAction.dispathChatList!({ type: "init", data: data.list });
      if (currentPage > 1) {
        mailboxAction.dispathChatList!({ type: "init", data: mailboxState.chatList.concat(list) });
      } else {
        mailboxAction.dispathChatList!({ type: "init", data: data.list });
      }

      if (paging) {
        totalPage = paging.totalPage;
      }
    } else {
      //실패
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: message,
        });
    }
  }

  const postMailboxUse = async () => {
    const { result, data, message } = await PostMailboxChatUse({
      isMailboxOn: !isMailboxOn,
    });
    if (result === "success") {
      globalAction.callSetToastStatus!({
        status: true,
        message: message,
      });
      globalAction.setIsMailboxOn!(!isMailboxOn);
    } else {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: true,
          content: message,
        });
    }
  };

  const handleNewMessageClick = () => {
    if (isMailboxOn) {
      history.push(`/mailbox/chat_new`);
    } else {
      globalAction.callSetToastStatus!({
        status: true,
        message: "메시지 기능을 사용하지 않는 상태이므로 새로운 메세지 기능을 사용할 수 없습니다.",
      });
    }
  };

  const scrollEvtHdr = () => {
    if (totalPage > currentPage && getWindowBottom()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const bounce = debounceFn(scrollEvtHdr, 50);

  useEffect(() => {
    if (globalState.baseData.isLogin) feachMailboxChatList();

    window.addEventListener("scroll", bounce);
    return () => {
      window.removeEventListener("scroll", bounce);
    };
  }, [currentPage]);

  return (
    <>
      <Header title="메시지" type={'back'}>
        <div className="buttonGroup">
          <button className="btnMassageAdd" onClick={handleNewMessageClick}>
            <img src="https://image.dalbitlive.com/mailbox/ico_user_b.svg" alt="추가"/>
          </button>
        </div>
      </Header>

      <div className="chatListPage">
        <div className="chatOnOffBox">
          <p>메시지 기능 사용 설정</p>
          <Toggle active={isMailboxOn} activeCallback={postMailboxUse} />
        </div>
        {chatList && chatList.length > 0 ? (
          <ul>{createList()}</ul>
        ) : (
          <div className="noResultBox">
            <button onClick={handleNewMessageClick}>
              <img src="https://image.dalbitlive.com/mailbox/ico_user_w.svg" alt="추가" /> 팬/스타 찾기
            </button>
            <p>
              나의 팬/스타에게
              <br />
              메시지를 보내세요!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
