import React, { useState, useContext, useCallback } from "react";

import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

import DirectGiftImg from "./static/img_directgift.svg";
import MoonIcon from "./static/ic_moon_l.svg";

import "./index.scss";
import { postSendGift, getProfile } from "common/api";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxSetToastStatus,
  setGlobalCtxUserProfile
} from "../../../../redux/actions/globalCtx";

let preventClick = false;

// RoomNO, memNo, itemNo,

function DirectGiftLayer() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { userProfile } = globalState;

  const { dimLayer, dispatchDimLayer, dispatchLayer } = useContext(BroadcastLayerContext);

  const [giftDalCnt, setGiftDalCnt] = useState<string>("");

  const handleChange = (e: string) => {
    const num = e.split(",").join("");
    if (!isNaN(parseInt(num))) {
      setGiftDalCnt(Number(num).toLocaleString());
    } else {
      if (num === "") {
        setGiftDalCnt("");
      }
    }
  };

  const sendDal = useCallback(async () => {
    if (preventClick === true) {
      return;
    }

    const cnt: number = Number(giftDalCnt.split(",").join(""));

    preventClick = true;

    if ((userProfile && userProfile.dalCnt) >= cnt) {
      const { result, message } = await postSendGift({
        roomNo: dimLayer.others.roomNo,
        memNo: dimLayer.others.memNo,
        itemNo: dimLayer.others.itemNo,
        itemCnt: cnt,
        isSecret: false,
      });

      if (result === "success") {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "선물이 성공적으로 발송되었습니다.",
        }));

        const res = await getProfile({
          memNo: globalState.baseData.memNo,
        });

        if (res.result === "success") {
          dispatch(setGlobalCtxUserProfile(res.data));
        }
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: message,
        }))
      }

      dispatchLayer({
        type: "INIT",
      });

      dispatchDimLayer({
        type: "INIT",
      });
    }

    preventClick = false;
  }, [giftDalCnt, userProfile, dimLayer]);

  return (
    <div id="direct-gift-layer" onClick={(e) => e.stopPropagation()}>
      <button
        className="closeBtn"
        onClick={() => {
          dispatchDimLayer({
            type: "INIT",
          });
        }}
      ></button>
      <div className="layerWrap">
        <div className="layerWrap__header">
          <h4>직접 선물하기</h4>
        </div>
        <div className="layerWrap__imgWrap">
          <div>
            <img src={MoonIcon} />
            {userProfile && Number(userProfile.dalCnt).toLocaleString()}
          </div>
          <img src={DirectGiftImg} />
        </div>
        <input
          type="text"
          className="layerWrap__input"
          placeholder="선물 개수를 입력해주세요."
          value={giftDalCnt}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
        />
        <p className="layerWrap__caption">※ 개수에 따라 다른 애니메이션(4종)이 나타납니다.</p>
        <button
          className={`confirm ${(userProfile && userProfile.dalCnt) >= Number(giftDalCnt.split(",").join("")) && "on"}`}
          onClick={sendDal}
        >
          선물하기
        </button>
      </div>
    </div>
  );
}

export default DirectGiftLayer;
