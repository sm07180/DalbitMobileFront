import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef
} from "react";
import { useHistory } from "react-router-dom";

// api
import {getProfile, getTTSActorList, postSendGift} from "common/api";
// component
import { DalbitScroll } from "common/ui/dalbit_scroll";

// ctx
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";
import { GuestContext } from "context/guest_ctx";

import SoundIcon from "../../static/ic_sound_badge.svg";
import {ttsActorCookieNaming, ttsContentMaxLength} from "constant";
import UseInput from '../../../../common/useInput/useInput';
import {getCookie, setCookie} from "../../../../common/utility/cookie";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxTtsActorInfo} from "../../../../redux/actions/broadcastCtx";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxSetToastStatus,
  setGlobalCtxUserProfile
} from "../../../../redux/actions/globalCtx";

let preventClick = false;
let giftListScroll = {active: false, itemNo: '',}; // giftList effect

type inputTTSStateType = {
  showInputField: boolean;
  actorId: string;
}

export default function SendGift(props: {
  roomInfo: any;
  roomNo: string;
  roomOwner: boolean | null;
}) {
  const { roomInfo, roomNo, roomOwner } = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);
  const { splash, chatInfo } = globalState;

  // settingObj : 유저방송 설정 ( ttsSound, normalSound : 아이템 사용여부 send_gift.tsx 에서는 2개만 사용중)
  const {settingObj} = broadcastState;

  const { layer, dispatchLayer, dispatchDimLayer } = useContext(BroadcastLayerContext);

  const { guestState } = useContext(GuestContext);
  const { guestConnectStatus, guestObj } = guestState;

  // 선물 팝업 스크롤 처리용도
  const itemListRef = useRef<any>({});
  const scrollInnerRef = useRef<any>();

  const common = useMemo(() => {
    if (splash !== null) {
      const itemCategories = roomInfo?.signatureItem?.itemCategories || [];
      const items = roomInfo?.signatureItem?.items || [];

      return {
        ...splash,
        itemCategories: splash.itemCategories.concat(itemCategories),
        items: splash.items.concat(items)
      };
    } else {
      return {};
    }
  }, [splash, roomInfo]);

  const profile = useMemo(() => {
    if (globalState.userProfile !== null) {
      return globalState.userProfile;
    } else {
      return {};
    }
  }, [globalState.userProfile]);

  // state
  const [item, setItem] = useState(-1);
  const [count, setCount] = useState<number>(0);
  const [itemNo, setItemNo] = useState<string>("");
  const [giftList, setGiftList] = useState<any>([]);
  const [giftCategoryItem, setGiftCategoryItem] = useState<number>(0);
  const [selectMember, setSelectMember] = useState<any>({
    memNo: "",
    nickNm: "",
  });

  const [ttsActor, setTTSActor] = useState('');
  const [showTTSInputField, setShowTTSInputField] = useState(false);

  const ttsInputRef = React.createRef<HTMLInputElement | null>();

  const history = useHistory();

  const categoryList = common.itemCategories;

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 아이템 선택하기
  const selectItem = (idx: number, selectItem: any) => {
    if (itemNo === selectItem.itemNo) {
      if (count === 1000) {
        return (
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            type: "alert",
            content: "콤보 선물은 최대 1,000개까지 가능합니다.",
          }))
        );
      }

      if (count >= 10 && count < 100 && selectItem.type === "sticker") {
        setCount(count + 10);
      } else if (count < 10) {
        setCount(count + 1);
      } else if (count >= 100 && selectItem.type === "sticker") {
        setCount(count + 100);
      }
    } else {
      setCount(1);
    }

    setItem(idx);
    setItemNo(selectItem.itemNo);
  };

  const changeCategory = (idx: number, arg: string) => {
    if (idx !== giftCategoryItem) {
      setGiftCategoryItem(idx);
      setItem(-1);
      setItemNo("");
      setCount(0);
      const categoryText = arg;

      const filterData = common.items.filter(
        (v) => v.category === categoryText && v.visibility
      );
      setGiftList(filterData);
    }
  };

  const ttsInputValidator = value => {
    const result = value.length <= ttsContentMaxLength;
    if(!result && !globalState.toastStatus.status) {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "최대 30자까지 입력할 수 있습니다.",
      }));
    }

    return result;
  };

  const getActorList = async () => {
    if(broadcastState.ttsActorInfo.length === 0) {
      const res = await getTTSActorList();
      if(res.code === '00000') {
        dispatch(setBroadcastCtxTtsActorInfo(res.data));
      }
    }
  };

  //방장의 방송설정 : tts, sound 아이템 사용여부에 따라 사용가능
  //이 값은 청취자인 경우만 해당됨
  const soundItemSettingMemo = useMemo(() => {
    if(roomOwner === false) {
      if (typeof roomInfo?.djTtsSound === 'boolean' && typeof roomInfo?.djNormalSound === 'boolean'
        && typeof settingObj?.ttsSound === 'boolean' && typeof settingObj?.normalSound === 'boolean') {

        const {djTtsSound, djNormalSound} = roomInfo;
        const {ttsSound, normalSound} = settingObj;

        return {ttsItemBool: djTtsSound && ttsSound, soundItemBool: djNormalSound && normalSound };
      }
    } else {
      return null;
    }
  },[roomInfo, settingObj, roomOwner]);

  useEffect(() => {
    if (layer.others.itemNo) {
      const giftStateItem = common.items.find((v) => {
        return v.itemNo === layer.others?.itemNo;
      });

      if (giftStateItem !== undefined) {
        switch (giftStateItem.category) {
          case "normal":
            setGiftCategoryItem(0);
            break;
          case "combo":
            setGiftCategoryItem(1);
            break;
          case "emotion":
            setGiftCategoryItem(2);
            break;
          case "text":
            setGiftCategoryItem(3);
            break;
          case "signature":
            setGiftCategoryItem(4);
            break;
        }

        const filterList = common.items.filter((v) => {
          return v.category === giftStateItem.category && v.visibility;
        });

        // 아이템 위치로 스크롤 처리
        giftListScroll = {active: true, itemNo: layer.others.itemNo};
        setGiftList([...filterList]);

        const idx = filterList.findIndex((v) => {
          return v.itemNo === layer.others.itemNo;
        });

        setItem(idx);
        setItemNo(giftStateItem.itemNo);
        setCount(layer.others.cnt);
        setShowTTSInputField(giftStateItem.ttsUseYn === 'y');
      } else {
      }
    } else {
      const filterData = common.items.filter(
        (v) => v.category === "normal" && v.visibility
      );

      if (item === -1) setGiftList(filterData);
    }

    // if (giftState.display !== false && giftState instanceof Object && giftState.itemNo !== "") {
    //   const giftStateItem = common.items.find((v) => {
    //     return v.itemNo === giftState.itemNo;
    //   });

    //   if (giftStateItem !== undefined) {
    //     switch (giftStateItem.category) {
    //       case "normal":
    //         setGiftCategoryItem(0);
    //         break;
    //       case "combo":
    //         setGiftCategoryItem(1);
    //         break;
    //       case "emotion":
    //         setGiftCategoryItem(2);
    //         break;
    //     }
    //     const filterList = common.items.filter((v) => {
    //       return v.category === giftStateItem.category && v.visibility;
    //     });

    //     setGiftList([...filterList]);

    //     const idx = filterList.findIndex((v) => {
    //       return v.itemNo === giftState.itemNo;
    //     });

    //     setItem(idx);
    //     setItemNo(giftStateItem.itemNo);
    //     setCount(giftState.cnt);
    //   }
    // } else if (giftState.display !== false) {
    //   const filterData = common.items.filter((v) => v.category === "normal" && v.visibility);
    //   if (item === -1) setGiftList(filterData);
    // } else {
    // }
  }, [layer]);

  useEffect(() => {
    if (
      guestConnectStatus === true &&
      guestObj !== null &&
      guestObj[globalState.baseData.memNo]
    ) {
      setSelectMember({
        memNo: roomInfo.bjMemNo,
        nickNm: roomInfo.bjNickNm,
      });
    } else if (guestConnectStatus === true && roomOwner === true) {
      Object.keys(guestObj).forEach((v, i) => {
        if (i === 0) {
          setSelectMember({
            memNo: v,
            nickNm: guestObj[v].nickNm,
          });
        }
      });
    }
  }, [guestConnectStatus, guestObj, globalState.baseData.memNo, roomOwner]);

  useEffect(() => {
    if(broadcastState.ttsActorInfo && broadcastState.ttsActorInfo.length > 0) {
      const getActorId = getCookie(ttsActorCookieNaming) ? getCookie(ttsActorCookieNaming) : broadcastState.ttsActorInfo[0].actorId;
      let idRegCheck = false;
      for(let i=0; i<broadcastState.ttsActorInfo.length; i++) {
        if(broadcastState.ttsActorInfo[i].actorId === getActorId) {
          idRegCheck = true;
          break;
        }
      }

      if(idRegCheck) {
        setTTSActor(getActorId);
      }else {
        setTTSActor(broadcastState.ttsActorInfo[0].actorId);
      }
    }
  }, [broadcastState.ttsActorInfo]);

  useEffect(() => {
    getActorList();
  }, []);

  /* 특정 아이템 선택시 스크롤 이동 ( giftListScroll?.active : true 일때 작동) */
  useEffect(() => {
    try {
      if (giftListScroll?.active && itemListRef.current && itemListRef.current[giftListScroll?.itemNo]) {
        const innerRef = scrollInnerRef.current?.getInnerRef();
        innerRef?.scrollTo(0, itemListRef.current[giftListScroll?.itemNo]?.offsetTop);

        giftListScroll = {active: false, itemNo: ''};
        itemListRef.current = {};
      }
    } catch (e) {
      console.warn(e);
    }
  },[giftList]);

  // 선물하기
  async function sendGift(count: number, itemNo: string, isHidden: boolean) {
    if (preventClick === true) {
      return;
    }
    setIsLoading(true);

    const ttsText = ttsInputRef.current ? ttsInputRef.current.value : "";

    if(isHidden && ttsText.length !== 0) { // tts 메시지가 있을때는 몰래보내기 안됨
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: '메시지가 입력되지 않은 상태에서 몰래 보낼 수 있습니다.',
      }));
      setIsLoading(false);
      return;
    }

    /** tts, sound 아이템 사용안함 경우 : 빈값으로 세팅*/
    const params = {
      roomNo: roomNo,
      memNo:
        guestConnectStatus === false ? roomInfo.bjMemNo : selectMember.memNo,
      itemNo: itemNo,
      itemCnt: count,
      isSecret: isHidden,
      ttsText: roomInfo?.djTtsSound ? ttsText : "",
      actorId: roomInfo?.djTtsSound ? ttsActor : "",
      ttsYn: showTTSInputField ? 'y' : 'n'
    };

    const alertMsg: string = (() => {
      if (isHidden) {
        return `${guestConnectStatus === false ? roomInfo.bjNickNm : selectMember.nickNm} 님에게 선물을 몰래 보냈습니다.`;
      } else {
        return `${
          guestConnectStatus === false ? roomInfo.bjNickNm : selectMember.nickNm
        } 님에게 선물을 보냈습니다.`;
      }
    })();

    if (item < 0) {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: "아이템을 선택해 주세요",
      }));
      setIsLoading(false);
      return false;
    }

    if (guestConnectStatus === true && selectMember.memNo === "") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: "선물할 사용자를 선택해 주세요.",
      }));
      setIsLoading(false);
      return false;
    }
    preventClick = true;

    const sendGiftRes = await postSendGift(params);

    if (sendGiftRes.result === "success") {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: sendGiftRes.data ? sendGiftRes.data.message : alertMsg
      }));

      /* 누적 선물 달에 선물한 달 더하기 */
      setDalCnt(chatInfo, giftList, itemNo, count);

      setItem(-1);
      setCount(0);
      setIsLoading(false);
      // dispatchLayer({
      //   type: "INIT",
      // });

      if(ttsText) setCookie(ttsActorCookieNaming, ttsActor, 3); // 성우 저장

      // profile 업데이트
      const { result, data } = await getProfile({
        memNo: globalState.userProfile.memNo,
      });
      if (result === "success") {
        dispatch(setGlobalCtxUserProfile(data));
      }
    } else if (sendGiftRes.result === "fail") {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: sendGiftRes.message,
      }));
      dispatchLayer({
        type: "INIT",
      });
    }

    preventClick = false;
  }

  return (
    <div className="giftPopupWrap">
      {profile && (
        <>
          <h3 className="tabTitle">선물</h3>
          <div className="giftWrap">
            <div className="giftInfo">
              {guestConnectStatus === true &&
                guestObj !== null &&
                !guestObj[globalState.baseData.memNo] && (
                  <div className="selectGiftUser">
                    <button
                      className={`selectUser ${selectMember.memNo ===
                        roomInfo.bjMemNo && "active"}`}
                      onClick={() => {
                        if (roomOwner === false) {
                          setSelectMember({
                            memNo: roomInfo.bjMemNo,
                            nickNm: roomInfo.bjNickNm,
                          });
                        }
                      }}
                    >
                      <img src={roomInfo.bjProfImg.url} />
                      <span className="selectUser__role selectUser__role--dj">
                        DJ
                      </span>
                      <span className="selectUser__nickNm">
                        {roomInfo.bjNickNm}
                      </span>
                    </button>
                    {Object.keys(guestObj).map((v, idx) => {
                      return (
                        <button
                          key={idx}
                          className={`selectUser guest ${selectMember.memNo ===
                            v && "active-guest"}`}
                          onClick={() => {
                            setSelectMember({
                              memNo: v,
                              nickNm: guestObj[v].nickNm,
                            });
                          }}
                        >
                          <img src={guestObj[v].profImg.url} />
                          <span className="selectUser__role selectUser__role--guest">
                            게스트
                          </span>
                          <span className="selectUser__nickNm">
                            {guestObj[v].nickNm}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              <div className="myLelvel">
                <strong>LEVEL {globalState.profile.level}</strong>
                <div className="graph">
                  <span
                    className="fill"
                    style={{
                      width: `${
                        globalState.profile.expRate < 101 ? `${globalState.profile.expRate}` : "100"
                      }%`,
                    }}
                  >
                    {globalState.profile.expRate}%
                  </span>
                </div>
              </div>
              <div className="myDal">
                <div className="myAcount">
                  <div className="myAcount__line">
                    <p>{globalState.profile.dalCnt.toLocaleString()}</p>
                    <button
                      className="charge"
                      onClick={() => history.push("/store")}
                    >
                      충전
                    </button>
                  </div>
                  <div className="myAcount__line">
                    <p>{globalState.profile.byeolCnt.toLocaleString()}</p>
                    <button
                      className="exchange"
                      onClick={() => history.push("/wallet/exchange")}
                    >
                      교환
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="giftCategory">
              {categoryList &&
                categoryList.map((v, i) => {
                  return (
                    <button
                      key={`category-${i}`}
                      onClick={() => changeCategory(i, v.code)}
                      className={`btn__category ${
                        i === giftCategoryItem ? " btn__category--active" : ""
                      }`}
                    >
                      {v.value}
                      {v.isNew && <span className="ico__new">N</span>}
                    </button>
                  );
                })}
            </div>
            {isLoading &&
              <div className="loading" style={{position: 'absolute'}}>
                <span/>
              </div>
            }
            <DalbitScroll preventAutoHidden={true} always={true} ref={scrollInnerRef}>
              <ul className="giftList">
                {giftList &&
                  giftList.map((v: any, i: number) => {
                    const { type } = v;
                    return (
                      <li
                        ref={(el) => {itemListRef.current[v?.itemNo] = el}}
                        key={`gift-${i}`}
                        onClick={() => {
                          if (type === "direct") {
                            dispatchDimLayer({
                              type: "DIRECT_GIFT",
                              others: {
                                memNo:
                                  guestConnectStatus === false
                                    ? roomInfo.bjMemNo
                                    : selectMember.memNo,
                                itemNo: v.itemNo,
                                roomNo: roomNo,
                              },
                            });
                          } else {
                            selectItem(i, v);
                            setShowTTSInputField(v.ttsUseYn === 'y');
                          }
                        }}
                        className={`giftItem ${
                          i === item ? "giftItem--active" : ""
                        }`}
                      >
                        <img src={v.thumbs} alt={v.itemNm} className="item" />
                        {v.soundFileUrl !== "" && roomInfo?.djNormalSound &&
                          <img className="sound-item" src={SoundIcon} />
                        }
                        {v.isNew && (
                          <span className="ico__new">
                            <img
                              src="https://image.dallalive.com/broadcast/giftIconNew.png"
                              alt=""
                            />
                          </span>
                        )}
                        {v.ttsUseYn === 'y' && roomInfo?.djTtsSound && (
                          <span className="ico__speaker">
                            <img
                              src="https://image.dallalive.com/broadcast/giftIconSpeaker.png"
                              alt=""
                            />
                          </span>
                        )}
                        <span className="price price--dal">
                          {type === "direct" ? "직접선물" : v.cost}
                        </span>
                        {count > 0 && <span className="clickCnt">{count}</span>}
                      </li>
                    );
                  })}
              </ul>
            </DalbitScroll>

            {/* soundItemSettingMemo?.ttsItemBool : (ttsItem 사용가능여부 true, false) */}
            {showTTSInputField &&
              <>
                <div className="giftTtsCategory">
                  <span>목소리</span>
                  {broadcastState.ttsActorInfo.map((data, index) => {
                    return(
                      <button key={index}
                              className={`ttsList ${ttsActor === data.actorId && (roomInfo?.djTtsSound) ? "active" : ""}`}
                              onClick={() => setTTSActor(data.actorId)}
                      >{data.actorName}
                      </button>
                    )
                  })}
                </div>
                <div className="giftTTSinput">
                  {roomInfo?.djTtsSound?
                  <>
                    <img src="https://image.dallalive.com/broadcast/ico_speaker.png" />
                    <UseInput placeholder={`하고 싶은 말과 함께 선물하세요.(${ttsContentMaxLength}자 이내)`}
                              forwardedRef={ttsInputRef}
                              validator={ttsInputValidator}
                              disabled={false}
                              value={inputValue}
                              setValue={setInputValue}
                    />
                  </>
                  :
                  <>
                    <img src="https://image.dallalive.com/broadcast/ico_speaker-mute.png"/>
                    <UseInput placeholder={'DJ의 설정으로 목소리 옵션을 사용할 수 없습니다'}
                              forwardedRef={ttsInputRef}
                              validator={ttsInputValidator}
                              disabled={true}
                              value={inputValue}
                              setValue={setInputValue}
                    />
                  </>
                  }
                </div>
              </>
            }

            <div className="giftBtnBox">
              <button
                className="btn__secret"
                onClick={() => {
                  sendGift(count, itemNo, true);
                }}
              >
                몰래 보내기
              </button>
              <button
                className="btn__send"
                onClick={() => {
                  sendGift(count, itemNo, false);
                }}
              >
                보내기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
/** 누적 선물 달에 값 누적하기 */
export const setDalCnt = (chatInfo, giftList: Array<any>, itemNo: string, count: number ) => {
  const item = giftList.find(v => v?.itemNo === itemNo);
  chatInfo?.addRoomInfoDalCnt(item?.cost * count);
}