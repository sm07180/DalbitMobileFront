// React
import React, { useContext, useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";

// Api
import { postAddFan, broadcastLike } from "common/api";

// Context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// Constant
import { RandomMsgType, tabType } from "../constant";

let liked = false;

let faned = false;

let startTimer;
let endTimer;

const RandomMsgWrap = (props: { roomOwner: boolean; roomInfo: roomInfoType; roomNo: string }) => {
  const { roomOwner, roomInfo, roomNo } = props;

  const history = useHistory();

  const { globalAction } = useContext(GlobalContext);

  const { broadcastState, broadcastAction } = useContext(BroadcastContext);

  const { dispatchLayer } = useContext(BroadcastLayerContext);

  const [randomMsg, setRandomMsg] = useState<{
    status: boolean;
    btnTitle: string;
    callback?(): void;
    msg: string;
  }>({
    status: false,
    btnTitle: "",
    msg: "",
  });

  const timeoutFn = useCallback((v) => {
    const { type, btnTitle, msg, conditionTime, runningTime } = v;
    if (roomOwner === false) {
      startTimer = setTimeout(() => {
        let callback;
        switch (type) {
          case RandomMsgType.GIFT:
            callback = () => {
              dispatchLayer({
                type: "GIFT",
                others: {
                  guestClicked: false,
                  itemNo: "",
                  cnt: 0,
                },
              });
            };
            break;
          case RandomMsgType.STORY:
            callback = () => {
              broadcastAction.setRightTabType!(tabType.STORY);
            };
            break;
          case RandomMsgType.FAN:
            callback = async () => {
              const { result } = await postAddFan({ memNo: roomInfo.bjMemNo });
              if (result === "success") {
                if (globalAction.callSetToastStatus) {
                  globalAction.callSetToastStatus({
                    status: true,
                    message: `${roomInfo.bjNickNm}님의 팬이 되었습니다`,
                  });
                }
                broadcastAction.setIsFan && broadcastAction.setIsFan(true);
                faned = true;
              }
            };
            break;
          case RandomMsgType.GOOD:
            callback = async () => {
              const { result, message } = await broadcastLike({ roomNo, memNo: roomInfo.bjMemNo });

              if (result === "fail") {
                globalAction.setAlertStatus!({
                  status: true,
                  content: message,
                });
              } else if (result === "success") {
                broadcastAction.setLikeClicked!(false);
                liked = true;
              }
            };
            break;
          case RandomMsgType.EVENT:
            callback = () => {
              history.push("/store");
            };
            break;
          default:
            return null;
        }

        if (type === RandomMsgType.GOOD && liked === false) {
        } else if (type === RandomMsgType.FAN && faned === true) {
        } else {
          setRandomMsg({
            btnTitle,
            msg,
            callback,
            status: true,
          });
        }

        endTimer = setTimeout(() => {
          //delete
          setRandomMsg({
            btnTitle: "",
            msg: "",
            status: false,
          });
        }, [runningTime * 1000]);
      }, [conditionTime * 1000]);
    }
  }, []);

  /* 청취자 유도 메시지 좋아요, 팬등록 성공시 막는 SIDE EFFECT */
  useEffect(() => {
    liked = broadcastState.likeClicked;
  }, [broadcastState.likeClicked]);

  useEffect(() => {
    faned = broadcastState.isFan;
  }, [broadcastState.isFan]);

  useEffect(() => {
    if (roomInfo.randomMsgList.length > 0) {
      roomInfo.randomMsgList.forEach((v) => {
        timeoutFn(v);
      });
    }

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (endTimer) clearTimeout(endTimer);
    };
  }, []);

  return (
    <>
      {randomMsg.status === true && (
        <div className="randomMsgWrap">
          <span>{randomMsg.msg}</span>
          <button
            onClick={(e) => {
              if (randomMsg.callback) {
                randomMsg.callback();

                setRandomMsg({
                  btnTitle: "",
                  msg: "",
                  status: false,
                });
              }
              e.stopPropagation();
            }}
          >
            {randomMsg.btnTitle}
          </button>
        </div>
      )}
    </>
  );
};

export default RandomMsgWrap;
