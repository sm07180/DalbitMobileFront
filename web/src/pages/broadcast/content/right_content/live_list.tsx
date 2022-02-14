import React, {
  useEffect,
  useState,
  useReducer,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useHistory } from "react-router-dom";
import { RoomTypeConvertToText } from "pages/main/content/common_fn";
import { printNumber } from "lib/common_fn";

// ctx
import { GlobalContext } from "context";
// api
import { broadcastList, broadcastExit } from "common/api";

// component
import SelectBox from "common/ui/dalbit_selectbox";
import { DalbitScroll } from "common/ui/dalbit_scroll";
import NoResult from "common/ui/no_result";
import {rtcSessionClear} from "../../../../common/realtime/rtc_socket";

type ActionType = {
  type: string;
  idx?: number;
  val?: any;
};

type OrderType = {
  isOpen: boolean;
  selectIdx: any;
  boxList: Array<{ text: string; value: any }>;
};

const selectReducer = (state: OrderType, action: ActionType) => {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: action.val,
      };

    case "select":
      return {
        ...state,
        selectIdx: action.idx || 0,
        isOpen: false,
      };

    case "init":
      return {
        ...state,
        boxList: action.val || [],
      };
    default:
      throw new Error();
  }
};

const linkInit = {
  isOpen: false,
  selectIdx: 0,
  boxList: [
    { value: 1, text: "추천" },
    { value: 2, text: "좋아요" },
    { value: 3, text: "청취자" },
  ],
};

const categoryInit = {
  isOpen: false,
  selectIdx: 0,
  boxList: [{ value: "", text: "전체" }],
};

export default function LiveList(props: {
  common: any;
  roomOwner: boolean;
  roomNo: string;
}) {
  const { common, roomOwner, roomNo } = props;
  // ctx
  const { globalState, globalAction } = useContext(GlobalContext);
  const { chatInfo, rtcInfo } = globalState;
  const isLogin: boolean = useMemo(() => {
    return globalState.baseData.isLogin;
  }, [globalState.baseData.isLogin]);

  const history = useHistory();
  // state
  const [linkState, linkDispatch] = useReducer(selectReducer, linkInit);
  const [categoryState, categoryDispatch] = useReducer(
    selectReducer,
    categoryInit
  );
  const [liveList, setLiveList] = useState<Array<any>>([]);

  async function fetchData(type?: string) {
    let searchType, roomType;
    if (type === "init") {
      searchType = linkInit.boxList[0].value;
      roomType = categoryInit.boxList[0].value;
      linkDispatch({ type: "select", idx: 0 });
      categoryDispatch({ type: "select", idx: 0 });
    } else {
      searchType = linkState.boxList[linkState.selectIdx].value;
      roomType = categoryState.boxList[categoryState.selectIdx].value;
    }
    setLiveList([]);

    const { result, data } = await broadcastList({
      searchType: searchType,
      roomType: roomType,
      page: 1,
      records: 100,
    });
    if (result === "success") {
      const { list } = data;
      setLiveList(list);
    }
  }

  const outBroadcast = (targetRoomNo: string) => {
    if (roomNo === targetRoomNo) {
      return;
    }

    const alertMsg = (() => {
      if (roomOwner === true) {
        return "현재 방송중 입니다. \n 방송을 종료 하시겠습니까?";
      } else {
        return "방송을 정말 나가시겠습니까?.";
      }
    })();

    if (globalAction.setAlertStatus) {
      globalAction.setAlertStatus({
        status: true,
        type: "confirm",
        title: "알림",
        content: alertMsg,
        callback: async () => {
          const { result } = await broadcastExit({ roomNo });
          if (result === "success") {
            if (chatInfo !== null && rtcInfo !== null) {
              chatInfo.privateChannelDisconnect();
              //chatInfo.destroy({ isdestroySocket: false, destroyChannelName: targetRoomNo });
              rtcInfo.socketDisconnect();
              rtcInfo.stop();
              globalAction.dispatchRtcInfo &&
                globalAction.dispatchRtcInfo({ type: "empty" });
              rtcSessionClear();
            }
            window.location.href = `/broadcast/${targetRoomNo}`;
          }
        },
      });
    }
  };

  useEffect(() => {
    const initCategoryList = () => {
      if (common.roomType) {
        const categoryList = common.roomType.map((v: any) => {
          return {
            text: v.cdNm,
            value: v.cd,
          };
        });
        categoryList.unshift({
          value: "",
          text: "전체",
        });
        categoryDispatch({ type: "init", val: categoryList });
      }
    };
    initCategoryList();
    // fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [linkState.selectIdx, categoryState.selectIdx]);

  return (
    <>
      <h3 className="blind">라이브</h3>
      <div className="liveWrap">
        <div className="sortBox">
          <button className="btn__reload" onClick={() => fetchData("init")}>
            새로고침
          </button>
          <div
            className="selectBox"
            onClick={(e) => {
              e.stopPropagation();
              categoryDispatch({ type: "open", val: false });
            }}
          >
            <SelectBox state={linkState} dispatch={linkDispatch} />
          </div>
          {/* <div
            className="selectBox"
            onClick={(e) => {
              e.stopPropagation();
              linkDispatch({ type: "open", val: false });
            }}
          >
            <SelectBox state={categoryState} dispatch={categoryDispatch} />
          </div> */}
        </div>
        <DalbitScroll width={345}>
          {liveList && liveList.length > 0 ? (
            <ul className="liveList">
              {liveList.map((value, idx) => {
                const {
                  roomNo,
                  bgImg,
                  bjProfImg,
                  badgeSpecial,
                  isNew,
                  roomType,
                  title,
                  bjNickNm,
                  entryCnt,
                  boostCnt,
                  likeCnt,
                  giftCnt,
                  totalCnt,
                  gstProfImg,
                } = value;

                return (
                  <li
                    className="liveItem"
                    key={`list-${idx}`}
                    onClick={() => {
                      outBroadcast(roomNo);
                    }}
                  >
                    <span className="thumb">
                      <img
                        src={bjProfImg.thumb190x190}
                        className="thumb_dj"
                        alt={bjNickNm}
                      />
                      {badgeSpecial > 0 && badgeSpecial === 1 ? (
                        <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                      ) : badgeSpecial === 2 ? (
                        <em className="icon_wrap icon_bestdj">베스트DJ</em>
                      ) : (
                        <></>
                      )}
                      {isNew && (
                        <span className="icon_wrap icon_newdj">신입DJ</span>
                      )}
                      {gstProfImg.thumb62x62 && (
                        <span className="thumb_guest">
                          <img src={gstProfImg.thumb62x62} alt="게스트" />
                        </span>
                      )}
                    </span>
                    <div className="info">
                      {/* <em className="type">
                        <RoomTypeConvertToText roomType={roomType} />
                      </em> */}
                      <span className="title">{title}</span>
                      <span className="nickName">{bjNickNm}</span>
                      <div className="cnt">
                        <span className="cnt_people">
                          {printNumber(totalCnt)}
                        </span>
                        <span className="cnt_now">{printNumber(entryCnt)}</span>
                        <span
                          className={boostCnt > 0 ? `cnt_boost` : `cnt_likes`}
                        >
                          {printNumber(likeCnt)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <NoResult text="진행중인 방송이 없습니다." />
          )}
        </DalbitScroll>
      </div>
    </>
  );
}
