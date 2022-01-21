import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "context";
import { useHistory } from "react-router-dom";

import Swiper from "react-id-swiper";
// static
const GoldMedal = `https://image.dalbitlive.com/main/200714/ico-ranking-gold.png`;
const SilverMedal = `https://image.dalbitlive.com/main/200714/ico-ranking-silver.png`;
const BronzeMedal = `https://image.dalbitlive.com/main/200714/ico-ranking-bronze.png`;
const LiveIcon = "https://image.dalbitlive.com/svg/ic_live.svg";
const ListenIcon = "https://image.dalbitlive.com/svg/ico_listen.svg";

type RankingType = {
  list: Array<any>;
};

export default function RealTimeRank(props: any) {
  const history = useHistory();
  const { list, type } = props;

  const { globalState, globalAction } = useContext(GlobalContext);
  const { baseData } = globalState;
  const { isLogin } = baseData;
  const goMypage = (memNo: string) => {
    if (isLogin) {
      history.push(`/mypage/${memNo}`);
    } else if (isLogin === false) {
      globalAction.setUrlInfo!((prevState) => ({
        ...prevState,
        type: `mypage`,
        memNo: memNo,
      }));
      history.push("/login");
    }
  };

  const swiperRealSlide: any = {
    slidesPerView: "auto",
    rebuildOnUpdate: true,
  };

  return (
    <>
      <Swiper {...swiperRealSlide}>
        {list.slice(0, 10).map((item, idx) => {
          const { profImg, rank, nickNm, likes, listeners, memNo, liveBadgeList, roomNo, listenRoomNo } = item;

          return (
            <div className="rankingItem slideWrap" key={`dj-${idx}`} onClick={() => goMypage(memNo)}>
              <div className="rankingItem__thumb">
                {idx > 2 ? (
                  <></>
                ) : liveBadgeList.length > 0 ? (
                  <img className="live-medal-img" src={liveBadgeList[0].icon} />
                ) : (
                  <img className="medal-img" src={idx === 0 ? GoldMedal : idx === 1 ? SilverMedal : BronzeMedal} />
                )}
                <img src={profImg["thumb190x190"]} className="rankingItem__thumb--img" />
                {type === "dj" && roomNo !== undefined && roomNo !== "" && (
                  <em className="icon_wrap icon_live icon_live_ranking">라이브중</em>
                )}
                {type === "fan" && listenRoomNo !== undefined && listenRoomNo !== "" && (
                  <em className="icon_wrap icon_listen icon_listen_ranking">청취중</em>
                )}
              </div>

              <p className="rankingItem__nick">{nickNm}</p>
            </div>
          );
        })}
      </Swiper>
    </>
  );
}
