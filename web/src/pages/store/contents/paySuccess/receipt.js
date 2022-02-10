import React from 'react';
import Utility from "components/lib/utility";
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";
import './receipt.scss'

import {useHistory, useLocation} from "react-router-dom";

const Receipt = () => {
  const history = useHistory();
  const location = useLocation();
  const { info, payType } = location.state
  console.log(location.state);

  return (
    <section className="bankResult">
      <div className="resultText">
        <div className="title">
          결제가 완료 되었습니다.
        </div>
        <div className="subTitle">
          결제 내역은 마이페이지 > 내지갑에서<br />확인하실 수 있습니다.
        </div>
      </div>
      <div className="receiptBoard">
        <div className="receiptList">
          <span>결제금액</span>
          <p>{Utility.addComma(info.price)} 원(부가세포함)</p>
        </div>
        <div className="receiptList">
          <span>상품명</span>
          <p>{info.itemName}</p>
        </div>
        <div className="receiptList">
          <span>결제수단</span>
          <p>{payType}</p>
        </div>
        <div className="receiptList">
          <span>주문번호</span>
          <p>{info.orderId}</p>
        </div>
      </div>
      <SubmitBtn text="확인" onClick={()=>history.push("/")}/>
    </section>
  );
};

export default Receipt;