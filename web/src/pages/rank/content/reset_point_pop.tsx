import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setRankData} from "../../../redux/actions/rank";
import {setGlobalCtxAlertStatus} from "../../../redux/actions/globalCtx";

export default function RankGuide({ setResetPointPop, rankSettingBtn, setRankSetting }) {
  const dispatch = useDispatch();
  const rankState = useSelector(({rankCtx}) => rankCtx);
  const history = useHistory();

  const closePopup = () => {
    setResetPointPop(false);
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
        <div className="layerContent resetPopWrap">
          <p>
            <strong>[반영하지 않기]</strong>로 설정되어 있는 동안
            <br />
            실시간 팬 랭킹 점수가 반영되지 않습니다.
            <br />
            (일간/주간/월간 공통 적용)
          </p>
          <p className="warning">
            지금부터 실시간 팬 랭킹 점수를
            <br />
            반영하지 않겠습니까?
          </p>
          <div className="btnWrap">
            <button className="btn btn_cancel" onClick={() => closePopup()}>
              취소
            </button>
            <button
              className="btn btn_ok"
              onClick={() => {
                dispatch(setGlobalCtxAlertStatus({
                  status: true,
                  content: `지금부터 팬 랭킹 점수가<br />반영되지 않습니다.`,
                  callback: () => {
                    closePopup();
                    rankSettingBtn(false);
                    setRankSetting(false);
                    dispatch(setRankData({
                      ...rankState.rankData,
                      isRankData: false,
                    }))
                  },
                }));
              }}
            >
              확인
            </button>
          </div>

          <ul className="notice">
            <li>* 현재까지 누적된 팬 랭킹 점수는 유지됩니다.</li>
            <li>* 언제든지 반영 상태로 변경할 수 있습니다.</li>
          </ul>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
}
