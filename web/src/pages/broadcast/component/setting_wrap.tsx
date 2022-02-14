// React
import React, {useCallback, useContext} from "react";

// Api
import { modifyBroadcastSetting } from "common/api";

// Context
import { GlobalContext } from "context";
import { BroadcastContext } from "context/broadcast_ctx";

import { MediaType } from "../constant";

// Static
import ArrowBlackImg from "../static/img_arrow_b.svg";
import {userBroadcastSettingType} from "../../../common/realtime/chat_socket";

/** 목소리 아이템, 사운드 아이템 설정 추가
 *
 * settingObj props에서 받아서 설정값 세팅
 *
 * modifySettingObj() 설정 update API
 * */

const SettingRenderComponent = (props: {
  roomOwner: boolean | null;
  settingObj: userBroadcastSettingType | null;
  setSettingObj: any
}) => {
  const { roomOwner, settingObj, setSettingObj} = props;

  const { globalAction } = useContext(GlobalContext);

  const { broadcastState } = useContext(BroadcastContext);

  const { roomInfo } = broadcastState;

  /** 방송 설정 변경 */
  const modifySettingObj = useCallback(async (e) => {
      e.stopPropagation();

      const { name } = e.target;
      if (settingObj !== null) {
        //bjSettingForSocketParam : bj가 설정 변경시 socket서버에 보내는 param
        const bjSettingForSocketParam = roomOwner? {bjMemNo: roomInfo?.bjMemNo ?? '', roomNo: roomInfo?.roomNo ?? ''} : {bjMemNo: '', roomNo: ''};
        //기존 설정 파라미터
        const param = {...settingObj, [name]: !settingObj[name] };
        const { result, data, message } = await modifyBroadcastSetting({...param, ...bjSettingForSocketParam});

        if (result === "success") {
          const {djTtsSound, djNormalSound, djListenerIn, djListenerOut, listenerIn, listenerOut,
            liveBadgeView, ttsSound, normalSound} = data;
          setSettingObj({djTtsSound, djNormalSound, djListenerIn, djListenerOut, listenerIn, listenerOut, liveBadgeView, ttsSound, normalSound});

          //설정후 결과 토스트 메시지
          globalAction.callSetToastStatus &&
            globalAction.callSetToastStatus({status: true, message: message});
        }
      }
    }, [settingObj, setSettingObj, roomInfo]);

  return (
    <>
      <div
        className={`setting-more-display ${roomInfo?.mediaType === MediaType.VIDEO && "video"} ${roomOwner === false &&
          "listener"}`}
      >
        <div>
          <span>실시간 팬 배지</span>
          <button
            className={`toggle-button ${settingObj?.liveBadgeView === true && "on"}`}
            name="liveBadgeView"
            onClick={(e) => {
              modifySettingObj(e);
            }}
          />
        </div>
        {/* TTS 재생여부 ON/OFF 버튼*/}
        {roomOwner ?
          <div>
            <span>목소리 아이템</span>  {/* 방장 설정*/}
            <button
              className={`toggle-button ${settingObj?.djTtsSound === true? 'on' : ''}`}
              name={"djTtsSound"}
              onClick={(e) => {
                modifySettingObj(e);
              }}
            />
          </div>
          :
          <div>
            <span>목소리 아이템</span>  {/* 청취자 설정*/}
            <button
              className={`toggle-button ${settingObj?.ttsSound === true? 'on' : ''}`}
              name={"ttsSound"}
              onClick={(e) => {
                modifySettingObj(e);
              }}
            />
          </div>
        }

        {/* 사운드 재생여부 ON/OFF 버튼*/}
        {roomOwner ?
          <div>
            <span>사운드 아이템</span>
            <button
              className={`toggle-button ${settingObj?.djNormalSound === true ? 'on' : ''}`}
              name={"djNormalSound"}
              onClick={(e) => {
                modifySettingObj(e);
              }}
            />
          </div>
          :
          <div>
            <span>사운드 아이템</span>
            <button
              className={`toggle-button ${settingObj?.normalSound === true ? 'on' : ''}`}
              name={"normalSound"}
              onClick={(e) => {
                modifySettingObj(e);
              }}
            />
          </div>
        }
        
        {roomOwner === true ? (
          <>
            <div>
              <span>입장 메시지</span>
              <button
                className={`toggle-button ${settingObj?.djListenerIn === true && "on"}`}
                name="djListenerIn"
                onClick={(e) => {
                  modifySettingObj(e);
                }}
              />
            </div>
            <div>
              <span>퇴장 메시지</span>
              <button
                className={`toggle-button ${settingObj?.djListenerOut === true && "on"}`}
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
                className={`toggle-button ${settingObj?.listenerIn === true && "on"}`}
                name="listenerIn"
                onClick={(e) => {
                  modifySettingObj(e);
                }}
              />
            </div>
            <div>
              <span>퇴장 메시지</span>
              <button
                className={`toggle-button ${settingObj?.listenerOut === true && "on"}`}
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
