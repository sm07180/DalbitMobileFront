import React, { useContext, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getChargeItem, postChargeItem, postDalAutoExchange, getDalAutoExchange } from "common/api";
import "./index.scss";

import Popup from "./popup";

import ic_guide from "../static/guide_s.svg";
import ic_toggle_off from "../static/toggle_off_s.svg";
import ic_toggle_on from "../static/toggle_on_s.svg";
import ic_close from "../static/ic_close_round_g.svg";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxSetToastStatus,
  setGlobalCtxUserProfile
} from "../../../../../redux/actions/globalCtx";

export default function DalExchange() {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [userProfile, setUserProfile] = useState(globalState.userProfile);
  const [list, setList] = useState<Array<any>>([]);
  const [selected, setSelected] = useState({
    num: -1,
    dal: 0,
    byeol: 0,
    itemCode: -1,
  });
  const [autoState, setAutoState] = useState(0);
  const [popState, setPopState] = useState(1);
  const [popup, setPopup] = useState(0);

  // console.log(userProfile);

  const chargeClick = () => {
    async function postChange() {
      const res = await postChargeItem({
        itemCode: selected.itemCode,
      });
      // console.log(res);
      if (res.result === "success") {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: res.message,
        }));
        dispatch(setGlobalCtxUserProfile({ ...globalState.userProfile, ...{ byeolCnt: res.data.byeolCnt } }));
        setUserProfile({ ...globalState.userProfile, ...{ byeolCnt: res.data.byeolCnt } });
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: res.message,
          callback: () => {
            window.location.href = `/mypage/${userProfile && userProfile.memNo}/wallet`;
          },
        }));
      }
    }
    dispatch(setGlobalCtxAlertStatus({
      status: true,
      type: "confirm",
      content: `별 ${selected.byeol}을 달 ${selected.dal}으로 \n 교환하시겠습니까?`,
      callback: () => {
        postChange();
      },
    }));
  };

  const toggleHandler = useCallback(async () => {
    const { result, data } = await postDalAutoExchange({
      autoChange: !autoState,
    });
    if (result === "success") {
      setAutoState(data.autoChange);
      if (data.autoChange === 0) {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "자동교환을 설정(OFF) 하였습니다",
        }));
      } else {
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "자동교환을 설정(ON) 하였습니다",
        }));
      }
    }
  }, [autoState]);

  useEffect(() => {
    async function getCharge() {
      const res = await getChargeItem();

      // console.log(res);

      if (res.result === "success") {
        setList(res.data.list);
      }
    }
    getCharge();
    const checkAutoState = async () => {
      const { result, data } = await getDalAutoExchange();
      if (result === "success") {
        setAutoState(data.autoChange);
        setPopState(data.autoChange);
      }
    };
    checkAutoState();

    if (userProfile === null) {
      history.goBack();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (popState === 0) {
        setPopState(1);
      }
    }, 8000);
  }, [popState]);

  useEffect(() => {
    if (globalState.userProfile !== null) {
      setUserProfile(globalState.userProfile);
    }
  }, [globalState.userProfile]);

  return (
    <div className="exchange-modal">
      <button className="closeBtn" onClick={() => history.goBack()} />
      <div className="dalExchangeWrap">
        <div className="" onClick={(e) => e.stopPropagation()}>
          <div className="dalExchangeWrap__header">
            <h1>달 교환하기</h1>
          </div>
          <div className="dalExchangeWrap__byeol">
            <div className="dalExchangeWrap__byeol--icon"></div>
            <div>보유 별 {userProfile && userProfile.byeolCnt.toLocaleString()}</div>
          </div>
          <br />
          {/* <div className="auto-exchange">
            <p>별 → 달 자동 교환</p>
            <button className="guide" onClick={() => setPopup(1)}>
              <img src={ic_guide} alt="가이드" />
            </button>
            <button className="toggle" onClick={toggleHandler}>
              {autoState ? <img src={ic_toggle_on} alt="활성화" /> : <img src={ic_toggle_off} alt="비활성화" />}
            </button>

            <div className={`auto-exchange-pop ${popState === 0 ? "on" : "off"}`}>
              <p>
                자동교환 설정을 ON 하시면 <br /> 편리하게 교환할 수 있어요!
              </p>
              <button
                className="close"
                onClick={() => {
                  setPopState(1);
                }}
              >
                <img src={ic_close} alt="닫기" />
              </button>
            </div>
          </div> */}

          <div className="dalExchangeWrap__list">
            {list.length > 0 &&
              list.map((v, index) => {
                return (
                  <div
                    className={`wrap ${selected.num === index && "on"}`}
                    key={index}
                    onClick={() => {
                      if (selected.num === index) {
                        setSelected({
                          ...selected,
                          num: -1,
                        });
                      } else {
                        setSelected({
                          num: index,
                          dal: v.dalCnt,
                          byeol: v.byeolCnt,
                          itemCode: v.itemCode,
                        });
                      }
                    }}
                  >
                    <div className="item-wrap">
                      <img src={v.itemThumbnail}></img>
                      <p>달 {v.dalCnt}</p>
                    </div>
                    <p className="item-name">{v.byeolCnt.toLocaleString()}별</p>
                  </div>
                );
              })}
          </div>

          <div className="info-wrap">
            <h5>달 교환 안내</h5>
            {/* <p className="red">별 → 달 교환 시 1달당 1exp를 획득할 수 있습니다.</p>
            <p>별 → 달 교환 및 교환 달로 선물하기가 가능합니다.</p> */}
            <p>달교환은 최소 200별 이상부터 가능합니다.</p>
            <p>별을 달로 교환할 경우 교환달로 아이템 선물이 가능합니다.</p>
            <p>별을 달로 교환할 경우 1exp를 획득할 수 있습니다.</p>
          </div>

          <button onClick={chargeClick} className="dalExchangeWrap__btn" disabled={selected.num == -1 ? true : false}>
            교환하기
          </button>

          {popup === 1 && <Popup setPopup={setPopup} />}
        </div>
      </div>
    </div>
  );
}
