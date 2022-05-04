import React, { useEffect, useState, useContext, useMemo } from "react";
// context
import { getProfile } from "common/api";
// content
import ListenerList from "./right_content/listener_list";
import GuestList from "./right_content/guest/guest_list";
import LiveList from "./right_content/live_list";
import NoticeList from "./right_content/notice_list";
import FanList from "./right_content/fan_rank_list";
import FanListMy from "./right_content/fan_rank_my";
import FanListUser from "./right_content/fan_rank_user";
import SendGift from "./right_content/send_gift";
import GiftList from "./right_content/gift_list";
import Profile from "./right_content/profile";
import Report from "./right_content/send_report";
import GiftDal from "./right_content/gift_dal";
import Boost from "./right_content/boost";
import StoryList from "./right_content/story_list";
import MsgShort from "./right_content/msg_short";
import Setting from "./right_content/setting";
import Emoticon from "./right_content/emoticon";
import LikeList from "./right_content/like_list";
import SpecialDjList from "./right_content/special_list";
import MakeUp from "./right_content/makeup";
import MiniGame from "./right_content/mini_game";
import Roulette from "./right_content/roulette";
import Vote from "./right_content/vote";

// constant
import { tabType } from "../constant";

// static
import "./right_side.scss";
import VideoFilter from "./right_content/video_filter";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxRightTabType} from "../../../redux/actions/broadcastCtx";
import {setGlobalCtxUserProfile} from "../../../redux/actions/globalCtx";

