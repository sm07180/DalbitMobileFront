import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'

import {IMG_SERVER} from 'context/config'
import moment from "moment";

import Header from 'components/ui/header/Header'

import Tabmenu from './components/tabmenu';
import './style.scss'

//오픈 예정~오픈중인 이벤트는 On 리스트에 > 종료되면 Off리스트로 이동
const submenu = ['예정된 콘텐츠', '종료된 콘텐츠']

const contentStarSchedule = () => {
  const history = useHistory();

  const nowDay = moment().format('YYYYMMDD HHmmss');
  const [tabType, setTabType] = useState(submenu[0])
  const [ingEvent, setIngEvent] = useState([]);
  const [endEvent, setEndEvent] = useState([]);

  const [schedule, setSchedule] = useState(
    [
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7901.png",
        title:"온유가 간다! EP.1 본사 습격편",
        date:"4월 15일 18:00",
        endDay : "20220415 210000",
        memNo:11631518696100,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7917.png",
        title:"옹기종기의 댄스 맞추기",
        date:"4월 15일 20:30",
        endDay : "20220415 233000",
        memNo:41632647800399,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7940.png",
        title:"말쑤의 냉혈의 말쑤",
        date:"4월 20일 22:00",
        endDay : "20220421 010000",
        memNo:31639546917221,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7934.jpg",
        title:"빠기의 오지리는 게임",
        date:"4월 21일 21:30",
        endDay : "20220422 003000",
        memNo:11592380122241,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7924.png",
        title:"Int팀 이그잼의 the Voice of Dalla",
        date:"4월 22일 20:00",
        endDay : "20220422 230000",
        memNo:61611836929345,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7941.png",
        title:"청이의 리액션 챌린지",
        date:"4월 22일 22:00",
        endDay : "20220423 010000",
        memNo: 31607782195952,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7915.png",
        title:"시골쥐의 패션왕",
        date:"4월 23일 21:00",
        endDay : "20220424 000000",
        memNo:61641048793489,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7935.png",
        title:"무진이의 서든어택",
        date:"4월 24일 17:00",
        endDay : "20220424 200000",
        memNo:31605522105416,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7919.png",
        title:"온유의 도전! 골든벨",
        date:"4월 24일 19:00",
        endDay : "20220424 220000",
        memNo:11631518696100,
        offState:false
      },
    ]
  )
  
  useEffect(() => {
    let endList = [];
    let ingList = [];
    for(let i = 0; i < schedule.length; i++){
      if(moment(nowDay).isAfter(moment(schedule[i].endDay))){
        schedule[i].offState = true;
        endList.push(schedule[i]);
      } else {
        schedule[i].offState = false;
        ingList.push(schedule[i]);
      }
    }   
    setIngEvent(ingList);
    setEndEvent(endList);
  }, [nowDay]);

  return (
    <div id="contentStarSchedule">
      <Header title="콘텐츠 방송 편성표" type="back"/>
      <section className="mainTopWrap">
        <img src={`${IMG_SERVER}/event/contentStarSchedule/mainTop.png`} alt="콘텐츠 스타 편성표" />
      </section>
      <section className="scheduleWrap">
        <img src={`${IMG_SERVER}/event/contentStarSchedule/schedule-6.png`} alt="4월 편성표" />
      </section>
      <Tabmenu data={submenu} tab={tabType} setTab={setTabType} />
      <section className="contentWrap">
        {tabType === submenu[0] ?
          <>
            {(ingEvent && ingEvent.length > 0)&&
              <>
                {ingEvent.map((list, index)=>{
                  return(
                    <div className={`contentBox`} key={index} onClick={() => history.push(`/profile/${list.memNo}`)}>
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
              </>
            }
            <div className='contentBox comingSoon'>
              <div className='thumbNail'/>
              <div className='eventInfo'>
                <div className='eventTitle'>다음 콘텐츠 스타는 누구일까요?</div>
              </div>
            </div>
          </>
        :
          <>
            {(endEvent && endEvent.length > 0) ?
              <>
                {endEvent.map((list, index)=>{
                  return(
                    <div className={`contentBox off`} key={index}>
                      <div className="thumbNail">
                        <div className="off">
                          <p>종료된 콘텐츠 입니다.</p>
                        </div>
                        <img src={list.bannerImg} alt={list.title} />
                      </div>
                      <div className="eventInfo">
                        <div className="eventTitle">{list.title}</div>
                        <div className="eventDate">{list.date}</div>  
                      </div>
                    </div>
                  )
                })}
              </>
            :
              <div className="offListNone">
                <p className='title'>종료된 콘텐츠가 없어요.</p>
                <p>아직 콘텐츠 방송이 진행중이에요!</p>
              </div>
            }
          </>
        }
        
      </section>
    </div>
  );
};

export default contentStarSchedule;