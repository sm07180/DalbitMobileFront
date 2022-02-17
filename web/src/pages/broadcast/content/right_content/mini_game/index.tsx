// React
import React, { useContext, useCallback, useEffect, useState } from "react";

// Api
// Api
import { getMiniGameList } from "common/api";

import "./index.scss";
import { tabType, MiniGameType } from "pages/broadcast/constant";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxRightTabType} from "../../../../../redux/actions/broadcastCtx";
import {setGlobalCtxAlertStatus} from "../../../../../redux/actions/globalCtx";

export default ({ roomNo }) => {

  const dispatch = useDispatch();

  const [miniGameList, setMiniGameList] = useState<Array<{
    gameNo: number;
    gameDesc: string;
    gameImg: string;
    gameName: string;
  }> | null>(null);

  const miniGameHandler = useCallback((type: number) => {
    switch (type) {
      case MiniGameType.ROLUTTE:
        dispatch(setBroadcastCtxRightTabType(tabType.ROULETTE));
        break;
    }
  }, []);

  useEffect(() => {
    getMiniGameList({ roomNo }).then((resolve) => {
      const { result, data, message } = resolve;
      if (result === "success") {
        setMiniGameList(data.list);
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: message,
        }));
      }
    });
  }, []);

  return (
    <div id="mini_game">
      <p className="title">미니게임을 통해 방송을 더 즐겁게 진행해 보세요!</p>
      <ul className="mini_game_list">
        {/* map 돌리자.. */}
        {miniGameList !== null &&
          miniGameList.map((v, i) => {
            return (
              <li key={i} className="mini_game_item" onClick={() => miniGameHandler(v.gameNo)}>
                <div className="thumb_box">
                  <img src={v.gameImg} alt="썸네일" />
                </div>
                <p className="content">{v.gameDesc}</p>
              </li>
            );
          })}
        {/* <li className="mini_game_item">
          <div className="thumb_box"></div>
          <p className="content">COMING SOON</p>
        </li> */}
      </ul>
    </div>
  );
};
