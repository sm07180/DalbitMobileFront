import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
// constant
import { tabType } from "../../constant";
// Api
import { getProfile, postGiftDal } from "common/api";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxRightTabType} from "../../../../redux/actions/broadcastCtx";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";

let preventClick = false;

export default function GiftDal(props: { common: any; profile: any }) {
  const { profile, common } = props;
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { userMemNo, userNickNm } = broadcastState;
  const history = useHistory();
  const { splashData } = globalState;
  // state
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
      setDal(common.giftDal[param]);
      setText("");
    }
  };

  const GiftSend = () => {
    if (preventClick === true) {
      return true;
    }
    let dalcount;
    if (dal != 0) {
      dalcount = dal;
    } else {
      dalcount = text;
    }
    async function SendDal() {
      preventClick = true;
      if (dal >= common.giftDalMin) {
        const { result, message } = await postGiftDal({
          memNo: userMemNo,
          dal: dal,
        });
        if (result === "success") {
          dispatch(setGlobalCtxSetToastStatus({
            status: true,
            message: message,
          }));

          fetchData();
          setText("");
        } else if (result === "fail") {
          dispatch(setGlobalCtxSetToastStatus({
            status: true,
            message: message,
          }));
        }
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: `직접입력 선물은 최소 ${common.giftDalMin}달 부터 선물이 가능합니다.`,
          callback: () => {},
        }));
      }

      preventClick = false;
    }
    SendDal();
  };

  //-------------------------------------------------
  async function fetchData() {
    const { result, data } = await getProfile({
      memNo: profile.memNo,
    });
    if (result === "success") {
      setMyDal(data.dalCnt);
    }
  }
  //-------------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <h3
        className="tabTitle tabTitle__back"
        onClick={() => {
          dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
        }}
      >
        선물
      </h3>
      <div className="giftBox">
        <p className="giftBox__subTitle">
          <span className="nickNm">{userNickNm}</span> 님에게 <br />
          달을 선물하시겠습니까?
        </p>
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
          {common.giftDal.map((item: number, index: number) => {
            return (
              <button
                key={`dal-${index}`}
                onClick={() => _active(index)}
                className={item === dal ? "btn__price btn__price--active" : "btn__price"}
              >
                {item.toLocaleString()}
              </button>
            );
          })}
        </div>
        {splashData?.giftDalDirect && (
          <input
            type="number"
            className="input__text"
            value={text}
            onChange={handleChangeInput}
            onClick={() => _active("input")}
            maxLength={10}
            placeholder={`달은 ${common.giftDalMin}개부터 선물할 수 있습니다.`}
          />
        )}
        <p className="giftBox__warnnigMsg">* 달 선물하기는 100% 전달됩니다.</p>
        <div className="btnWrap">
          <button className="btn btn_cancel" onClick={() => dispatch(setBroadcastCtxRightTabType(tabType.PROFILE))}>
            취소
          </button>

          {dal <= 9 ? (
            <button onClick={() => GiftSend()} className="btn btn_ok isDisable">
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
  );
}
