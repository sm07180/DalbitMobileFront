import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
// context
import { GlobalContext } from "context";

import NoResult from "common/ui/no_result";
import GuidePop from "./rank_guide_pop";

//static
import guideIcon from "../static/guide_s.svg";
import {useSelector} from "react-redux";
function LevelList({ empty }) {
  const history = useHistory();
  const { globalState } = useContext(GlobalContext);
  const rankState = useSelector(({rank}) => rank);

  const { levelList } = rankState;

  const [guidePop, setGuidePop] = useState(false);
  const [guideState, setGuideState] = useState("level");

  return (
    <>
      <div className="renewalBox">
        <span>매일 00시 집계 및 갱신</span>
        <img
          src={guideIcon}
          onClick={() => {
            setGuidePop(true);
            setGuideState("level");
          }}
        />
      </div>

      <ul className="levelListWrap">
        {empty === true ? (
          <NoResult type="default" text="랭킹이 없습니다." />
        ) : (
          <>
            {levelList.map((list, index) => {
              const {
                nickNm,
                fanNickNm,
                fanMemNo,
                profImg,
                holder,
                level,
                grade,
                fanCnt,
                roomNo,
                listenerCnt,
                memNo,
                levelColor,
              } = list;

              return (
                <li key={index} className="levelListBox">
                  <LevelBox levelColor={levelColor}>{level}</LevelBox>
                  <div
                    className="thumbBox"
                    onClick={() => {
                      if (globalState.baseData.isLogin) {
                        history.push(`/mypage/${memNo}`);
                      } else {
                        history.push("/login");
                      }
                    }}
                  >
                    <img src={holder} className="thumbBox__frame" />
                    <img src={profImg.thumb120x120} className="thumbBox__pic" />
                  </div>
                  <div>
                    <div className="nickNameBox">{nickNm}</div>
                    <div className="countBox">
                      <span>
                        <i className="icon icon--fan"></i> {fanCnt}
                      </span>
                      <span>
                        <i className="icon icon--people"></i> {listenerCnt}
                      </span>
                    </div>
                    <div className="bestFanBox">
                      <span className="bestFanBox__label">최고팬</span>
                      <span
                        className="bestFanBox__nickname"
                        onClick={() => {
                          if (globalState.baseData.isLogin) {
                            history.push(`/mypage/${fanMemNo}`);
                          } else {
                            history.push("/login");
                          }
                        }}
                      >
                        {fanNickNm}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </>
        )}
      </ul>
      {guidePop && <GuidePop guideState={guideState} setGuidePop={setGuidePop} />}
    </>
  );
}

export default React.memo(LevelList);

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
  min-width: 44px;
  height: 22px;
  border-radius: 14px;
  font-weight: 500;
  font-size: 16px;
  color: #fff;
  text-align: center;
`;
