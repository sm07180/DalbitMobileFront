import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import { addComma } from "lib/common_fn";
import moment from 'moment'

import Header from 'components/ui/header/Header'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import Button from './component/Button'
import Title from './component/Title'
import Bottom from './component/Bottom'

import './style.scss'
import {Context} from "context";
import { IMG_SERVER } from "constant/define";

const StarDj = () => {
  let history = useHistory()
  const context = useContext(Context) 
  const [applyBtn, setApplyBtn] = useState(false); //신청하기 버튼 활성화 상태값
  const [popup, setPopup] = useState(false); //신청하기 버튼 활성화 상태값

  // 최소 신청 제한 조건 
  const applyCondition = {
    broadcastTime : 40,
    totalListener : 500,
    totalLikeCnt : 1500,
    totalByeolCnt : 10000
  }
  // 데이터 집계 기간 임시 데이터
  const [period, setPeriod] = useState({
    startDay : "20220228",
    endDay : "20220330",
  })

  // 본인이 달성한 신청 조건 임시 데이터
  const [myApplyData, setMyApplyData] = useState({
    broadcastTime : 80,
    totalListener : 420,
    totalLikeCnt : 10002,
    totalByeolCnt : 999,
  })

  const golink = (path) => {
    history.push(path);
  }

  const openPopup = () => {
    setPopup(true)
  }

  // 신청하기 버튼 활성화 체크
  useEffect(() => {
    if((myApplyData.broadcastTime >= applyCondition.broadcastTime) && (myApplyData.totalListener >= applyCondition.totalListener) && (myApplyData.totalLikeCnt >= applyCondition.totalLikeCnt) && (myApplyData.totalByeolCnt >= applyCondition.totalByeolCnt)) {
      setApplyBtn(true)
    } else (
      setApplyBtn(false)
    )
  }, [myApplyData])

  // 페이지 시작
  return (
    <div id='starDj'>
      <Header position={'sticky'} title="스타DJ 신청" type={'back'}/>
      <div className='content'>
        <div className='starDjTop'>
          <img src={`${IMG_SERVER}/starDJ/starDJ_topImg.png`} alt=""/>
          <div className='buttonPosition'>
            <Button height="20%">
              <span onClick={() => {golink("/starDj/benefits")}}>
                <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-1.png`} alt=""/>
              </span>
              <span onClick={() => {golink("/honor")}}>
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
              <div className='countPeriod'>
                데이터 집계 기간 : {moment(period.startDay).format('MM월 DD일')} ~ {moment(period.endDay).format('MM월 DD일')}
              </div>
              <div className='conditionListWrap'>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon broadcastTime'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>방송시간 {addComma(applyCondition.broadcastTime)}시간</span>
                      <span className='titleInfo'>(팬 방송 제외)</span>
                    </div>
                  </div>
                  <div className={`myCondition ${myApplyData.broadcastTime > applyCondition.broadcastTime ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(myApplyData.broadcastTime)}시간</span>
                    <span className='isAchieve'>{myApplyData.broadcastTime > applyCondition.broadcastTime ? "달성" : "미달성"}</span>
                  </div>
                </div>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon totalListener'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>누적 시청자 수 {addComma(applyCondition.totalListener)}명</span>
                    </div>
                  </div>
                  <div className={`myCondition ${myApplyData.totalListener > applyCondition.totalListener ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(myApplyData.totalListener)}명</span>
                    <span className='isAchieve'>{myApplyData.totalListener > applyCondition.totalListener ? "달성" : "미달성"}</span>
                  </div>
                </div>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon totalLike'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>좋아요 수 {addComma(applyCondition.totalLikeCnt)}개</span>
                      <span className='titleInfo'>(유료 부스터 포함)</span>
                    </div>
                  </div>
                  <div className={`myCondition ${myApplyData.totalLikeCnt > applyCondition.totalLikeCnt ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(myApplyData.totalLikeCnt)}개</span>
                    <span className='isAchieve'>{myApplyData.totalLikeCnt > applyCondition.totalLikeCnt ? "달성" : "미달성"}</span>
                  </div>
                </div>
                <div className='conditionList'>                
                  <div className='listFront'>
                    <span className='icon totalByeol'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>받은 별 {addComma(applyCondition.totalByeolCnt)}개</span>
                      <span className='titleInfo'>(룰렛 포함)</span>
                    </div>
                  </div>
                  <div className={`myCondition ${myApplyData.totalByeolCnt > applyCondition.totalByeolCnt ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(myApplyData.totalByeolCnt)}개</span>
                    <span className='isAchieve'>{myApplyData.totalByeolCnt > applyCondition.totalByeolCnt ? "달성" : "미달성"}</span>
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
                <span onClick={openPopup}>정량 평가 기준 자세히 보기</span>
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
            {
              applyBtn ? 
                <span>
                  <img src={`${IMG_SERVER}/starDJ/starDJ_btnName-active.png`} alt=""/>
                </span>
              :         
                <span>       
                  <img src={`${IMG_SERVER}/starDJ/starDJ_btnName-disabled.png`} alt=""/>
                </span>
            }
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
      {
        popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>정량 평가 점수 기준</div>
          <div className='popContent'>
            <div className='period'>
              데이터 집계 기간 : {moment(period.startDay).format('MM월 DD일')} ~ {moment(period.endDay).format('MM월 DD일')}
            </div>
            <div className='score'>
              <p><span>방송 점수 (25%) : </span><span>누적 방송 시간 (팬 방송 제외)</span></p>
              <p><span>시청자 점수 (25%) : </span><span>평균 시청자 수</span></p>
              <p><span>좋아요 점수 (25%) : </span><span>받은 좋아요 수<br/>(유료 부스터 포함,무료 제외)</span></p>
              <p><span>선물 점수 (25%) : </span><span>받은 선물 수 (룰렛 포함)</span></p>
            </div>
            <div className='referenceWrap'>
              <span className='referenceTitle'>경고/정지 이력</span>
              <ul className='referenceList'>
                <li>경고 이력 2건부터 -10점 반영</li>
                <li>정지 시 선발 불가</li>
              </ul>
            </div>
            <div className='referenceWrap'>
              <span className='referenceTitle'>타임 랭킹 가산점</span>
              <ul className='referenceList'>
                <li>1위 : 1.5점 / 2위 : 0.5점 / 3위 : 0.3점</li>
              </ul>
            </div>
            <div className='referenceWrap'>
              <span className='referenceTitle'>기획 방송 가산점</span>
              <ul className='referenceList'>
                <li>데이터 집계 기간 내 진행한 기획 방송을 통해 운영자 가산점 반영</li>
              </ul>
            </div>
          </div>
        </LayerPopup>
      }  
    </div>
  )
}

export default StarDj
