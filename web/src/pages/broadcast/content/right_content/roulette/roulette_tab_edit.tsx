// React
import React, { useCallback, useEffect, useMemo, } from "react";

// Component
import DalbitCheckbox from "../../../../../common/ui/dalbit_checkbox";
import DalbitInput from "../../../../../common/ui/dalbit_input";
import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";

// Api
import {
  insertMiniGame,
  modifyMiniGame
} from "../../../../../common/api";

// Constant
import {MiniGameType, tabType, rouletteOptions} from "../../../constant";

// Static
import CloseIcon from "../../../static/ic_close_round_fill.svg";
import {setBroadcastCtxRightTabType} from "../../../../../redux/actions/broadcastCtx";

export default function RouletteTabEdit (props) {
  const { roomNo, globalAction, dispatch, broadcastState, isFree, setIsFree, price, setPrice,
    options, setOptions, toggleCaption, setToggleCaption, createAuto, setCreateAuto, setMiniGameInfo
  } = props;

  const inspection = useMemo(() => {
    if (isFree === false && price === "") {
      return {
        status: false,
        msg: "룰렛 금액을 설정해주세요.",
      };
    } else if (isFree === false && parseInt(price) > rouletteOptions.ROULETTE_MAX_DAL) {
      return {
        status: false,
        msg: `룰렛은 달 ${rouletteOptions.ROULETTE_MIN_DAL}개부터 최대 ${rouletteOptions.ROULETTE_MAX_DAL}개 까지 설정 가능합니다.`,
      };
    } else if (
      options.some((v) => {
        return v.trim() === "";
      })
    ) {
      return {
        status: false,
        msg: "아직 입력되지 않은 옵션이 있습니다.",
      };
    } else {
      return {
        status: true,
        msg: "",
      };
    }
  }, [options, price, isFree]);

  const optionsHandler = useCallback(
    (value, idx) => {
      options[idx] = value;
      setOptions([...options]);
    },
    [options]
  );

  const removeOptions = useCallback(
    (idx) => {
      setOptions(
        options.filter((v, i) => {
          if (i === idx) return false;
          else return true;
        })
      );
    },
    [options]
  );

  const addOptions = useCallback(() => {
    if (options.length < rouletteOptions.OPTION_MAX_SIZE) {
      setOptions([...options, ""]);
    }
  }, [options]);

  const checkInspection = useCallback(() => {
    if (inspection.status === false) {
      globalAction.callSetToastStatus &&
      globalAction.callSetToastStatus({
        status: true,
        message: inspection.msg,
      });
    } else {
      if (broadcastState.miniGameInfo.status === true) {
        modifyRoulette();
      } else {
        insertRoulette();
      }
    }
  }, [inspection, broadcastState.miniGameInfo, createAuto]);

  const insertRoulette = useCallback(async () => {
    const { result, data, message } = await insertMiniGame({
      roomNo,
      isFree,
      payAmt: price ? parseInt(price) : 0,
      optCnt: options.length,
      optList: options.join("|"),
      gameNo: MiniGameType.ROLUTTE,
      autoYn: createAuto ? 'y' : 'n',
    });

    if (result === "success") {
      setMiniGameInfo({
        status: true,
        gameNo: MiniGameType.ROLUTTE,
        ...data,
      });

      callToastMessage(message);

      changeRightTabListener();
    } else {
      globalAction.setAlertStatus &&
      globalAction.setAlertStatus({
        status: true,
        content: message,
      });
    }
  }, [isFree, options, price, createAuto]);

  const modifyRoulette = useCallback(async () => {
    const { result, data, message } = await modifyMiniGame({
      roomNo,
      isFree,
      payAmt: price ? parseInt(price) : 0,
      optCnt: options.length,
      optList: options.join("|"),
      gameNo: MiniGameType.ROLUTTE,
      autoYn: createAuto ? 'y' : 'n',
    });

    if (result === "success") {
      setMiniGameInfo({
        status: true,
        gameNo: MiniGameType.ROLUTTE,
        ...data,
      });

      // callToastMessage(message);

      changeRightTabListener();
    } else {
      globalAction.setAlertStatus &&
      globalAction.setAlertStatus({
        status: true,
        content: message,
      });
    }
  }, [isFree, options, price, createAuto]);

  const callToastMessage = useCallback((msg) => {
    globalAction.callSetToastStatus &&
    globalAction.callSetToastStatus({
      status: true,
      message: msg,
    });
  }, []);

  const changeRightTabListener = useCallback(() => {
    dispatch(setBroadcastCtxRightTabType(tabType.LISTENER));
  }, []);

  useEffect(() => {
    const captionHandler = () => {
      setToggleCaption(false);
    };

    window.addEventListener("click", captionHandler);

    return () => {
      window.removeEventListener("click", captionHandler);
    };
  }, []);

  return (
    <>
      <div className="notice_wrap">
        <p>* 룰렛 옵션은 최대 {rouletteOptions.OPTION_MAX_SIZE}개 까지 설정이 가능합니다.</p>
        <p>* DJ는 금액 설정과 상관없이 룰렛을 돌릴 수 있습니다.</p>
        <p>* 무료로 설정 시 청취자는 룰렛을 돌릴 수 없습니다.</p>
      </div>

      <div className="price_wrap">
        <div className="title">
          <span>룰렛 금액 설정</span>
          <button
            className="caption"
            onClick={(e) => {
              e.stopPropagation();
              setToggleCaption(!toggleCaption);
            }}
          >
            ?
          </button>
        </div>
        <div className="checkbox_wrap">
          <DalbitCheckbox
            status={isFree}
            size={20}
            callback={() => {
              setIsFree(true);
            }}
            label={{
              id: "free",
              position: "right",
              text: "무료",
            }}
          />
          <DalbitCheckbox
            status={!isFree}
            size={20}
            callback={() => {
              setPrice("");
              setIsFree(false);
            }}
            label={{
              id: "price",
              position: "right",
              text: "금액설정",
            }}
          />
        </div>
        {toggleCaption === true && <CaptionLayer setToggleCaption={setToggleCaption} />}
      </div>
      {isFree === false && (
        <DalbitInput
          name="number"
          value={price}
          placeHolder={`${rouletteOptions.ROULETTE_MIN_DAL} ~ ${rouletteOptions.ROULETTE_MAX_DAL} 달 까지 룰렛 금액을 입력해주세요.`}
          maxLength={4}
          onChange={setPrice}
        />
      )}

      <div className="option_wrap">
        <DalbitScroll height={500}>
          <>
            {options.map((v, i) => {
              return (
                <div key={i} className="option_item">
                  <p>
                    옵션 <span>{i + 1}</span>
                  </p>
                  <DalbitInput
                    value={v}
                    placeHolder={`최대 ${rouletteOptions.OPTION_LETTER_SIZE}자까지 입력 가능합니다.`}
                    maxLength={rouletteOptions.OPTION_LETTER_SIZE}
                    onChange={(value) => {
                      optionsHandler(value, i);
                    }}
                  />
                  {i > 1 && (
                    <button
                      onClick={() => {
                        removeOptions(i);
                      }}
                    >
                      삭제
                    </button>
                  )}
                </div>
              );
            })}
            <div className="autoCreate">
              <DalbitCheckbox
                status={createAuto}
                size={20}
                callback={() => {
                  setCreateAuto(!createAuto);
                }}
                label={{
                  id: "autoCreate",
                  position: "right",
                  text: "자동 생성",
                }}
              />
              <p className="autoCreateInfo">방송을 시작할 때 돌림판을 자동으로 생성합니다.</p>
            </div>
          </>
        </DalbitScroll>
      </div>
      <div className="btnWrap">
        <button className={`btn ${options.length >= rouletteOptions.OPTION_MAX_SIZE && "isDisable"} icon`} onClick={addOptions}>
          옵션 추가
        </button>
        <button className={`btn ${inspection.status === false && "isDisable"}`} onClick={checkInspection}>
          완료
        </button>
      </div>
    </>
  )
}

const CaptionLayer = ({ setToggleCaption }) => {
  return (
    <div
      className="caption_layer"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span>금액 설정 시 청취자는 설정한 개수의 달 선물 후 룰렛을 돌릴 수 있으며 DJ가 선물받은 달은 별로 적립됩니다.</span>
      <button className="close" onClick={(e) => setToggleCaption(false)}>
        <img src={CloseIcon} />
      </button>
    </div>
  )
};
