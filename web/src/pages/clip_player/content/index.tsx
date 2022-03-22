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
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus, setGlobalCtxClipInfoAdd,
  setGlobalCtxClipPlayerInit, setGlobalCtxClipPlayListAdd, setGlobalCtxClipPlayListTabAdd,
  setGlobalCtxClipPlayMode
} from "../../../redux/actions/globalCtx";

export default function ClipContent() {
  const { clipNo } = useParams<{ clipNo: string }>();
  const history = useHistory();
  const historyState = history.location.state;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { clipState, clipAction } = useContext(ClipContext);
  const { clipPlayer, baseData, clipInfo } = globalState;

  const [playState, setPlayState] = useState(false);

  let newClipPlayer = clipPlayer;

  const clipPlay = async () => {

    const { result, message, data } = await postClipPlay({
      clipNo: clipNo,
    });
    if (result === "success") {
      createPlayer(data, "firstStart");
      sessionStorage.setItem("clip", JSON.stringify(data));
      if (!clipInfo?.clipNo || (clipInfo?.clipNo !== data.clipNo && historyState === "firstJoin")) {
        updatePlayList(data);
      }
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
        callback: playFailHandler,
        cancelCallback: playFailHandler,
      }));
    }
  };

  const createPlayer = (data: any, type: string) => {
    if (clipPlayer === null) {
      newClipPlayer = new ClipPlayerHandler({info:data, dispatch, globalState});
      if (type !== "restart")
        dispatch(setGlobalCtxClipPlayMode({clipPlayMode:"normal"}));
    }
    newClipPlayer!.clipAudioTag!.onerror = () => {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: "오디오 파일을 찾을 수 없습니다.",
        callback: () => history.goBack(),
        cancelCallback: () => history.goBack(),
      }));
    };

    if (data.file.url === newClipPlayer?.clipAudioTag?.src && data.clipNo !== newClipPlayer!.clipNo) {
      newClipPlayer!.restart();
    }
    newClipPlayer?.init(data.file.url);
    newClipPlayer?.clipNoUpdate(data.clipNo);
    dispatch(setGlobalCtxClipPlayerInit(newClipPlayer));
    const addObj = { type: "add", data: { ...data, ...{ isPaused: true, isSaved60seconds: false } } };
    dispatch(setGlobalCtxClipInfoAdd({ ...data, ...{ isPaused: true, isSaved60seconds: false } }))
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
    if (globalState.clipPlayList.length > 0) {
      if (clipPlayer?.isPlayingIdx === globalState.clipPlayList!.length - 1) {
        if (globalState.clipPlayMode !== "normal" && globalState.clipPlayMode !== "oneLoop") {
          history.push(`/clip/${globalState.clipPlayList![0].clipNo}`);
        }
      } else {
        history.push(`/clip/${globalState.clipPlayList![clipPlayer?.isPlayingIdx! + 1].clipNo}`);
      }
    } else {
      history.push(`/clip`);
    }
  };

  const updatePlayList = async (oneData: any) => {
    let playListInfo;
    if (sessionStorage.getItem("clipPlayListInfo") !== null) {
      playListInfo = JSON.parse(sessionStorage.getItem("clipPlayListInfo")!);
    }
    if (playListInfo === undefined) return null;
    if (playListInfo.hasOwnProperty("type") && playListInfo.type === "one") {
      dispatch(setGlobalCtxClipPlayListTabAdd(oneData));
      if (globalState.clipPlayMode !== "shuffle") {
        return dispatch(setGlobalCtxClipPlayListAdd(oneData))
      } else {
        dispatch(setGlobalCtxClipPlayListAdd(globalState.clipPlayList))
      }
    }
    if (playListInfo.hasOwnProperty("listCnt")) {
      if (playListInfo.hasOwnProperty("subjectType")) {
        //메인 top3
        const res = await getMainTop3List({ ...playListInfo });
        insertPlayList(res);
      } else {
        //추천(인기)
        const res = await getPopularList({ ...playListInfo });
        insertPlayList(res);
      }
    } else if (playListInfo.hasOwnProperty("memNo")) {
      if (playListInfo.hasOwnProperty("slctType")) {
        //청취내역 좋아요, 선물
        const res = await getHistoryList({ ...playListInfo });
        insertPlayList(res);
      } else {
        //마이페이지 업로드목록
        const res = await getUploadList({ ...playListInfo });
        insertPlayList(res);
      }
    } else if (playListInfo.hasOwnProperty("recDate")) {
      //달대리 목록
      const res = await getMarketingClipList({ ...playListInfo });
      insertPlayList(res);
    } else if (playListInfo.hasOwnProperty("rankType")) {
      //클립랭킹
      const res = await getClipRankingList({ ...playListInfo });
      insertPlayList(res);
    } else {
      //나머지 기본 '/clip/list' 조회(최신, 테마슬라이더, 각 주제별, 서치)
      const res = await getClipList({ ...playListInfo });
      insertPlayList(res);
    }
  };

  const insertPlayList = (res) => {
    if (res.result === "success") {
      dispatch(setGlobalCtxClipPlayListTabAdd(res.data.list));
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
    if (globalState.clipInfo !== null) {
      sessionStorage.setItem("clip", JSON.stringify(globalState.clipInfo));
    }
  }, [globalState.clipInfo]);

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
      sessionStorage.removeItem("clipPlayListInfo");
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
            console.log("다시시도");
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
