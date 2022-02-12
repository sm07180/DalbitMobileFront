import React, { useState, useEffect, useContext } from "react";

import { getProfile, postGiftDal, splash, postSendGift } from "common/api";
import { GlobalContext } from "context";
import { ClipProvider, ClipContext } from "context/clip_ctx";
import { useHistory } from "react-router-dom";
import {useSelector} from "react-redux";

export default function GiftDal(props) {
  const { setPopupState, clipProfile } = props;
  const modalState = useSelector(({modal}) => modal);
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  const { splashData } = globalState;
  const { clipState, clipAction } = useContext(ClipContext);

  const [giftInfo, setGiftInfo] = useState<any>([]);
  const [giftCount, setGiftCount] = useState<any>([]);
  const [dalMin, setDalMin] = useState<number>(0);
  const [dal, setDal] = useState<number>(0);
  const [mydal, setMyDal] = useState<number>(0);
  const [text, setText] = useState<any>("");
  const [point, setPoint] = useState<any>(0);
  const [active, setActive] = useState<boolean>(false);

  const closePopup = () => {
    setPopupState(false);
  };
  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };

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

  console.log(clipProfile);

  const GiftSend = () => {
    async function SendDal() {
      const { result, message } = await postGiftDal({
        memNo: clipProfile.memNo,
        dal: dal,
      });
      if (result === "success") {
        globalAction.setAlertStatus!({
          status: true,
          type: "alert",
          content: "선물이 성공적으로 발송되었습니다.",
          callback: () => setPopupState(false),
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
          callback: () => setPopupState(false),
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
    if (clipProfile) {
      setGiftInfo(clipProfile);
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
  }, [clipProfile.memNo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer isGray">
        <h3>선물하기</h3>
        <div className="layerContent giftBoxWrap">
          {modalState.mypageInfo && (
            <>
              <p className="topBox">
                <strong>{clipProfile.nickNm}</strong>님에게
                <br />
                선물하시겠습니까?
              </p>

              <div className="dalBox">
                <dl>
                  <dt>내가 보유한 달</dt>
                  <dd>
                    {mydal.toLocaleString()}{" "}
                    <button className="chargeIcon" onClick={() => history.push(`/store`)}>
                      <span className="blind">충전하기</span>
                    </button>
                  </dd>
                </dl>

                <div className="dalList">
                  {giftCount.map((item, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => _active(index)}
                        className={item === dal ? "dalList__btn active" : "dalList__btn"}
                      >
                        {item.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
                {splashData?.giftDalDirect && (
                  <input
                    type="number"
                    className="dalList__input"
                    value={text}
                    onChange={handleChangeInput}
                    onClick={() => _active("input")}
                    maxLength={10}
                    placeholder={
                      modalState.mypageInfo.type === "broadcast"
                        ? `선물할 별 개수를 직접 입력하세요.`
                        : `달은 ${dalMin}개부터 선물할 수 있습니다.`
                    }
                  />
                )}
                <p className="giftBox__warnnigMsg">
                  {modalState.mypageInfo.type === "broadcast"
                    ? "※ 직접 선물하기는 선물 시 별로 전달됩니다."
                    : "※ 달 선물하기는 100% 전달됩니다."}
                </p>
                <div className="btnWrap">
                  <button className="btn btn_cancel">취소</button>
                  {modalState.mypageInfo.type === undefined ? (
                    <button onClick={() => GiftSend()} className={`btn btn_ok ${dal <= 9 ? "isDisable" : ""}`}>
                      선물
                    </button>
                  ) : (
                    <button onClick={() => GiftSend()} className="btn btn_ok">
                      선물
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          {/* <div className="btnWrap">
            <button className="btn btn_cancel" >취소</button>
            <button className="btn btn_ok">확인</button>
          </div> */}
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
}
