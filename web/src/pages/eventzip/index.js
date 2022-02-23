import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'

import './style.scss'
import moment from "moment";
import {Context} from "context";

const EventZip = () => {
  let history = useHistory()
  const context = useContext(Context)
  const poemEventEnd = new moment().isAfter('20220310');
  const inviteEventEnd = new moment().isAfter('20220308');

  const golink = (path, endDay) => {
    if(endDay){
      context.action.alert({msg: "해당 이벤트는 종료되었습니다."})
    }else{
      history.push("/event/" + path);
    }
  }

  // 페이지 시작
  return (
   <div id='eventZip'>
    <Header position={'sticky'} title="리브랜딩 이벤트 모음.zip" type={'back'}/>
    <div className='content'>
      <div className='eventWrap'>

        <div className={`eventList ${poemEventEnd ? 'end' : ''}`} onClick={() => {golink("acrostic", poemEventEnd)}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/event/dalla/7649/event7649_zip.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>달라를 축하해 달라</div>
            <div className='eventDate'>02.28 - 03.09</div>
          </div>
        </div>

        <div className={`eventList ${inviteEventEnd ? 'end' : ''}`} onClick={() => {golink("invite", inviteEventEnd)}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/event/dalla/event7590.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>친구 초대, 초대왕 도전!</div>
            <div className='eventDate'>02.21 - 03.07</div>
          </div>
        </div>

        <div className='eventList comingSoon'>
          <div className='thumbNail'/>
          <div className='eventInfo'>
            <div className='massege'>이벤트가 시작되면  배너를 통해 알려드려요.</div>
          </div>
        </div>

      </div>
    </div>
   </div>
  )
}

export default EventZip
