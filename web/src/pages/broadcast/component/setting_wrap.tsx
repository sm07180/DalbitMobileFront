// React
import React, { useCallback, useContext } from "react";

// Api
import { modifyBroadcastSetting } from "common/api";

// Context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";

import { MediaType } from "../constant";


const SettingRenderComponent = (props: {
  roomOwner: boolean | null;
  settingObj: {
    [key: string]: boolean;
  };
  setSettingObj(props: { [key: string]: boolean }): void;
}) => {
  const { roomOwner, settingObj, setSettingObj } = props;

  const { globalAction } = useContext(GlobalContext);

  const { broadcastState } = useContext(BroadcastContext);

  const { roomInfo } = broadcastState;

  const modifySettingObj = useCallback(
    async (e) => {
      e.stopPropagation();
      const { name } = e.target;
      if (settingObj !== null) {
        const { result, message } = await modifyBroadcastSetting({
          ...settingObj,
          [name]: !settingObj[name],
        });

        if (result === "success") {
          setSettingObj({
            ...settingObj,
            [name]: !settingObj[name],
          });
          globalAction.callSetToastStatus!({
            status: true,
            message: message,
          });
        }
      }
    },
    [settingObj]
  );

  return (
    <>
      <div
        className={`setting-more-display ${roomInfo?.mediaType === MediaType.VIDEO && "video"} ${roomOwner === false &&
          "listener"}`}
      >
        <div>
          <span>실시간 팬 배지</span>
          <button
            className={`toggle-button ${settingObj.liveBadgeView === true && "on"}`}
            name="liveBadgeView"
            onClick={(e) => {
              modifySettingObj(e);
            }}
          />
        </div>
        {roomOwner === true ? (
          <>
            <div>
              <span>입장 메시지</span>
              <button
                className={`toggle-button ${settingObj.djListenerIn === true && "on"}`}
                name="djListenerIn"
                onClick={(e) => {
                  modifySettingObj(e);
                }}
              />
            </div>
            <div>
              <span>퇴장 메시지</span>
              <button
                className={`toggle-button ${settingObj.djListenerOut === true && "on"}`}
                name="djListenerOut"
                onClick={(e) => {
                  modifySettingObj(e);
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <span>입장 메시지</span>
              <button
                className={`toggle-button ${settingObj.listenerIn === true && "on"}`}
                name="listenerIn"
                onClick={(e) => {
                  modifySettingObj(e);
                }}
              />
            </div>
            <div>
              <span>퇴장 메시지</span>
              <button
                className={`toggle-button ${settingObj.listenerOut === true && "on"}`}
                name="listenerOut"
                onClick={(e) => {
                  modifySettingObj(e);
                }}
              />
            </div>
          </>
        )}
      </div>
      {/* <img src={ArrowBlackImg} className={`setting-more-display-arrow ${roomOwner === false && "listener"}`} /> */}
    </>
  );
};

export default SettingRenderComponent;
