// React
import React, {useContext, useEffect, useRef, useState} from "react";

// Context
import {GlobalContext} from "context";
import {BroadcastContext} from "context/broadcast_ctx";

import {MediaType} from "../constant";

// Component
import {DalbitScroll, ScrollObject} from "common/ui/dalbit_scroll";

// Module
// static
import scrollDownArrowIcon from "../static/scroll_down.svg";

const MsgListWrap = (props: {
  forceChatScrollDown: boolean;
  setForceChatScrollDown: any;
  roomInfo: any;
}) => {
  const { forceChatScrollDown, setForceChatScrollDown, roomInfo } = props;

  const { globalState } = useContext(GlobalContext);
  const { chatInfo, rtcInfo } = globalState;

  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { chatCount } = broadcastState;

  const [scrollUpStatus, setScrollUpStatus] = useState<boolean>(false);
  const [chatInnerWrapAbsolute, setChatInnerWrapAbsolute] = useState<boolean>(
    true
  );

  const scrollWrapRef = React.createRef<ScrollObject>();
  const msgListWrapRef = useRef<HTMLDivElement>(null);
  const chatInnerWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceChatScrollDown === true) {
      if (scrollWrapRef.current !== null && msgListWrapRef.current !== null) {
        scrollWrapRef.current.scrollToDown();

        setForceChatScrollDown(false);
      }
    }
  }, [forceChatScrollDown]);

  useEffect(() => {
    if (chatInfo !== null) {
      chatInfo.setMsgListWrapRef(msgListWrapRef);
    }
    if (rtcInfo !== null) {
      rtcInfo.setMsgListWrapRef(msgListWrapRef);
    }
  }, [chatInfo, rtcInfo]);

  useEffect(() => {
    const chatMsgWrap = scrollWrapRef.current?.elem;
    const chatInner = chatInnerWrapRef.current;
    if (chatMsgWrap && chatInner && chatInnerWrapAbsolute === true) {
      if (chatInner.clientHeight >= chatMsgWrap.clientHeight) {
        setChatInnerWrapAbsolute(false);
      }
    }
  }, [scrollWrapRef]);

  useEffect(() => {
    if (scrollWrapRef.current !== null) {
      scrollWrapRef.current.scrollToDown();
    }
  }, []);

  return (
    <>
      <DalbitScroll
        ref={scrollWrapRef}
        displayClassName="chat-msg-wrap"
        preventAutoHidden={false}
        dynamic={true}
        initBarBottom={true}
        fixedIntervalSec={20}
        barClassName="broadcast-scroll-bar"
        scrollUpCallback={() => setScrollUpStatus(true)}
        scrollBottomCallback={() => setScrollUpStatus(false)}
        lenCheck={chatCount}
        onHoverBarVisible={true}
        // intervalCallback={() => {
        //   const msgListWrapElem = msgListWrapRef.current;
        //   const lottieDisplayElem = lottieDisplayRef.current;
        //   if (msgListWrapElem && lottieDisplayElem) {
        //     const chatInnerWrap = msgListWrapElem.parentNode;
        //     if (chatInnerWrap !== null) {
        //       const scrollInnerWrap = chatInnerWrap.parentNode as HTMLElement;
        //       if (scrollInnerWrap !== null) {
        //         const lottieDisplayBottom = -scrollInnerWrap.scrollTop;
        //         lottieDisplayElem.style.bottom = `${lottieDisplayBottom}px`;
        //       }
        //     }
        //   }
        // }}
      >
        <div
          className="chat-inner-wrap"
          ref={chatInnerWrapRef}
          style={
            chatInnerWrapAbsolute === true
              ? { position: "absolute", bottom: 0 }
              : {
                  position: "relative",
                }
          }
        >
          <div className="msg-list-wrap" ref={msgListWrapRef}></div>
        </div>
      </DalbitScroll>

      {scrollUpStatus === true && (
        <div
          className={`move-down-btn ${roomInfo.mediaType === MediaType.VIDEO &&
            "video"}`}
          onClick={() => setForceChatScrollDown(true)}
        >
          <div className="inner">
            <span>아래로 이동</span>
            <img className="icon" src={scrollDownArrowIcon} />
          </div>
        </div>
      )}
    </>
  );
};

export default MsgListWrap;
