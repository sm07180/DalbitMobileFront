import React, { useState, useEffect, useContext, useReducer, useCallback } from "react";
// ctx
import { BroadcastContext } from "context/broadcast_ctx";
import { GlobalContext } from "context";
// Api
import { getBroadcastBoost, postBroadcastBoost, getProfile } from "common/api";
import { tabType } from "pages/broadcast/constant";

let preventClick = false;

function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT__Double":
      return state * 2;
    case "INCREMENT__Multifly2.5":
      return state * 2.5;
    case "DECREMENT__Divide":
      return state / 2;
    case "DECREMENT__Divide2.5":
      return state / 2.5;
    default:
      return state;
  }
}

export default function Profile(props: { roomNo: string; roomOwner: boolean; roomInfo: any }) {
  const { roomNo, roomOwner, roomInfo } = props;
  // ctx
  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  // state
  const [boostList, setBoostList] = useState<any>({});
  const [myTimer, setMyTimer] = useState<any>();
  const [timer, setTimer] = useState<string>("00:00");
  const [boostCount, dispatch] = useReducer(counterReducer, 1);

  let time = 0;
  let addFlag = false;
  let BcEndTime = 7200; //방송방 기본 시간 ( 2시간 -> 7200)

  //타이머 연장 기능 함수
  const addTimer = (sum: number) => {
    addFlag = true;
    BcEndTime += sum;
    time++;
  };

  // fetch data
  const fetchData = async function() {
    const res = await getBroadcastBoost({ roomNo: roomNo });
    if (res.result === "success") {
      setBoostList(res.data);
    } else {
      console.log("boost fetch error", res.code);
    }
  };

  const countFunction = (type: string) => {
    if (type === "decrementState") {
      if (boostCount > 1) {
        if (boostCount === 5) {
          dispatch({ type: "DECREMENT__Divide2.5" });
        } else {
          dispatch({ type: "DECREMENT__Divide" });
        }
      } else {
        return false;
      }
    } else if (type === "incrementState") {
      if (boostCount < 10) {
        if (boostCount === 2) {
          dispatch({ type: "INCREMENT__Multifly2.5" });
        } else {
          dispatch({ type: "INCREMENT__Double" });
        }
      } else {
        return false;
      }
    }
  };
  // dividing DJ & USER Viewr
  const dividedBoostCounter = useCallback(() => {
    if (boostList.boostItemCnt > 0 && roomOwner === true) {
      return <div className="boost__bjhave">무료 부스터 보유 수량 : {boostList.boostItemCnt}개</div>;
    } else {
      return (
        <div className="boost__nohave">
          <button
            onClick={() => countFunction("decrementState")}
            className={boostCount === 1 ? `boost__minusBtn notActive` : `boost__minusBtn`}
          />
          <span className="boost__countInfo">
            <em className="boost__cnt">{boostCount}개 : </em>
            <em className="boost__totalCnt">{boostCount * 20}</em>
          </span>
          <button
            onClick={() => countFunction("incrementState")}
            className={boostCount === 10 ? `boost__plusBtn notActive` : `boost__plusBtn`}
          />
        </div>
      );
    }
  }, [boostCount, boostList.boostItemCnt]);

  useEffect(() => {
    if (boostList.boostCnt > 0) {
      // console.log(boostList);
      // 남아있는 부스트 시간이 있으면 인터벌 시작
      const stop: any = clearInterval(myTimer);

      setMyTimer(stop);
      let myTime = boostList.boostTime;

      const interval = setInterval(() => {
        if (broadcastAction.setUseBoost) broadcastAction.setUseBoost(true);
        myTime -= 1;
        let m = Math.floor(myTime / 60) + ":" + ((myTime % 60).toString().length > 1 ? myTime % 60 : "0" + (myTime % 60)); // 받아온 값을 mm:ss 형태로 변경
        setTimer(m);
        if (myTime === 0) {
          clearInterval(interval); // 부스트 시간이 끝나면 stop
          if (broadcastAction.setUseBoost) broadcastAction.setUseBoost(false);
        }
        if (time >= BcEndTime) return;
      }, 1000);
      setMyTimer(interval);
    }
  }, [boostList]);

  // 부스트 사용하기
  const useBoost = (useItem: boolean) => {
    if (preventClick === true) {
      return;
    }

    let msg: string = "";
    let subCont: string = "";

    // if (window.localStorage.myDate === undefined) {
    if (useItem) {
      msg = `보유중인 부스터 아이템이 ${boostList.boostItemCnt}개 있습니다.\n부스터를 사용하시겠습니까?`;
      subCont =
        "* 방송방 좋아요 수치 30분간 +10\n* 부스터 아이템 보유 시 아이템 우선 차감\n* 부스터 아이템의 좋아요는 실시간 방송 순위에만 적용\n* 부스터 아이템은 본인이 개설한 방송에만 사용 가능";
    } else {
      msg = "부스터를 사용 하시겠습니까?";
      subCont = "* 1개당 달 20개 차감, DJ에게 별 10개 지급\n* 방송방 좋아요 수치 30분간 +10";
    }
    // } else {
    //   msg = "부스터를 사용 하시겠습니까?";
    // }
    async function fetchBoostData() {
      preventClick = true;
      const res = await postBroadcastBoost({
        roomNo: roomNo,
        itemNo: "U1447", // 부스트 사용 시 아이템 선택 없음 문의 필요
        itemCnt: boostCount,
        isItemUse: useItem,
        memNo: roomInfo.bjMemNo
      });
      if (res.result === "success") {
        if (broadcastAction.setUseBoost) broadcastAction.setUseBoost(true);
        const stop = clearInterval(myTimer);
        // localStorage.setItem("myDate", JSON.stringify(new Date()));
        setMyTimer(stop);
        addTimer(1800); //부스터 사용 ( 30분 연장 )
        fetchData(); // 부스트 사용 후 다시 조회

        globalAction.callSetToastStatus && globalAction.callSetToastStatus({ status: true, message: "부스터가 사용되었습니다" });

        const { result, data } = await getProfile({ memNo: globalState.baseData.memNo });
        if (result === "success") {
          globalAction.setUserProfile!(data);
        }
      } else {
        globalAction.setAlertStatus &&
          globalAction.setAlertStatus({
            status: true,
            type: "alert",
            content: res.message,
            callback: () => {
              return;
            },
          });
      }
      preventClick = false;
    }
    fetchBoostData();
    // if (globalAction.setAlertStatus) {
    //   globalAction.setAlertStatus({
    //     status: true,
    //     type: "confirm",
    //     title: useItem ? "부스터 아이템 사용" : "부스터 사용",
    //     titleStyle: {
    //       paddingBottom: "10px",
    //       borderBottom: "1px solid #e0e0e0",
    //     },
    //     content: msg,
    //     subcont: subCont,
    //     subcontStyle: {
    //       color: "red",
    //       lineHeight: "16px",
    //       margin: "10px 0 0 0",
    //       wordBreak: "break-all",
    //       fontSize: "11px",
    //       whiteSpace: "pre-wrap",
    //     },
    //     confirmText: "사용",
    //     callback: async () => {
    //       preventClick = true;
    //       const res = await postBroadcastBoost({
    //         roomNo: roomNo,
    //         itemNo: "U1447", // 부스트 사용 시 아이템 선택 없음 문의 필요
    //         itemCnt: boostCount,
    //         isItemUse: useItem,
    //       });
    //       if (res.result === "success") {
    //         if (broadcastAction.setUseBoost) broadcastAction.setUseBoost(true);
    //         const stop = clearInterval(myTimer);
    //         // localStorage.setItem("myDate", JSON.stringify(new Date()));
    //         setMyTimer(stop);
    //         addTimer(1800); //부스터 사용 ( 30분 연장 )
    //         fetchData(); // 부스트 사용 후 다시 조회

    //         globalAction.callSetToastStatus &&
    //           globalAction.callSetToastStatus({ status: true, message: "부스터가 사용되었습니다" });

    //         const { result, data } = await getProfile({ memNo: globalState.baseData.memNo });
    //         if (result === "success") {
    //           globalAction.setUserProfile!(data);
    //         }
    //       } else {
    //         globalAction.setAlertStatus &&
    //           globalAction.setAlertStatus({
    //             status: true,
    //             type: "alert",
    //             content: res.message,
    //             callback: () => {
    //               return;
    //             },
    //           });
    //       }
    //       preventClick = false;
    //     },
    //   });
    // }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h3 className="tabTitle">
        현재 방송방 순위
        <button
          className="tabTitle__back"
          onClick={() => {
            broadcastAction.setRightTabType!(tabType.LISTENER);
          }}
        ></button>
      </h3>
      <div className="boostWrap">
        <div className="rank">
          <em>{boostList.rank}</em>/{boostList.roomCnt}
        </div>
        <div className="img">
          {boostList.boostCnt > 0 ? (
            <>
              <img src="https://image.dalbitlive.com/images/api/img_boost_on@2x.png" />
              <div className="status status--active">
                {boostList.boostCnt}개 사용중 | {timer}
              </div>
            </>
          ) : (
            <>
              <img src="https://image.dalbitlive.com/images/api/img_boost_off@2x.png" />
              <div className="status">30:00</div>
            </>
          )}
        </div>
        <div className="boost">
          <div className="boost__desc">
            <p>부스터 사용시,</p>
            <p>방송방 순위를 1.5배 더 빠르게 올릴수 있습니다.</p>
            <p className="alert">30분 동안 인기도(좋아요) +10상승</p>
            <p className="alert">1개당 DJ에게 별10개 지급</p>
            {dividedBoostCounter()}
          </div>

          {boostList.boostItemCnt > 0 && roomOwner === true ? (
            <button
              className="btn__boost item"
              onClick={() => {
                useBoost(true);
              }}
            >
              무료 부스터 사용
            </button>
          ) : (
            <button
              className="btn__boost"
              onClick={() => {
                useBoost(false);
              }}
            >
              부스터 사용
              {/* (<span className="ico"></span>x {boostList.boostPrice}) */}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
