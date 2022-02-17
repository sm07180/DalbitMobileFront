import React, { useEffect, useContext } from "react";


import { DalbitScroll } from "common/ui/dalbit_scroll";
import {useSelector} from "react-redux";

export default ({ setPopState }) => {
  const rankState = useSelector(({rank}) => rank);
  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };
  const closePopup = () => {
    setPopState(false);
    // rank.action('')
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer">
        <div className="layerContent speicalPointPop">
          <div>
            <p className="topBox">
              <span>{rankState.specialPoint.nickNm} 님</span>은<br />
              스페셜 DJ 선발 누적 가산점
              <br />
              <span>{rankState.specialPoint.totalPoint}점</span>을 획득했습니다
            </p>

            <div className="table">
              <div className="table__th">
                <span>구분</span>
                <span>일자</span>
                <span>가산점</span>
              </div>
              <DalbitScroll height={200}>
                <ul>
                  {rankState.specialPointList.map((item, index) => {
                    const { rankDate, rank, addPoint, timeRound } = item;

                    const roundChage = () => {
                      if (timeRound === 0) {
                        return <>일간</>;
                      } else {
                        return <>타임</>;
                      }
                    };

                    return (
                      <li key={index}>
                        <span>
                          {roundChage()} {rank}위
                        </span>
                        <span>
                          {rankDate} {timeRound !== 0 && <>({timeRound}회차)</>}
                        </span>
                        <span>{addPoint}</span>
                      </li>
                    );
                  })}
                </ul>
              </DalbitScroll>
            </div>

            <p className="noteBox">
              ※ 스페셜 DJ 선발 누적 가산점은 선발 총점 100점 기준
              <br />월 최대 10점까지만 인정되며 표기됩니다.
              <br />
              단, 매월 스페셜 DJ 선발 데이터 수집 기간 변동에 따라
              <br />
              내부 검토 시 수집 기간 외 점수는 이월되어 집계됩니다.
            </p>
          </div>
        </div>
        <button className="btnClose" onClick={() => closePopup()}>
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" />
        </button>
      </div>
    </div>
  );
};
