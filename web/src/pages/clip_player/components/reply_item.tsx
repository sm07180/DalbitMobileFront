import React, { useState, useContext, useEffect } from "react";

import { postClipReplyDelete } from "common/api";
import { useHistory } from "react-router-dom";
import optionIcon from "../static/morelist_g.svg";
import reportIcon from "../static/ic_report_g.svg";

import { tabType } from "../constant";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../redux/actions/globalCtx";
import {setClipCtxReplyIdx} from "../../../redux/actions/clipCtx";

export default ({ replyValue, fetchReplyList, replyEdit }) => {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const clipState = useSelector(({clipCtx}) => clipCtx);
  const dispatch = useDispatch();
  const history = useHistory();

  const optionBtnToggle = () => {
    dispatch(setClipCtxReplyIdx(replyValue.replyIdx));
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
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: message,
        }));
        dispatch(setClipCtxReplyIdx(0));
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
                ??????
              </span>
              <span
                className="optionBox__list"
                onClick={() =>
                  dispatch(setGlobalCtxAlertStatus({
                    status: true,
                    type: "confirm",
                    content: `?????? ?????????????????????????`,
                    callback: () => replyDelete(),
                  }))
                }
              >
                ??????
              </span>
            </>
          ) : (
            <>
              <span
                className="optionBox__list"
                onClick={() =>
                  dispatch(setGlobalCtxAlertStatus({
                    status: true,
                    type: "confirm",
                    content: `?????? ?????????????????????????`,
                    callback: () => replyDelete(),
                  }))
                }
              >
                ??????
              </span>
              {/* <span
                className="optionBox__list"
                onClick={() => clipAction.setRightTabType && clipAction.setRightTabType(tabType.REPORT)}
              >
                ??????
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
            onClick={() => history.push(`/profile/${replyValue.writerMemNo}`)}
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
