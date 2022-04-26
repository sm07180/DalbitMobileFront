import React, {useEffect, useState} from 'react'
import Api from 'context/api'

import {SETTING_TYPE} from '../../constant'

//component
import BC_SettingTitle from './setting_broadcast/title'
import BC_SettingWelcome from './setting_broadcast/welcome'
import BC_SettingQuickMsg from './setting_broadcast/quick_msg'
import BC_SettingListen from './setting_broadcast/listen'
import BC_SettingJoinClose from './setting_broadcast/join_close'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const BroadSettingArray = [
  {value: SETTING_TYPE.TITLE, text: '방송 제목', subText: '최대 3개'},
  {value: SETTING_TYPE.WELCOME, text: 'DJ 인사말', subText: '최대 3개'},
  {value: SETTING_TYPE.SHORT_MSG, text: '퀵 메시지', subText: '최대 6개'},
  {value: SETTING_TYPE.LISTEN, text: '방송 청취 정보 공개'},
  {value: false, text: '선물 시 자동 스타추가', isButton: true},
  {value: SETTING_TYPE.JOIN_CLOSE, text: '배지 / 입퇴장 메시지'}
]

function BroadCastSetting(props) {
  const {subContents, setSubContents} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const [list, setList] = useState(BroadSettingArray)
  const [settingData, setSettingData] = useState({})

  const makeContents = () => {
    switch (subContents) {
      case SETTING_TYPE.TITLE:
        return <BC_SettingTitle/>
      case SETTING_TYPE.WELCOME:
        return <BC_SettingWelcome/>
      case SETTING_TYPE.SHORT_MSG:
        return <BC_SettingQuickMsg />
      case SETTING_TYPE.LISTEN:
        return <BC_SettingListen settingData={settingData} setSettingData={setSettingData} />
      case SETTING_TYPE.JOIN_CLOSE:
        return <BC_SettingJoinClose settingData={settingData} setSettingData={setSettingData} />
    }
  }

  const modifyGiftFanReg = async (value, idx) => {
    const res = await Api.modifyBroadcastSetting({
      giftFanReg: !value
    })

    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "toast",
        msg: res.message
      }))

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
          list.map((v, idx) => {
            if (idx === 4) {
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
                if (idx === 4) {
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
