import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "context/modal_ctx";
import { useHistory } from "react-router-dom";

// components
import Header from "common/ui/header";
import Layout from "common/layout";

import "./pay.scss";

export default function Payment() {
  const history = useHistory();
  const { modalState, modalAction } = useContext(ModalContext);
  const { payInfo } = modalState;
  const { itemName, itemPrice, payMethod, phone, orderId, cardName, itemCnt, returntype } = payInfo;

  const createTypeResult = () => {
    if (payMethod === "카드 결제") {
      return (
        <>
          <div className="buyList__wrap">
            <div className="buyList__label">결제카드</div>
            <div className="buyList__value">{cardName}</div>
          </div>
          <div className="buyList__wrap">
            <div className="buyList__label">주문번호</div>
            <div className="buyList__value">{orderId}</div>
          </div>
        </>
      );
    } else if (payMethod === "휴대폰 결제") {
      return (
        <>
          <div className="buyList__wrap">
            <div className="buyList__label">휴대폰번호</div>
            <div className="buyList__value">{phone}</div>
          </div>
          <div className="buyList__wrap">
            <div className="buyList__label">주문번호</div>
            <div className="buyList__value">{orderId}</div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="buyList__wrap">
            <div className="buyList__label">주문번호</div>
            <div className="buyList__value">{orderId}</div>
          </div>
        </>
      );
    }
  };

  const handleClick = () => {
    if (returntype === "chooseok") {
      history.push("/event/purchase");
    } else {
      history.push("/store");
    }
  };

  return (
    <>
      <Header title="결제완료" type="noBack" />
      <div id="pay" className="subContent gray">
        <div className="content">
          <div className="buyList result">
            <h2 className="charge__title">결제가 완료 되었습니다.</h2>

            <div className="buyList__box">
              <div className="buyList__wrap">
                <div className="buyList__label">결제금액</div>
                <div className="buyList__value">
                  <strong>{itemPrice.toLocaleString()}</strong>원 (부가세 포함)
                </div>
              </div>
              <div className="buyList__wrap">
                <div className="buyList__label">상품명</div>
                <div className="buyList__value">
                  {itemName} X {itemCnt}
                </div>
              </div>
              <div className="buyList__wrap">
                <div className="buyList__label">결제수단</div>
                <div className="buyList__value">{payMethod}</div>
              </div>
              {createTypeResult()}
            </div>

            <p className="buyResult__text">
              결제 내역은 마이페이지 &gt; 내지갑에서 <br />
              확인하실 수 있습니다.
              {/* <br />
                확인 버튼을 누르시면 팝업창을 닫습니다. */}
            </p>
          </div>

          <button className="payButton payButton--active" onClick={handleClick}>
            확인
          </button>
        </div>
      </div>
    </>
  );
}
