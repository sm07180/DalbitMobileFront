import React, { useContext } from "react";
import { ModalContext } from "context/modal_ctx";
import { useHistory } from "react-router-dom";
import { DalbitScroll } from "common/ui/dalbit_scroll";

import IconMoney from "../static/ic_money.svg";

import "./pay.scss";

// components
import Header from "common/ui/header";
import Layout from "common/layout";

export default function Payment() {
  const history = useHistory();
  const { modalState } = useContext(ModalContext);
  const { payInfo } = modalState;
  const { itemPrice, name, bankNo, phone } = payInfo;

  return (
    <>
      <Header title="무통장 입금(계좌이체)" />
      <div id="pay" className="subContent gray">
        <div className="content">
          <div className="payHold">
            <h2 className="payHold__title">결제 대기 중...</h2>

            <div className="payHold__sub">
              <strong>
                <span>{phone}</span>(으)로 <br /> 입금하실 가상계좌 정보를 발송했습니다.
                <br />
              </strong>
              <p>
                24시간 내 해당계좌로 입금하시면 <br /> 달 충전이 완료됩니다.
              </p>{" "}
            </div>
          </div>

          <div className="deposit">
            <div className="deposit__list">
              <div className="list__label">입금하실 금액</div>
              <div className="deposit__value">{Number(itemPrice).toLocaleString()}원(부가세 포함)</div>
            </div>
            <div className="deposit__list">
              <div className="list__label">예금주</div>
              <div className="deposit__value">(주)여보야</div>
            </div>
            <div className="deposit__list">
              <div className="list__label">입금은행</div>
              <div className="deposit__value">KB 국민은행</div>
            </div>
            <div className="deposit__list">
              <div className="list__label">계좌번호</div>
              <div className="deposit__value">{bankNo}</div>
            </div>
            <div className="deposit__list">
              <div className="list__label">입금자</div>
              <div className="deposit__value">{name}</div>
            </div>
          </div>
          {/* <div className="inquiry">
            <span className="inquriy__title">결제 문의</span>
            <span className="inquiry__number">1522-0251</span>
          </div> */}

          <button className="payButton payButton--active" onClick={() => history.push("/store")}>
            확인
          </button>
        </div>
      </div>
    </>
  );
}
