import { NormalMsgFormat } from "pages/broadcast/lib/chat_msg_format";

export function mailSoketCmd(data: any) {
  const { cmd, isMine } = data;
  switch (cmd) {
    case "mailBoxChat": {
      const { user, recvMsg } = data;
      const { nk, memNo } = user;
      const { msg, type } = recvMsg;
      console.log(data);

      return NormalMsgFormat({
        type: "div",
        className: "msg-wrap",
        children: [
          {
            type: "div",
            className: "nickname-msg-wrap",
            children: [
              {
                type: "div",
                text: msg,
                className: "msg",
              },
            ],
          },
        ],
      });
    }
  }

  return null;
}
