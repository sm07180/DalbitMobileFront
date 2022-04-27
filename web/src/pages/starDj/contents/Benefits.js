import React, {useEffect, useState, useCallback, useContext} from 'react'

import Header from 'components/ui/header/Header'

import Bottom from '../component/Bottom'
import './benefits.scss'


import { IMG_SERVER } from "constant/define";

const StarDjBenefits = () => {
  const benefitList = [
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-1.png",
      benefitsName : "스타DJ 전용 배지"
    },
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-2.png",
      benefitsName : "스타DJ 전용 프레임"
    },
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-3.png",
      benefitsName : "라이브 썸네일 선택 기능"
    },
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-4.png",
      benefitsName : "라이브 푸시 알림 1회 발송"
    },
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-5.png",
      benefitsName : "방송 개설 시 부스터 효과"
    },
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-6.png",
      benefitsName : "방송 개설 시 탑 배너 노출"
    },
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-7.png",
      benefitsName : "환전 수수료 특별 우대"
    },
    {
      benefitsImg : "/starDJ/benefits/starDJ_benefits-8.png",
      benefitsName : "첫 선정 기념 달비굿즈 지급"
    },
  ]

  // 페이지 시작
  return (
   <div id='StarDjBenefits'>
    <Header position={'sticky'} title="스타DJ 혜택" type={'back'}/>
    <div className='content'>
      <section className='benefits'>
        <div className='benefitsTitle'>
          <span>달라를 빛내줄 셀럽</span>
          <span>스타 DJ의 어메이징한 혜택!</span>
        </div>
        <div className='benefitsWrap'>
          {
            benefitList.map((list, index) => {
              return (
                <div className='benefitsList' key={index}>
                  <img src={`${IMG_SERVER}${list.benefitsImg}`} alt={`${list.benefitsName}`}/>
                  <span className='benefitsName'>{list.benefitsName}</span>
                </div>
              )
            })
          }
        </div>
      </section>
      <section className='benefits'>
        <div className='benefitsTitle'>
          <span>선정될 때마다 추가로 쏟아지는 혜택</span>
          <span>활동 지원비 & 다양한 굿즈 지급!</span>
        </div>
        <div className='rewardWrap'>
          <div className='rewardList'>
            <span className='selectedCount'>1~5회</span>
            <span className='selectedReward'>500달</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount'>6회</span>
            <span className='selectedReward'>2,000달 + 부스터 30개 + 시그니처 아이템</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount'>7~9회</span>
            <span className='selectedReward'>2,000달 + 부스터 30개</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount'>10회</span>
            <span className='selectedReward'>4,000달 + 부스터 30개<br/>+ 시그니처 아이템</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount'>11~14회</span>
            <span className='selectedReward'>3,000달 + 부스터 30개</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount'>15회</span>
            <span className='selectedReward'>40만원 + 4,000달 + 부스터 30개</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount'>16~19회</span>
            <span className='selectedReward'>4,000달 + 부스터 30개</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount point'>20회</span>
            <span className='selectedReward'>150만원 + 부스터 30개</span>
          </div>
          <div className='rewardList'>
            <span className='selectedCount point'>21회</span>
            <span className='selectedReward'>
              <img src={`${IMG_SERVER}/starDJ/benefits/starDJ_benefits-frame.png`}/>
              명예 프레임 (영구 소장)
            </span>
          </div>
        </div>
      </section>
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
