import React, { useEffect } from "react";
import styled from "styled-components";

export default function ChatMsg(props: any) {
  const { user, recvMsg } = props;
  const { image, nk } = user;
  const { msg } = recvMsg;
  // console.log(msg);
  return (
    <ChatMsgStyled>
      <div className="profile-img" style={{ backgroundImage: `url(${image})` }}></div>
      <div className="nickname-msg-wrap">
        <div className="nickname">{nk}</div>
        <div className="msg">{msg}</div>
      </div>
    </ChatMsgStyled>
  );
}

const ChatMsgStyled = styled.div`
  display: flex;
  flex-direction: row;

  .profile-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .nickname-msg-wrap {
    .nickname {
    }
    .msg {
      width: 100%;
      padding: 4px;
      color: #fff;
      box-sizing: border-box;
      font-size: 14px;
    }
  }
`;
