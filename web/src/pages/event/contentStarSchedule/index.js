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
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7940-2.png",
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
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_7952.png",
        title:"제2회 헌이의 음유시인",
        date:"4월 23일 23:00",
        endDay : "20220424 020000",
        memNo:61630125869781,
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
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_8027.png",
        title:"얀규의 사연 라디오",
        date:"5월 7일 20:00",
        endDay : "20220507 230000",
        memNo:11614503085121,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_8031.png",
        title:"뮤아진의 리액션 챌린지",
        date:"5월 11일 22:00",
        endDay : "20220512 010000",
        memNo:61642511571222,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_userpic.jpg",
        title:"헌이의 최고 목소리를 찾아라",
        date:"5월 13일 22:30",
        endDay : "20220514 013000",
        memNo:61630125869781,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_220517-11631518696100.png",
        title:"온유의 연애의 참견",
        date:"5월 17일 19:00",
        endDay : "20220517 220000",
        memNo:11631518696100,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_220519-61641048793489.png",
        title:"시골쥐의 나를 표현하라",
        date:"5월 19일 21:00",
        endDay : "20220520 000000",
        memNo:61641048793489,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_8065.png",
        title:"빛쀼의 쀼가맨",
        date:"5월 20일 15:15",
        endDay : "20220520 181500",
        memNo:31621777031786,
        offState:false
      },
      {
        bannerImg:"https://image.dalbitlive.com/event/contentStarSchedule/contentStar_8055.png",
        title:"숲속의 음악스케치",
        date:"5월 27일 20:00",
        endDay : "20220527 230000",
        memNo:31650388124370,
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
        <img src={`${IMG_SERVER}/event/contentStarSchedule/schedule-5-4.png`} alt="5월 편성표" />
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
                {endEvent.reverse().map((list, index)=>{
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