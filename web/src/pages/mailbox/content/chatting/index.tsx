/**
 * @brief : mailbox/chatting/index.tsx
 * @role : 우체통채팅 ui 및 기능 index role
 */
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
//api & libs
import { mailChatExit, mailChatSend, mailChatPrevChatting } from "common/api";
import { mailBoxJoin } from "common/mailbox/mail_func";
import { usePrevious } from "lib/hooks";
// context
import { GlobalContext } from "context";
import { MailboxContext } from "context/mailbox_ctx";
//component
import Header from "components/ui/header/Header";
import ChatInput from "./components/chat_input";
import GiftPop from "./components/gift_pop";
import ReportPop from "./components/report_pop";
import ChatListComponent from "./components/chat_list_render";
import AnimationViewer from "./components/animation_viewer";
import ImgSlidePopup from "./components/img_pop";

import '../../mailbox.scss';

// global var
let lastPrevIdx: string | number = "0";
let translateFlag: string | number = "";
let prevObj: any = {};
let storeHeight: number = 0;

// check Interval
const initInterval = (callback: () => boolean) => {
  const intervalTime = 100;
  const id = setInterval(() => {
    const result = callback();
    if (result === true) {
      clearInterval(id);
    }
  }, intervalTime);
};

export default function chatting() {
  const { mailNo } = useParams<{ mailNo: string }>();
  const history = useHistory();
  // ctx
  const { globalState, globalAction } = useContext(GlobalContext);
  const { baseData, mailChatInfo, mailBlockUser } = globalState;
  const { mailboxAction, mailboxState } = useContext(MailboxContext);
  // ref
  const mailMsgListWrapRef = useRef<HTMLDivElement>(null);
  const msgWrapRef = useRef<any>(null);
  const PrevRef = useRef<any>(null);
  const prevPushChatInfo = usePrevious(mailboxState.pushChatInfo);
  // state
  const [more, setMore] = useState<boolean>(false); // more btn state
  const [chatText, setChatText] = useState<string>(""); // chatting txt
  const [msgGroup, setMsgGroup] = useState<any>(null); // msg grouping
  const [giftPop, setGiftPop] = useState<boolean>(false); // gift pop state
  const [prevList, setPrevList] = useState<any>(null); // api call list length check
  const [reportPop, setReportPop] = useState<boolean>(false); // reopr pop state
  const [pageType, setPageType] = useState<number>(1); // concat page
  const [targetIsMailboxOn, setTargetIsMailboxOn] = useState(true);
  // scroll state
  const [scrollHeight, setScrollHeight] = useState<any>(""); // realtime height
  const [scrollPositionIsBottom, setScrollPositionIsBottom] = useState<boolean>(true); // scroll position check
  //API Call ----------------------------------------------------------
  async function mailChatExitFetch() {
    const { result, message } = await mailChatExit({ chatNo: mailNo });
    if (result === "success") {
      history.goBack();
      if (globalAction.callSetToastStatus) {
        globalAction.callSetToastStatus({
          status: true,
          message: message,
        });
      }
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          history.push(`/`);
        },
      });
    }
  }
  async function mailChatPrevChattingFetch(next?: string) {
    const { result, message, data } = await mailChatPrevChatting({
      chatNo: mailNo,
      nowIdx: lastPrevIdx,
      page: 1,
      records: 100,
    });
    if (result === "success") {
      mailboxAction.setIsMailboxNew && mailboxAction.setIsMailboxNew(data.isNew);
      setTargetIsMailboxOn(data.targetIsMailboxOn);
      if (data.list.length > 0) {
        if (next === "next") {
          setPrevList(data.list);
          msgGroupBind(data.list.reverse(), "scroll");
          lastPrevIdx = data.list[data.list.length - 1].msgIdx;
          stayScrollDown();
        } else {
          setPrevList(data.list);
          msgGroupBind(data.list, "init");
          lastPrevIdx = data.list[0].msgIdx;
          forceScrollDown();
        }
      } else {
        if (lastPrevIdx !== 0) setPrevList([]);
      }
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
        callback: () => {
          history.push(`/`);
        },
      });
    }
  }
  // 메세지 전송 선물
  async function mailChatSendFetch(chatType, addData1?, addData2?, addData3?) {
    const { result, message } = await mailChatSend({
      chatNo: mailNo,
      chatType: chatType,
      addData1: addData1,
      addData2: addData2,
      addData3: addData3,
    });
    if (result === "success") {
    } else {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: message,
      });
    }
  }
  // function-----------------------------------------------------------------------------------
  //강제 스크롤 바닥
  const forceScrollDown = useCallback(() => {
    if (PrevRef.current !== null) {
      PrevRef.current.scrollTo(0, PrevRef.current.scrollHeight - PrevRef.current.clientHeight);
    }
  }, []);
  //강제 스크롤 유지
  const stayScrollDown = useCallback(() => {
    if (PrevRef.current !== null) {
      PrevRef.current.scrollTo(0, msgWrapRef.current.offsetHeight - storeHeight);
    }
  }, []);
  // 대화 퇴장
  const exitMail = () => {
    globalAction.setAlertStatus!({
      status: true,
      type: "confirm",
      content: `퇴장할 경우 대화 내용이 삭제됩니다. 정말 퇴장하시겠습니까?`,
      callback: () => mailChatExitFetch(),
    });
  };
  // 더보기 버튼 신고/차단
  const moreBtnDetail = (type: number) => {
    setMore(false);
    setReportPop(true);
    setPageType(type);
  };
  // API list date obj group binding
  const msgGroupBind = (data: any, type: string) => {
    data.forEach((prevItem) => {
      const key = prevItem.sendDt.substring(0, 8);
      if (prevObj[key]) {
        if (type === "scroll") {
          prevObj[key].unshift(prevItem);
        } else if (type === "init") {
          prevObj[key].push(prevItem);
        }
      } else {
        prevObj[key] = [prevItem];
      }
    }); //일
    let msg = {};
    Object.keys(prevObj).forEach((itemIdx) => {
      msg[itemIdx] = [];
    });
    Object.keys(msg).forEach((itemIdx) => {
      if (prevObj) {
        prevObj[itemIdx].forEach((item) => {
          let key = item.sendDt && item.sendDt.substring(8, 12);
          if (key !== null && key !== undefined && key.indexOf(0) === 0) key = key.slice(1, 4);
          if (msg[itemIdx][key]) {
            msg[itemIdx][key].push(item);
          } else {
            msg[itemIdx][key] = [item];
          }
        });
      } //시.분
      msg[itemIdx] = msg[itemIdx].filter(Array);
    });
    setMsgGroup(msg);
  };
  // Send Message
  const sendMessage = useCallback(
    (chatText: string, chatType: number) => {
      if (mailChatInfo !== null) {
        mailChatInfo.sendSocketMessageMail(mailNo, "mailBoxChat", chatType, 3, chatText, (result: boolean) => {
          if (result === false) {
            globalAction.setAlertStatus!({
              status: true,
              type: "alert",
              content: "채팅방 접속이 원할하지 않습니다.",
              callback: () => {
                history.goBack();
              },
            });
          } else {
            // Clear Init
            setTimeout(() => {
              forceScrollDown();
            });
            setChatText("");
          }
        });
      }
    },
    [mailChatInfo, chatText]
  );
  // Send gift
  const sendGift = useCallback(
    (chatText: string, chatType: number, addDataObj: any) => {
      const { addData1, addData2, addData3 } = addDataObj;
      mailChatSendFetch(chatType, addData1, addData2, addData3);
    },
    [mailChatInfo, chatText]
  );
  // 실시간 채팅 상호작용 알림
  const pushChatCheckScroll = useCallback(() => {
    if (mailboxState.pushChatInfo !== null && prevPushChatInfo !== mailboxState.pushChatInfo) {
      if (mailboxState.pushChatInfo.memNo !== globalState.baseData.memNo) {
        if (PrevRef.current !== null && msgWrapRef.current !== null) {
          if (PrevRef.current.offsetHeight + PrevRef.current.scrollTop === msgWrapRef.current.offsetHeight) {
            setTimeout(() => {
              forceScrollDown();
            });
            setScrollPositionIsBottom(true);
          } else {
            setScrollPositionIsBottom(false);
          }
        }
      }
    }
  }, [mailboxState.pushChatInfo]);
  // Chat Socket에서 온 정보를 토대로 MsgGroup 마지막에 추가시키는 함수
  const pushChatProceeeding = useCallback(() => {
    if (mailboxState.pushChatInfo !== null && prevPushChatInfo !== mailboxState.pushChatInfo) {
      const { sendDt, isRead } = mailboxState.pushChatInfo;
      if (!sendDt) {
        return false;
      }
      if (isRead === false) {
        mailboxAction.setUserCount!(null);
      } else if (isRead === true) {
        mailboxAction.setUserCount!(true);
      }
      const key = sendDt.substring(0, 8);
      const keyByTime = sendDt.substring(8, 12);
      // 같은 년월일 모두 같을 경우
      if (msgGroup && msgGroup[key]) {
        // 마지막이 항상 가장 최근 데이터이기 때문에 마지막의 첫번째 검색
        const lastDt = msgGroup[key][msgGroup[key].length - 1][0].sendDt;
        const lastKey = lastDt.substring(8, 12);
        // 시, 분 까지 같을 경우
        if (lastKey === keyByTime) {
          msgGroup[key][msgGroup[key].length - 1].push(mailboxState.pushChatInfo);
          setMsgGroup({
            ...msgGroup,
          });
        }
        // 시, 분은 다를 경우
        else {
          msgGroup[key].push([mailboxState.pushChatInfo]);
          setMsgGroup({
            ...msgGroup,
          });
        }
        prevObj[key].push(mailboxState.pushChatInfo);
      }
      // 다른 년월일 중 하나라도 다를 경우
      else {
        if (!prevObj[key]) prevObj[key] = [];
        prevObj[key].push([mailboxState.pushChatInfo]);
        setMsgGroup({
          ...msgGroup,
          [key]: [[mailboxState.pushChatInfo]],
        });
      }
    } else {
      return;
    }
    if (
      mailboxState.pushChatInfo &&
      (mailboxState.pushChatInfo.chatType === 2 || mailboxState.pushChatInfo.chatType === 3) &&
      mailboxState.pushChatInfo.memNo === baseData.memNo
    ) {
      setTimeout(() => {
        forceScrollDown();
      });
    }
  }, [mailboxState.pushChatInfo, msgGroup]);

  const createGuideMsg = () => {
    if (prevList === null || prevList.length > 0 || (msgGroup && Object.keys(msgGroup).length)) return <></>;
    return (
      <p className="guideMsg">
        상대방에게 욕설, 비방, 성희롱 등의 내용이 포함된 메시지를
        <br />
        보낼 경우 경고 및 정지 등의 제재가 가해질 수 있습니다.
        <br />
        <br />
      </p>
    );
  };

  // 최초 조회 및 대화방나가기
  useEffect(() => {
    // prohibit window zoom event
    function stopKeyZoom(event) {
      if (event.ctrlKey && [48, 61, 96, 107, 109, 187, 189].indexOf(event.keyCode) > -1) {
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", stopKeyZoom);
    return () => {
      //initialize var
      lastPrevIdx = "0";
      translateFlag = "";
      prevObj = {};
      storeHeight = 0;
      document.removeEventListener("keydown", stopKeyZoom);
      if (mailChatInfo !== null) {
        if (mailChatInfo.chatUserInfo["roomNo"] !== null) {
          mailChatInfo.destroy({ isdestroySocket: false, destroyChannelName: mailChatInfo.chatUserInfo["roomNo"] });
          mailboxAction.setPushChatInfo!(null);
          mailboxAction.setUserCount!(null);
          mailboxAction.setGiftItemInfo!(null);
        }
      }
    };
  }, []);
  // 채팅조회 => url이 바뀌거나 챗인포 변경시 첫 조회
  useEffect(() => {
    if (mailboxState.mailboxInfo?.memNo !== "") {
      mailChatPrevChattingFetch();
    }
  }, [mailboxState.mailboxInfo]);
  // 챗소켓 연결
  useEffect(() => {
    if (mailChatInfo !== null) {
      mailChatInfo.setRoomNo(mailNo);
      mailChatInfo.setMailMsgListWrapRef(mailMsgListWrapRef);
      mailChatInfo.setGlobalAction(globalAction);
      mailChatInfo.setBroadcastAction(mailboxAction);
      mailChatInfo.setDefaultData({ history });
      if (mailChatInfo.privateChannelHandle === null) {
        initInterval(() => {
          if (
            mailChatInfo.socket != null &&
            mailChatInfo.socket.getState() === "open" &&
            mailChatInfo.chatUserInfo.roomNo !== null
          ) {
            mailChatInfo.binding(mailChatInfo.chatUserInfo.roomNo, (roomNo: string) => {});
            return true;
          }
          return false;
        });
      }
    }
  }, []);
  // 챗 스크롤 => 초기 스크롤 이벤트 설정
  useEffect(() => {
    const scrollToTopEvent = (event) => {
      setTimeout(() => {
        let scroll = PrevRef && PrevRef.current.scrollTop;
        translateFlag = scroll;
        setScrollHeight(scroll);
      }, 100);
      if (PrevRef.current.offsetHeight + PrevRef.current.scrollTop === msgWrapRef.current.offsetHeight) {
        setScrollPositionIsBottom(true);
      }
    };
    PrevRef.current.addEventListener("scroll", scrollToTopEvent);
    return () => {
      if (PrevRef.current) {
        PrevRef.current.removeEventListener("scroll", scrollToTopEvent);
      }
    };
  }, []);
  // 챗 스크롤 => 헤이트 체크
  useEffect(() => {
    if (translateFlag === 0) {
      if (prevList.length > 0) {
        if (msgWrapRef.current !== null) {
          storeHeight = msgWrapRef.current.offsetHeight;
        }
        mailChatPrevChattingFetch("next");
      }
    }
  }, [scrollHeight]);
  // Chat Socket에서 Push 가 왔을경우 chat list push
  useEffect(() => {
    if (mailboxState.pushChatInfo !== null) {
      pushChatProceeeding();
      pushChatCheckScroll();
    }
  }, [mailboxState.pushChatInfo, msgGroup]);
  // Read Msg Change
  useEffect(() => {
    if (mailboxState.userCount === true && msgGroup !== null && msgGroup !== undefined) {
      Object.keys(msgGroup).forEach((items, idx) => {
        let arr = msgGroup[items];
        arr.forEach((item) => {
          item.forEach((innerItem) => {
            if (globalState.baseData.memNo === innerItem.memNo) {
              innerItem.isRead = true;
            }
          });
        });
      });
    }
  }, [mailboxState.userCount, msgGroup, globalState.baseData.memNo]);
  // BLOCK EXIT
  useEffect(() => {
    if (mailBlockUser.blackMemNo === baseData.memNo) {
      globalAction.setAlertStatus!({
        status: true,
        type: "alert",
        content: "차단 되었습니다.",
        callback: () => {
          if (globalAction.setMailBlockUser) {
            globalAction.setMailBlockUser({
              memNo: "",
              blackMemNo: "",
            });
          }
          history.goBack();
        },
      });
    }
  }, [mailBlockUser]);
  useEffect(() => {
    const info = JSON.parse(sessionStorage.getItem("chattingInfo")!);
    const { memNo } = info;
    if (history.action === "POP" && history.location.pathname.includes("/chatting/")) {
      mailBoxJoin(memNo, mailboxAction, globalAction, history, mailboxState.mailboxInfo?.memNo);
    }
  }, [history.action]);
  // ---------------------------------------------------------------------------------------------
  return (
    <>
      <Header title={mailboxState.mailboxInfo?.title} type="back">
        <div className="buttonGroup">
          <button className="btnMore" onClick={() => setMore(!more)}>
            <img src="https://image.dalbitlive.com/mailbox/ico_more_vertical_g.svg" alt="더보기" />
          </button>
          <ul className={`moreList ${more ? "on" : ""}`}>
            {/* 1:신고하기 0:차단하기 */}
            <li onClick={() => moreBtnDetail(1)}>신고하기</li>
            <li onClick={() => moreBtnDetail(0)}>차단하기</li>
            <li onClick={exitMail}>나가기</li>
          </ul>
        </div>
      </Header>
      <div className="chatBoxPage">
        {/* list view */}
        <div className="chatPrevWrapper" ref={PrevRef}>
          {/* animationviewer */}
          {mailboxState.giftItemInfo !== null && <AnimationViewer />}
          <div className="chatViewBox" ref={msgWrapRef}>
            {createGuideMsg()}
            {/* Chat List Rendering */}
            <ChatListComponent msgGroup={msgGroup} />
            <div className="chat-inner-wrap" ref={mailMsgListWrapRef}></div>
          </div>
        </div>
        {/* input */}
        <ChatInput
          setChatText={setChatText}
          sendMessage={sendMessage}
          chatText={chatText}
          setGiftPop={setGiftPop}
          targetIsMailboxOn={targetIsMailboxOn}
        />
        {/* popUp */}
        <GiftPop setGiftPop={setGiftPop} giftPop={giftPop} sendGift={sendGift} />
        {mailboxState.imgSliderInfo.startImgIdx && <ImgSlidePopup startMemNo={mailboxState.imgSliderInfo.startMemNo} />}
        {reportPop && <ReportPop setReportPop={setReportPop} setPageType={setPageType} pageType={pageType} />}
        {/* addMesaageAlarm */}
        {scrollPositionIsBottom === false && (
          <div
            className="newMsg"
            onClick={() => {
              setScrollPositionIsBottom(true);
              forceScrollDown();
            }}
          >
            {mailboxState.pushChatInfo !== null && (
              <>
                <p className="newMsg__msg">{mailboxState.pushChatInfo.msg}</p>
                <button className="newMsg__btn" />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
