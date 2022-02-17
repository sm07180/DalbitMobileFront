/**
 * @brief : mailbox/chatting - gift_pop.tsx
 * @role : 우체통 선물하기 팝업 ui / 기능
 */
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// component
import { DalbitScroll } from "common/ui/dalbit_scroll";
import {useDispatch, useSelector} from "react-redux";
import {setMailBoxGiftItemInfo} from "../../../../../redux/actions/mailBox";
import {setGlobalCtxAlertStatus} from "../../../../../redux/actions/globalCtx";
// global var
let selectObj = {};
export default function giftPop({ setGiftPop, giftPop, sendGift }) {
  // ctx
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const { splashData } = globalState;
  const history = useHistory();
  // profileInfo
  const profile: any = globalState.userProfile;
  // state
  const [item, setItem] = useState(-1);
  const [count, setCount] = useState<number>(1);
  const [giftList, setGiftList] = useState<any>([]);
  const [giftCategoryItem, setGiftCategoryItem] = useState<any>([]);
  const [giftCategoryType, setGiftCategoryType] = useState("normal");
  const [filterCategory, setFilterCategory] = useState([]);
  const [addDataObj, setAddDataObj] = useState({});
  // function ------------------------------------------------------------------
  const giftInitialize = () => {
    setCount(1);
    setItem(-1);
  };
  // 창닫기
  const closePopup = () => {
    setGiftPop(false);
    giftInitialize();
  };
  // 레이어딤 제거 처리
  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
      giftInitialize();
    }
  };
  // 아이템 선택하기
  const selectItem = (idx: number, itemNo: string, selectItem) => {
    dispatch(setMailBoxGiftItemInfo(null));
    selectObj = selectItem;
    if (item != idx) {
      setItem(idx);
      setCount(1);
    } else if (item === idx) {
      if (selectItem.type === "sticker") {
        if (count >= 10) {
          if (count >= 100) {
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              type: "alert",
              content: "콤보 선물은 최대 100개까지 가능합니다.",
              callback: () => {},
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
            callback: () => {},
          }));
        }
        if (count + 1 == 11) return false;
        setCount(count + 1);
      }
    }
    setAddDataObj({
      addData1: selectItem.itemNo,
      addData2: count,
      addData3: selectItem.type,
    });
  };
  // 셀렉트 아이템 랩핑
  const giftAction = (idx: number, itemNo: string, value) => {
    selectItem(idx, itemNo, value);
  };
  // 선물 보내기
  const sendEmit = () => {
    sendGift("선물보냈다", 3, {
      ...addDataObj,
      addData2: count,
    });
    closePopup();
    setCount(1);
    setItem(-1);
  };
  //초기 데이터 세팅
  useEffect(() => {
    if (splashData) {
      setGiftCategoryItem(splashData.itemCategories);
      setGiftList(splashData.items);
    }
  }, []);
  // 카테고리 필터링
  useEffect(() => {
    const filterList = giftList.filter((giftItem) => {
      if (giftItem.category === giftCategoryType) {
        return giftItem;
      }
    });
    setFilterCategory(filterList);
    setItem(-1);
  }, [giftList, giftCategoryType]);
  // -------------------------------------------------------------------
  return (
    <>
      {giftPop && (
        <div id="layerPopup" className="giftPopWrap" onClick={closePopupDim}>
          <div className="layerContainer">
            <div className="layerContent">
              <div className="myDalBox">
                <div className="myDalBoxItem">
                  {profile.dalCnt.toLocaleString()}
                  <button onClick={() => history.push(`/store`)}>
                    <img src="https://image.dalbitlive.com/mailbox/ico_charge.svg" alt="충전" />
                  </button>
                </div>
                <div className="myDalBoxItem">
                  {profile.byeolCnt.toLocaleString()}
                  <button onClick={() => history.push(`/dal_exchange`)}>
                    <img src="https://image.dalbitlive.com/mailbox/ico_exchange.svg" alt="교환" />
                  </button>
                </div>
              </div>
              <div className="giftCategory">
                {giftCategoryItem.map((tab, idx) => {
                  const { value, isNew, code } = tab;
                  return (
                    <button
                      key={`category-${idx}`}
                      className={`btn ${giftCategoryType === code ? "active" : ""}`}
                      onClick={() => setGiftCategoryType(code)}
                    >
                      {value}
                      {isNew && (
                        <span className="newIcon">
                          <img src="https://image.dalbitlive.com/mailbox/ico_new_item.svg" alt="New" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <DalbitScroll height={220}>
                <ul className="giftList">
                  {filterCategory &&
                    filterCategory.map((value, idx) => {
                      const { thumbs, itemNm, isNew, cost, itemNo, type, lottieUrl } = value;
                      if (type === "direct") return null;
                      return (
                        <li
                          key={idx}
                          onClick={() => giftAction(idx, itemNo, value)}
                          className={`giftItem ${idx === item ? "active" : ""}`}
                        >
                          <img src={thumbs} alt={itemNm} />
                          {isNew && (
                            <span className="newIcon">
                              <img src="https://image.dalbitlive.com/mailbox/ico_new_item.svg" alt="New" />
                            </span>
                          )}

                          <span className="price">
                            <img src="https://image.dalbitlive.com/mailbox/ico_moon_s.svg" alt="dal" /> {cost}
                          </span>
                          {count > 0 && <span className="clickCnt">{count}</span>}
                        </li>
                      );
                    })}
                </ul>
              </DalbitScroll>

              <div className="btnWrap">
                {/* <button className="btn">몰래 보내기</button> */}
                <button className="btn send" onClick={sendEmit}>
                  보내기
                </button>
              </div>
            </div>
            <button className="btnClose" onClick={closePopup}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
