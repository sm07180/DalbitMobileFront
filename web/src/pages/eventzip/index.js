import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'

import './style.scss'
import moment from "moment";
import {Context} from "context";

const EventZip = () => {
  let history = useHistory()
  const context = useContext(Context)
  const nowDay = moment().format('YYYYMMDD');
  const [ingEvent, setIngEvent] = useState([]);
  const [endEvent, setEndEvent] = useState([]);

  const [eventInfo, setEventInfo] = useState(
    [
      {
        eventTitle : "달라져스 : 달라 스톤 모으기",
        startDay : "20220308",
        endDay : "20220327",
        bannerImg : "https://image.dalbitlive.com/eventzip/eventZip_7634.png",
        path : "/event/rebranding",
        endState : false
      },
      {
        eventTitle : "슬기로운 달라생활",
        startDay : "20220307",
        endDay : "20220327",
        bannerImg : "https://image.dalbitlive.com/eventzip/eventZip_7733.png",
        path : "/notice",
        noticeNum : 617,
        endState : false
      },
      {
        eventTitle : "달라를 소개해 달라",
        startDay : "20220303",
        endDay : "20220324",
        bannerImg : "https://image.dalbitlive.com/eventzip/eventZip_7650.png",
        path : "/event/share",
        endState : false
      },
      {
        eventTitle : "달라를 축하해 달라",
        startDay : "20220228",
        endDay : "20220321",
        bannerImg : "https://image.dalbitlive.com/eventzip/eventZip_7649.png",
        path : "/event/acrostic",
        endState : false
      },
      {
        eventTitle : "달라에 놀러온 핵인싸 주목!",
        startDay :"20220310",
        endDay : "",
        bannerImg : "https://image.dalbitlive.com/eventzip/eventZip_7583.png",
        path : "/event/playmaker",
        endState : false
      },
      {
        eventTitle : "3사 플랫폼 노래대전",
        startDay : "20220303",
        endDay : "20220311",
        bannerImg : "https://image.dalbitlive.com/eventzip/eventZip_7677.png",
        path : "/event/platformWar",
        endState : false
      },
      {
        eventTitle : "친구 초대, 초대왕 도전!",
        startDay : "20220227",
        endDay : "20220307",
        bannerImg : "https://image.dalbitlive.com/eventzip/eventZip_7590.png",
        path : "/event/invite",
        endState : false
      },
    ]
  );

  useEffect(() => {
    for(let i = 0; i < eventInfo.length; i++){
      if(moment(nowDay).isAfter(moment(eventInfo[i].endDay).add(1, 'days'))){
        eventInfo[i].endState = true;
        endEvent.push(eventInfo[i]);
      } else {
        eventInfo[i].endState = false;
        ingEvent.push(eventInfo[i]);
      }
    }
  }, [nowDay]);

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
        <div id='ingWrap'>
          {
            ingEvent.map((list, index) => {
              return (
                <div key={index} className={`eventList ${list.endState ? 'end' : ''}`} onClick={() => {golink(`${list.path}`, list.endState, `${list.noticeNum && list.noticeNum}`)}}>
                  <div className='thumbNail' style={{backgroundImage: `url(${list.bannerImg})`}}/>
                  <div className='eventInfo'>
                    <div className='eventTitle'>{list.eventTitle}</div>
                    <div className='eventDate'>
                      {list.endDay ? `${moment(list.startDay).format('MM.DD')} - ${moment(list.endDay).format('MM.DD')}` : "상시모집"}
                    </div>
                  </div>
                </div>
              )      
            })
          }
        </div>
        <div id='comingSoonWrap'>
          <div className='eventList comingSoon'>
            <div className='thumbNail'/>
            <div className='eventInfo'>
              <div className='eventTitle'>이벤트가 시작되면 배너를 통해 알려드려요.</div>
            </div>
          </div>
        </div>
        <div id='endWrap'>
          {
            endEvent.map((list, index) => {
              return (
                <div key={index} className={`eventList ${list.endState ? 'end' : ''}`} onClick={() => {golink(`${list.path}`, list.endState)}}>
                  <div className='thumbNail' style={{backgroundImage: `url(${list.bannerImg})`}}/>
                  <div className='eventInfo'>
                    <div className='eventTitle'>{list.eventTitle}</div>
                    <div className='eventDate'>{moment(list.startDay).format('MM.DD')} - {moment(list.endDay).format('MM.DD')}</div>
                  </div>
                </div>
              )              
            })
          }
        </div>  
      </div>
    </div>
   </div>
  )
}

export default EventZip
