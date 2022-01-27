import qs from "query-string";
import React, { useEffect } from "react";

export default function Payment() {
  const { result, message, date, amount, prdtNm, orderId, itemCnt } = qs.parse(location.search);

  if (result === "success") {
    try {
      if (window.fbq) {
        window.fbq("track", "Purchase", { price: amount });
      }
      if (window.firebase) {
        window.firebase.analytics().logEvent("Purchase", { price: amount });
      }
      if (window.kakaoPixel) {
        window.kakaoPixel("114527450721661229").purchase({ total_price: amount, currency: "KRW" });
      }
    } catch (e) {}
  } else if (result === "cancel") {
    return window.close();
  }

  useEffect(() => {
    if (window.opener !== null) {
      window.opener.document.dispatchEvent(
        new CustomEvent("store-pay", {
          detail: {
            result: result,
            message: message,
            date: date,
            itemName: prdtNm,
            price: amount,
            orderId: orderId,
            itemCnt:itemCnt,
          },
        })
      );
    }
    window.close();
  }, []);

  return <></>;
}
