import React, { useContext, useState, useEffect } from "react";

import { getEmoticon } from "common/api";

import { DalbitScroll } from "common/ui/dalbit_scroll";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";

type ActionType = {
  type: string;
  val: any;
  idx?: number;
};

export default function Emoticon(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);

  const { chatFreeze, chatLimit, roomInfo } = broadcastState;
  const [emoticon, setEmoticon] = useState<Array<any>>([]);
  const [category, setCategory] = useState<Array<any>>([]);
  const [selectCategory, setSelectCategory] = useState<number>(-1);
  const [chatText, setChatText] = useState<string>("");

  const { chatInfo } = globalState;
  const { roomNo, setForceChatScrollDown, roomOwner } = props;
  const sendMessage = async (obj: any) => {
    if(chatLimit) return;

    const { emoticonDesc, idx } = obj;
    if (chatFreeze === false || roomOwner === true) {
      chatInfo !== null &&
        chatInfo.sendSocketMessage(roomNo, "chat", "", emoticonDesc, (result: boolean) => {
          /* 채팅 도배방지 (일반 청취자만)*/
          if(roomInfo?.auth === 0) {
            chatInfo.chatLimitCheck();
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
  };

  useEffect(() => {
    async function getShortcut() {
      const res = await getEmoticon();
      if (res.result === "success") {
        if (res.data.list instanceof Array) {
          setEmoticon(res.data.list);
        }
        if (res.data.categoryList instanceof Array) {
          setCategory(res.data.categoryList);
        }
      }
    }

    getShortcut();
  }, [globalState.baseData.isLogin]);
  return (
    <>
      <div className="emoticonWrap">
        <div className="emoticonWrap__category">
          {category.map((v, idx) => {
            return (
              <button
                key={idx}
                className={`${selectCategory === v.categoryOrderNo && "on"}`}
                onClick={() => {
                  setSelectCategory(v.categoryOrderNo);
                }}
              >
                {v.categoryNm}
              </button>
            );
          })}
        </div>
        <DalbitScroll width={360}>
          <div className="emoticonWrap__emoticon">
            {emoticon.map((v, idx) => {
              if (selectCategory !== -1) {
                if (v.categoryOrderNo === selectCategory) {
                  return (
                    <button
                      key={idx}
                      onClick={(e: any) => {
                        sendMessage(v);
                        e.target.blur();
                      }}
                    >
                      {v.emoticonDesc}
                    </button>
                  );
                }
              } else {
                return (
                  <button
                    key={idx}
                    onClick={(e: any) => {
                      sendMessage(v);
                      e.target.blur();
                    }}
                  >
                    {v.emoticonDesc}
                  </button>
                );
              }
            })}
          </div>
        </DalbitScroll>
      </div>
    </>
  );
}
