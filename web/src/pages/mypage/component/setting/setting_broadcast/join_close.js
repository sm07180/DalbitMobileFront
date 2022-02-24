import React from 'react'

import Api from 'context/api'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

function BC_SettingJoinClose({settingData, setSettingData}) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const modifyBroadcastSetting = async (type) => {
    const res = await Api.modifyBroadcastSetting({
      [type]: !settingData[type]
    })
    console.log(settingData, settingData[type])
    let message
    if (res.result === 'success') {
      setSettingData({
        ...settingData,
        [type]: !settingData[type]
      })
      if (type === 'djListenerIn' || type === 'djListenerOut') {
        message = `DJ로 방송 시 청취자 <br>${type === 'djListenerIn' ? `입장메시지` : `퇴장메시지`}${
          settingData[type] === false ? '가 보입니다' : '를 숨깁니다.'
        }`
      } else if (type === 'listenerIn' || type === 'listenerOut') {
        message = `청취자로 방송 청취 시 다른 청취자<br>${type === 'listenerIn' ? `입장메시지` : `퇴장메시지`}${
          settingData[type] === false ? '가 보입니다' : '를 숨깁니다.'
        }`
      } else {
        message = res.message
      }

      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: message
      }))
    }
  }

  return (
    <div id="bc_setting_join_close">
      <div className="contentsWrap">
        <p className="contentsWrap__title">배지 설정</p>
        <span>
          실시간 팬 배지
          <button
            className={`${settingData.liveBadgeView === true && 'on'}`}
            onClick={() => {
              modifyBroadcastSetting('liveBadgeView')
            }}
          />
        </span>
        <p className="contentsWrap__sub">방송방 내 채팅 시 본인의 보유 배지 노출 여부를 제어할 수 있습니다.</p>
      </div>

      <div className="contentsWrap">
        <p className="contentsWrap__title">청취자 입장/ 퇴장 메시지 설정(DJ)</p>
        <span>
          입장 메시지
          <button
            className={`${settingData.djListenerIn === true && 'on'}`}
            onClick={() => {
              modifyBroadcastSetting('djListenerIn')
            }}
          />
        </span>
        <span>
          퇴장 메시지
          <button
            className={`${settingData.djListenerOut === true && 'on'}`}
            onClick={() => {
              modifyBroadcastSetting('djListenerOut')
            }}
          />
        </span>
        <p className="contentsWrap__sub">방송 진행 시 청취자들의 입퇴장 메시지 노출 여부를 제어할 수 있습니다.</p>
      </div>

      <div className="contentsWrap">
        <p className="contentsWrap__title">청취자 입장/ 퇴장 메시지 설정(청취자)</p>
        <span>
          입장 메시지
          <button
            className={`${settingData.listenerIn === true && 'on'}`}
            onClick={() => {
              modifyBroadcastSetting('listenerIn')
            }}
          />
        </span>
        <span>
          퇴장 메시지
          <button
            className={`${settingData.listenerOut === true && 'on'}`}
            onClick={() => {
              modifyBroadcastSetting('listenerOut')
            }}
          />
        </span>
        <p className="contentsWrap__sub">방송 청취 시 청취자들의 입퇴장 메시지 노출 여부를 제어할 수 있습니다</p>
      </div>
    </div>
  )
}

export default React.memo(BC_SettingJoinClose)
