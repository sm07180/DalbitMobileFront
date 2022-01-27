import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function RankGuide({ guideState, setGuidePop }) {
  const history = useHistory();

  const closePopup = () => {
    setGuidePop(false);
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
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
        {guideState === "level" ? (
          <>
            <h3>레벨 랭킹</h3>
            <div className="layerContent guidePopWrap">
              <span>레벨(경험치) TOP 200의 순위입니다</span>
              <br />

              <span>단, 최근 7일 간 미접속 대상자는</span>

              <span>리스트에서 일시 제외됩니다.</span>

              <br />
              <span>'최고팬'은 랭커의 팬랭킹 1위를 뜻합니다.</span>

              <div className="btnWrap">
                <button className="btn" onClick={closePopup}>
                  확인
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3>좋아요 랭킹</h3>
            <div className="layerContent guidePopWrap">
              <p className="topBox">
                보낸 좋아요 개수(부스터 포함)
                <br />
                <span>TOP 200의 순위입니다.</span>
              </p>
              <p className="middleBox">
                <span className="colorRed">'심쿵유발자'</span>는 랭커로부터 <span>가장 많은 좋아요</span> <br />
                (부스터 포함)를 받은 사람입니다.
              </p>

              <div className="btnWrap">
                <button className="btn" onClick={closePopup}>
                  확인
                </button>
              </div>
            </div>
          </>
        )}

        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
}
