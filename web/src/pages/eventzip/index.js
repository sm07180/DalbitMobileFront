import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'

import './style.scss'
import moment from "moment";
import {Context} from "context";

const EventZip = () => {
  let history = useHistory()
  const context = useContext(Context)
  const platformWarEventEnd = new moment().isAfter('20220311');
  const shareEventEnd = new moment().isAfter('20220324');
  const poemEventEnd = new moment().isAfter('20220322');
  const inviteEventEnd = new moment().isAfter('20220308');
  const playMakerEventEnd = new moment().isAfter('20301231');
  
  const dalragersEvenetEnd = new moment().isAfter('20220327');

  const golink = (path, endDay, num) => {
    if(endDay){
      context.action.alert({msg: "해당 이벤트는 종료되었습니다."})
    }else{
      if(num !== undefined) {
        //golink("path(/notice)", endDay, num(공지사항번호)) => 공지사항 번호를 state값으로 같이 넘겨줘야함
        history.push({pathname: `${path}/${num}`, state: num});
      } else {
        history.push(path);
      }
    }
  }

  // 페이지 시작
  return (
   <div id='eventZip'>
    <Header position={'sticky'} title="리브랜딩 이벤트 모음.zip" type={'back'}/>
    <div className='content'>
      <div className='eventWrap'>

        <div className={`eventList ${dalragersEvenetEnd ? 'end' : ''}`} onClick={() => {golink("/event/rebarnding", dalragersEvenetEnd)}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/eventzip/eventZip_7634.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>달라져스 흩어진 스톤을 찾아서</div>
            <div className='eventDate'>03.08 - 03.27</div>
          </div>
        </div>

        <div className={`eventList ${platformWarEventEnd ? 'end' : ''}`} onClick={() => {golink("/event/platformWar", platformWarEventEnd)}}>
        {/*  <div className={`eventList ${platformWarEventEnd ? 'end' : ''}`} onClick={() => {golink("/notice", platformWarEventEnd, 612)}}>*/}
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/eventzip/eventZip_7677.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>3사 플랫폼 노래대전</div>
            <div className='eventDate'>03.03 - 03.11</div>
          </div>
        </div>

        <div className={`eventList ${shareEventEnd ? 'end' : ''}`} onClick={() => {golink("/event/share", shareEventEnd)}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/eventzip/eventZip_7650.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>달라를 소개해 달라</div>
            <div className='eventDate'>03.03 - 03.24</div>
          </div>
        </div>

        <div className={`eventList ${poemEventEnd ? 'end' : ''}`} onClick={() => {golink("/event/acrostic", poemEventEnd)}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/eventzip/eventZip_7649.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>달라를 축하해 달라</div>
            <div className='eventDate'>02.28 - 03.21</div>
          </div>
        </div>

        <div className={`eventList ${inviteEventEnd ? 'end' : ''}`} onClick={() => {golink("/event/invite", inviteEventEnd)}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/eventzip/eventZip_7590.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>친구 초대, 초대왕 도전!</div>
            <div className='eventDate'>02.21 - 03.07</div>
          </div>
        </div>

        <div className={`eventList ${playMakerEventEnd ? 'end' : ''}`} onClick={() => {golink("/event/playmaker", playMakerEventEnd)}}>
          <div className='thumbNail' style={{backgroundImage: `url(https://image.dalbitlive.com/eventzip/eventZip_7583.png)`}}/>
          <div className='eventInfo'>
            <div className='eventTitle'>달라에 놀러온 핵인싸 주목!</div>
            <div className='eventDate'>상시 모집</div>
          </div>
        </div>

        <div className='eventList comingSoon'>
          <div className='thumbNail'/>
          <div className='eventInfo'>
            <div className='eventTitle'>이벤트가 시작되면 배너를 통해 알려드려요.</div>
          </div>
        </div>
      </div>
    </div>
   </div>
  )
}

export default EventZip
