import React from 'react';
import Swiper from 'react-id-swiper'

import {IMG_SERVER} from 'context/config'

import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'

import './style.scss'

const winningList = [
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-1.png',
    presentName:'10달',
    nick:'헌바라기_하늘이 ✿'
  },
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-2.png',
    presentName:'50달',
    nick:'헌바라기_하늘이 ✿'
  },
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-3.png',
    presentName:'100달',
    nick:'헌바라기_하늘이 ✿'
  },
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-4.png',
    presentName:'스타벅스 아메리카노',
    nick:'헌바라기_하늘이 ✿'
  },
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-5.png',
    presentName:'GS25 상품권 5천원',
    nick:'헌바라기_하늘이 ✿'
  },
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-6.png',
    presentName:'네이버페이 1만원 포인트',
    nick:'헌바라기_하늘이 ✿'
  },
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-7.png',
    presentName:'맘스터치 싸이버거 세트',
    nick:'헌바라기_하늘이 ✿'
  },
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-8.png',
    presentName:'배스킨라빈스31 2만원 교환권',
    nick:'헌바라기_하늘이 ✿'
  },
]

const keyboardHero = () => {
  const swiperParams = {
    loop: true,
    direction: 'vertical',
    slidesPerColumnFill: 'row',
    slidesPerView: 2,
    // resistanceRatio: 0,
    autoplay: {
      delay: 2500
    }
  }
  return (
    <div id="keyboardHero">
      <Header title="키보드 히어로 31" type="back"/>
      <img src={`${IMG_SERVER}/event/keyboardHero/mainTop.png`} alt="키보드 히어로 31" />
      <section className="winningWrap">
        <div className="winningBox">
          <div className="title">
            <img src={`${IMG_SERVER}/event/keyboardHero/todayWinningTitle.png`} alt="오늘의 당첨자" />
          </div>
          <div className="content">
            <div className="welcome">축하드립니다!</div>
            {(winningList && winningList.length > 0) ?
              <Swiper {...swiperParams}>
                {winningList.map((list, index)=>{
                  return(
                    <div key={index}>
                      <ListRow photo={list.presentImg}>
                        <div className="listContent">
                          <div className="present">{list.presentName}</div>
                          <div className="nick">{list.nick}</div>
                        </div>
                      </ListRow>
                    </div>
                  )
                })}
              </Swiper>
              :
              <div className='listNone'>
                
              </div>
            }
            
            <button className="listMore">
              <img src={`${IMG_SERVER}/event/keyboardHero/todayWinningButton.png`} alt="당첨자보기 및 선물받기" />
            </button>
          </div>
        </div>
      </section>
      <section className="contentWrap">
        <img src={`${IMG_SERVER}/event/keyboardHero/mainContent.png`} />
      </section>
      <section className="noticeWrap">
        <img src={`${IMG_SERVER}/event/keyboardHero/notice.png`} alt="주의사항"/>
      </section>
    </div>
  );
};

export default keyboardHero;