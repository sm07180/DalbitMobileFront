import React, {useContext} from 'react'

import {Context} from 'context'
import Api from 'context/api'
import {BROAD_SETTING} from '../constant'

const radioButtons = [
  {
    label: '방송 청취 상태 및 위치 공개',
    value: BROAD_SETTING.STATUS_LOCATION
  },
  {
    label: '방송 청취 상태만 공개',
    value: BROAD_SETTING.STATUS
  },
  {
    label: '방송 청취 정보 비공개',
    value: BROAD_SETTING.HIDE
  }
]

export default function BC_SettingListen(props) {
  const {settingData, setSettingData} = props
  const context = useContext(Context)

  const listenSettingAPIHandler = async (slctedVal) => {
    if (settingData !== null) {
      const {result, message} = await Api.modifyBroadcastSetting({listenOpen: slctedVal})

      if (result === 'success') {
        setSettingData({
          ...settingData,
          listenOpen: slctedVal
        })
        displayModalMsg(message)
      } else {
        displayModalMsg(message)
      }
    }
  }

  const onChangeHandler = (event) => {
    const {value} = event.target
    listenSettingAPIHandler(+value)
  }

  const displayModalMsg = (msg) => {
    context.action.toast({
      msg
    })
  }

  return (
    <div id="bc_seeting_listen">
      {radioButtons.map((btn, idx) => (
        <label className="radio_btn_container" key={`${idx}-${btn.value}`}>
          {btn.label}
          <input
            className={`radio_btn${settingData?.listenOpen === btn.value ? ' active' : ''}`}
            type="radio"
            value={btn.value}
            checked={settingData?.listenOpen === btn.value}
            onChange={onChangeHandler}
          />
          <span className="check_circle" />
        </label>
      ))}
    </div>
  )
}
