import React, {useState, useContext, useEffect} from 'react'

import {Context} from 'context'
import Api from 'context/api'

import {SETTING_TYPE} from '../../constant'

//component
import BC_SettingTitle from './setting_broadcast/title'
import BC_SettingWelcome from './setting_broadcast/welcome'
import BC_SettingQuickMsg from './setting_broadcast/quick_msg'
import BC_SettingJoinClose from './setting_broadcast/join_close'

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

  const context = useContext(Context)

  const [list, setList] = useState(BroadSettingArray)
  const [settingData, setSettingData] = useState({})

  const makeContents = () => {
    switch (subContents) {
      case SETTING_TYPE.TITLE:
        return <BC_SettingTitle />
      case SETTING_TYPE.WELCOME:
        return <BC_SettingWelcome />
      case SETTING_TYPE.SHORT_MSG:
        return <BC_SettingQuickMsg />
      case SETTING_TYPE.JOIN_CLOSE:
        return <BC_SettingJoinClose settingData={settingData} setSettingData={setSettingData} />
    }
  }

  const modifyGiftFanReg = async (value, idx) => {
    const res = await Api.modifyBroadcastSetting({
      giftFanReg: !value
    })

    if (res.result === 'success') {
      if (value === false) {
        context.action.toast({
          msg: '선물 시 자동 친구 설정이 활성화 되었습니다.'
        })
      } else {
        context.action.toast({
          msg: '선물 시 자동 친구 설정이 비 활성화 되었습니다.'
        })
      }

      setList(
        list.map((v, index) => {
          if (index === idx) {
            v.value = !value
          }
          return v
        })
      )
    }
  }

  useEffect(() => {
    async function fetchData() {
      const res = await Api.getBroadcastSetting()

      if (res.result === 'success') {
        setList(
          list.map((v) => {
            if (typeof v.value === 'boolean') {
              v.value = res.data.giftFanReg
            }
            return v
          })
        )

        setSettingData(res.data)
      }
    }

    fetchData()
  }, [])

  return (
    <div id="broadcast_setting">
      {subContents === -1 &&
        list.map((v, idx) => {
          return (
            <span
              key={idx}
              onClick={() => {
                if (typeof v.value === 'boolean') {
                  modifyGiftFanReg(v.value, idx)
                } else {
                  setSubContents(v.value)
                }
              }}>
              {v.text}
              {v.subText && <span>{v.subText}</span>}
              {v.isButton ? <button className={`${v.value === true && 'on'}`} /> : <a></a>}
            </span>
          )
        })}
      {subContents !== -1 && makeContents()}
    </div>
  )
}

export default React.memo(BroadCastSetting)
