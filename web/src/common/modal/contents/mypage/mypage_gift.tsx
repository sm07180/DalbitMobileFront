// tab navigation
// api
import { getProfile, postGiftDal, splash, postSendGift } from "common/api";
import { GlobalContext } from "context";

import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./mypage_modal.scss";
import {useSelector} from "react-redux";

export default (props) => {
  const modalState = useSelector(({modal}) => modal);
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  const { splashData } = globalState;

  const [giftInfo, setGiftInfo] = useState<any>([]);
  const [giftCount, setGiftCount] = useState<any>([]);
  const [dalMin, setDalMin] = useState<number>(0);

  const [dal, setDal] = useState<number>(0);
  const [mydal, setMyDal] = useState<number>(0);
  const [text, setText] = useState<any>("");
  const [point, setPoint] = useState<any>(0);
  const [active, setActive] = useState<boolean>(false);

  const handleChangeInput = (event) => {
    const { value, maxLength } = event.target;
    if (value.length > maxLength) {
      return false;
    }
    setDal(value);
    setText(value);
  };

  const _active = (param) => {
    // 달 수를 직접 입력 ( param : input ) , 20,50,100,500,1000 (param : 0,1,2,3,4)
    if (param === "input") {
      setPoint(-1);
      setActive(true);
      setDal(0);
    } else {
      setPoint(param);
      setActive(false);
      setDal(giftCount[param]);
      setText("");
    }
  };

  const GiftSend = () => {
    async function SendDal() {
      const { result, message } = await postGiftDal({
        memNo: modalState.mypageYourMem,
        dal: dal,
      });
      if (result === "success") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "선물이 성공적으로 발송되었습니다.",
          callback: () => history.goBack(),
        });
      } else if (result === "fail") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: message,
        });
      }
    }

    async function sendDirectDal(roomNo: string, memNo: string, itemNo: string, itemCnt: number) {
      const { result, message } = await postSendGift({
        roomNo,
        memNo,
        itemNo,
        itemCnt,
        isSecret: false,
      });
      if (result === "success") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "선물이 성공적으로 발송되었습니다.",
          callback: () => history.goBack(),
        });
      } else if (result === "fail") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: message,
        });
      }
    }

    if (modalState.mypageInfo) {
      if (modalState.mypageInfo.type === undefined && dal >= dalMin) {
        SendDal();
      } else if (modalState.mypageInfo.type === "broadcast") {
        const { roomNo, memNo, itemNo } = modalState.mypageInfo;
        sendDirectDal(roomNo, memNo, itemNo, dal);
      } else {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: `직접입력 선물은 최소 ${dalMin}달 부터 선물이 가능합니다.`,
          callback: () => {},
        });
      }
    }
  };

  useEffect(() => {
    // console.log(splashData);
    if (splashData) {
      setDalMin(splashData.giftDalMin);
      setGiftCount(splashData.giftDal);
    }
  }, [dalMin]);
  //-----------------------------------------------------
  useEffect(() => {
    if (modalState.mypageInfo) {
      setGiftInfo(modalState.mypageInfo);
    }
  }, []);
  //-------------------------------------------------------

  useEffect(() => {
    async function ProfileInfo() {
      const { result, data } = await getProfile({
        memNo: globalState.baseData.memNo,
      });
      if (result === "success") {
        setMyDal(data.dalCnt);
      }
    }

    ProfileInfo();
  }, [modalState.mypageChange]);

  return (
    <div className="fanlist-modal" onClick={(e) => e.stopPropagation()}>
      <button className="closeBtn" onClick={() => history.goBack()}></button>

      <div className="myModalWrap">
        {modalState.mypageInfo && (
          <div className="giftBox">
            <h4 className="myModalWrap__title">{modalState.mypageInfo.type === "broadcast" ? "직접 선물하기" : "선물하기"}</h4>

            <div className="giftBox__bg">
              {modalState.mypageInfo.type === undefined && (
                <div className="giftBox__subTitle">
                  <div className="giftBox__userMsg">
                    <b>{giftInfo.nickNm}</b>님에게
                  </div>
                  <div className="giftBox__userMsg">선물하시겠습니까?</div>
                </div>
              )}
              <div className="mydalBox">
                <span className="mydalBox__ptext">내가 보유한 달</span>
                <div className="mydalBox__dalWrap">
                  <span className="mydalBox__dalCnt">{mydal.toLocaleString()}</span>
                  <button className="mydalBox__chargeIcon" onClick={() => history.push(`/store`)}>
                    <span className="blind">충전하기</span>
                  </button>
                </div>
              </div>
              <div className="dalList">
                {giftCount.map((item, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => _active(index)}
                      className={item === dal ? "btn__price btn__price--active" : "btn__price"}
                    >
                      {item.toLocaleString()}
                    </button>
                  );
                })}
              </div>
              <input
                type="number"
                className="input__text"
                value={text}
                onChange={handleChangeInput}
                onClick={() => _active("input")}
                maxLength={10}
                placeholder={
                  modalState.mypageInfo.type === "broadcast"
                    ? "선물할 별 개수를 직접 입력하세요."
                    : "달은 10개부터 선물할 수 있습니다."
                }
              />
              <p className="giftBox__warnnigMsg">
                {modalState.mypageInfo.type === "broadcast"
                  ? "※ 직접 선물하기는 선물 시 별로 전달됩니다."
                  : "※ 달 선물하기는 100% 전달됩니다."}
              </p>
              <div className="dalSubmit">
                <button className="dalSubmit__btn" onClick={() => history.goBack()}>
                  취소
                </button>
                {modalState.mypageInfo.type === undefined ? (
                  <button
                    onClick={() => GiftSend()}
                    className={`dalSubmit__btn dalSubmit__btn${dal <= 9 ? "--none" : "--active"}`}
                  >
                    선물
                  </button>
                ) : (
                  <button onClick={() => GiftSend()} className="dalSubmit__btn dalSubmit__btn--active">
                    선물
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
