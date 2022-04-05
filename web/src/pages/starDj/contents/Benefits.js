import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'

import Bottom from '../component/Bottom'
import './benefits.scss'


import {Context} from "context";
import { IMG_SERVER } from "constant/define";

const StarDjBenefits = () => {
  let history = useHistory()
  const context = useContext(Context) 

  // 페이지 시작
  return (
   <div id='StarDjBenefits'>
    <Header position={'sticky'} title="스타DJ 혜택" type={'back'}/>
    <div className='content'>

    </div>
    <Bottom>
      <div className='notice'>
        <div className='noticeTitle'>
          <img src={`${IMG_SERVER}/starDJ/starDJ_notice-title.png`} alt="유의사항"/>
        </div>
        <ul className='noticeWrap'>
          <li className='noticeList'>이벤트 및 컨텐츠 방송 외의 라이브 방송 푸시는 발송 요청이 거절될 수 있습니다.</li>
          <li className='noticeList'>60일 이내에 2시간 이상 방송 시간이 없으면 스타DJ 누적 횟수가 초기화 됩니다.</li>
          <li className='noticeList'>누적 횟수에 따른 지원금은 별로 지급됩니다.</li>
          <li className='noticeList'>시그니처 아이템 제작은 선정 횟수에 따라 정해진 가격대 안에서 DJ와의 협의를 통해 제작됩니다.</li>
        </ul>
      </div>
    </Bottom>
   </div>
  )
}

export default StarDjBenefits
