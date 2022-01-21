import React, { useContext } from "react";
import { GlobalContext } from "context";

export const RoomTypeConvertToText = (props: { roomType: string }) => {
  const { roomType } = props;
  const { globalState } = useContext(GlobalContext);
  const { splashData } = globalState;
  if (splashData && splashData !== null) {
    const text = splashData.roomType.find((v) => {
      return v.cd === roomType;
    });

    return <>{text === undefined ? "" : text.cdNm}</>;
  } else {
    return <></>;
  }
};
