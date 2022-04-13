import React from 'react';
import {useHistory} from 'react-router-dom'

import {IMG_SERVER} from 'context/config'

import Header from 'components/ui/header/Header'

import './style.scss'

const schedule = [
  {
    bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7901.png",
    title:"온유가 간다! EP.1 본사 습격편",
    date:"4월 15일 18:00",
    memNo:11631518696100,
  },
]

const contentStarSchedule = () => {
  const history = useHistory();
  
  return (
    <div id="contentStarSchedule">
      <Header title="콘텐츠 방송 편성표" type="back"/>
      <section className="mainTopWrap">
        <img src={`${IMG_SERVER}/event/contentStarSchedule/mainTop.png`} alt="콘텐츠 스타 편성표" />
      </section>
      <section className="scheduleWrap">
        <img src={`${IMG_SERVER}/event/contentStarSchedule/schedule.png`} alt="4월 편성표" />
      </section>
      <section className="contentWrap">
        {schedule.map((list, index)=>{
          return(
            <div className="contentBox" key={index} onClick={() => history.push(`/profile/${list.memNo}`)}>
              <div className="thumbNail">
                <img src={list.bannerImg} alt={list.title} />
              </div>
              <div className="eventInfo">
                <div className="eventTitle">{list.title}</div>
                <div className="eventDate">{list.date}</div>  
              </div>
            </div>
          )
        })}
        <div className='contentBox comingSoon'>
          <div className='thumbNail'/>
          <div className='eventInfo'>
            <div className='eventTitle'>다음 콘텐츠 스타는 누구일까요?</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default contentStarSchedule;