import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'
import Button from './component/Button'
import Title from './component/Title'
import Bottom from './component/Bottom'

import './style.scss'
import {Context} from "context";
import { IMG_SERVER } from "constant/define";

const StarDj = () => {
  let history = useHistory()
  const context = useContext(Context) 
  const [applyBtn, setApplyBtn] = useState(false);

  // 페이지 시작
  return (
    <div id='starDj'>
      <Header position={'sticky'} title="스타DJ 신청" type={'back'}/>
      <div className='content'>
        <div className='starDjTop'>
          <img src={`${IMG_SERVER}/starDJ/starDJ_topImg.png`} alt=""/>
          <div className='buttonPosition'>
            <Button height="20%">
              <span>
                <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-1.png`} alt=""/>
              </span>
              <span>
                <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-2.png`} alt=""/>
              </span>
            </Button>
          </div>
        </div>
        <div className='starDjBody'>
          <section className='scheduleWrap'>
            <Title name="schedule"/>
            <div className='sectionContent'>
              <img src={`${IMG_SERVER}/starDJ/starDJ_schedule-content.png`} alt=""/>
            </div>
          </section>
          <section className='conditionWrap'>
            <Title name="condition"/>
            <div className='sectionContent'>
              <div className='countPeriod'>데이터 집계 기간 : 2월 28일 ~ 3월 30일</div>
              <div className='conditionListWrap'>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon broadcastTime'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>방송시간 40시간</span>
                      <span className='titleInfo'>(팬 방송 제외)</span>
                    </div>
                  </div>
                  <div className='myCondition achieve'>
                    <span className='myData'>80시간</span>
                    <span className='isAchieve'>달성</span>
                  </div>
                </div>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon totalListener'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>누적 시청자 수 500명</span>
                    </div>
                  </div>
                  <div className='myCondition'>
                    <span className='myData'>420명</span>
                    <span className='isAchieve'>미달성</span>
                  </div>
                </div>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon totalLike'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>좋아요 수 1,500개</span>
                      <span className='titleInfo'>(유료 부스터 포함)</span>
                    </div>
                  </div>
                  <div className='myCondition achieve'>
                    <span className='myData'>10,002개</span>
                    <span className='isAchieve'>달성</span>
                  </div>
                </div>
                <div className='conditionList'>                
                  <div className='listFront'>
                    <span className='icon totalByeol'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>받은 별 10,000개</span>
                      <span className='titleInfo'>(룰렛 포함)</span>
                    </div>
                  </div>
                  <div className='myCondition'>
                    <span className='myData'>999개</span>
                    <span className='isAchieve'>미달성</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='standardWrap'>
            <Title name="standard"/>
            <div className='sectionContent'>
              <div className='standard'>정량평가와 가산점을 합한 상위 20명(±α)</div>
              <div className='estimateWrap'>
                <div className='estimate'>정량평가</div>
                <span>+</span>
                <div className='estimate'>가산점</div>
              </div>
              <div className='estimateInfo'>
                <p>정량 평가란?</p>
                <p>전 달 (방송시간 + 평균 동접 시청자 수 + 좋아요 점수 + 받은 별)</p>
              </div>
              <Button height="14%">
                <span>정량 평가 기준 자세히 보기</span>
              </Button>
            </div>
          </section>
          <section className='addPickWrap'>
            <Title name="addPick"/>
            <div className='sectionContent'>
              <p>
                신입DJ들의 콘텐츠 활성화를 목적으로<br/>
                <strong>가입일 기준 90일 이내 DJ</strong>를 대상으로 하여<br/>
                운영자 심사를 통해 추가 선발합니다.</p>
            </div>
          </section>
        </div>      
      </div>
      <Bottom>
        <div className='buttonPosition'>
          <Button height="25%" active={applyBtn}>
            <span>
              {
                applyBtn ? 
                  <img src={`${IMG_SERVER}/starDJ/starDJ_btnName-active.png`} alt=""/>
                :                
                  <img src={`${IMG_SERVER}/starDJ/starDJ_btnName-disabled.png`} alt=""/>
              }
            </span>
          </Button>
        </div>
        <div className='notice'>
          <div className='noticeTitle'>
            <img src={`${IMG_SERVER}/starDJ/starDJ_notice-title.png`} alt="유의사항"/>
          </div>
          <ul className='noticeWrap'>
            <li className='noticeList'>60일 이내에 2시간 이상 방송 시간이 없으면 스타DJ 누적 횟수가 초기화 됩니다.</li>
            <li className='noticeList'>지속적인 권고에도 불구하고 방송인으로서의의무를 다하지 아니할 경우에는 스타DJ 자격을 박탈할 수 있습니다.</li>
            <li className='noticeList'>신입부문 특별 선발 또한 신청한 DJ에 한하여 선발합니다.</li>
            <li className='noticeList'>신청 및 심사에 따라 신입부문 특별 선발 선정이 없을 수도 있습니다.</li>
          </ul>
        </div>
      </Bottom>    
    </div>
  )
}

export default StarDj
