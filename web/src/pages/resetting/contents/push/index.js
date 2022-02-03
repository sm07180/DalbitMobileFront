import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'

import SwitchList from '../../components/switchList'

import '../../style.scss'

const SettingPush = () => {
  const tabList = ['무음','소리','진동'];
  const [tabType, setTabType] = useState(tabList[0])

  const [alarmAll, setAlarmAll] = useState(false)
  const [alarmMyStarBroadcast, setAlarmMyStarBroadcast] = useState(false)
  const [alarmMyStarClip, setAlarmMyStarClip] = useState(false)
  const [alarmMailbox, setAlarmMailbox] = useState(false)

  return (
    <>
      <Header position={'sticky'} title={'Push 알림 설정'} type={'back'}/>
      <div className='subContent'>
        <div className='tabWrap'>
          <p className='topText'>메시지 알림</p>
          <ul className="tabmenu">
            {tabList.map((data,index) => {
              const param = {
                item: data,
                tab: tabType,
                setTab: setTabType,
              }
              return (
                <TabBtn param={param} key={index} />
              )
            })}
          </ul>
        </div>
        <div className='switchWrap'>
            <SwitchList title={"전체 알림 수신"} on={alarmAll}></SwitchList>
            <SwitchList title={"마이스타 방송 시작 알림"} mark={true} on={alarmMyStarBroadcast}></SwitchList>
            <SwitchList title={"마이스타 클립 등록 알림"} mark={true} on={alarmMyStarClip}></SwitchList>
            <SwitchList title={"우체통 알림"} mark={true} on={alarmMailbox}></SwitchList>
            <SwitchList title={"내 클립 알림"} mark={true} on={false}></SwitchList>
            <SwitchList title={"신규 팬 추가 알림"} mark={true} on={false}></SwitchList>
            <SwitchList title={"팬보드 신규 글 등록 알림"} mark={true} on={false}></SwitchList>
            <SwitchList title={"팬보드 댓글 등록 알림"} mark={true} on={false}></SwitchList>
            <SwitchList title={"선물 도착 알림"} mark={true} on={false}></SwitchList>
            <SwitchList title={"1:1 문의 답변 도착 알림"} mark={true} on={false}></SwitchList>
            <SwitchList title={"알림받기 방송시작 알림"} mark={true} on={false}></SwitchList>
        </div>
      </div>
    </>
  )
}

export default SettingPush
