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
  {value: SETTING_TYPE.TITLE, text: '방송 제목', subText: '최대 3개'},
  {value: SETTING_TYPE.WELCOME, text: 'DJ 인사말', subText: '최대 3개'},
  {value: SETTING_TYPE.SHORT_MSG, text: '퀵 메시지', subText: '최대 6개'},
  {value: false, text: '방송 청취 정보 공개', isButton: true},
  {value: false, text: '선물 시 자동 스타추가', isButton: true},
  {value: SETTING_TYPE.JOIN_CLOSE, text: '배지 / 입퇴장 메시지'}
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
      context.action.toast({
        msg: res.message
      })

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
  const modifyListenOpen = async (value, idx) => {
    const res = await Api.modifyBroadcastSetting({
      listenOpen: !value
    })

    if (res.result === 'success') {
      context.action.toast({
        msg: res.message
      })

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
        console.log(list)
        setList(
          list.map((v, idx) => {
            console.log(idx)
            if (idx === 4) {
              v.value = res.data.giftFanReg
            } else if (idx === 3) {
              v.value = res.data.listenOpen
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
                if (idx === 3) {
                  modifyListenOpen(v.value, idx)
                } else if (idx === 4) {
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
