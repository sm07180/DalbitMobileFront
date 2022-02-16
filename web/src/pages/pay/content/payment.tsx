import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { NODE_ENV } from "constant/define";
import { getCookie, setCookie } from "common/utility/cookie";
import {
  payCard,
  payPhone,
  payGiftCulture,
  payGiftHappyMoney,
  payGiftGame,
  payGiftBook,
  payLetter,
  payKakaomoney,
  paySimple,
  getBanner,
  selfAuthCheck,
} from "common/api";

import "./pay.scss";
const icoPlus = "https://image.dalbitlive.com/svg/ico_add.svg";
const icoMinus = "https://image.dalbitlive.com/svg/ico_minus.svg";

// components
import Header from "common/ui/header";
import Layout from "common/layout";
import BankTimePopup from "./bank_time_pop";
import LayerPopupWrap from "../../main_www/content/layer_popup_wrap";
import { date } from "@storybook/addon-knobs";
import {useDispatch, useSelector} from "react-redux";
import {setPayInfo} from "../../../redux/actions/modal";
import {setGlobalCtxAlertStatus, setGlobalCtxSetToastStatus} from "../../../redux/actions/globalCtx";

export default function Payment() {
  const history = useHistory();
  const dispatch = useDispatch();
  const modalState = useSelector(({modal}) => modal);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { payInfo } = modalState;
  const { baseData } = globalState;

  let { itemName, itemPrice, itemNo, pageCode } = payInfo;
  const formTag = useRef<HTMLFormElement>(null);

  const [selectedBtn, setSelectedBtn] = useState(-1);
  const [buttonState, setButtonState] = useState(true);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [bankPop, setBankPop] = useState(false);

  const [popupData, setPopupData] = useState<any>([]);
  const [popupState, setPopupState] = useState(false);
  const dalVal = Number(itemName.split(" ")[1]);

  let payMethod: any;
  // if (NODE_ENV === "dev" || globalState.baseData.memNo === "51594275686446") {
  payMethod = [
    { type: "계좌 간편결제", fetch: paySimple, code: "simple" },
    { type: "무통장 입금(계좌이체)", code: "coocon" },
    { type: "카드 결제", fetch: payCard },
    { type: "휴대폰 결제", fetch: payPhone },
    { type: "카카오페이(머니)", fetch: payKakaomoney, code: "kakaomoney" },
    { type: "카카오페이(카드)", fetch: payLetter, code: "kakaopay" },
    { type: "페이코", fetch: payLetter, code: "payco" },
    { type: "티머니/캐시비", fetch: payLetter, code: "tmoney" },
    { type: "문화상품권", fetch: payGiftCulture },
    { type: "해피머니상품권", fetch: payGiftHappyMoney },
    // { type: "캐시비", fetch: payLetter, code: "cashbee" },
    // { type: "스마트문상(게임문화상품권)", fetch: payGiftGame },
    // { type: "도서문화상품권", fetch: payGiftBook },
  ];
  // }

  const createPayMethodBtn = (): any => {
    return payMethod.map((item: any, idx: number) => {
      const selectedClassName =
        selectedBtn === idx ? "payMathod__button--forced" : "";
      const wideBtnClassName =
        idx === 0 || idx === 1 ? "payMathod__button--contain" : "";
      // const wideBtnClassName = idx === 0 ? "payMathod__button--contain" : "";
      const disabledState = makeDisabled(item.type);
      const newIcon = idx === 0 ? "new " : "";
      return (
        <button
          key={idx}
          className={`payMathod__button ${selectedClassName} ${wideBtnClassName} ${newIcon}`}
          onClick={() => {
            setSelectedBtn(idx);
          }}
          disabled={disabledState}
        >
          {item.type === "스마트문상(게임문화상품권)" ? (
            <>
              스마트문상 <br /> (게임문화상품권)
            </>
          ) : (
            item.type
          )}
        </button>
      );
    });
  };

  async function fetchPay(ciData?) {
    if (selectedBtn === -1) return null;
    const selectedMathod = payMethod[selectedBtn];
    // if (selectedMathod.type === "카카오페이" || selectedMathod.type === "페이코") {
    //   return dispatch(setGlobalCtxAlertStatus({
    //     status: true,
    //     content: `결제대행사 장애가 발생하여 일시적으로 결제가 불가능합니다.
    //     잠시 다른 결제수단을 이용 부탁드립니다.`,
    //   });
    // }
    if (selectedMathod.code === "coocon") {
      let hour = String(new Date().getHours());
      let min = String(new Date().getMinutes());
      let sec = String(new Date().getSeconds());
      if (hour < "10") {
        hour = "0" + hour;
      }
      if (min < "10") {
        min = "0" + min;
      }
      if (sec < "10") {
        sec = "0" + sec;
      }

      const time = String(hour) + String(min) + String(sec);

      if (
        (time >= "000000" && time <= "001000") ||
        (time >= "235000" && time <= "235959")
      ) {
        return setBankPop(true);
      } else {
        return goBank();
      }
    }

    const { result, data, message } = await selectedMathod.fetch({
      Prdtnm: itemName,
      Prdtprice: String(Number(itemPrice) * totalQuantity),
      itemNo: itemNo,
      pageCode: pageCode,
      pgCode: selectedMathod.code,
      itemAmt: totalQuantity,
      ci: ciData,
    });
    if (result === "success") {
      setButtonState(false);
      document.addEventListener("store-pay", updateDispatch);

      if (data.hasOwnProperty("pcUrl") || data.hasOwnProperty("url")) {
        return window.open(
          data.pcUrl ? data.pcUrl : data.url,
          "popup",
          "width = 400, height = 560, top = 100, left = 200, location = no"
        );
      } else if (data.hasOwnProperty("next_redirect_pc_url")) {
        return window.open(
          data.next_redirect_pc_url,
          "popup",
          "width = 500, height = 560, top = 100, left = 200, location = no"
        );
      }

      const { current } = formTag;
      let ft = current!;

      const makeHiddenInput = (key, value) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("id", key);
        input.setAttribute("value", value);
        return input;
      };

      Object.keys(data).forEach((key) => {
        ft.append(makeHiddenInput(key, data[key]));
      });

      // MCASH_PAYMENT(ft);
      ft.innerHTML = "";
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
      }));
    }
  }

  async function fetchMainPopupData(arg) {
    const res = await getBanner({ position: arg });

    if (res.result === "success") {
      if (res.hasOwnProperty("data")) {
        setPopupData(
          res.data.filter((v) => {
            if (getCookie("popup_notice_" + `${v.idx}`) === undefined) {
              return v;
            } else {
              return false;
            }
          })
        );
        setPopupState(true);
      }
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: res.message,
      }));
    }
  }

  const makeDisabled = (type) => {
    switch (type) {
      case "페이코":
        if (Number(itemPrice) * totalQuantity > 100000) return true;
      case "티머니":
        if (Number(itemPrice) * totalQuantity > 500000) return true;
      case "캐시비":
        if (Number(itemPrice) * totalQuantity > 500000) return true;
      case "휴대폰 결제":
        if (Number(itemPrice) * totalQuantity > 1000000) return true;
      default:
        return false;
        break;
    }
  };

  const goBank = () => {
    dispatch(setPayInfo({
      itemName: itemName,
      //itemPrice: String(Number(itemPrice) * totalQuantity),
      itemPrice: itemPrice,
      itemNo: itemNo,
      itemCnt: totalQuantity,
    }));
    history.push("/payment/bank");
  };

  const bonusDal = useMemo(() => {
    if(Number(itemPrice) * totalQuantity >= 1100000) {
      return Math.floor(dalVal * totalQuantity * 0.05);
    }
    return null;

    /*if (Number(itemPrice) * totalQuantity > 100000) {
      return Math.floor(dalVal * totalQuantity * 0.1);
    } else if (Number(itemPrice) * totalQuantity > 30000) {
      return Math.floor(dalVal * totalQuantity * 0.05);
    } else {
      return null;
    }*/
  }, [itemPrice, totalQuantity, Number(itemPrice) * totalQuantity]);

  const isBonusDalYn = useMemo(() => {
    return Number(itemPrice) * totalQuantity >= 1100000;
    /*if (Number(itemPrice) * totalQuantity > 30000) {
      return true;
    } else {
      return false;
    }*/
  }, [itemPrice, totalQuantity, Number(itemPrice) * totalQuantity]);

  const updateDispatch = (event) => {
    const {
      result,
      date,
      message,
      phone,
      orderId,
      cardName,
      apprNo,
      itemCnt,
      returntype,
    } = event.detail;
    // console.log("event.detail", event.detail);
    // console.log("itemCnt", itemCnt);
    // console.log("totalQuantity", totalQuantity);
    if (result == "success") {
      dispatch(setPayInfo({
        itemName: itemName,
        itemPrice: String(Number(itemPrice) * totalQuantity),
        itemNo: itemNo,
        payMethod: payMethod[selectedBtn].type,
        phone: phone,
        orderId: orderId,
        cardName: cardName,
        itemCnt: totalQuantity,
        returntype: returntype,
      }));

      history.push("/payment/result");
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: message,
        callback: () => {
          history.push("/pay/store");
        },
        cancelCallback: () => {
          history.push("/pay/store");
        },
      }));
    }
  };

  const quantityCalc = (type) => {
    if (type === "plus") {
      if (totalQuantity === 10) {
        return dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "최대 10개까지 구매 가능합니다.",
        }));
      }
      setTotalQuantity(totalQuantity + 1);
    } else if (type === "minus") {
      if (totalQuantity === 1) {
        return dispatch(setGlobalCtxSetToastStatus({
          status: true,
          message: "최소 1개부터 구매 가능합니다.",
        }));
      }

      setTotalQuantity(totalQuantity - 1);
    }
  };

  const setPopupCookie = () => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + 1);
    exdate.setHours(0);
    exdate.setMinutes(0);
    exdate.setSeconds(0);

    const encodedValue = encodeURIComponent("y");
    const c_value = encodedValue + "; expires=" + exdate.toUTCString();
    document.cookie =
      "simpleCheck" +
      "=" +
      c_value +
      "; path=/; secure; domain=.dalbitlive.com";
  };

  const simplePayCheck = () => {
    async function fetchSelfAuth() {
      const res = await selfAuthCheck();
      if (res.result === "success") {
        const ciValue = res.data.ci;
        if (
          ciValue === null ||
          ciValue === false ||
          ciValue === "testuser" ||
          ciValue === "admin" ||
          ciValue.length < 10
        ) {
          history.push("/self_auth/self?event=/pay/store");
        } else {
          if (getCookie("simpleCheck") === "y" || res.data.isSimplePay) {
            fetchPay(res.data.ci);
          } else {
            const contStyle = {
              fontSize: "15px",
              textAlign: "left",
            };

            dispatch(setGlobalCtxAlertStatus({
              status: true,
              type: "alert",
              contentStyle: contStyle,
              content: `
              ★ 필수 : 인증 정보를 확인해 주세요.
              <br />
              -----------------------------------------------
              <br />
              회원 이름 : <span style='color: #632beb; font-weight: bold;'>${
                res.data.memName
              }</span>
              <br />
              연락처 : 
              <span style='color: #632beb; font-weight: bold;'>
              ${res.data.phoneNo.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}
              </span>
              <br />
              -----------------------------------------------
              <br /> <br />
              - 안전한 계좌 정보 등록을 위해
              <br />
                한 번 더 본인인증을 해주셔야 합니다.
              <br />
              - (중요) 추가 인증 시에는 반드시
              <br />
                위의 회원정보와 일치해야 합니다.
              <br />
                ※ 추가 인증은 딱 1회만 진행됩니다.
              `,
              callback: () => {
                setPopupCookie();
                fetchPay(res.data.ci);
              },
            }));
          }
        }
      } else {
        history.push("/self_auth/self?event=/pay/store");
      }
    }
    fetchSelfAuth();
  };

  useEffect(() => {
    if (selectedBtn === 0) {
      simplePayCheck();
    } else {
      fetchPay();
    }
  }, [selectedBtn]);

  useEffect(() => {
    fetchMainPopupData(12);
  }, []);

  useEffect(() => {
    if (!itemName) return history.goBack();
    return () => {
      document.removeEventListener("store-pay", updateDispatch);
    };
  }, []);

  return (
    <>
      <Header title="달 충전하기" />

      <div id="pay" className="subContent gray">
        <div className="content">
          <div className="buyList">
            <h2 className="pageTitle">구매 내역</h2>

            <div className="buyList__box">
              <div className="buyList__wrap">
                <div className="buyList__label">결제상품</div>
                <div className="buyList__value">
                  <img
                    src="https://image.dalbitlive.com/svg/moon_yellow_s.svg"
                    alt="달 아이콘"
                    className="dalIcon"
                  />
                  {dalVal}
                </div>
              </div>

              {isBonusDalYn && (
                <div className="buyList__wrap">
                  <div className="buyList__label">추가지급</div>
                  <div className="buyList__value">
                    <img
                      src="https://image.dalbitlive.com/svg/moon_yellow_s.svg"
                      alt="달 아이콘"
                      className="dalIcon"
                    />
                    {bonusDal}
                  </div>
                </div>
              )}

              <div className="buyList__wrap">
                <div className="buyList__label">상품수량</div>
                <div className="buyList__value">
                  <button onClick={() => quantityCalc("minus")}>
                    <img src={icoMinus} />
                  </button>
                  <span className="quantity">{totalQuantity}</span>
                  <button onClick={() => quantityCalc("plus")}>
                    <img src={icoPlus} />
                  </button>
                </div>
              </div>

              <div className="buyList__wrap">
                <div className="buyList__label">결제금액</div>
                <div className="buyList__value">
                  <span className="buyList__value--point">
                    {(Number(itemPrice) * totalQuantity).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="payMathod">
            <h2 className="pageTitle">결제 수단</h2>

            <div className="payMathod__box">{createPayMethodBtn()}</div>
          </div>

          <div className="info__wrap">
            <h5>
              달 충전 안내
              <span>
                <strong>결제 문의</strong>1522-0251
              </span>
            </h5>
            <p>충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
            <p>달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
            <p>
              미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는
              법정대리인은 계약을 취소할 수 있습니다.
            </p>
            <p>
              사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.
            </p>
            <p>
              깐부 게임에 참여중인 회원은 1만원 이상 달 구매 시 받은 구슬을 사용했을 경우 달 환불이 불가합니다.
            </p>
          </div>
        </div>
        {bankPop && <BankTimePopup setBankPop={setBankPop} goBank={goBank} />}

        {popupState && popupData.length > 0 && (
          <div className="responsiveBox">
            <LayerPopupWrap
              data={popupData}
              setData={setPopupData}
              setPopupState={setPopupState}
            />
          </div>
        )}
      </div>
      <form
        ref={formTag}
        name="payForm"
        acceptCharset="euc-kr"
        id="payForm"
      ></form>
    </>
  );
}
