import React, {useState, useEffect} from 'react'


// global components
import Header from 'components/ui/header/Header'
import SwitchList from '../../../components/switchList'

import './inOutMessage.scss'

const InOutMessage = () => {
    
  // 페이지 시작
  return (
    <div id="inOutMessage">
      <Header position={'sticky'} title={'배지 / 입퇴장 메시지'} type={'back'}/>
      <div className='subContent'>
        <div className='section'>
          <div className='sectionTitle'>배지 설정</div>
          <SwitchList title="실시간 팬 배지" mark={false}/>
        </div>
        <div className='section'>
          <div className='sectionTitle'>청취자 입장 / 퇴장 메시지 설정(DJ)</div>
          <SwitchList title="입장 메시지" mark={false}/>
          <SwitchList title="퇴장 메시지" mark={false}/>
        </div>
        <div className='section'>
          <div className='sectionTitle'>청취자 입장 / 퇴장 메시지 설정(청취자)</div>
          <SwitchList title="입장 메시지" mark={false}/>
          <SwitchList title="퇴장 메시지" mark={false}/>
        </div>
      </div>
    </div>
  )
}

export default InOutMessage
