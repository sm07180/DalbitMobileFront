import React, { useState, useEffect, useCallback, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";

import { ClipPlayerHandler } from "common/audio/clip_player";
import {
  postClipPlay,
  getMainTop3List,
  getPopularList,
  getUploadList,
  getHistoryList,
  getClipList,
  clipPlayConfirm,
  getMarketingClipList,
  getClipRankingList,
} from "common/api";

import PlayBox from "../components/player_box";
import ClipRightTabRender from "../components/right_tab_render";

import { ClipContext } from "context/clip_ctx";

import "./clip_player.scss";
import "./tab_contents.scss";
import Utility from "../../../components/lib/utility";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus, setGlobalCtxClipInfoAdd, setGlobalCtxClipPlayerInit,
  setGlobalCtxClipPlayListAdd,
  setGlobalCtxClipPlayListTabAdd, setGlobalCtxClipPlayMode
} from "../../../redux/actions/globalCtx";

export default function ClipContent() {
  const { clipNo } = useParams<{ clipNo: string }>();
  const history = useHistory();
  const historyState = history.location.state;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const { clipState, clipAction } = useContext(ClipContext);
  const { clipPlayer, baseData, clipInfo, clipPlayListTab } = globalState;

  const [playState, setPlayState] = useState(false);

  let newClipPlayer = clipPlayer;

  const clipPlay = async () => {
    const { result, message, data } = await postClipPlay({
      clipNo: clipNo,
    });

    if (result === "success") {
      createPlayer(data, "firstStart");

      if (!clipInfo?.clipNo || (clipInfo?.clipNo !== data.clipNo && historyState === "firstJoin")) {
        updatePlayList(data);
      }
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
        callback: playFailHandler,
        cancelCallback: playFailHandler,
      }))
    }
  };

  const createPlayer = (data: any, type: string) => {
    if (clipPlayer === null) {
      newClipPlayer = new ClipPlayerHandler({info:data, dispatch, globalState});
      if (type !== "restart") {
        dispatch(setGlobalCtxClipPlayMode({clipPlayMode:'normal'}))
      }
    }
    newClipPlayer!.clipAudioTag!.onerror = () => {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "????????? ????????? ?????? ??? ????????????.",
        callback: () => history.goBack(),
        cancelCallback: () => history.goBack(),
      }));
    };

    Utility.addClipPlayList(data);
    dispatch(setGlobalCtxClipPlayListAdd(data))

    if (data.file.url === newClipPlayer?.clipAudioTag?.src && data.clipNo !== newClipPlayer!.clipNo) {
      newClipPlayer!.restart();
    }
    newClipPlayer?.init(data.file.url);
    newClipPlayer?.clipNoUpdate(data.clipNo);
    dispatch(setGlobalCtxClipPlayerInit(newClipPlayer))
    const addObj = { type: "add", data: { ...data, isPaused: true, isSaved60seconds: false } };
    dispatch(setGlobalCtxClipInfoAdd({ ...data, isPaused: true, isSaved60seconds: false }));
    // dispatch(setGlobalCtxClipInfoAdd(addObj));
    clipAction.dispatchClipInfo!(addObj);
    newClipPlayer?.start();
    if (globalState.baseData.memNo === data.clipMemNo) {
      clipAction.setIsMyClip!(true);
    } else {
      clipAction.setIsMyClip!(false);
    }
  };

  const playFailHandler = () => {
    if (historyState === "firstJoin") {
      history.goBack();
      return;
    }
    if (clipPlayListTab.length > 0) {
      if (clipPlayer?.isPlayingIdx === clipPlayListTab.length - 1) {
        if (globalState.clipPlayMode !== "normal" && globalState.clipPlayMode !== "oneLoop") {
          history.push(`/clip/${clipPlayListTab[0].clipNo}`);
        }
      } else {
        history.push(`/clip/${clipPlayListTab[clipPlayer?.isPlayingIdx! + 1].clipNo}`);
      }
    } else {
      history.push(`/clip`);
    }
  };

  const updatePlayList = async (oneData: any) => {
    let playListInfo;
    if (localStorage.getItem("clipPlayListInfo") !== null) {
      playListInfo = JSON.parse(localStorage.getItem("clipPlayListInfo")!);
    }
    if (playListInfo === undefined) return null;
    if(playListInfo.type === 'setting') return;

    if ((playListInfo.hasOwnProperty("type") && playListInfo.type === "one")) {
      dispatch(setGlobalCtxClipPlayListTabAdd(oneData))
      if (globalState.clipPlayMode !== "shuffle") {
        return dispatch(setGlobalCtxClipPlayListAdd(oneData));
      } else {
        dispatch(setGlobalCtxClipPlayListAdd(globalState.clipPlayList));
      }
    }
    if (playListInfo.hasOwnProperty("listCnt")) {
      if (playListInfo.hasOwnProperty("subjectType")) {
        //?????? top3
        const res = await getMainTop3List({ ...playListInfo });
        insertPlayList(res);
      } else {
        //??????(??????)
        const res = await getPopularList({ ...playListInfo });
        insertPlayList(res);
      }
    } else if (playListInfo.hasOwnProperty("memNo")) {
      if (playListInfo.hasOwnProperty("slctType")) {
        //???????????? ?????????, ??????
        const res = await getHistoryList({ ...playListInfo });
        insertPlayList(res);
      } else {
        //??????????????? ???????????????
        const res = await getUploadList({ ...playListInfo });
        insertPlayList(res);
      }
    } else if (playListInfo.hasOwnProperty("recDate")) {
      //????????? ??????
      const res = await getMarketingClipList({ ...playListInfo });
      insertPlayList(res);
    } else if (playListInfo.hasOwnProperty("rankType")) {
      //????????????
      const res = await getClipRankingList({ ...playListInfo });
      insertPlayList(res);
    } else {
      //????????? ?????? '/clip/list' ??????(??????, ??????????????????, ??? ?????????, ??????)
      const res = await getClipList({ ...playListInfo });
      insertPlayList(res);
    }
  };

  const insertPlayList = (res) => {
    if (res.result === "success") {
      dispatch(setGlobalCtxClipPlayListTabAdd(res.data.list))
      if (globalState.clipPlayMode !== "shuffle") {
        dispatch(setGlobalCtxClipPlayListAdd(res.data.list));
      } else {
        dispatch(setGlobalCtxClipPlayListAdd(globalState.clipPlayList));
      }
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: `${res.message}`,
      }));
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("clip") === null) {
      clipPlay();
      return;
    }
    let data = JSON.parse(sessionStorage.getItem("clip")!);
    if (clipNo === data.clipNo) {
      createPlayer(data, "restart");
    } else {
      clipPlay();
    }
    if (data !== undefined || sessionStorage.getItem("clip") !== null) {
      if (clipNo === data.clipNo) {
        updatePlayList(data);
      }
    }
    if (globalState.clipPlayList.length > 0) {
      newClipPlayer?.findPlayingClip(clipNo);
    }
  }, [clipNo]);

  useEffect(() => {
    if (!baseData.isLogin) {
      clipPlayer?.clipExit();
      sessionStorage.removeItem("clip");
      localStorage.removeItem("clipPlayListInfo");
      history.push("/");
    }
  }, [baseData.isLogin]);

  useEffect(() => {
    if (globalState.clipPlayList.length > 0) {
      newClipPlayer?.findPlayingClip(clipNo);
    }
  }, [globalState.clipPlayList, newClipPlayer, globalState.clipPlayListTab, clipState.isMyClip]);

  useEffect(() => {
    if (clipInfo !== null && !playState && clipNo === clipInfo.clipNo) {
      setPlayState(true);
    }
    if (clipInfo !== null && clipInfo.isSaved60seconds === true && clipPlayer?.save60seconds! >= 59) {
      let checked = false;
      const clip60secondsConfirm = async () => {
        const { result, message } = await clipPlayConfirm({
          clipNo: clipInfo.clipNo,
          playIdx: clipInfo.playIdx,
        });
        if (result === "success") {
          console.log(message);
          clipPlayer?.initSave60seconds();
        } else {
          console.log(message);
          if (!checked) {
            console.log("????????????");
            checked = true;
            const { message } = await clipPlayConfirm({
              clipNo: clipInfo.clipNo,
              playIdx: clipInfo.playIdx,
            });
            console.log(message);
          }
        }
      };

      clip60secondsConfirm();
    }
  }, [clipInfo]);

  useEffect(() => {
    if (clipPlayListTab.length === 0) {
      const temp = sessionStorage.getItem("clipList");
      if(temp) {
        try {
          const clipList = JSON.parse(temp);
          dispatch(setGlobalCtxClipPlayListTabAdd(clipList))
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, []);

  return (
    <>
      {playState && globalState.clipInfo && (
        <div id="clipPlayer">
          <div className="leftSide">
            <PlayBox />
          </div>
          <ClipRightTabRender />
        </div>
      )}
    </>
  );
}
