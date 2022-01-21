import React, { useContext, useCallback } from "react";

import { tabType } from "../constant";

import { ClipContext } from "context/clip_ctx";

import Profile from "../components/profile";
import GiftGive from "../components/gift_give";
import PlayList from "../components/play_list";
import Reply from "../components/reply";
import GiftList from "../components/gift_list";
import GiftRank from "../components/gift_rank";
import Report from "../components/report";
import FanRankMy from "../components/fan_rank_my";
import FanRankUser from "../components/fan_rank_user";
import SpecialDjList from "../components/special_list";

export default function ClipRightTabRender() {
  const { clipState, clipAction } = useContext(ClipContext);
  const { rightTabType } = clipState;

  const tabBundle = (() => {
    if (!clipState.isMyClip) {
      if (
        rightTabType === tabType.PROFILE ||
        rightTabType === tabType.GIFT_GIVE ||
        rightTabType === tabType.PLAY_LIST ||
        rightTabType === tabType.REPLY
      ) {
        return [
          { id: 0, type: tabType.PROFILE, value: "프로필" },
          { id: 1, type: tabType.GIFT_GIVE, value: "선물하기" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.GIFT_RANK) {
        return [
          { id: 0, type: tabType.PROFILE, value: "프로필" },
          { id: 4, type: tabType.GIFT_RANK, value: "선물랭킹" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.REPORT) {
        return [
          { id: 0, type: tabType.REPORT, value: "차단/신고" },
          { id: 1, type: tabType.GIFT_GIVE, value: "선물하기" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.FAN_RANK_MY) {
        return [
          { id: 0, type: tabType.FAN_RANK_MY, value: "팬 랭킹" },
          { id: 1, type: tabType.GIFT_GIVE, value: "선물하기" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.FAN_RANK_USER) {
        return [
          { id: 0, type: tabType.FAN_RANK_USER, value: "팬 랭킹" },
          { id: 1, type: tabType.GIFT_GIVE, value: "선물하기" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.SPECIALDJLIST) {
        return [
          { id: 0, type: tabType.SPECIALDJLIST, value: "스디약력" },
          { id: 1, type: tabType.GIFT_GIVE, value: "선물하기" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      }
    } else {
      if (
        rightTabType === tabType.PROFILE ||
        rightTabType === tabType.GIFT_LIST ||
        rightTabType === tabType.PLAY_LIST ||
        rightTabType === tabType.REPLY
      ) {
        return [
          { id: 0, type: tabType.PROFILE, value: "프로필" },
          { id: 5, type: tabType.GIFT_LIST, value: "선물내역" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.GIFT_RANK) {
        return [
          { id: 0, type: tabType.PROFILE, value: "프로필" },
          { id: 5, type: tabType.GIFT_LIST, value: "선물내역" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.FAN_RANK_MY) {
        return [
          { id: 0, type: tabType.FAN_RANK_MY, value: "팬 랭킹" },
          { id: 5, type: tabType.GIFT_LIST, value: "선물내역" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.FAN_RANK_USER) {
        return [
          { id: 0, type: tabType.FAN_RANK_USER, value: "팬 랭킹" },
          { id: 5, type: tabType.GIFT_LIST, value: "선물내역" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      } else if (rightTabType === tabType.SPECIALDJLIST) {
        return [
          { id: 0, type: tabType.SPECIALDJLIST, value: "스디약력" },
          { id: 5, type: tabType.GIFT_LIST, value: "선물내역" },
          { id: 2, type: tabType.PLAY_LIST, value: "재생목록" },
          { id: 3, type: tabType.REPLY, value: "댓글" },
        ];
      }
    }
  })();

  const RenderTabType = useCallback((type: tabType) => {
    switch (type) {
      case tabType.PROFILE: {
        return <Profile />;
      }

      case tabType.GIFT_GIVE: {
        return <GiftGive />;
      }

      case tabType.PLAY_LIST: {
        return <PlayList />;
      }

      case tabType.REPLY: {
        return <Reply />;
      }

      case tabType.GIFT_RANK: {
        return <GiftRank />;
      }

      case tabType.REPORT: {
        return <Report />;
      }

      case tabType.GIFT_LIST: {
        return <GiftList />;
      }

      case tabType.FAN_RANK_MY: {
        return <FanRankMy />;
      }

      case tabType.FAN_RANK_USER: {
        return <FanRankUser />;
      }
      case tabType.SPECIALDJLIST: {
        return <SpecialDjList />;
      }
    }
  }, []);

  return (
    <div className="rightSide">
      <div className="tabBox">
        {tabBundle &&
          tabBundle.map((tab, idx) => {
            const { value, type } = tab;
            return (
              <div
                className={`tabBox__btnTab ${rightTabType === type ? " tabBox__btnTab--active" : ""}`}
                onClick={() => clipAction.setRightTabType && clipAction.setRightTabType(type)}
                key={`tab-${idx}`}
              >
                {value}
              </div>
            );
          })}
      </div>
      <div className="tabContent">{RenderTabType(rightTabType)}</div>
    </div>
  );
}
