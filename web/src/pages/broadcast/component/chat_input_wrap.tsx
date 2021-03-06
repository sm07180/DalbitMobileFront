import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// component
import GiftComponent from "./gift_component";

// constant
import { tabType } from "pages/broadcast/constant";

// others
import { UserType } from "common/realtime/rtc_socket";
import {IconWrap} from "./icon_wrap";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxSetToastStatus} from "../../../redux/actions/globalCtx";

export default function ChatInputWrap(props: {
  roomNo: string;
  roomInfo: roomInfoType;
  roomOwner: boolean | null;
  setForceChatScrollDown(data: boolean): void;
}) {
  const { roomNo, roomInfo, roomOwner, setForceChatScrollDown } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const { baseData, chatInfo } = globalState;

  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);

  const { chatFreeze, chatLimit } = broadcastState;

  const { dimLayer, layer, dispatchLayer } = useContext(BroadcastLayerContext);
  const [chatText, setChatText] = useState<string>("");

  const MsgRef = useRef<any>(null);

  const textOnChangeEvent = (e: any) => {
    const target = e.currentTarget;
    if (baseData.isLogin === false || target.value.length > 1000) {
      return;
    }
    if (target.value === "\n") {
      return;
    }
    setChatText(target.value);
  };

  const sendMessage = (message: string) => {
    if(chatLimit) return;

    if (chatInfo !== null) {
      if (chatFreeze === false || roomOwner === true) {
        chatInfo.sendSocketMessage(roomNo, "chat", "", message, (result: boolean) => {
          /* 채팅 도배방지 (일반 청취자만)*/
          if(roomInfo.auth === 0) {
            chatInfo.chatLimitCheck(setChatText);
          }

          if (result === false) {
          } else if (result === true) {
            setForceChatScrollDown(true);
          }
        });
      } else {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "채팅 얼리기 중에는 채팅 입력이 불가능합니다.",
        }))
      }
    }
  };

  const chatKeydownEvent = useCallback(
    (e: any) => {
      const target = e.currentTarget;
      if (e.keyCode === 13 && target.value !== "" && e.shiftKey === false) {
        e.preventDefault();
        sendMessage(chatText);
        setChatText("");
      }
    },
    [chatInfo, chatText]
  );

  /** Animation Interval player */

  useEffect(() => {
    if (globalState.alertStatus.status) {
      if (MsgRef !== null && MsgRef.current !== null) {
        MsgRef.current.blur();
      }
    }
  }, [globalState.alertStatus.status]);

  useEffect(() => {
    if (chatText === "") {
      MsgRef.current.value = "";
    }
  }, [chatText]);

  useEffect(() => {
    if (!chatLimit && MsgRef?.current) {
      MsgRef.current?.focus();
    }
  }, [chatLimit]);

  return (
    <div
      className={`chatInputWrap ${dimLayer.status === true && dimLayer.type === "ROULETTE" && "fixed"}`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <GiftComponent roomInfo={roomInfo} roomOwner={roomOwner} roomNo={roomNo} />
      <div className="gift-input-wrap">
        <textarea
          typeof="text"
          className={`${chatLimit? 'disabled' : '' }`}
          placeholder={`${baseData.isLogin === true ? (chatLimit? "3초간 채팅 입력이 제한됩니다." : "대화를 입력해 주세요.") : "로그인 후, 사용 가능합니다."}`}
          value={chatText}
          disabled={chatLimit}
          onKeyDown={chatKeydownEvent}
          onChange={textOnChangeEvent}
          onFocus={(e) => {
            e.stopPropagation();
            if (baseData.isLogin === false) {
              history.push("/login");
            }
            if(layer.status &&layer.type === 'GIFT'){
              dispatchLayer({
                type: "INIT",
              });
            }
          }}
          ref={MsgRef}
        />

        {/* <input
          type="text"
          placeholder={`${baseData.isLogin === true ? "대화를 입력해 주세요." : "로그인 후, 사용 가능합니다."}`}
          value={chatText}
          onKeyDown={chatKeydownEvent}
          onChange={textOnChangeEvent}
          onFocus={() => {
            if (baseData.isLogin === false) {
              history.push("/login");
            }
          }}
          ref={MsgRef}
        /> */}
        {/* <img src={EmojiIcon} className="emoji-icon" /> */}
      </div>
      <IconWrap roomOwner={roomOwner} roomInfo={roomInfo} roomNo={roomNo} sendMessage={sendMessage} />
    </div>
  );
}
