import React, {useState, useEffect} from 'react'


// global components
import Header from 'components/ui/header/Header'

import './inOutMessage.scss'
import API from "context/api";
import InfoSwitchList from "pages/resetting/components/InfoSwitchList";

const InOutMessage = (props) => {
  /**
   * liveBadgeView 실시간 팬 배지 djListenerIn DJ 입장 메시지, djListenerOut DJ 퇴장 메시지, listenerIn 청취자 입장 메시지, listenerOut 청취자 퇴장 메시지 => true, false
   * */
  const {settingData, setSettingData} = props;

  const fetchData = async (type) => {
    const res = await API.modifyBroadcastSetting({
      [type]: !settingData[type]
    });
    if(res.result === "success") {
      setSettingData({
        ...settingData,
        [type]: !settingData[type]
      })
    }
  }

  // 페이지 시작
  return (
    <div id="inOutMessage">
      <Header position={'sticky'} title={'배지 / 입퇴장 메시지'} type={'back'}/>
      <div className='subContent'>
        <div className='section'>
          <div className='sectionTitle'>배지 설정</div>
          <InfoSwitchList title="실시간 팬 배지" mark={false} data={"liveBadgeView"} checked={settingData.liveBadgeView} action={fetchData}/>
        </div>
        <div className='section'>
          <div className='sectionTitle'>청취자 입장 / 퇴장 메시지 설정(DJ)</div>
          <InfoSwitchList title="입장 메시지" mark={false} data={"djListenerIn"} checked={settingData.djListenerIn} action={fetchData}/>
          <InfoSwitchList title="퇴장 메시지" mark={false} data={"djListenerOut"} checked={settingData.djListenerOut} action={fetchData}/>
        </div>
        <div className='section'>
          <div className='sectionTitle'>청취자 입장 / 퇴장 메시지 설정(청취자)</div>
          <InfoSwitchList title="입장 메시지" mark={false} data={"listenerIn"} checked={settingData.listenerIn} action={fetchData}/>
          <InfoSwitchList title="퇴장 메시지" mark={false} data={"listenerOut"} checked={settingData.listenerOut} action={fetchData}/>
        </div>
      </div>
    </div>
  )
}

export default InOutMessage
