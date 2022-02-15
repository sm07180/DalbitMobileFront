import React, {useEffect} from "react";
import qs from "query-string";

export default function End() {
  const {result, message, orderId} = qs.parse(location.search);

  useEffect(() => {
    if (result === "cancel") {
      return window.close();
    } else {
      if (window.opener !== null) {
        window.opener.document.dispatchEvent(
          new CustomEvent("store-pay", {detail: {result: result, message: message, orderId: orderId}})
        );
      }
    }
    window.close();
  }, []);

  return <></>;
}
