import React, {useState} from 'react'

import {SETTING_TYPE} from '../../constant'

//component
import BC_SettingTitle from './setting_broadcast/title'

import './index.scss'
const BroadSettingArray = [
  {value: SETTING_TYPE.TITLE, text: '방송 제목 설정', subText: '최대 3개'},
  {value: SETTING_TYPE.WELCOME, text: 'DJ 인사말 설정', subText: '최대 3개'},
  {value: SETTING_TYPE.SHORT_MSG, text: '퀵 메시지 설정', subText: '최대 6개'},
  {value: false, text: '선물 시 자동 친구추가 설정', isButton: true},
  {value: SETTING_TYPE.JOIN_CLOSE, text: '입장 / 퇴장 메시지 설정'}
]

function BroadCastSetting(props) {
  const {subContents, setSubContents} = props

  const makeContents = () => {
    switch (subContents) {
      case SETTING_TYPE.TITLE:
        return <BC_SettingTitle />
      case SETTING_TYPE.WELCOME:
        return <h1>웰컴</h1>
      case SETTING_TYPE.SHORT_MSG:
        return <h1>숏</h1>
      case SETTING_TYPE.JOIN_CLOSE:
        return <h1>입퇴장</h1>
    }
  }

  return (
    <div id="broadcast_setting">
      {subContents === -1 &&
        BroadSettingArray.map((v, idx) => {
          return (
            <span
              key={idx}
              onClick={() => {
                setSubContents(v.value)
              }}>
              {v.text}
              {v.subText && <span>{v.subText}</span>}
              {v.isButton ? <button /> : <a></a>}
            </span>
          )
        })}
      {subContents !== -1 && makeContents()}
    </div>
  )
}

export default React.memo(BroadCastSetting)
