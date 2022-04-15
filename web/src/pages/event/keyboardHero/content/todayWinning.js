import React from 'react';

import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'

import './todayWinning.scss'

const winningList = [
  {
    presentImg:'https://image.dalbitlive.com/event/keyboardHero/present-1.png',
    presentName:'10달',
    nick:'12312312312311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
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

const todayWinning = () => {
  return (
    <div id="todayWinning">
      <Header title="오늘의 당첨자" type="back"/>
      <section className="winningTopWrap">
        <div className="topBox">
          <p className="mainText">당첨을 축하드립니다</p>
          <p className="subText">선물받기 버튼을 눌러 선물을 수령해주세요.</p>
        </div>
      </section>
      <section>
        {(winningList && winningList.length > 0) &&
          winningList.map((list, index)=>{
            return(
              <ListRow photo={list.presentImg} key={index}>
                <div className="listContent">
                  <div className="item">{list.presentName}</div>
                  <div className="item">{list.nick}</div>
                </div>
                <div className="listBack">
                  <button>선물받기</button>
                </div>
              </ListRow>
            )
          })
        }
      </section>
    </div>
  );
};

export default todayWinning;