export default function RightSide(props: {
  splashData: any;
  roomInfo: any;
  roomOwner: boolean;
  roomNo: string;
  forceChatScrollDown: boolean;
  setForceChatScrollDown: any;
}) {
  const { splashData, roomInfo, roomOwner, roomNo, forceChatScrollDown, setForceChatScrollDown } = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);

  const { rightTabType } = broadcastState;
  // profile
  const profile: any = globalState.userProfile;
  const { isLogin, memNo } = globalState.baseData;

  const tabBundle = (() => {
    if (roomOwner === true) {
      // DJ
      if (rightTabType === tabType.FAN_RANK) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.FAN_RANK, value: "팬 랭킹" },
        ];
      } else if (rightTabType === tabType.FAN_RANK_MY) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.FAN_RANK_MY, value: "팬 랭킹" },
        ];
      } else if (rightTabType === tabType.FAN_RANK_USER) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.FAN_RANK_USER, value: "팬 랭킹" },
        ];
      } else if (rightTabType === tabType.REPORT) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.REPORT, value: "차단/신고" },
        ];
      } else if (rightTabType === tabType.GIFT_DAL) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.GIFT_DAL, value: "선물" },
        ];
      } else if (rightTabType === tabType.NOTICE) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.NOTICE, value: "공지" },
        ];
      } else if (rightTabType === tabType.SHORT) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.SHORT, value: "퀵 메시지" },
        ];
      } else if (rightTabType === tabType.STORY) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.STORY, value: "사연" },
        ];
      } else if (rightTabType === tabType.SETTING) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.SETTING, value: "방송 설정" },
        ];
      } else if (rightTabType === tabType.EMOTICON) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.EMOTICON, value: "이모티콘" },
        ];
      } else if (rightTabType === tabType.LIKELIST) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.LIKELIST, value: "좋아요" },
        ];
      } else if (rightTabType === tabType.GUEST) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.GUEST, value: "게스트" },
        ];
      } else if (rightTabType === tabType.SPECIALDJLIST) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.SPECIALDJLIST, value: "스디약력" },
        ];
      } else if (rightTabType === tabType.BOOST) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.BOOST, value: "부스트" },
        ];
      } else if (rightTabType === tabType.GUEST_GIFT) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.BOOST, value: "부스트" },
        ];
      } else if (rightTabType === tabType.MAKE_UP) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.MAKE_UP, value: "메이크업" },
          { type: tabType.FILTER, value: "필터" },
        ];
      } else if (rightTabType === tabType.FILTER) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.MAKE_UP, value: "메이크업" },
          { type: tabType.FILTER, value: "필터" },
        ];
      } else if (rightTabType === tabType.MINI_GAME) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.MINI_GAME, value: "미니게임" },
        ];
      } else if (rightTabType === tabType.ROULETTE) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.ROULETTE, value: "룰렛" },
        ];
      } else if (rightTabType === tabType.VOTE) {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.VOTE, value: "투표" },
        ];
      } else {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
          { type: tabType.PROFILE, value: "프로필" },
          { type: tabType.NOTICE, value: "공지" },
        ];
      }
    } else {
      // 청취자
      if (isLogin === true)
        if (rightTabType === tabType.FAN_RANK) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.FAN_RANK, value: "팬 랭킹" },
          ];
        } else if (rightTabType === tabType.FAN_RANK_MY) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.FAN_RANK_MY, value: "팬 랭킹" },
          ];
        } else if (rightTabType === tabType.FAN_RANK_USER) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.FAN_RANK_USER, value: "팬 랭킹" },
          ];
        } else if (rightTabType === tabType.REPORT) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.REPORT, value: "차단/신고" },
          ];
        } else if (rightTabType === tabType.SPECIALDJLIST) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.SPECIALDJLIST, value: "스디약력" },
          ];
        } else if (rightTabType === tabType.PROFILE) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.NOTICE, value: "공지" },
          ];
        } else if (rightTabType === tabType.BOOST) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.BOOST, value: "부스터" },
          ];
        } else if (rightTabType === tabType.GIFT_DAL) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.GIFT_DAL, value: "선물" },
          ];
        } else if (rightTabType === tabType.NOTICE) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.NOTICE, value: "공지" },
          ];
        } else if (rightTabType === tabType.SHORT) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.SHORT, value: "퀵 메시지" },
          ];
        } else if (rightTabType === tabType.STORY) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.STORY, value: "사연" },
          ];
        } else if (rightTabType === tabType.EMOTICON) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.EMOTICON, value: "이모티콘" },
          ];
        } else if (rightTabType === tabType.LIKELIST) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.LIKELIST, value: "좋아요" },
          ];
        } else if (rightTabType === tabType.GUEST) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.GUEST, value: "게스트" },
          ];
        } else if (rightTabType === tabType.MINI_GAME) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.MINI_GAME, value: "미니게임" },
          ];
        } else if (rightTabType === tabType.ROULETTE) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.ROULETTE, value: "룰렛" },
          ];
        } else if (rightTabType === tabType.VOTE) {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.VOTE, value: "투표" },
          ];
        } else {
          return [
            { type: tabType.LISTENER, value: "청취자" },
            { type: tabType.LIVE, value: "라이브" },
            { type: tabType.PROFILE, value: "프로필" },
            { type: tabType.NOTICE, value: "공지" },
          ];
        }
      // logout
      else {
        return [
          { type: tabType.LISTENER, value: "청취자" },
          { type: tabType.LIVE, value: "라이브" },
        ];
      }
    }
  })();

  function typeRender(type: tabType) {
    switch (type) {
      case tabType.LIVE: {
        return <LiveList common={splashData} roomOwner={roomOwner} roomNo={roomNo} />;
      }
      case tabType.LISTENER: {
        return <ListenerList roomInfo={roomInfo} roomOwner={roomOwner} roomNo={roomNo} profile={profile} />;
      }
      case tabType.PROFILE: {
        return <Profile roomInfo={roomInfo} profile={profile} roomNo={roomNo} roomOwner={roomOwner} />;
      }
      case tabType.FAN_RANK: {
        return <FanList profile={profile} />;
      }
      case tabType.FAN_RANK_MY: {
        return <FanListMy profile={profile} />;
      }
      case tabType.FAN_RANK_USER: {
        return <FanListUser profile={profile} />;
      }
      case tabType.REPORT: {
        return <Report roomNo={roomNo} profile={profile} />;
      }
      case tabType.BOOST: {
        return <Boost roomNo={roomNo} roomOwner={roomOwner} roomInfo={roomInfo} />;
      }
      case tabType.GIFT_DAL: {
        return <GiftDal profile={profile} common={splashData} />;
      }
      case tabType.GIFT_GIVE: {
        if (isLogin === true) return <SendGift roomInfo={roomInfo} roomNo={roomNo} roomOwner={roomOwner} />;
        else return <></>;
      }
      case tabType.GIFT_LIST: {
        if (isLogin) return <GiftList roomNo={roomNo} />;
        else return <></>;
      }
      case tabType.GUEST: {
        return <GuestList roomNo={roomNo} />;
      }
      case tabType.NOTICE: {
        return <NoticeList roomOwner={roomOwner} roomNo={roomNo} />;
      }
      case tabType.STORY: {
        return <StoryList roomInfo={roomInfo} roomOwner={roomOwner} roomNo={roomNo} />;
      }
      case tabType.SPECIALDJLIST: {
        return <SpecialDjList />;
      }
      case tabType.SHORT: {
        if (isLogin === true) {
          return <MsgShort />;
        } else {
          return <></>;
        }
      }
      case tabType.EMOTICON: {
        if (isLogin === true) {
          return <Emoticon roomNo={roomNo} setForceChatScrollDown={setForceChatScrollDown} roomOwner={roomOwner} />;
        } else {
          return <></>;
        }
      }
      case tabType.LIKELIST: {
        if (isLogin === true) {
          return <LikeList profile={profile} roomNo={roomNo} />;
        } else {
          return <></>;
        }
      }
      case tabType.SETTING: {
        return <Setting roomInfo={roomInfo} roomNo={roomNo} />;
      }
      case tabType.GUEST_GIFT: {
        if (isLogin === true) return <SendGift roomInfo={roomInfo} roomNo={roomNo} roomOwner={roomOwner} />;
        else return <></>;
      }
      case tabType.MAKE_UP: {
        return <MakeUp />;
      }
      case tabType.FILTER: {
        return <VideoFilter />;
      }
      case tabType.MINI_GAME: {
        return <MiniGame roomNo={roomNo} />;
      }
      case tabType.ROULETTE: {
        return <Roulette roomNo={roomNo} />;
      }
      case tabType.VOTE: {

        return <Vote {...{roomInfo, roomOwner, roomNo}} />;
      }
    }
  }

  useEffect(() => {
    if (isLogin === false) {
      dispatch(setBroadcastCtxRightTabType(tabType.PROFILE));
    }

    if (isLogin === true) {
      getProfile({ memNo }).then((res) => {
        const { result, data } = res;
        if (result === "success") {
          dispatch(setGlobalCtxUserProfile(data));
        }
      });
    }
  }, [isLogin]);

  return (
    <div className="right-side">
      {
        <>
          <div className="tabBox">
            {tabBundle.map((info, idx) => {
              const { value, type } = info;
              return (
                <div
                  className={`btnTab ${rightTabType === type ? "btnTab--active" : ""}`}
                  key={`tab-${idx}`}
                  onClick={() => {
                    dispatch(setBroadcastCtxRightTabType(type));
                  }}
                >
                  {value}
                </div>
              );
            })}
          </div>
          {
            globalState.rtcInfo && globalState.chatInfo.privateChannelHandle &&
            <div className="tabContent">{typeRender(rightTabType)}</div>
          }
        </>
      }
    </div>
  );
}
