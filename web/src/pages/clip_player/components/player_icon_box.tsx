import React, { useState, useContext, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";

import { tabType } from "../constant";

import { ClipContext } from "context/clip_ctx";

import { postClipGood, getClipShare } from "common/api";

import btnGift from "../static/ic_gift.svg";
import btnHeart from "../static/ic_heart_g.svg";
import btnHeartActive from "../static/ic_heart.svg";
import btnMessage from "../static/ic_message_g.svg";
import btnShare from "../static/ic_share_g.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxClipInfoAdd, setGlobalCtxSetToastStatus} from "../../../redux/actions/globalCtx";

export default function ClipPlayerIconBox() {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const { clipState, clipAction } = useContext(ClipContext);
  const { setRightTabType } = clipAction;
  const { baseData, clipInfo } = globalState;

  async function fetchClipGood() {
    const { result, data, message } = await postClipGood({
      clipNo: clipInfo!.clipNo!,
      good: clipInfo!.isGood ? 0 : 1,
    });
    if (result === "success") {
      dispatch(setGlobalCtxClipInfoAdd({ isGood: data.isGood, goodCnt: data.goodCnt }));
    }
    dispatch(setGlobalCtxSetToastStatus({
      status: true,
      message: message,
    }));
  }

  async function fetchClipShare() {
    const { result, data, message } = await getClipShare({
      clipNo: clipInfo!.clipNo!,
    });
    if (result === "success") {
      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);
      textarea.value = data.shareLink;
      textarea.select();
      textarea.setSelectionRange(0, 9999);
      document.execCommand("copy");
      document.body.removeChild(textarea);
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: message,
      }));
    } else {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: message,
      }));
    }
  }

  const clickbtnhandle = useCallback(
    (e) => {
      const { name } = e.currentTarget;
      if (baseData.isLogin) {
        switch (name) {
          case "gift":
            clipState.isMyClip
              ? setRightTabType && setRightTabType(tabType.GIFT_LIST)
              : setRightTabType && setRightTabType(tabType.GIFT_GIVE);
            break;
          case "good":
            fetchClipGood();
            break;
          case "reply":
            setRightTabType && setRightTabType(tabType.REPLY);
            break;
          case "share":
            fetchClipShare();
            break;
          default:
            break;
        }
      } else {
        history.push("/login");
      }
    },
    [clipInfo]
  );

  return (
    <>
      <ul className="iconBox">
        <li className="iconBox__item">
          <button type="button" name="gift" onClick={clickbtnhandle}>
            <img src={btnGift} width={36} alt="gift" />
          </button>
        </li>
        <li className="iconBox__item">
          <button type="button" name="good" onClick={clickbtnhandle}>
            <img src={clipInfo!.isGood ? btnHeartActive : btnHeart} width={36} alt="Heart" />
          </button>
        </li>
        <li className="iconBox__item">
          <button type="button" name="reply" onClick={clickbtnhandle}>
            <img src={btnMessage} width={36} alt="Message" />
          </button>
        </li>
        <li className="iconBox__item">
          <button type="button" name="share" onClick={clickbtnhandle}>
            <img src={btnShare} width={36} alt="Share" />
          </button>
        </li>
      </ul>
      {clipInfo!.eventOpen && (
        <Link to={`/event/clip_gift_event`} className="giftEventButton">
          <img src="https://image.dalbitlive.com/images/clip/banner_gift.png" alt="선물 시 40% 추가 지급" />
        </Link>
      )}
    </>
  );
}
