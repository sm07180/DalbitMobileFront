import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { tabType } from "../constant";

import { printNumber, addComma } from "lib/common_fn";

import { GlobalContext } from "context";
import { ClipContext } from "context/clip_ctx";

import iconPlay from "../static/play_g_s.svg";

export default function ClipPlayerTop() {
  const history = useHistory();

  const { globalState } = useContext(GlobalContext);
  const { clipState, clipAction } = useContext(ClipContext);
  const { clipInfo, clipPlayer } = globalState;
  const { setRightTabType, setUserMemNo } = clipAction;
  const { isMyClip } = clipState;

  const ReportLoginCheck = () => {
    if (!globalState.baseData.isLogin) {
      history.push("/login");
    } else {
      setRightTabType && setRightTabType(tabType.REPORT);
    }
  };

  return (
    <>
      {clipInfo && (
        <div className="playerTop">
          <div className="optionBox">
            {isMyClip ? (
              <button
                className="optionBox__editBtn"
                onClick={() => {
                  clipPlayer!.clipExit();
                  history.push(`/clip_edit/${clipInfo!.clipNo}`);
                }}
              />
            ) : (
              <button className="optionBox__reportBtn" onClick={ReportLoginCheck} />
            )}
          </div>
          <p className="playerTop__subsect">{clipInfo.title}</p>
          <p
            className="playerTop__nick"
            onClick={(e) => {
              e.stopPropagation();
              setRightTabType && setRightTabType(tabType.PROFILE);
              setUserMemNo && setUserMemNo(clipInfo.clipMemNo);
            }}
          >
            {clipInfo.nickName}
          </p>
          <div className="playerTop__detail">
            {clipState.isMyClip && (
              <span className="playerTop__detail--play">
                <img src={iconPlay} width={16} alt="play" /> {clipInfo.playCnt}
              </span>
            )}

            <span className="playerTop__detail">
              <i className="playerTop__detail--star">선물 아이콘</i>
              {clipInfo.byeolCnt > 999 ? printNumber(clipInfo.byeolCnt) : addComma(clipInfo.byeolCnt)}
            </span>
            <span className="playerTop__detail">
              <i className="playerTop__detail--like">회색 하트 아이콘</i>
              {clipInfo.goodCnt > 999 ? printNumber(clipInfo.goodCnt) : addComma(clipInfo.goodCnt)}
            </span>
            <span className="playerTop__detail">
              <i className="playerTop__detail--message">회색 말풍선 아이콘</i>
              {clipInfo.replyCnt > 999 ? printNumber(clipInfo.replyCnt) : addComma(clipInfo.replyCnt)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}