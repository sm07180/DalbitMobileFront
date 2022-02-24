import React, { useContext, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

// Api
import {
  postBroadcastRoomExtend,
  getBroadcastBoost,
  miniGameEnd, getMoonLandInfoData, getMoonLandMyRank, getMoonLandRankList, getMoonLandMissionSel
} from "common/api";

// ctx
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";
import { BroadcastLayerContext } from "context/broadcast_layer_ctx";

// lib
import {
  stringTimeFormatConvertor,
  secToDateConvertor,
  secToDateConvertorMinute,
} from "lib/common_fn";
// constant
import { tabType, MediaType, MiniGameType } from "../constant";

// static
import fanIcon from "../static/ic_fan.png";
import newFanIcon from "../static/ic_newpeople_g_s.svg";
import boosterOffIcon from "../static/ic_booster_off.svg";
import boosterActiveIcon from "../static/ic_booster.svg";
import RouletteIcon from "../static/ic_roulette.svg";
import SettingIcon from "../static/ic_setting_circle_w.svg";
import CloseIcon from "../static/ic_close_m.svg";

// component
import GuestComponent from "./guest_component";
import MoonComponent from "./moon_component";

let boostInterval;

export default function ChatHeaderWrap(prop: any) {
  const { roomOwner, roomNo, roomInfo, displayWrapRef } = prop;
  const { likes, startDt } = roomInfo;
  const { globalState, globalAction } = useContext(GlobalContext);

  const { baseData, chatInfo } = globalState;
  const { broadcastState, broadcastAction } = useContext(BroadcastContext);
  const { realTimeValue, useBoost, commonBadgeList } = broadcastState;
  const { setRightTabType, setUserMemNo, setCommonBadgeList } = broadcastAction;

  const { dispatchDimLayer } = useContext(BroadcastLayerContext);

  const [broadcastTime, setBroadcastTime] = useState<number | null>(null);
  const [boostInfo, setBoostInfo] = useState<any>(null);
  const [boostTimer, setBoostTimer] = useState<number>(0);
  const [miniGameToggle, setMiniGameToggle] = useState<boolean>(false);
  const [moonLandEventBool, setMoonLandEventBool] = useState<boolean>(false);

  const history = useHistory();
  useEffect(() => {
    const timeIntervalId = (() => {
      if (startDt) {
        return setInterval(() => {
          const time = stringTimeFormatConvertor(startDt);
          const diff = Math.floor(
            (new Date().getTime() - new Date(time).getTime()) / 1000
          );
          setBroadcastTime(diff);
        }, 1000);
      }
      return null;
    })();
    return () => {
      if (timeIntervalId !== null) {
        clearInterval(timeIntervalId);
      }
    };
  }, [startDt]);
  const StoryToggle = () => {
    setRightTabType && setRightTabType(tabType.STORY);
    if (broadcastState.storyState === 1) {
      broadcastAction.setStoryState!(-1);
    }
  };
  const NoticeToggle = () => {
    setRightTabType && setRightTabType(tabType.NOTICE);
    if (broadcastState.noticeState === 1) {
      broadcastAction.setNoticeState!(-1);
    }
  };
  const LikeToggle = () => {
    setRightTabType && setRightTabType(tabType.LIKELIST);
    if (broadcastState.likeState === 1) {
      broadcastAction.setLikeState!(-1);
    }
  };
  const tooltipToggle = () => {
    globalAction.setTooltipStatus &&
      globalAction.setTooltipStatus({
        status: true,
        message: "방송 시작부터 현재까지 입장한 모든 청취자 수의 합계입니다.",
      });
  };
  const createFanBadgeList = () => {
    const { fanBadgeList } = roomInfo;
    if (!fanBadgeList || Object.keys(fanBadgeList).length === 0) return null;
    return fanBadgeList.map((val, idx) => {
      const { text, icon, startColor, endColor, tipMsg } = val;
      if (icon && icon != null && icon != "") {
        return (
          <span
            className="fan-badge"
            style={{
              background: `linear-gradient(to right, ${startColor}, ${endColor})`,
              cursor: tipMsg ? "" : "pointer",
            }}
            key={idx}
            onClick={() => {
              if (val.tipMsg !== "") {
                globalAction.callSetToastStatus!({
                  status: true,
                  message: val.tipMsg,
                });
              }
            }}
          >
            <img src={icon} alt={text} />
            <span>{text}</span>
          </span>
        );
      }
    });
  };

  useEffect(() => {
    setCommonBadgeList && setCommonBadgeList(roomInfo.commonBadgeList);

    //달나라 팝업 버튼 노출 여부
    if(roomInfo && roomInfo.hasOwnProperty('moonLandEvent') && roomInfo.moonLandEvent){
      setMoonLandEventBool(roomInfo.moonLandEvent);
    }
  }, [roomInfo]);

  useEffect(() => {
    const boostFetch = async () => {
      const res = await getBroadcastBoost({ roomNo: roomNo });
      if (res.result === "success") {
        setBoostInfo(res.data);
      }
    };

    boostFetch();
  }, [broadcastState.boost]);

  useEffect(() => {
    if (boostInfo !== null && boostInfo.boostCnt > 0) {
      let myTime = boostInfo.boostTime;
      boostInterval = setInterval(() => {
        myTime -= 1;
        setBoostTimer(myTime);
        if (myTime === 0) {
          clearInterval(boostInterval);
        }
      }, 1000);
    }
    return () => {
      if (boostInterval) {
        clearInterval(boostInterval);
      }
    };
  }, [boostInfo]);

  return (
    <ChatHeaderWrapStyled isVideo={roomInfo.mediaType === MediaType.VIDEO}>
      <div className="top-section">
        <div className="dj-info">
          <div
            className="profile-image"
            onClick={() => {
              setRightTabType && setRightTabType(tabType.PROFILE);
              setUserMemNo && setUserMemNo(roomInfo.bjMemNo);
            }}
          >
            <div
              className="image-background"
              style={
                roomInfo !== null
                  ? {
                      backgroundImage: `url(${roomInfo.bjProfImg["thumb150x150"]})`,
                    }
                  : {}
              }
            ></div>
            {roomInfo.badgeFrame.frameAni !== "" ? (
              <>
                <div
                  className="dj-holder"
                  style={{
                    backgroundImage: `url(${roomInfo.badgeFrame.frameTop})`,
                  }}
                ></div>
                <div
                  className="dj-holder"
                  style={{
                    backgroundImage: `url(${roomInfo.badgeFrame.frameAni})`,
                  }}
                ></div>
              </>
            ) : (
              <div
                className="dj-holder"
                style={
                  roomInfo !== null
                    ? { backgroundImage: `url(${roomInfo.bjHolder})` }
                    : {}
                }
              ></div>
            )}
          </div>

          <div className="broadcast-info">
            <div className="dj-nickname">
              {roomInfo !== null ? roomInfo.bjNickNm : ""}
            </div>
            <div className="title">
              {roomInfo !== null ? roomInfo.title : ""}
            </div>
          </div>
        </div>
        <div className="user-info">
          <div className="fan-list">
            {realTimeValue !== null &&
              Array.isArray(realTimeValue.fanRank) &&
              realTimeValue.fanRank.map((fan, idx) => {
                return (
                  <div
                    key={`fan-list-${idx}`}
                    className="fan-item"
                    style={{
                      backgroundImage: `url(${fan.profImg["thumb150x150"]})`,
                    }}
                    onClick={() => {
                      const { memNo } = fan;

                      setRightTabType && setRightTabType(tabType.PROFILE);
                      setUserMemNo && setUserMemNo(memNo);
                    }}
                  >
                    {fan.badgeFrame && (
                      <>
                        <div
                          className="fan-holder"
                          style={{
                            backgroundImage: `url(${fan.badgeFrame.frameTop})`,
                          }}
                        ></div>
                        <div
                          className="fan-holder"
                          style={{
                            backgroundImage: `url(${fan.badgeFrame.frameAni})`,
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
          <div
            className="current-user"
            onClick={() => {
              setRightTabType && setRightTabType(tabType.LISTENER);
            }}
          >
            <div className="icon"></div>
            {broadcastState.userCount.current}
          </div>
        </div>
      </div>
      <div className="mid-section">
        <div className="wrapper">
          <div className="left-section">
            <span className="info" onClick={tooltipToggle}>
              <img
                className="icon"
                src="https://image.dalbitlive.com/broadcast/ico_people_color_s.svg"
                alt="청취자"
              />
              <span className="text">{broadcastState.userCount.history}</span>
            </span>
            <span className="info">
              <img className="icon" src={newFanIcon} alt="신규팬" />
              <span className="text">{broadcastState.roomInfo?.newFanCnt}</span>
            </span>
            <span className="info" onClick={LikeToggle}>
              <img
                className="icon"
                src="https://image.dalbitlive.com/broadcast/ico_heart_color_s.svg"
                alt="좋아요"
              />
              <span className="text">
                {realTimeValue !== null ? realTimeValue.likes : likes}
              </span>
            </span>
            {((broadcastState.roomInfo && broadcastState.roomInfo.auth === 1) ||
              roomOwner === true) &&
              startDt && (
                <span className="info time">
                  <img
                    className="icon"
                    src="https://image.dalbitlive.com/broadcast/ico_time.svg"
                    alt="시간"
                  />
                  <span className="text">
                    {broadcastTime !== null &&
                      secToDateConvertor(broadcastTime)}
                  </span>
                </span>
              )}

            {roomOwner === true &&
              broadcastState.extendTimeOnce === false &&
              broadcastState.extendTime === true && (
                <ExtendingIconStyled
                  onClick={async () => {
                    if (
                      broadcastAction.setExtendTime &&
                      broadcastAction.setExtendTimeOnce
                    ) {
                      const { result, message, data } =
                        await postBroadcastRoomExtend({ roomNo });
                      if (result === "success") {
                        broadcastAction.setExtendTime(false);
                        broadcastAction.setExtendTimeOnce(true);
                        if (globalAction.setAlertStatus) {
                          globalAction.setAlertStatus({
                            status: true,
                            content: "연장에 성공하였습니다.",
                          });
                        }
                      } else if (result === "fail") {
                        if (globalAction.setAlertStatus) {
                          globalAction.setAlertStatus({
                            status: true,
                            content: message,
                          });
                        }
                      }
                    }
                  }}
                >
                  연장
                </ExtendingIconStyled>
              )}
          </div>
          <div className="right-section">
            <button
              onClick={StoryToggle}
              className={
                broadcastState.storyState === 1
                  ? "right-section__btn right-section__btn--active"
                  : "right-section__btn"
              }
            >
              <img
                className="icon"
                src="https://image.dalbitlive.com/broadcast/ico_mail.svg"
                alt="사연"
              />
            </button>
            <button
              onClick={NoticeToggle}
              // className={
              //   broadcastState.noticeState === 1 ? "right-section__btn right-section__btn--active" : "right-section__btn"
              // }
            >
              <img
                className="icon"
                src={
                  broadcastState.noticeState === 1
                    ? `https://image.dalbitlive.com/broadcast/ico_notice_on_dot.svg`
                    : `https://image.dalbitlive.com/broadcast/ico_notice_dot.svg`
                }
                alt="공지"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <RankIconStyled
          onClick={() => {
            baseData.isLogin
              ? setRightTabType && setRightTabType(tabType.BOOST)
              : history.push("/login");
          }}
          className={
            roomInfo?.useBoost || useBoost
              ? boostTimer <= 300 && boostTimer > 30
                ? "boost_flash"
                : boostTimer <= 30 && boostTimer > 0
                ? "boost_flash_r"
                : `active`
              : ""
          }
        >
          <span className="text">
            {(boostTimer > 300 || boostTimer <= 0) && `TOP `}
            {(boostTimer > 300 || boostTimer <= 0) &&
              realTimeValue !== null &&
              realTimeValue.rank}
            {boostTimer <= 300 &&
              boostTimer > 0 &&
              secToDateConvertorMinute(boostTimer)}
          </span>
        </RankIconStyled>

        {roomInfo !== null && (
          <RoomBadgeWrap>
            {commonBadgeList &&
              commonBadgeList.map((badge, badgeIdx) => {
                const {
                  text,
                  icon,
                  startColor,
                  endColor,
                  bgImg,
                  borderColor,
                  bgAlpha,
                  textColor,
                } = badge;

                return (
                  <React.Fragment key={badgeIdx}>
                    {text === "신입DJ" && (
                      <span
                        className="fan-badge tlsdlq"
                        style={{
                          backgroundImage: `${
                            bgImg !== ""
                              ? `url("${bgImg}")`
                              : `linear-gradient(to right, ${startColor} ${
                                  bgAlpha * 100
                                }%, ${endColor} ${bgAlpha * 100}%)`
                          } `,
                          border: borderColor
                            ? `1px solid ${borderColor}`
                            : "none",
                          backgroundSize: "contain",
                        }}
                      >
                        {icon && <img src={icon} alt={text} />}
                        <span
                          style={{
                            color: `${textColor}`,
                          }}
                        >
                          {text}
                        </span>
                      </span>
                    )}
                    {text === "Best" && (
                      <span
                      className="fan-badge"
                      style={{
                        backgroundImage: 
                        `linear-gradient(to right, ${startColor} ${bgAlpha * 100}%, ${endColor} ${bgAlpha * 100}%)`,
                        border: borderColor
                          ? `1px solid ${borderColor}`
                          : "none",
                        backgroundSize: "contain",
                      }}
                    >
                      {icon && <img src={icon} alt={text} />}
                      <span
                        style={{
                          color: `${textColor}`,
                        }}
                      >
                        {text}
                      </span>
                    </span>
                    )}
                    {text === "콘텐츠DJ" && (
                      <span className="fan-badge imgBadge">
                        <em className="icon_wrap icon_contentsdj_broadcast"></em>
                      </span>
                    )}
                    {text &&
                      text !== "신입DJ" &&
                      text !== "Best" &&
                      text !== "콘텐츠DJ" && (
                        <span
                          className="fan-badge"
                          style={{
                            backgroundImage: `${
                              bgImg !== ""
                                ? `url("${bgImg}")`
                                : `linear-gradient(to right, ${startColor} ${
                                    bgAlpha * 100
                                  }%, ${endColor} ${bgAlpha * 100}%)`
                            } `,
                            border: borderColor
                              ? `1px solid ${borderColor}`
                              : "none",
                            backgroundSize: "contain",
                          }}
                        >
                          {icon && <img src={icon} alt={text} />}
                          <span
                            style={{
                              color: `${textColor}`,
                            }}
                          >
                            {text}
                          </span>
                        </span>
                      )}
                  </React.Fragment>
                );
              })}

            {createFanBadgeList()}
          </RoomBadgeWrap>
        )}
        <GuestComponent
          roomOwner={roomOwner}
          roomNo={roomNo}
          roomInfo={roomInfo}
          displayWrapRef={displayWrapRef}
        />
      </div>
      <div className="mini_game_section">
        {broadcastState.miniGameInfo.status === true &&
          ((roomOwner === false &&
            broadcastState.miniGameInfo.isFree === false) ||
            roomOwner === true) && (
            <div className={`mini_game_wrap`}>
              <button
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();

                  dispatchDimLayer({
                    type: "ROULETTE",
                    others: {
                      roomOwner,
                    },
                  });
                }}
              >
                <img src={RouletteIcon} alt="미니게임 룰렛" />
              </button>
              {roomOwner === true && (
                <div className={`mini_game_slide`}>
                  <button
                    onClick={() => {
                      broadcastAction.setRightTabType &&
                        broadcastAction.setRightTabType(tabType.ROULETTE);
                    }}
                  >
                    <img src={SettingIcon} alt="미니게임 세팅" />
                  </button>
                  <button
                    onClick={() => {
                      globalAction.setAlertStatus &&
                        globalAction.setAlertStatus({
                          status: true,
                          type: "confirm",
                          title: "종료하기",
                          content:
                            "룰렛을 종료하겠습니까? <br /> 종료 후에는 DJ, 청취자 모두 룰렛을 <br /> 돌릴 수 없습니다.",
                          callback: async () => {
                            const { result, data, message } = await miniGameEnd({
                              roomNo: roomNo,
                              gameNo: MiniGameType.ROLUTTE,
                              rouletteNo: broadcastState.miniGameInfo.rouletteNo,
                              versionIdx: broadcastState.miniGameInfo.versionIdx,
                            });

                            if (result === "success") {
                              broadcastAction.setMiniGameInfo &&
                                broadcastAction.setMiniGameInfo({
                                  status: false,
                                });
                            }
                          },
                        });
                    }}
                  >
                    <img src={CloseIcon} alt="미니게임 삭제" />
                  </button>
                </div>
              )}
            </div>
          )
        }
        <div className="mini_game_wrap">
          <button 
            onClick={() => {
              broadcastAction.setRightTabType &&
                broadcastAction.setRightTabType(tabType.VOTE);
            }}
          >
            <img src="https://image.dalbitlive.com/broadcast/dalla/vote/voteFloatingBtn.png" alt="미니게임 투표" />
          </button>
          {roomOwner === true && (
            <div className={`mini_game_slide`}>
              <button
                onClick={() => {
                  globalAction.setAlertStatus &&
                    globalAction.setAlertStatus({
                      status: true,
                      type: "confirm",
                      title: "종료하기",
                      content:
                        "투표를 종료하겠습니까? <br /> 종료 시 모든 투표가 마감처리 됩니다."
                    });
                }}
              >
                <img src={CloseIcon} alt="미니게임 삭제" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="gotomoon-section"/>
      <div className="moon-section">
        <MoonComponent roomNo={roomNo} roomInfo={roomInfo} />
      </div>

      {/* 달나라 갈꺼야 버튼 */}
      {moonLandEventBool &&
        <div className="moon-land-button">
          <button className="btnEventGotomoon"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const {data, message} = await getMoonLandMissionSel({roomNo: chatInfo ? chatInfo.chatUserInfo.roomNo : 0});
                    dispatchDimLayer({type: "MOON_LAND", others: {data, roomOwner}});
                  }}/>
        </div>
      }

    </ChatHeaderWrapStyled>
  );
}

const ExtendingIconStyled = styled.button`
  width: 42px;
  margin-left: 10px;
  padding: 4px 0;
  text-align: center;
  font-size: 12px;
  border-radius: 11px;
  color: #fff;
  background-color: #ec455f;
  cursor: pointer;
`;

const ChatHeaderWrapStyled = styled.div`
  position: relative;
  width: 100%;
  padding: 8px 13px;
  box-sizing: border-box;
  z-index: 3;

  .top-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .dj-info {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      padding-top: 10px;

      &::before {
        content: "";
        position: absolute;
        top: 25px;
        left: 10px;
        width: 94%;
        height: 55px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 28px;
        z-index: 0;
      }

      .profile-image {
        display: flex;
        align-items: center;
        position: relative;
        width: 75px;
        height: 82px;
        margin-left: -1px;

        .dj-holder {
          position: absolute;
          left: -9px;
          top: -4px;
          width: 92px;
          height: 92px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          cursor: pointer;
        }
        .image-background {
          width: 63px;
          height: 63px;
          margin-left: 5px;
          margin-top: 1px;
          border-radius: 50%;
          background-color: darkgray;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
      }

      .broadcast-info {
        width: calc(100% - 68px);
        margin-left: 8px;
        color: #fff;
        z-index: 1;

        .dj-nickname {
          width: 90%;
          font-size: 18px;
          letter-spacing: -0.45px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
        }
        .title {
          width: 90%;
          font-size: 16px;
          letter-spacing: -0.4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
        }
      }
    }

    .user-info {
      color: #fff;
      display: flex;
      margin-left: 3px;
      padding-top: 10px;
      flex-direction: row;
      width: min-content;
      align-items: center;

      .fan-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        .fan-item {
          position: relative;
          margin-left: 4px;
          width: 48px;
          height: 48px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          border-radius: 50%;
          cursor: pointer;
          &:first-child {
            margin-left: 0;
          }
          &::before {
            content: "";
            position: absolute;
            right: 0px;
            bottom: 0px;
            width: 18px;
            height: 18px;
            z-index: 1;
          }
          &:nth-child(1) {
            &::before {
              background-image: url("https://image.dalbitlive.com/images/api/20200727/ic_gold.png");
            }
          }
          &:nth-child(2) {
            &::before {
              background-image: url("https://image.dalbitlive.com/images/api/20200727/ic_silver.png");
            }
          }
          &:nth-child(3) {
            &::before {
              background-image: url("https://image.dalbitlive.com/images/api/20200727/ic_bronze.png");
            }
          }
        }
        .fan-holder {
          position: absolute;
          top: -16px;
          left: 0px;
          width: 48px;
          height: 81px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      }

      .current-user {
        position: relative;
        margin-left: 4px;
        border: 1px solid #fff;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        background-color: rgba(0, 0, 0, 0.2);
        text-align: center;
        font-size: 14px;
        line-height: 65px;
        cursor: pointer;
        .icon {
          position: absolute;
          top: 6px;
          left: 50%;
          margin-left: -8px;
          width: 16px;
          height: 16px;
          background-image: url(${fanIcon});
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }
      }
    }
  }

  .mid-section {
    margin-top: 10px;

    .wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      .left-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 6px 12px;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, 0.2);
        .info {
          display: flex;
          align-items: center;
          margin-left: 7px;
          cursor: pointer;
          &:first-child {
            margin-left: 0;
          }
          &.time {
            cursor: auto;
          }
        }

        .icon {
          margin-right: 4px;
        }
        .text {
          position: relative;
          top: -1px;
          display: inline-block;
          min-width: 7px;
          font-size: 14px;
          letter-spacing: -0.38px;
          vertical-align: middle;
          color: #fff;
        }
      }
      .right-section {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        &__btn {
          position: relative;
          &--active {
            &::after {
              content: "";
              position: absolute;
              top: 4px;
              right: 4px;
              width: 9px;
              height: 9px;
              border-radius: 50%;
              border: solid 1px #463e36;
              background: linear-gradient(to bottom, #eeff00, #0dc700);
            }
          }
        }
        button {
          margin-left: 3px;
          /* &:first-child {
            margin-left: 0;
          } */
        }
      }
    }
  }

  .bottom-section {
    display: flex;
    padding-top: 5px;
  }
  .mini_game_section{
    display:flex;
    flex-direction: column;
    align-items:flex-start;
    position: absolute;
    left: 16px;
    top: 190px;
    .mini_game_wrap {
      display: flex;
      background-color: black;
      border-radius: 32px;
      z-index: 1;
      & + .mini_game_wrap{
        margin-top: 8px;
      }
      & > .icon {
        & > img {
          width: 62px;
          height: 62px;
        }
      }
  
      & > .mini_game_slide {
        display: flex;
        overflow-x: hidden;
  
        & > button:first-child {
          margin-left: 6px;
        }
  
        & > button:last-child {
          margin-right: 6px;
        }
  
        &.in {
          width: 80px;
          animation: fadeIn 0.4s;
        }
  
        &.out {
          width: 0px;
          animation: fadeOut 0.4s;
        }
  
        @keyframes fadeIn {
          0% {
            width: 0px;
          }
  
          100% {
            width: 80px;
          }
        }
  
        @keyframes fadeOut {
          0% {
            width: 80px;
          }
  
          100% {
            width: 0px;
          }
        }
      }
    }
  }
  

  .moon-section {
    position: absolute;
    right: 16px;
    margin-top: 12px;
    z-index: 1;
  }
  
  .moon-land-button {    
    position: absolute;
    right: 16px;
    margin-top: 12px;
    z-index: 1;
    .btnEventGotomoon {
      display: inline-block;
      width: 40px; height:50px;
      background-image: url(https://image.dalbitlive.com/broadcast/event/gotomoon/btn_popOpen-gotomoon.png);
      background-position: center;
      background-size: cover;
      background-repeat:no-repeat;
    }
  }
`;

const RankIconStyled = styled.div`
  margin-right: 5px;
  padding-right: 14px;
  height: 26px;
  border: 1px solid #9e9e9e;
  border-radius: 16px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  &::before {
    display: inline-block;
    content: "";
    width: 26px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-image: url(${boosterOffIcon});
    background-color: #9e9e9e;
    border-radius: 50%;
  }
  &.active {
    border: 1px solid #ff7400;
    // background: rgba(255, 255, 255, 0.2);
    &::before {
      background-image: url(${boosterActiveIcon});
      background-color: #fff;
    }
  }

  &.boost_flash {
    background-color: #feac2b;
    border: 1px solid #feac2b;
    color: #fff;
    &::before {
      background-image: url(${boosterActiveIcon});
      background-color: #fff;
    }
    span {
      opacity: 1;
      animation: flash linear 3s infinite;
    }
  }

  &.boost_flash_r {
    background-color: #ec455f;
    border: 1px solid #ec455f;
    color: #fff;
    &::before {
      background-image: url(${boosterActiveIcon});
      background-color: #fff;
    }
    span {
      opacity: 1;
      animation: flash_r linear 1s infinite;
    }
  }

  @keyframes flash {
    0% {
      opacity: 1;
    }

    75% {
      opacity: 1;
    }

    87% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes flash_r {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .text {
    margin-left: 6px;
    font-size: 14px;
  }
`;

const RoomBadgeWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  height: 28px;
  display: flex;
  span {
    display: inline-block;
    height: 28px;
    padding: 0 10px;
    border-radius: 14px;
    line-height: 28px;
    color: #fff;
    font-size: 12px;
    &.new {
      background-color: rgba(69, 147, 236, 1);
    }
    &.pop {
      background: rgba(236, 69, 95, 0.7);
    }
    &.recomm {
      background: rgba(255, 60, 123, 0.7);
    }
    &.special {
      background: rgba(236, 69, 95, 0.7);
    }
  }
  span + span {
    margin-left: 3px;
  }
  span.badge {
    padding: 0;
    img {
      width: auto;
      height: 28px;
    }
  }

  .fan-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: -0.35px;
    padding: 0 8px;
    text-align: left;
    color: #fff;
    box-sizing: border-box;
  }

  .fan-badge.imgBadge {
    padding: 0;
    vertical-align: bottom;
  }

  .fan-badge img {
    width: auto;
    height: 20px;
  }
  .fan-badge span {
    display: inline-block;
    vertical-align: middle;
    color: #fff;
    padding: 0;
  }

  .fan-badge-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    border-radius: 20px;
    font-size: 14px;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: -0.35px;
    padding: 0 10px;
    text-align: left;
    color: #424242;
  }
`;

const GuestWrapStyled = styled.div`
  position: absolute;
  right: 16px;

  & > img {
    display: block;
    width: 62px;
    height: 62px;
    margin-bottom: 5px;
    border-radius: 50%;
    cursor: pointer;
  }

  .equalizer {
    position: absolute;
    animation: roll linear 2s infinite;
    @keyframes roll {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(359deg);
      }
    }
  }

  & > button {
    width: 66px;
    height: 28px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    color: #fff;
    font-size: 13px;
    line-height: 26px;
    text-align: center;

    & > img.guestAlarm {
      position: absolute;
      left: 0;
    }
  }
`;

const button = styled.button``;
