import React, { useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import AnimationViewer from "./animation_viewer";
import ClipPlayerTop from "./player_box_top";
import ClipPlayerCoverBox from "./player_cover_box";
import ClipPlayerIconBox from "./player_icon_box";
import ClipPlayerBar from "./player_bar";
import ClipPlayerBarBtn from "./player_bar_btn";
import ClipPlayerBanner from "./player_banner";

import {useSelector} from "react-redux";

export default () => {
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const { clipInfo, clipPlayMode } = globalState;
  const { clipPlayer } = globalState;
  const { clipAudioTag } = clipPlayer!;
  const clipPlayNo = clipInfo!.clipNo;

  const createCoverClassName = useCallback((e) => {
    const { classList } = e.currentTarget;
    if (classList.contains("on")) {
      classList.remove("on");
    } else {
      classList.add("on");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      clipAudioTag?.removeEventListener("ended", ()=>{
        audioEndHandler({globalState})
      });
    };
  }, []);

  useEffect(() => {
    if (globalState.clipPlayList!.length > 0) {
      clipAudioTag?.addEventListener("ended", ()=>{
        audioEndHandler({globalState})
      });
    }
    return () => {
      clipAudioTag?.removeEventListener("ended", ()=>{
        audioEndHandler({globalState})
      });
    };
  }, [globalState.clipPlayList, clipPlayMode]);

  useEffect(() => {
    document.getElementsByClassName("cover")[0].classList.remove("on");
  }, [clipInfo]);

  return (
    <>
      <AnimationViewer />
      <div className="playerBox">
        <ClipPlayerTop />
        <div className="playerCenter">
          <div className="cover" onClick={createCoverClassName}>
            <ClipPlayerCoverBox />
          </div>
          <ClipPlayerIconBox />
        </div>
        <ClipPlayerBanner clipPlayNo={clipPlayNo} />
        <div className="playerBottom" id="test">
          <ClipPlayerBar />
          <ClipPlayerBarBtn />
        </div>
      </div>
    </>
  );
};


export const audioEndHandler = async ({globalState}) => {
  const history = useHistory();
  const { clipPlayer, clipPlayMode } = globalState;
    console.log("audioEndHandler====>",clipPlayMode,clipPlayer)
  if (globalState.clipPlayList?.length === 0) return null;
  if (globalState.clipPlayList![clipPlayer?.isPlayingIdx! + 1] === undefined) {
    if (clipPlayMode === "allLoop") {
      return history.push(`/clip/${globalState.clipPlayList![0].clipNo}`);
    } else {
      return console.log("마지막곡입니다");
    }
  }
  const isNotClipPlayerPage = window.location.pathname.indexOf("/clip/") === -1;
  if (!isNotClipPlayerPage) history.push(`/clip/${globalState.clipPlayList![clipPlayer?.isPlayingIdx! + 1].clipNo}`);
};
