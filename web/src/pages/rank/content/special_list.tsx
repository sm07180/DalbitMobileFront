import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import { addComma } from "../../../lib/common_fn";
import { GlobalContext } from "context";
import { RankContext } from "context/rank_ctx";
import { RoomValidateFromClip } from "common/audio/clip_func";

import NoResult from "common/ui/no_result";
import SpecialHandleHistory from "./special_history_handle";
import ProfileImage from "common/ui/profileImage";
import live from "../static/live_m.svg";

function SpecialList({ empty }) {
  const history = useHistory();
  const { globalState } = useContext(GlobalContext);
  const { rankState } = useContext(RankContext);

  const gtx = useContext(GlobalContext);

  const { specialList } = rankState;

  return (
    <>
      <SpecialHandleHistory />
      <div className="specialPage">
        <p className="specialText">달빛라이브의 스타 스페셜 DJ를 소개합니다.</p>
        <ul className="levelListWrap">
          {empty === true ? (
            <NoResult />
          ) : (
            <>
              {specialList.map((v, idx) => {
                const imageData = {
                  profImg: v.profImg.thumb120x120,
                  holder: v.holder,
                  level: v.level,
                };

                return (
                  <li key={idx} className="levelListBox">
                    <div className="specialBox">
                      {v.isNew === true ? <span className="new">NEW</span> : <span>{v.specialCnt}회</span>}
                    </div>
                    <div className="infoBox flexBox">
                      <div
                        className="profileBox"
                        onClick={() => {
                          if (globalState.baseData.isLogin) {
                            history.push(`/mypage/${v.memNo}`);
                          } else {
                            history.push("/login");
                          }
                        }}
                      >
                        <ProfileImage imageData={imageData} imageSize={74} />
                      </div>
                      <div>
                        <div
                          className="nickNameBox"
                          onClick={() => {
                            if (globalState.baseData.isLogin) {
                              history.push(`/mypage/${v.memNo}`);
                            } else {
                              history.push("/login");
                            }
                          }}
                        >
                          {v.nickNm}
                        </div>
                        <div className="genderBox">
                          <LevelBox levelColor={v.levelColor}>Lv{v.level}</LevelBox>

                          {v.gender !== "" && (
                            <em className={`icon_wrap ${v.gender === "m" ? "icon_male" : "icon_female"}`}>
                              <span className="blind">성별</span>
                            </em>
                          )}
                        </div>
                        <div className="countBox">
                          <span>
                            <i className="icon icon--like">회색 하트 아이콘</i> {addComma(v.goodCnt)}
                          </span>
                          <span>
                            <i className="icon icon--people">사람 아이콘</i> {addComma(v.listenerCnt)}
                          </span>
                          <span>
                            <i className="icon icon--time">시계 아이콘</i> {addComma(v.broadMin)}
                          </span>
                        </div>
                      </div>

                      {v.roomNo !== "" && (
                        <div className="liveBox">
                          <img
                            src={live}
                            onClick={() => {
                              RoomValidateFromClip(v.roomNo, gtx, history, v.nickNm);
                            }}
                            className="liveBox__img"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default React.memo(SpecialList);

const LevelBox = styled.div`
  ${(props) => {
    if (props.levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.levelColor[0]}, ${props.levelColor[1]} 51%, ${props.levelColor[2]});
      `;
    } else {
      return css`
        background-color: ${props.levelColor[0]};
      `;
    }
  }};
  width: 44px;
  height: 16px;
  border-radius: 14px;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`;
