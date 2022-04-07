import React, {useState} from 'react';
// global components
import {IMG_SERVER} from 'context/config';

import '../../scss/badgeInfo.scss';

const BadgeInfoPop = (props) => {
  const {closePopup} = props;

  // 페이지 시작
  return (
    <>
      <div className="popOverTopImg">
        <div className="teamBadge">
          <img src={`${IMG_SERVER}/team/badge/a002.png`} alt="a002" />
        </div>
      </div>
      <div className="textBox">
        <div className="textWrap">
          <div className="text1">방송에 진심</div>
          <div className="text3">방송시간 500시간 달성</div>
        </div>
        <div className="textWrap">
          <div className="text2">보너스 경험치</div>
          <div className="text2"><span>300 EXP</span></div>
        </div>
        <div className="textWrap">
          <div className="text2">진행도</div>
          <div className="text2"><span>23 / 1000</span></div>
        </div>
      </div>
    </>
  )
}

export default BadgeInfoPop;