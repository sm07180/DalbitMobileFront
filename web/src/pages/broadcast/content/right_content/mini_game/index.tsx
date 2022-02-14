// React
import React, { useContext, useCallback, useEffect, useState } from "react";

// Api
// Api
import { getMiniGameList } from "common/api";

// Context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";

import "./index.scss";
import { tabType, MiniGameType } from "pages/broadcast/constant";

export default ({ roomNo }) => {
  const { globalAction } = useContext(GlobalContext);

  const { broadcastAction } = useContext(BroadcastContext);

  const [miniGameList, setMiniGameList] = useState<Array<{
    gameNo: number;
    gameDesc: string;
    gameImg: string;
    gameName: string;
  }> | null>(null);

  const miniGameHandler = useCallback((type: number) => {
    if (broadcastAction.setRightTabType) {
      switch (type) {
        case MiniGameType.ROLUTTE:
          broadcastAction.setRightTabType(tabType.ROULETTE);
          break;
      }
    }
  }, []);

  useEffect(() => {
    getMiniGameList({ roomNo }).then((resolve) => {
      const { result, data, message } = resolve;
      if (result === "success") {
        setMiniGameList(data.list);
      } else {
        globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            content: message,
          });
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
