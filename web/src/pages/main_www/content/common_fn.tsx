import React, { useContext } from "react";
import {useSelector} from "react-redux";

export const RoomTypeConvertToText = (props: { roomType: string }) => {
  const { roomType } = props;
  const globalState = useSelector(({globalCtx})=> globalCtx);
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
