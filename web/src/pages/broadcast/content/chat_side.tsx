import React from "react";

import ChatListWrap from "../component/chat_list_wrap";
import ChatInputWrap from "../component/chat_input_wrap";
import { MediaType } from "pages/broadcast/constant";

const ChatSide = (props: {
  forceChatScrollDown: boolean;
  setForceChatScrollDown: any;
  roomNo: string;
  roomOwner: boolean | null;
  roomInfo: roomInfoType;
}) => {
  const { forceChatScrollDown, setForceChatScrollDown, roomNo, roomOwner, roomInfo } = props;

  return (
    <div className={`chat-side ${roomInfo.mediaType === MediaType.VIDEO && "video"}`}>
      <ChatListWrap
        roomInfo={roomInfo}
        forceChatScrollDown={forceChatScrollDown}
        setForceChatScrollDown={setForceChatScrollDown}
      />
      <ChatInputWrap roomNo={roomNo} roomInfo={roomInfo} roomOwner={roomOwner} setForceChatScrollDown={setForceChatScrollDown} />
    </div>
  );
};

export default ChatSide;
