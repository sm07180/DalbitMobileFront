import React, {useState, useCallback, useEffect, useContext} from 'react'

import Api from 'context/api'
import {Context} from 'context'
function BC_SettingJoinClose({settingData, setSettingData}) {
  const context = useContext(Context)
  const modifyBroadcastSetting = async (type) => {
    const res = await Api.modifyBroadcastSetting({
      [type]: !settingData[type]
    })
    console.log(settingData, settingData[type])
    let message, djType, listenerType
    djType = ''
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
      }

      context.action.toast({
        msg: message
      })
    }
  }

  return (
    <div id="bc_setting_join_close">
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
        <p className="contentsWrap__sub">
          DJ가 되었을 시 방송방의 손님, 팬, 일반 청취자의 입장 퇴장 메시지를 ON / OFF로 설정할 수 있습니다.
        </p>
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
        <p className="contentsWrap__sub">
          방송방에 입장하여 청취자 입장일 시 손님, 팬, 일반 청취자의 입장 퇴장 메시지를 ON / OFF로 설정할 수 있습니다.
        </p>
      </div>
    </div>
  )
}

export default React.memo(BC_SettingJoinClose)
