// React
import React, { useEffect, useRef, useState, useContext } from "react";

// Api
import {getProfile, miniGameStart} from "common/api";

// Context
import { GlobalContext } from "context";
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// Static
import RouletteBack from "../../static/ic_roulette_back.svg";
import Roulette2 from "../../static/ic_roulette_2.svg";
import Roulette3 from "../../static/ic_roulette_3.svg";
import Roulette4 from "../../static/ic_roulette_4.svg";
import Roulette5 from "../../static/ic_roulette_5.svg";
import Roulette6 from "../../static/ic_roulette_6.svg";
import Roulette7 from "../../static/ic_roulette_7.svg";
import Roulette8 from "../../static/ic_roulette_8.svg";
import GoBtn from "../../static/ic_go_btn.svg";
import Arrow from "../../static/ic_arrow.svg";

import "./index.scss";
import {MiniGameType} from "pages/broadcast/constant";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxMiniGameResult} from "../../../../redux/actions/broadcastCtx";

const rouletteImgs = {
  2: Roulette2,
  3: Roulette3,
  4: Roulette4,
  5: Roulette5,
  6: Roulette6,
  7: Roulette7,
  8: Roulette8,
};

let rouletteStart = false;

export default (props: { roomOwner?: boolean }) => {
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);

  const { globalAction, globalState } = useContext(GlobalContext);

  const { miniGameInfo, miniGameResult } = broadcastState;

  const { optList } = miniGameInfo;

  const { dispatchDimLayer } = useContext(BroadcastLayerContext);

  const RouletteRef = useRef<HTMLImageElement>(null);

  const [winnerVisible, setWinnerVisible] = useState<boolean>(false);

  const miniGameStartHandler = () => {
    if (rouletteStart === false) {
      if (props.roomOwner === false) {
        globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            type: "confirm",
            title: "룰렛",
            content: `룰렛을 돌리시겠습니까?<br />룰렛에는 달 ${miniGameInfo.payAmt}개가 차감되며<br />차감된 달은 DJ에게 선물됩니다.`,
            callback: () => {
              fetchMiniGameStart();
            },
          });
      } else {
        fetchMiniGameStart();
      }
    } else {
      globalAction.callSetToastStatus &&
        globalAction.callSetToastStatus({
          status: true,
          message: "룰렛 진행 중에는 룰렛을 돌릴 수 없습니다.",
        });
    }
  };

  const fetchMiniGameStart = async () => {
    const { result, data, message } = await miniGameStart({
      roomNo: broadcastState.roomInfo?.roomNo,
      gameNo: MiniGameType.ROLUTTE,
      rouletteNo: Number(miniGameInfo.rouletteNo),
      versionIdx: Number(miniGameInfo.versionIdx),
    });

    if (result === "fail") {
      globalAction.callSetToastStatus &&
        globalAction.callSetToastStatus({
          status: true,
          message,
        });

      dispatchDimLayer({
        type: "INIT",
      });
    } else {
      if(!miniGameInfo.isFree) {
        // profile 업데이트
        const { result, data } = await getProfile({
          memNo: globalState.userProfile!.memNo,
        });
        if (result === "success") {
          if (globalAction.setUserProfile) {
            globalAction.setUserProfile(data);
          }
        }
      }

      rouletteStart = true;
    }
  };

  const calculateRotate = (data) => {
    rouletteStart = true;
    const { winNo, winOpt, nickName, optList } = data;
    let currentLength = 0;

    if (RouletteRef.current !== null) {
      let spininterval = (winNo - 1) * (360 / optList.length) + 3 * 1080;

      currentLength += spininterval;

      const duration = 5;

      setTimeout(() => {
        RouletteRef.current?.setAttribute("style", `transform: rotate(-${currentLength}deg)`);
      });

      setTimeout(() => {
        setWinnerVisible(true);
        setTimeout(() => {
          rouletteStart = false;
          dispatch(setBroadcastCtxMiniGameResult({
            ...miniGameResult,
            status: false,
            winOpt: "",
            winNo: 0,
            nickName: "",
            winListSelect: true, // 당첨내역 api 조회 여부
          }))
          dispatchDimLayer({
            type: "INIT",
          });
        }, 2000);
      }, duration * 1000);
    }
  };

  useEffect(() => {
    if (miniGameInfo.isFree && props.roomOwner === false) {
      globalAction.setAlertStatus &&
        globalAction.setAlertStatus({
          status: false,
        });

      dispatchDimLayer({
        type: "INIT",
      });
    }
  }, [miniGameInfo]);

  useEffect(() => {
    if (miniGameResult.status) {
      calculateRotate(miniGameResult);
    }
  }, [miniGameResult]);

  return (
    <div
      id="roulette_layer"
      onClick={(e) => {
        if (rouletteStart === true) {
          e.stopPropagation();
        }
      }}
    >
      {miniGameResult.status === true ? (
        <div
          className="roulette_wrap"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={`roulette spin spin_${miniGameResult.optList.length}`} ref={RouletteRef}>
            {miniGameResult.optList.map((v, i) => {
              return (
                <div key={i} style={{ transform: `rotate(${i * (360 / miniGameResult.optList.length)}deg)` }}>
                  <span>{v}</span>
                </div>
              );
            })}
            <img src={rouletteImgs[miniGameResult.optList.length]} alt="룰렛" />
          </div>
          <img src={Arrow} className="arrow" alt="화살표" />
          <button>
            <img
              src={GoBtn}
              className="go"
              alt="룰렛시작버튼"
              onClick={() => {
                miniGameStartHandler();
              }}
            />
          </button>
          {miniGameResult.winOpt && winnerVisible === true && (
            <div className="winning_wrap">
              <p>{miniGameResult.winOpt}</p>
              <span>당첨입니다!</span>
            </div>
          )}
        </div>
      ) : (
        miniGameInfo.status === true && (
          <div
            className="roulette_wrap"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={`roulette spin spin_${miniGameInfo.optList.length}`} ref={RouletteRef}>
              {miniGameInfo.optList.map((v, i) => {
                return (
                  <div key={i} style={{ transform: `rotate(${i * (360 / miniGameInfo.optList.length)}deg)` }}>
                    <span>{v}</span>
                  </div>
                );
              })}
              <img src={rouletteImgs[miniGameInfo.optList.length]} alt="룰렛" />
            </div>
            <img src={Arrow} className="arrow" alt="화살표" />
            <button>
              <img
                src={GoBtn}
                className="go"
                alt="룰렛시작버튼"
                onClick={() => {
                  miniGameStartHandler();
                }}
              />
            </button>
          </div>
        )
      )}
    </div>
  );
};
