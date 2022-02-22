import React, {useEffect, useState, useCallback} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'

import './style.scss'

const EventZip = () => {
  let history = useHistory()

  const golink = (path) => {
    history.push("/event/" + path);
  }

  // 페이지 시작
  return (
   <div id='eventZip'>
    <Header position={'sticky'} title="리브랜딩 이벤트 모음.zip" type={'back'}/>
    <div className='content'>
      <div className='eventWrap'>
        <div className='eventList' onClick={() => {golink("invite")}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/event/dalla/event7590.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>친구 초대, 초대왕 도전!</div>
            <div className='eventDate'>02.21 - 03.07</div>
          </div>
        </div>

        <div className='eventList' onClick={() => {golink("acrostic")}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/event/dalla/7649/event7649_zip.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>달라를 축하해 달라</div>
            <div className='eventDate'>02.28 - 03.09</div>
          </div>
        </div>
        
        <div className='eventList comingSoon'>
          <div className='thumbNail'/>
          <div className='eventInfo'>
            <div className='massege'>이벤트가 시작되면  배너를 통해 알려드려요.</div>
          </div>
        </div>

        {/*<div className='eventList end'>*/}
        {/*  <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/event/dalla/event7590.png)`}}/>*/}
        {/*  <div className='eventInfo'>*/}
        {/*    <div className='eventTitle'>친구 초대, 초대왕 도전!</div>*/}
        {/*    <div className='eventDate'>02.21 - 03.07</div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
   </div>
  )
}

export default EventZip
