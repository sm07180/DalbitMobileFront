import React, { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

//constant
import { RANK_TYPE, DATE_TYPE } from "../constant";

import goldDecoDj from "../static/djrf1_deco@3x.png";
import sliverDecoDj from "../static/djrf2_deco@3x.png";
import bronzeDecoDj from "../static/djrf3_deco@3x.png";
import goldDecoFan from "../static/fanrf1_deco@3x.png";
import sliverDecoFan from "../static/fanrf2_deco@3x.png";
import bronzeDecoFan from "../static/fanrf3_deco@3x.png";
import {useDispatch, useSelector} from "react-redux";

function LikeListTop() {
  const history = useHistory();
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const rankState = useSelector(({rank}) => rank);
  const { formState, likeList, rankList } = rankState;

  const TopBoxRef = useRef<any>(null);

  const creatList = () => {
    const rank = rankList;
    const baseCount = 3;

    let rankResult;
    if (rank.length < 3) {
      rankResult = [...rank].concat(Array(baseCount - rank.length).fill(null));
    } else {
      rankResult = rank;
    }

    return (
      <div className="userRanking">
        <div className="TopBoxLike" ref={TopBoxRef}>
          {rankResult.slice(0, 3).map((item, index) => {
            if (item === null) return <div className="TopBoxLike__item" key={index}></div>;
            const { nickNm, profImg, roomNo, memNo, djProfImg, djMemNo, djNickNm } = item;
            return (
              <div className="TopBoxLike__item" key={index}>
                <div
                  className={`TopBoxThumb ${formState[formState.pageType].rankType === RANK_TYPE.DJ ? "dj" : "fan"}`}
                  onClick={() => {
                    if (globalState.baseData.isLogin) {
                      history.push(`/profile/${memNo}`);
                    } else {
                      history.push("/login");
                    }
                  }}
                >
                  <img src={profImg.thumb120x120} className="TopBoxThumb__pic" />
                </div>

                <div className="nickNameBox">
                  <p className="nickNameBox__nick">{nickNm}</p>
                </div>

                <div className="cupidBox">
                  <div className="cupidItem">
                    <div
                      className="thumbBox"
                      onClick={() => {
                        if (globalState.baseData.isLogin) {
                          if (globalState.baseData.memNo === memNo) {
                            history.push(`/myProfile`);
                          } else {
                            history.push(`/profile/${djMemNo}`);
                          }
                        } else {
                          history.push(`/login`);
                        }
                      }}
                    >
                      <img src={djProfImg && djProfImg.thumb120x120} alt={djNickNm} />
                    </div>
                    <p className="nickName">{djNickNm}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return creatList();
}

export default React.memo(LikeListTop);
