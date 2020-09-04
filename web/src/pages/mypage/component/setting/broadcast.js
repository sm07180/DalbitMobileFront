import React, {useState} from 'react'

import {SETTING_TYPE} from '../../constant'

import './index.scss'
const BroadSettingArray = [
  {value: SETTING_TYPE.TITLE, text: '방송 제목 설정', subText: '최대 3개'},
  {value: SETTING_TYPE.WELCOME, text: 'DJ 인사말 설정', subText: '최대 3개'},
  {value: SETTING_TYPE.SHORT_MSG, text: '퀵 메시지 설정', subText: '최대 6개'},
  {value: -1, text: '선물 시 자동 친구추가 설정', isButton: true},
  {value: SETTING_TYPE.JOIN_CLOSE, text: '입장 / 퇴장 메시지 설정'}
]

function BroadCastSetting() {
  return (
    <div id="broadcast_setting">
      {BroadSettingArray.map((v, idx) => {
        return (
          <span key={idx}>
            {v.text}
            {v.subText && <span>{v.subText}</span>}
            {v.isButton ? <button>버튼</button> : <a></a>}
          </span>
        )
      })}
    </div>
  )
}

export default React.memo(BroadCastSetting)
