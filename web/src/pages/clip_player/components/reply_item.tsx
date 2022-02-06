import React, { useState, useContext, useEffect } from "react";

import { postClipReplyDelete } from "common/api";
import { GlobalContext } from "context";
import { ClipProvider, ClipContext } from "context/clip_ctx";
import { useHistory } from "react-router-dom";
import optionIcon from "../static/morelist_g.svg";
import reportIcon from "../static/ic_report_g.svg";

import { tabType } from "../constant";

export default ({ replyValue, fetchReplyList, replyEdit }) => {
  const { globalState, globalAction } = useContext(GlobalContext);
  const { clipState, clipAction } = useContext(ClipContext);
  const history = useHistory();

  const optionBtnToggle = () => {
    clipAction.setClipReplyIdx!(replyValue.replyIdx);
  };
  useEffect(() => {
    // console.log(clipState.clipReplyIdx);
  }, [clipState.clipReplyIdx]);
  const replyDelete = () => {
    async function fetchReplyDelete() {
      const { result, data, message } = await postClipReplyDelete({
        clipNo: globalState.clipInfo?.clipNo!,
        replyIdx: replyValue.replyIdx,
      });
      if (result === "success") {
        if (globalAction.callSetToastStatus) {
          globalAction.callSetToastStatus({
            status: true,
            message: message,
          });
        }
        clipAction.setClipReplyIdx!(0);
        fetchReplyList();
      }
    }
    fetchReplyDelete();
  };

  const timeFormat = (strFormatFromServer: string) => {
    let date = strFormatFromServer.slice(0, 8);
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join(".");
    let time = strFormatFromServer.slice(8);
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(":");
    return `${date} ${time}`;
  };

  const optionMenu = () => {
    if (globalState.baseData.memNo === replyValue.writerMemNo || clipState.isMyClip === true) {
      return (
        <button type="button" className="optionBtn" onClick={() => optionBtnToggle()}>
          <img src={optionIcon} width={24} alt="option" />
        </button>
      );
    } else if (globalState.baseData.memNo !== replyValue.writerMemNo) {
      return (
        // <button
        //   type="button"
        //   className="optionBtn"
        //   onClick={() => clipAction.setRightTabType && clipAction.setRightTabType(tabType.REPORT)}
        // >
        //   <img src={reportIcon} width={30} alt="reoport" />
        // </button>
        <></>
      );
    }
  };

  return (
    <>
      {optionMenu()}
      {clipState.clipReplyIdx === replyValue.replyIdx ? (
        <div className="optionBox">
          {globalState.baseData.memNo === replyValue.writerMemNo ? (
            <>
              <span className="optionBox__list" onClick={() => replyEdit(replyValue)}>
                수정
              </span>
              <span
                className="optionBox__list"
                onClick={() =>
                  globalAction.setAlertStatus!({
                    status: true,
                    type: "confirm",
                    content: `정말 삭제하시겠습니까?`,
                    callback: () => replyDelete(),
                  })
                }
              >
                삭제
              </span>
            </>
          ) : (
            <>
              <span
                className="optionBox__list"
                onClick={() =>
                  globalAction.setAlertStatus!({
                    status: true,
                    type: "confirm",
                    content: `정말 삭제하시겠습니까?`,
                    callback: () => replyDelete(),
                  })
                }
              >
                삭제
              </span>
              {/* <span
                className="optionBox__list"
                onClick={() => clipAction.setRightTabType && clipAction.setRightTabType(tabType.REPORT)}
              >
                신고
              </span> */}
            </>
          )}
        </div>
      ) : (
        ""
      )}

      <div className="userInfobox">
        <div className="userInfobox__thumb">
          <img
            src={replyValue.profImg.thumb62x62}
            alt="thumb"
            onClick={() => history.push(`/mypage/${replyValue.writerMemNo}`)}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="textBox">
          <p className="textBox__nick">{replyValue.nickName}</p>
          <p className="textBox__date">{timeFormat(replyValue.writeDt)}</p>
        </div>
      </div>

      <div className="userInfobox__content">{replyValue.contents}</div>
    </>
  );
};
