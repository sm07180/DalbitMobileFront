import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

import {tabType} from "../constant";

import {deleteFan, getClipType, getProfile, postAddFan} from "common/api";

import iconFemale from "../static/female.svg";
import iconMale from "../static/male.svg";
import iconSp from "../static/slabel_circle_s.svg";
import iconClip from "../static/clip_w_s.svg";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../redux/actions/globalCtx";
import {setClipCtxRightTabType, setClipCtxUserMemNo} from "../../../redux/actions/clipCtx";

export default function ClipPlayerIconBox() {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const clipState = useSelector(({clipCtx}) => clipCtx);

  const { clipInfo, baseData } = globalState;

  const [fanState, setFanState] = useState(0);
  const [clipType, setClipType] = useState<any>([]);
  const [clipProfile, setClipProfile] = useState({
    memNo: 0,
    nickNm: "",
    grade: "",
    level: 0,
    memId: "",
    fanCnt: 0,
    profImg: {
      thumb120x120: "",
    },
    holder: "",
    fanRank: [
      {
        profImg: {
          url: "",
        },
        memNo: 0,
      },
    ],

    byeolCnt: 0,
    isFan: false,
  });

  const addFan = async () => {
    const { result } = await postAddFan({
      memNo: clipInfo!.clipMemNo!,
    });
    if (result === "success") {
      if (fanState === 0) {
        setFanState && setFanState(-1);
        dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: `${clipInfo?.nickName}님의 팬이 되었습니다`,
        }));
        getProfileinfo();
      } else {
        setFanState && setFanState(0);
      }
    }
  };

  const cancelFan = () => {

    dispatch(setGlobalCtxAlertStatus({
      status: true,
      type: "confirm",
      content: `${globalState.clipInfo?.nickName} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        async function DeleteFanFunc() {
          const { result, message } = await deleteFan({ memNo: globalState.clipInfo?.clipMemNo! });
          if (result === "success") {
            dispatch(setGlobalCtxSetToastStatus({
              status: true,
              message: message,
            }));

            if (fanState === 0) {
              setFanState && setFanState(-1);
            } else {
              setFanState && setFanState(0);
            }
            getProfileinfo();
          }
        }

        DeleteFanFunc();
      },
    }));
  };

  const getProfileinfo = async () => {
    const { result, data } = await getProfile({
      memNo: clipInfo!.clipMemNo!,
    });
    if (result === "success") setClipProfile(data);
  };

  const registerFan = () => {
    if (baseData.isLogin) {
      addFan();
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    const getDataClipType = async () => {
      const { result, data, message } = await getClipType({});
      if (result === "success") {
        setClipType(data);
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: `${message}`,
          callback: () => {},
        }));
      }
    };
    getDataClipType();
  }, []);
  return (
    <>
      {clipInfo && (
        <div className="coverBoxInner">
          <div className="coverBox">
            <img src={clipInfo!.bgImg["thumb700x700"]} alt="cover" />
            <div className="dim">
              <p className="type">
                {clipType.map((item, idx) => {
                  if (item.value === clipInfo.subjectType) {
                    return item.cdNm;
                  }
                })}
              </p>
              <span className="rate">
                <img src={iconClip} />
                {clipInfo.regCnt}
              </span>
            </div>
            <div className="fanListWrap">
              {baseData.isLogin === true && !clipState.isMyClip ? (
                <>
                  {clipProfile.isFan === true ? (
                    <button
                      className="fanListWrap__btnfanAdd fanListWrap__btnfanAdd--active"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelFan();
                      }}
                    >
                      팬
                    </button>
                  ) : (
                    <button
                      className="fanListWrap__btnfanAdd"
                      onClick={(e) => {
                        e.stopPropagation();
                        registerFan();
                      }}
                    >
                      +팬등록
                    </button>
                  )}
                </>
              ) : (
                <button></button>
              )}
              <div className="rankItem">
                <ul className="rankItem__imgBox">
                  {clipInfo.list.map((value, index) => {
                    return (
                      <li
                        className="rankItem__list"
                        key={index}
                        style={{ backgroundImage: `url("${value.profImg.thumb62x62}")` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setClipCtxUserMemNo(value.memNo));
                          dispatch(setClipCtxRightTabType(tabType.PROFILE));
                        }}
                      >
                        <span className="blind">닉네임</span>
                      </li>
                    );
                  })}
                </ul>
                {clipInfo.list.length > 0 && (
                  <button
                    className="rankItem__more"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setClipCtxRightTabType(tabType.GIFT_RANK));7
                    }}
                  >
                    <span className="blind">팬랭킹 더보기</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="coverBoxBack">
            <img src={clipInfo!.bgImg["thumb700x700"]} alt="cover" />
            <div className="backWrap">
              <p className="type">
                {clipType.map((item, idx) => {
                  if (item.value === clipInfo.subjectType) {
                    return item.cdNm;
                  }
                })}
              </p>

              <div className="profImg">
                <img src={clipInfo.profImg.thumb292x292} alt="profImg" />
                <img src={clipInfo.holder} alt="holder" />
              </div>
              <div className="tagWrap">
                <span className="level">Lv {clipInfo.level}</span>
                {clipInfo.gender === "f" ? <img src={iconFemale} /> : clipInfo.gender === "m" ? <img src={iconMale} /> : <></>}
                {clipInfo.badgeSpecial > 0 && <img src={iconSp} />}
              </div>
              <p className="nickName">
                {clipInfo.nickName}
                <span className="rate">
                  <img src={iconClip} />
                  {clipInfo.regCnt}
                </span>
              </p>
              <button
                className="goBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(`/profile/${clipInfo.clipMemNo}?tab=2`);
                }}
              >
                다른 클립 보러가기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
