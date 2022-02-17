import React, { useContext, useEffect, useState, useCallback } from "react";

import { useHistory } from "react-router-dom";
import { DalbitScroll } from "common/ui/dalbit_scroll";

import { ClipProvider, ClipContext } from "context/clip_ctx";

import { getProfile, postClipSendGift } from "common/api";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxClipInfoAdd,
  setGlobalCtxSetToastStatus, setGlobalCtxUserProfile
} from "../../../redux/actions/globalCtx";

let preventClick = false;

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { clipState, clipAction } = useContext(ClipContext);

  const { clipInfo, splashData } = globalState;

  const profile: any = globalState.userProfile;
  const history = useHistory();

  const [item, setItem] = useState(-1);
  const [itemNo, setItemNo] = useState<string>("");
  const [giftState, setGiftState] = useState<any>(false);
  const [state, setState] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [giftList, setGiftList] = useState<any>([]);
  const [giftCategoryItem, setGiftCategoryItem] = useState<any>([]);
  const [giftCategoryType, setGiftCategoryType] = useState("normal");
  const [filterCategory, setFilterCategory] = useState([]);
  const [byeolState, setByeolState] = useState(globalState.clipInfo?.byeolCnt);
  const [lottie, setLottie] = useState("");

  // 아이템 선택하기
  const selectItem = (idx: number, itemNo: string, selectItem) => {
    setLottie(selectItem);

    if (item != idx) {
      setItem(idx);
      setItemNo(itemNo);
      setCount(1);
    } else if (item === idx) {
      if (selectItem.type === "sticker") {
        if (count >= 10) {
          if (count >= 100) {
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              type: "alert",
              content: "콤보 선물은 최대 100개까지 가능합니다.",
              callback: () => {
                return;
              },
            }));
            return;
          }

          setCount(count + 10);
        } else {
          setCount(count + 1);
        }
      } else {
        if (count >= 10) {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            type: "alert",
            content: "콤보 선물은 최대 10개까지 가능합니다.",
            callback: () => {
              return;
            },
          }));
        }
        if (count + 1 == 11) return false;
        setCount(count + 1);
      }
    }
  };

  // 선물하기
  async function sendGift(count: number, itemNo: string, lottie: any) {
    if (preventClick === true) {
      return;
    }
    let params = {
      clipNo: globalState.clipInfo?.clipNo!,
      memNo: globalState.clipInfo?.clipMemNo!,
      itemCode: itemNo,
      itemCnt: count,
    };
    let alertMsg;
    if (itemNo < "0") {
      return alert("아이템을 선택해 주세요");
    } else {
      setItem(-1);

      alertMsg = `${globalState.clipInfo?.nickName} 님에게 선물을 보냈습니다.`;
    }
    preventClick = true;
    const res = await postClipSendGift(params);
    if (res.result === "success") {
      clipAction.setlottieUrl && clipAction.setlottieUrl!(lottie);
      dispatch(setGlobalCtxClipInfoAdd({ list: res.data.list }));
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: alertMsg,
      }));

      // profile 업데이트
      const { result, data } = await getProfile({
        memNo: profile.memNo,
      });
      if (result === "success") {
        dispatch(setGlobalCtxUserProfile(data));
        clipAction.setLottie &&
          clipAction.setLottie({
            ...lottie,
            ...{
              profImg: data.profImg.thumb120x120,
              nickName: data.nickNm,
              count: count,
              isCombo: lottie.category === "combo" ? true : count > 1 ? true : false,
            },
          });
      }

      setItem(-1);
      setGiftState(false);
      setItemNo("");
      setCount(0);

      preventClick = false;
      // 별 업데이트
      setByeolState(res.data.giftCnt);
      dispatch(setGlobalCtxClipInfoAdd({ byeolCnt: byeolState }));
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: res.message,
        callback: () => {
          return;
        },
      }));
    }
    setState(!state);
  }

  useEffect(() => {
    dispatch(setGlobalCtxClipInfoAdd({ byeolCnt: byeolState }));
  }, [byeolState]);

  useEffect(() => {
    if (splashData) {
      setGiftCategoryItem(splashData.itemCategories);
      setGiftList(splashData.items);
    }

    return () => {
      preventClick = false;
    };
  }, []);

  useEffect(() => {
    const filterList = giftList.filter((giftItem) => {
      if (giftItem.category === giftCategoryType) {
        return giftItem;
      }
    });

    setFilterCategory(filterList);
    setItem(-1);
  }, [giftList, giftCategoryType]);

  useEffect(() => {
    setGiftState({ itemNo: "", cnt: 1 });
  }, []);

  return (
    <div className="tabGiftGive">
      <h2 className="tabContent__title">선물하기</h2>

      <div className="giftWrap">
        <div className="giftInfo">
          <div className="myLelvel">
            <strong>LEVEL {profile.level}</strong>
            <span className="graph">
              <span className="fill" style={{ width: `${profile.expRate < 101 ? `${profile.expRate}` : "100"}%` }}>
                {profile.expRate}%
              </span>
            </span>
          </div>
          <div className="myDal">
            <div className="myAcount">
              <div className="myAcount__line">
                <p>{profile.dalCnt.toLocaleString()}</p>
                <button className="charge" onClick={() => history.push("/pay/store")}>
                  충전
                </button>
              </div>
              <div className="myAcount__line">
                <p>{profile.byeolCnt.toLocaleString()}</p>
                <button className="exchange" onClick={() => history.push("/dal_exchange")}>
                  교환
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="giftCategory">
          {giftCategoryItem.map((tab, idx) => {
            const { value, isNew, code } = tab;
            return (
              <div
                key={`category-${idx}`}
                className={`btn__category ${giftCategoryType === code ? " btn__category--active" : ""}`}
                onClick={() => setGiftCategoryType(code)}
              >
                {value}
                {isNew && <span className="ico__new">N</span>}
              </div>
            );
          })}
        </div>
        <DalbitScroll width={362}>
          <ul className="giftList">
            {filterCategory &&
              filterCategory.map((value, idx) => {
                const { thumbs, itemNm, isNew, cost, itemNo, type, lottieUrl } = value;
                if (type === "direct") return null;
                return (
                  <li
                    key={idx}
                    onClick={() => selectItem(idx, itemNo, value)}
                    className={`giftItem ${idx === item ? " giftItem--active" : ""}`}
                  >
                    <img src={thumbs} alt={itemNm} className="item" />
                    {isNew && <span className="ico__new">N</span>}

                    <span className="price price--dal">{cost}</span>
                    {count > 0 && <span className="clickCnt">{count}</span>}
                  </li>
                );
              })}
          </ul>
        </DalbitScroll>

        <div className="giftBtnBox">
          <button className="btn__send" onClick={() => sendGift(count, itemNo, lottie)}>
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};
