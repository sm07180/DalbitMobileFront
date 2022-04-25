import React, {useState} from 'react';
// global components
import {IMG_SERVER} from 'context/config';

import '../../scss/badgeInfo.scss';

const BadgeInfoPop = (props) => {
  const {statChk,badgeData} = props;

  const secFormatHH = (data,code) => {
    let hour = 0;
    if(code === "a008" || code === "a002"){
      hour = Math.floor(data / 3600);
      return hour;
    }else{
      return data
    }
  }
  // 페이지 시작
  return (
    <>
      <div className="popOverTopImg">
        <div className="teamBadge">
          {badgeData.bg_achieve_yn === 'n' && <img src={`${badgeData.bg_black_url}`} alt={badgeData.bg_name} />}
          {badgeData.bg_achieve_yn === 'y' && <img src={`${badgeData.bg_color_url}`} alt={badgeData.bg_name} />}
        </div>
      </div>
      <div className="textBox">
        <div className="textWrap">
          <div className="text1">{badgeData.bg_name}</div>
          <div className="text3">{badgeData.bg_conts}</div>
        </div>
        <div className="textWrap">
          <div className="text2">보너스 경험치</div>
          <div className="text2"><span>{badgeData.bg_bonus} EXP</span></div>
        </div>
        {(statChk ==='m' || statChk==='t') &&
        <div className="textWrap">
          <div className="text2">진행도</div>
          <div className="text2"><span>{secFormatHH(badgeData.bg_achieve,badgeData.bg_code)} /{secFormatHH(badgeData.bg_objective,badgeData.bg_code)}</span></div>
        </div>
        }
      </div>
    </>
  )
}

export default BadgeInfoPop;