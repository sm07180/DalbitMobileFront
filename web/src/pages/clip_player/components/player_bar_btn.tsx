import React, { useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { tabType } from "../constant";

import { ClipContext } from "context/clip_ctx";

import btnReplay from "../static/replay.svg";
import btnReplayAll from "../static/replay_b.svg";
import btnShuffle from "../static/shuffle_b.svg";
import btnReplayOne from "../static/replay1_b.svg";
import btnPlay from "../static/play_purple.svg";
import btnPause from "../static/pause_purple.svg";
import btnPrev from "../static/skip-back.svg";
import btnNext from "../static/skip_forward.svg";
import btnPlayList from "../static/playlist.svg";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxClipPlayListAdd,
  setGlobalCtxClipPlayMode,
  setGlobalCtxSetToastStatus
} from "../../../redux/actions/globalCtx";

export default function ClipPlayerBarButton() {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const { clipState, clipAction } = useContext(ClipContext);

  const { clipPlayer, clipPlayMode, clipInfo, clipPlayListTab } = globalState;
  const { setRightTabType, setUserMemNo } = clipAction;

  const createModeBtn = useCallback(() => {
    switch (clipPlayMode) {
      case "normal":
        return <img src={btnReplay} width={32} alt="일반" />;

      case "oneLoop":
        return <img src={btnReplayOne} width={32} alt="1곡반복" />;

      case "allLoop":
        return <img src={btnReplayAll} width={32} alt="전체반복" />;

      case "shuffle":
        return <img src={btnShuffle} width={32} alt="셔플" />;

      default:
        break;
    }
  }, [clipPlayMode]);

  const playModeHandle = useCallback(() => {
    switch (clipPlayMode) {
      case "normal":
        //normal 상태에서 클릭시 한곡 반복으로

        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "현재 클립을 반복합니다.",
        }));
        dispatch(setGlobalCtxClipPlayMode({clipPlayMode: "oneLoop"}));
        clipPlayer!.loopStart();
        break;

      case "oneLoop":
        //oneLoop 상태에서 클릭시 전체 반복으로
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "전체 클립을 반복합니다.",
        }));
        dispatch(setGlobalCtxClipPlayMode({clipPlayMode: "allLoop"}));
        clipPlayer!.loopEnd();
        break;
      case "allLoop":
        //allLoop 상태에서 클릭시 셔플 상태로
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "클립을 셔플하여 재생합니다.",
        }));
        dispatch(setGlobalCtxClipPlayMode({clipPlayMode: "shuffle"}));
        const test = globalState.clipPlayList!.sort(() => {
          return Math.round(Math.random()) - 0.5;
        });
        dispatch(setGlobalCtxClipPlayListAdd(test))
        break;
      case "shuffle":
        //shuffle 상태에서 클릭시 노멀 상태로
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "클립을 반복하지 않습니다.",
        }));
        dispatch(setGlobalCtxClipPlayMode({clipPlayMode: "normal"}));
        break;
      default:
        break;
    }
  }, [clipPlayMode]);

  return (
    <div className="playerBtnWrap">
      <button type="button" className="playerBtn__next" onClick={playModeHandle}>
        {createModeBtn()}
      </button>

      <div className="playerBtn">
        <button
          type="button"
          className="playerBtn__prev"
          onClick={() => {
            if(clipPlayListTab?.length > 1) {
              const prevIdx = clipPlayer?.isPlayingIdx - 1;
              const lastIdx = clipPlayListTab.length - 1;

              if(clipPlayer?.isPlayingIdx === undefined) {
                history.push(`/clip/${clipPlayListTab[0].clipNo}`);
              }else if(clipPlayer?.isPlayingIdx === 0) {
                history.push(`/clip/${clipPlayListTab[lastIdx].clipNo}`);
              }else {
                history.push(`/clip/${clipPlayListTab[prevIdx].clipNo}`);
              }
            }
          }}
        >
          <img src={btnPrev} alt="back" />
        </button>
        <button
          type="button"
          className="playerBtn__play"
          onClick={() => {
            if (clipInfo!.isPaused) {
              clipPlayer!.start();
            } else {
              clipPlayer!.stop();
            }
          }}
        >
          <img src={clipInfo!.isPaused ? btnPlay : btnPause} alt="play" />
        </button>
        <button
          type="button"
          className="playerBtn__next"
          onClick={() => {
            const nextIdx = clipPlayer?.isPlayingIdx + 1;
            if(clipPlayListTab?.length > 1) {
              if (clipPlayer?.isPlayingIdx! === undefined || clipPlayer?.isPlayingIdx === clipPlayListTab.length - 1) {
                history.push(`/clip/${clipPlayListTab[0].clipNo}`);
              }else {
                history.push(`/clip/${clipPlayListTab[nextIdx].clipNo}`);
              }
            }
          }}
        >
          <img src={btnNext} alt="back" />
        </button>
      </div>

      <button
        type="button"
        className="playerBtnWrap__refresh"
        onClick={() => {
          setRightTabType && setRightTabType(tabType.PLAY_LIST);
        }}
      >
        <img src={btnPlayList} width={32} alt="PlayList" />
      </button>
    </div>
  );
}
