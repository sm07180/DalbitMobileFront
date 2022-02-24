import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {payCoocon} from "common/api";

import "./pay.scss";
// components
import Header from "common/ui/header";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus} from "../../../redux/actions/globalCtx";
import {setPayInfo} from "../../../redux/actions/modal";

export default function Payment() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const modalState = useSelector(({modalCtx}) => modalCtx);
  const history = useHistory();
  const {payInfo} = modalState;
  const {itemName, itemPrice, itemNo, itemCnt} = payInfo;

  const [receiptType, setReceiptType] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [receiptOption, setReceiptOption] = useState("");
  const [receiptOptionType, setReceiptOptionType] = useState("0");
  const [receiptOptionState, setReceiptOptionState] = useState(true);
  const [buttonState, setButtonState] = useState(false);

  const receipt = ["선택안함", "소득공제용", "지출증빙용"];

  const createReceipt = () => {
    const receiptButtonWrap = (
      <div className="receipt__btn__wrap" key="receiptInputWrap">
        {receipt.map((value, idx) => {
          return (
            <button key={idx} className={` ${receiptType === idx && "on"}`} onClick={() => setReceiptType(idx)}>
              {value}
            </button>
          );
        })}
      </div>
    );

    const receiptInput = () => {
      if (receiptType === 1) {
        return (
          <div className="receipt__sub" key="receiptInput">
            <select
              className="receipt__label select"
              value={receiptOptionType}
              onChange={(e) => {
                setReceiptOptionType(e.target.value);
              }}
            >
              <option value="0">주민번호</option>
              <option value="1">휴대폰번호</option>
            </select>
            <input
              className="receipt__input"
              type="text"
              name={receiptOptionType === "0" ? "residentNm" : "phoneNm"}
              onChange={inputHandle}
              value={receiptOption}
            ></input>
          </div>
        );
      } else if (receiptType === 2) {
        return (
          <div className="receipt__sub" key="receiptInput">
            <label className="receipt__label">사업자 번호</label>
            <input className="receipt__input" type="text" name="businessNm" onChange={inputHandle} value={receiptOption}></input>
          </div>
        );
      }
    };
    return [receiptButtonWrap, receiptInput()];
  };

  useEffect(() => {
    setReceiptOption("");
    if (receiptType !== 0) setReceiptOptionState(false);
  }, [receiptType, receiptOptionType]);

  const inputHandle = (e): any => {
    const { name, value } = e.target;
    const nmValue = value.replace(/[^0-9]/g, "");
    switch (name) {
      case "name":
        setName(value);
        break;
      case "phone":
        if (value.toString().length < 15) setPhone(nmValue);
        break;
      case "residentNm":
        if (value.toString().length < 14) {
          if (value.toString().length === 13) {
            setReceiptOptionState(true);
          } else {
            setReceiptOptionState(false);
          }
          setReceiptOption(nmValue);
        }
        break;
      case "phoneNm":
        if (value.toString().length < 15) {
          if (value.toString().length > 10) {
            setReceiptOptionState(true);
          } else {
            setReceiptOptionState(false);
          }
          setReceiptOption(nmValue);
        }
        break;
      case "businessNm":
        if (value.toString().length < 11) {
          if (value.toString().length == 10) {
            setReceiptOptionState(true);
          } else {
            setReceiptOptionState(false);
          }
          setReceiptOption(nmValue);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (name.length > 1 && phone.length > 10 && receiptOptionState) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [name, phone, receiptOptionState]);

  const getDepositInfo = async () => {
    const { result, data, message } = await payCoocon({
      Prdtnm: itemName,
      Prdtprice: Number(itemPrice) * Number(itemCnt),
      rcptNm: name,
      phoneNo: phone,
      itemNo: itemNo,
      itemAmt: itemCnt,
      receiptCode: receiptType === 0 ? "n" : receiptType === 1 ? "i" : "b",
      receiptPhone: receiptType === 1 && receiptOptionType === "1" ? receiptOption : "",
      receiptSocial: receiptType === 1 && receiptOptionType === "0" ? receiptOption : "",
      receiptBiz: receiptType === 2 ? receiptOption : "",
    });

    if (result === "success") {
      dispatch(setPayInfo({
        itemName: data.Prdtnm,
        itemPrice: data.Prdtprice,
        itemNo: data.itemNo,
        name: data.rcptNm,
        bankNo: data.accountNo,
        phone: data.phoneNo,
        itemCnt: itemCnt,
      }));
      history.push("/payment/bank_wait");
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    }
  };

  const clickDepositButton = () => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g;

    if (name.length < 2) {
      return dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: `이름은 필수입력 값입니다.`,
      }));
    }

    if (!phone) {
      return dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: `휴대폰 번호는 필수입력 값입니다.`,
      }));
    }

    if (!rgEx.test(phone)) {
      return dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: `올바른 휴대폰 번호가 아닙니다.`,
      }));
    }

    if (receiptType === 1) {
      if (receiptOptionType === "0" && receiptOption.length < 13) {
        return dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: `현금영수증 발급을 위하여 \n 주민번호를 입력해주세요.`,
        }));
      } else if (receiptOptionType === "1" && !receiptOption) {
        return dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: `현금영수증 발급을 위하여 \n 휴대폰번호를 입력해주세요.`,
        }));
      }
    } else if (receiptType === 2) {
      if (receiptOption.length < 10) {
        return dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: `현금영수증 발급을 위하여 \n 사업자번호를 입력해주세요.`,
        }));
      }
    }
    getDepositInfo();
  };

  useEffect(() => {
    if (itemCnt === undefined) history.goBack();
  }, []);

  return (
    <>
      <Header title="무통장 입금(계좌이체)" />
      <div id="pay" className="subContent gray">
        <div className="content">
          {/* <div className="buyList">
              <h2 className="charge__title">구매 내역</h2>

              <div className="buyList__box">
                <div className="buyList__label">결제상품</div>
                <div className="buyList__value">{itemName}</div>
                <div className="buyList__label">결제금액</div>
                <div className="buyList__value">
                  <span className="buyList__value--point">{itemPrice.toLocaleString()}</span> 원
                </div>
              </div>
            </div> */}

          <div className="depositInfo">
            <div className="depositInfo__box">
              <div className="depositInfo__wrap label__wrap">
                <div className="depositInfo__label">입금정보</div>
                <div className="depositInfo__value">
                  <span className="depositInfo__value--point">{(Number(itemPrice) * Number(itemCnt)).toLocaleString()}원</span>
                  (부가세 포함)
                </div>
              </div>

              <div className="depositInfo__wrap label__wrap">
                <div className="depositInfo__label">입금은행</div>
                <div className="depositInfo__value">국민은행</div>
              </div>

              <div className="depositInfo__wrap ">
                <div className="depositInfo__label">입금자명</div>
                <div className="depositInfo__value input">
                  <input
                    type="text"
                    name="name"
                    onChange={inputHandle}
                    value={name}
                    className="depositInfo__input"
                    placeholder={`입금자명을 입력해주세요`}
                  ></input>
                </div>
              </div>

              <div className="depositInfo__wrap ">
                <div className="depositInfo__label">휴대폰번호</div>
                <div className="depositInfo__value input">
                  <input
                    type="text"
                    name="phone"
                    onChange={inputHandle}
                    value={phone}
                    className="depositInfo__input"
                    placeholder={`휴대폰 번호를 입력해주세요`}
                  ></input>
                </div>
              </div>
            </div>
          </div>

          <div className="receipt">
            <h2 className="charge__title">현금영수증</h2>
            {createReceipt()}
          </div>

          <button className={`payButton ${buttonState ? "payButton--active" : ""}`} onClick={clickDepositButton}>
            입금계좌 받기
          </button>

          <div className="info__wrap">
            <h5>
              무통장 입금 안내
              <button onClick={() => history.push("/payment/bank_info")}>은행별 점검시간 확인</button>
            </h5>
            <p>
              심야시간 무통장 입금이 지연될 경우{" "}
              <strong onClick={() => history.push("/payment/bank_info")}>은행별 점검시간을 확인</strong>하세요.
            </p>
            <p>매월 말에서 1일 자정시간은 거래량이 급증하여 이체처리가 지연 될 수 있습니다.</p>
            <p>
              시스템 점검시간으로 이체가 지연되는 경우 다른 결제 수단을 이용 하시면 보다 신속하게 달 충전을 완료 할 수 있습니다.
            </p>
            <p>정기점검 일정은 당행 사정에 따라 변경될 수 있습니다.</p>
          </div>
        </div>
      </div>
    </>
  );
}
