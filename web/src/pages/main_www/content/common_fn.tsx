import React, { useContext } from "react";
import {useSelector} from "react-redux";

export const RoomTypeConvertToText = (props: { roomType: string }) => {
  const { roomType } = props;
  const globalState = useSelector(({globalCtx})=> globalCtx);
  const { splash } = globalState;
  if (splash && splash !== null) {
    const text = splash.roomType.find((v) => {
      return v.cd === roomType;
    });

    return <>{text === undefined ? "" : text.cdNm}</>;
  } else {
    return <></>;
  }
};
