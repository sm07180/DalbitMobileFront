import React, {useState, useEffect} from 'react'


// global components
import Header from 'components/ui/header/Header'

import './inOutMessage.scss'
import API from "context/api";
import InfoSwitchList from "pages/resetting/components/InfoSwitchList";

const InOutMessage = (props) => {
  const {settingData, setSettingData} = props;

  const fetchData = async (type) => {
    console.log(type);
    const res = await API.modifyBroadcastSetting({
      [type]: !settingData[type]
    });
    console.log(res);
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
          <InfoSwitchList title="실시간 팬 배지" mark={false} data={"liveBadgeView"} action={fetchData}/>
        </div>
        <div className='section'>
          <div className='sectionTitle'>청취자 입장 / 퇴장 메시지 설정(DJ)</div>
          <InfoSwitchList title="입장 메시지" mark={false} data={"djListenerIn"} action={fetchData}/>
          <InfoSwitchList title="퇴장 메시지" mark={false} data={"djListenerOut"} action={fetchData}/>
        </div>
        <div className='section'>
          <div className='sectionTitle'>청취자 입장 / 퇴장 메시지 설정(청취자)</div>
          <InfoSwitchList title="입장 메시지" mark={false} data={"listenerIn"} action={fetchData}/>
          <InfoSwitchList title="퇴장 메시지" mark={false} data={"listenerOut"} action={fetchData}/>
        </div>
      </div>
    </div>
  )
}

export default InOutMessage
