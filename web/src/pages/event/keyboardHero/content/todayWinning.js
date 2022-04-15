import React from 'react';

import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'

import './todayWinning.scss'

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
        <ListRow photo={``}>
          <div className="listContent">
            <div className="item">10달</div>
            <div className="item">12312312312311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111</div>
          </div>
          <div className="listBack">
            <button>선물받기</button>
          </div>
        </ListRow>
        <ListRow photo={``}>
          <div className="listContent">
            <div className="item">10달</div>
            <div className="item">123123123123</div>
          </div>
          <div className="listBack">
            <button>선물받기</button>
          </div>
        </ListRow>
      </section>
    </div>
  );
};

export default todayWinning;