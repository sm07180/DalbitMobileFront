import React, { useContext, useEffect, useState } from "react";
import { dateFormatterKorDay, makeHourMinute } from "lib/common_fn";

import { GlobalContext } from "context";
import { useHistory, useParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setMailBoxImgSliderInit, setMailBoxOtherInfo} from "../../../../../redux/actions/mailBox";
function timeCheck(time: Date) {
  return time.getMinutes() + "분" + time.getSeconds() + "초" + time.getMilliseconds() + "밀리초";
}

function ChatList({ msgGroup }) {
  const history = useHistory();
  const { globalState } = useContext(GlobalContext);
  const { baseData } = globalState;
  const dispatch = useDispatch();
  const mailboxState = useSelector(({mailBox}) => mailBox);
  const { deletedImgArray } = mailboxState.imgSliderInfo;

  const giftAction = (itemInfo, nickNm, imageInfo, myChat) => {
    if (myChat) {
      dispatch(setMailBoxOtherInfo({
        nick: globalState.userProfile!.nickNm,
        profImg: globalState.userProfile!.profImg.thumb80x80,
      }));
    } else {
      dispatch(setMailBoxOtherInfo({ nick: nickNm, profImg: imageInfo }));
    }
    dispatch(setMailBoxOtherInfo(itemInfo));
  };

  const createMsgByChatType = (msgItem: any, isRead: boolean) => {
    const { memNo, nickNm, msg, chatType, itemInfo, imageInfo, msgIdx, profImg } = msgItem;
    let { sendDt } = msgItem;
    sendDt = sendDt.substring(8, 12);

    const myChat = memNo === baseData.memNo;
    //{msg.replaceAll("\\n", "\n")}
    switch (chatType) {
      case 1: // 일반 메시지
        return (
          <div className="textBox">
            {myChat !== true && <p className="textBox__nick">{nickNm}</p>}
            <p className={`textBox__msg`}>
              {msg.split("\\n").join("\n")} <span className="textBox__msg--time">{makeHourMinute(sendDt)}</span>
            </p>
            <span className="textBox__readNum">{mailboxState.userCount === true ? "" : isRead === true ? "" : "1"}</span>
          </div>
        );
      case 2: // 사진
        return (
          <div className="textBox">
            {myChat !== true && <p className="textBox__nick">{nickNm}</p>}
            {imageInfo.url === "" || deletedImgArray.indexOf(msgIdx) !== -1 ? (
              <div className={`textBox__msg textBox__msg--img`}>
                <div className="deletedImg" />
                <span className="textBox__msg--time">{makeHourMinute(sendDt)}</span>
              </div>
            ) : (
              <p
                className={`textBox__msg textBox__msg--img`}
                onClick={() => {
                  dispatch(setMailBoxImgSliderInit({
                    memNo: memNo,
                    idx: msgIdx,
                  }))
                }}
              >
                <span className="imgBox">
                  <img src={imageInfo.thumb120x120} />
                </span>
                <span className="textBox__msg--time">{makeHourMinute(sendDt)}</span>
              </p>
            )}
            <span className="textBox__readNum">{mailboxState.userCount === true ? "" : isRead === true ? "" : "1"}</span>
          </div>
        );
      case 3: // 선물
        return (
          <div
            className="textBox"
            onClick={() => giftAction(itemInfo, nickNm, profImg.thumb80x80, myChat)}
            style={{ cursor: "pointer" }}
          >
            {myChat !== true && <p className="textBox__nick">{nickNm}</p>}
            <div className={`textBox__msg giftWrap`}>
              <img src={itemInfo.itemImgUrl} className={`giftThumb ${myChat !== true ? "grayBg" : ""}`} alt="giftThumbImg" />
              <p>
                {nickNm}님이 {itemInfo.itemNm} {`x ${itemInfo.itemCnt}개`}
                (달 {itemInfo.itemCnt > 1 ? itemInfo.dalCnt * itemInfo.itemCnt : itemInfo.dalCnt}개)를 선물하였습니다.
              </p>
              <span className="textBox__msg--time">{makeHourMinute(sendDt)}</span>
            </div>
            <span className="textBox__readNum">{mailboxState.userCount === true ? "" : isRead === true ? "" : "1"}</span>
          </div>
        );

      default:
        break;
    }
  };

  const settingMsgBoxClassName = (msgGroup: any, memNo: string, msgIdx: any) => {
    let msgClassName = "middle";
    const prevMsgMemNo = msgGroup[msgIdx - 1]?.memNo;
    const nextMsgMemNo = msgGroup[msgIdx + 1]?.memNo;
    if (memNo !== prevMsgMemNo && memNo !== nextMsgMemNo) {
      msgClassName = "firstLast";
    } else if (memNo !== prevMsgMemNo && memNo === nextMsgMemNo) {
      msgClassName = "first";
    } else if (memNo === prevMsgMemNo && memNo !== nextMsgMemNo) {
      msgClassName = "last";
    } else {
      msgClassName = "middle";
    }
    return msgClassName;
  };

  return (
    <>
      {msgGroup !== null
        ? Object.keys(msgGroup).map((chatItemDt, idx) => {
            const arr = msgGroup[chatItemDt];
            return (
              <React.Fragment key={idx}>
                <div className="dayLine">{dateFormatterKorDay(chatItemDt)}</div>
                {arr instanceof Array &&
                  arr.map((msgGroup, idxInnerItem) => {
                    return (
                      <div className="msgBox" key={idxInnerItem}>
                        {msgGroup.map((msgItem, msgIdx) => {
                          const { memNo, isRead, profImg } = msgItem;
                          const myChat = memNo === baseData.memNo;
                          const msgClassName = settingMsgBoxClassName(msgGroup, memNo, msgIdx);

                          return (
                            <div
                              className={`chatPreviousItem ${myChat ? "myChat" : ""} ${msgClassName}`}
                              key={`chatPrevIdx-${msgIdx}`}
                            >
                              <div
                                className="thumb"
                                onClick={() => {
                                  sessionStorage.setItem("isBeforeMailbox", "Y");
                                  history.push(`/mypage/${memNo}`);
                                }}
                              >
                                <img src={profImg.thumb80x80} />
                              </div>
                              {createMsgByChatType(msgItem, isRead)}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
              </React.Fragment>
            );
          })
        : ""}
    </>
  );
}

export default React.memo(ChatList, (prev, cur) => {
  return prev.msgGroup === cur.msgGroup;
});
