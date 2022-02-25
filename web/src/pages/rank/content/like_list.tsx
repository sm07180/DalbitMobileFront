import React, { useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";

// context
import { GlobalContext } from "context";
import { RankContext } from "context/rank_ctx";

import NoResult from "common/ui/no_result";
import MyProfile from "./myProfile";
import LikeListTop from "./like_list_top";
import GuidePop from "./rank_guide_pop";

//static
import guideIcon from "../static/guide_s.svg";
import goodIcon from "../static/like_w_m.svg";
import likeIcon from "../static/like_g_s.svg";
import goldMedalIcon from "../static/medal_gold_b.svg";
import silverMedalIcon from "../static/medal_silver_b.svg";
import bronzeMedalIcon from "../static/medal_bronze_m.svg";
import likeRedIcon from "../static/like_red_m.svg";

import { RANK_TYPE } from "../constant";

function LikeList({ empty }) {
  const history = useHistory();
  const { globalState } = useContext(GlobalContext);
  const { rankState } = useContext(RankContext);

  const { formState, likeList, rankList } = rankState;

  const sliceStart = useMemo(() => {
    if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
      return 3;
    } else {
      return 0;
    }
  }, [formState]);

  return (
    <>
      {empty === true ? (
        <NoResult type="default" text="랭킹이 없습니다." />
      ) : (
        <>
          {globalState.baseData.isLogin ? (
            <div className="likeTopBox">
              <MyProfile />
              <LikeListTop />
            </div>
          ) : (
            <div className="likeTopBox">
              <LikeListTop />
            </div>
          )}
          <div className="userRanking bottomList">
            <ul>
              {rankList.slice(sliceStart).map((list, index) => {
                const {
                  nickNm,
                  djNickNm,
                  fanMemNo,
                  profImg,
                  holder,
                  level,
                  grade,
                  djGoodPoint,
                  djMemNo,
                  goodPoint,
                  roomNo,
                  rank,
                  upDown,
                  memNo,
                } = list;

                return (
                  <li key={index} className="myRanking rankingList">
                    <div className="myRanking__rank levelListBox__levelBox">
                      {/* {rank === 1 ? (
                        <img src={goldMedalIcon} className="levelListBox__levelBox--rankImg" />
                      ) : rank === 2 ? (
                        <img src={silverMedalIcon} className="levelListBox__levelBox--rankImg" />
                      ) : rank === 3 ? (
                        <img src={bronzeMedalIcon} className="levelListBox__levelBox--rankImg" />
                      ) : (
                        <div className="myRanking__rank--ranking">{rank}</div>
                      )} */}
                      <div className="myRanking__rank--ranking">{rank}</div>
                      <div className="levelListBox__levelBox--updown">
                        {upDown === "-" ? (
                          <span className="levelListBox__levelBox--updown__new"></span>
                        ) : upDown === "new" ? (
                          <span className="levelListBox__levelBox--updown__new">NEW</span>
                        ) : upDown[0] === "+" ? (
                          <span className="levelListBox__levelBox--updown__up">{Math.abs(parseInt(upDown))}</span>
                        ) : (
                          <span className="levelListBox__levelBox--updown__down">{Math.abs(parseInt(upDown))}</span>
                        )}
                      </div>
                    </div>
                    <div
                      className="thumbBox"
                      onClick={() => {
                        if (globalState.baseData.isLogin) {
                          history.push(`/profile/${memNo}`);
                        } else {
                          history.push("/login");
                        }
                      }}
                    >
                      <img src={profImg.thumb292x292} className="thumbBox__pic" />
                    </div>
                    <div className="likeDetailWrap">
                      <div
                        className="likeListDetail"
                        onClick={() => {
                          if (globalState.baseData.isLogin) {
                            history.push(`/profile/${memNo}`);
                          } else {
                            history.push("/login");
                          }
                        }}
                      >
                        <div className="fanGoodBox">
                          <img src={likeRedIcon} />
                          <span>{goodPoint.toLocaleString()}</span>
                        </div>
                        <div className="nickNameBox">{nickNm}</div>
                      </div>

                      {/* <div className="countBox">
                      
                    </div> */}
                      <div className="bestFanBox">
                        <span className="bestFanBox__label">심쿵유발자</span>
                        <span
                          className="bestFanBox__nickname"
                          onClick={() => {
                            if (globalState.baseData.isLogin) {
                              history.push(`/profile/${djMemNo}`);
                            } else {
                              history.push("/login");
                            }
                          }}
                        >
                          {djNickNm}
                        </span>
                        <span className="bestFanBox__icon">
                          <img src={likeIcon} />
                          {djGoodPoint}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

export default React.memo(LikeList);
