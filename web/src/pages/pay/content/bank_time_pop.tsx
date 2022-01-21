import React from "react";

import { useHistory } from "react-router-dom";

export default function bankTimePop({ setBankPop, goBank }) {
  const history = useHistory();

  const closePopup = () => {
    setBankPop(false);
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPopup") {
      closePopup();
    }
  };

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer isGray">
        <h3>무통장 입금이 지연되는 경우</h3>
        <div className="layerContent bankInfoBox">
          <p className="bankInfoBox__time">
            23시 50분 ~ 00시 10분은
            <br />
            <span>금융기관 시스템을 주로 점검하는 시간</span>입니다.
          </p>
          <p className="bankInfoBox__desc">
            무통장 입금이 지연되는 경우
            <br />
            해당 은행의 시스템 점검시간을 확인하세요.
          </p>

          <div className="bankTime">
            <button onClick={() => history.push("/payment/bank_info")}>은행별 점검시간 확인 &gt; </button>
            <p>
              ※ <span>다른 결제수단</span>을 이용하시면 <br />
              보다 빠르게 달 충전을 할 수 있습니다.
            </p>
          </div>

          <div className="btnWrap">
            <button onClick={() => setBankPop(false)}>다른 결제수단</button>
            <button
              onClick={() => {
                setBankPop(false);
                goBank();
              }}
            >
              계속하기
            </button>
          </div>
        </div>
        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  );
}
