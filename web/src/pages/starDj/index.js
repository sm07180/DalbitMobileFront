import React, {useContext, useEffect, useState} from 'react'
import {useHistory, withRouter} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {addComma} from "lib/common_fn";

import Header from 'components/ui/header/Header'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import Button from './component/Button'
import Title from './component/Title'
import Bottom from './component/Bottom'

import './style.scss'
import {Context} from "context";
import {IMG_SERVER} from "constant/define";
import Api from "context/api";
import moment from "moment";
import UtilityCommon from "common/utility/utilityCommon";

const StarDj = (props) => {
  let history = useHistory();
  const context = useContext(Context) 
  const [applyBtn, setApplyBtn] = useState(false); //신청하기 버튼 활성화 상태값
  const [popup, setPopup] = useState(false); //팝업

  const isDesktop = useSelector((state)=> state.common.isDesktop);

  //starDj정보
  const [eventInfo, setEventInfo] = useState({});

  useEffect(() => {
    getStarInfo();
  }, []);

  //초기 데이터
  const getStarInfo = () => {
    let date = new Date();
    let year = `${date.getFullYear()}`
    let month = date.getMonth() + 1;
    Promise.all([
      Api.event_specialdj({data: {select_year: year, select_month: month < 10 ? `0${month}` : `${month}`}}),
      Api.getMyStarPoint({tYear: year, tMonth: month < 10 ? `0${month}` : `${month}`})
    ]).then(([djInfo, myPoint]) => {
      if (djInfo.result === "success" && myPoint.result === "success"){
        if (djInfo.data){
          let startDate = moment(djInfo.data.eventInfo?.req_start_date.substring(0, 8)).format("YYYYMMDD");
          let endDate = moment(djInfo.data.eventInfo?.req_end_date.substring(0, 8)).format("YYYYMMDD");
          let nowDate = moment().format("YYYYMMDD");
          //신청 기간 아닐땐 메인
          if (nowDate >= startDate && nowDate <= endDate){
            //5월 기준 myStarDjPoint프로시저 바뀜
            if (UtilityCommon.eventDateCheck("20220510")){
              setEventInfo({...djInfo.data.eventInfo, stat: getStat(djInfo.data.eventInfo), myStat: myPoint.data, already: djInfo.data.specialDjCondition.already});
            } else {
              setEventInfo({...djInfo.data.eventInfo, stat: getStat(djInfo.data.eventInfo), myStat: getMyStat(djInfo.data.specialDjCondition.conditionList), already: djInfo.data.specialDjCondition.already});
            }
          } else {
            props.history.replace("/");
          }
        }
      } else if (djInfo.code === "-7"){
        props.history.replace("/");
      }
    });
  }

  const golink = (path) => {
    history.push(path);
  }

  const openPopup = () => {
    setPopup(true)
  }

  // 신청하기 버튼 활성화 체크
  useEffect(() => {
    if(((eventInfo.myStat?.play_cnt >= eventInfo.stat?.brodTime) && (eventInfo.myStat?.view_cnt >= eventInfo.stat?.viewer) && (eventInfo.myStat?.like_score_cnt >= eventInfo.stat?.like) && (eventInfo.myStat?.byeol_cnt >= eventInfo.stat?.star) && eventInfo.already < 1) || context.token.memNo === "11594614777966") {
      setApplyBtn(true)
    } else (
      setApplyBtn(false)
    )
  }, [eventInfo])

  const getStat = (data) => {
    let result = {brodTime: 0, viewer: 0, like: 0, star: 0}
    if (typeof data?.["condition_code1"] !== "undefined"){
      for (let i = 1; i <= 4; i++){
        if (data?.[`condition_code${i}`] == 8){
          result.brodTime = data?.[`condition_data${i}`];
        } else if (data?.[`condition_code${i}`] == 6) {
          result.viewer = data?.[`condition_data${i}`];
        } else if (data?.[`condition_code${i}`] == 3) {
          result.like = data?.[`condition_data${i}`];
        } else {
          result.star = data?.[`condition_data${i}`];
        }
      }
    }

    return result;
  }

  const getMyStat = (data) => {
    let result = {play_cnt: 0, like_score_cnt: 0, byeol_cnt	: 0, view_cnt: 0}
      for (let i = 0; i < data.length; i++){
        if (data[i].title === "누적방송시간"){
          result.play_cnt = data[i].point;
        } else if (data[i].title === "누적 청취자 수") {
          result.view_cnt = data[i].point;
        } else if (data[i].title === "받은 좋아요") {
          result.like_score_cnt = data[i].point;
        } else {
          result.byeol_cnt = data[i].point;
        }
      }
    return result;
  }

  const starDjIns = () => {
    Api.starDjIns().then(res => {
      if (res.result === "success"){
        setApplyBtn(false);
        context.action.toast({
          msg: '스타DJ 신청을 완료하였습니다.'
        })
      } else {
        context.action.toast({
          msg: '스타DJ 신청에 실패했습니다 다시 시도해 주세요'
        })
      }
    })
  }

  const starDjInsFail = () => {
    if ((eventInfo.myStat?.play_cnt < eventInfo.stat?.brodTime) || (eventInfo.myStat?.view_cnt < eventInfo.stat?.viewer) || (eventInfo.myStat?.like_score_cnt < eventInfo.stat?.like) || (eventInfo.myStat?.byeol_cnt < eventInfo.stat?.star)){
      context.action.toast({
        msg: '최소 신청 조건을 충족하지 못하였습니다.'
      })
    } else {
      context.action.toast({
        msg: '이미 스타DJ에 지원하셨습니다.'
      })
    }

  }

  // 페이지 시작
  return (
    <div id='starDj'>
      <Header position={'sticky'} title="스타DJ 신청" type={'back'}/>
      <div className='content'>
        <div className='starDjTop'>
          {
            isDesktop ?
            <>
              <img src={`${IMG_SERVER}/starDJ/starDJ_topImg-PC.png`} alt=""/>
              <div className='buttonPosition pc'>
                <Button height="25%">                  
                  {UtilityCommon.eventDateCheck("20220501") ?
                    <>
                      <span onClick={() => {golink("/starDj/benefits")}}>
                        <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-1.png`} alt=""/>
                      </span>
                      <span onClick={() => {golink("/honor")}}>
                        <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-2.png`} alt=""/>
                      </span>                    
                    </>
                    :
                    <span onClick={() => {golink("/starDj/benefits")}}>
                      <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-3.png`} alt=""/>
                    </span>
                  }
                </Button>
              </div>
            </>
            :
            <>
              <img src={`${IMG_SERVER}/starDJ/starDJ_topImg.png`} alt=""/>
              <div className='buttonPosition'>
                <Button height="20%">                  
                  {UtilityCommon.eventDateCheck("20220501") ?
                    <>
                      <span onClick={() => {golink("/starDj/benefits")}}>
                        <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-1.png`} alt=""/>
                      </span>
                      <span onClick={() => {golink("/honor")}}>
                        <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-2.png`} alt=""/>
                      </span>
                    </>
                    :
                    <span onClick={() => {golink("/starDj/benefits")}}>
                      <img src={`${IMG_SERVER}/starDJ/starDJ_topBtn-3.png`} alt=""/>
                    </span>
                  }
                </Button>
              </div>
            </> 
          }
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
                데이터 집계 기간 : {moment(eventInfo.condition_start_date?.replace(/\./g,'')).format('MM월 DD일')} ~ {moment(eventInfo.condition_end_date?.replace(/\./g,'')).format('MM월 DD일')}
              </div>
              <div className='conditionListWrap'>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon broadcastTime'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>방송시간 {addComma(eventInfo.stat?.brodTime)}시간</span>
                      <span className='titleInfo'>(팬 방송 제외)</span>
                    </div>
                  </div>
                  <div className={`myCondition ${eventInfo.myStat?.play_cnt >= eventInfo.stat?.brodTime ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(eventInfo.myStat?.play_cnt)}시간</span>
                    <span className='isAchieve'>{eventInfo.myStat?.play_cnt >= eventInfo.stat?.brodTime ? "달성" : "미달성"}</span>
                  </div>
                </div>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon totalListener'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>누적 시청자 수 {addComma(eventInfo.stat?.viewer)}명</span>
                    </div>
                  </div>
                  <div className={`myCondition ${eventInfo.myStat?.view_cnt >= eventInfo.stat?.viewer ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(eventInfo.myStat?.view_cnt)}명</span>
                    <span className='isAchieve'>{eventInfo.myStat?.view_cnt >= eventInfo.stat?.viewer ? "달성" : "미달성"}</span>
                  </div>
                </div>
                <div className='conditionList'>
                  <div className='listFront'>
                    <span className='icon totalLike'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>좋아요 수 {addComma(eventInfo.stat?.like)}개</span>
                      <span className='titleInfo'>(유료 부스터 포함)</span>
                    </div>
                  </div>
                  <div className={`myCondition ${eventInfo.myStat?.like_score_cnt >= eventInfo.stat?.like ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(eventInfo.myStat?.like_score_cnt)}개</span>
                    <span className='isAchieve'>{eventInfo.myStat?.like_score_cnt >= eventInfo.stat?.like ? "달성" : "미달성"}</span>
                  </div>
                </div>
                <div className='conditionList'>                
                  <div className='listFront'>
                    <span className='icon totalByeol'></span>
                    <div className='titleWrap'>
                      <span className='titleName'>받은 별 {addComma(eventInfo.stat?.star)}개</span>
                      <span className='titleInfo'>(룰렛 포함)</span>
                    </div>
                  </div>
                  <div className={`myCondition ${eventInfo.myStat?.byeol_cnt >= eventInfo.stat?.star ? "achieve" : ""}`}>
                    <span className='myData'>{addComma(eventInfo.myStat?.byeol_cnt)}개</span>
                    <span className='isAchieve'>{eventInfo.myStat?.byeol_cnt >= eventInfo.stat?.star ? "달성" : "미달성"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='standardWrap'>
            <Title name="standard"/>
            <div className='sectionContent'>
              <div className='standard'>정량평가와 가산점을 합한 상위 19명(±α)</div>
              <div className='estimateWrap'>
                <div className='estimate'>정량평가</div>
                <span>+</span>
                <div className='estimate'>가산점</div>
              </div>
              <Button height="14%">
                <span onClick={openPopup}>정량 평가 기준 자세히 보기</span>
              </Button>
              <div className='estimateInfo'>
                <p>선발하는 스타DJ 수는 월별 신청 건수를 반영하여 결정됩니다.</p>
                <p>정량평가는 방송 시간과 평균 동접 시청자, 좋아요, 받은 별을 합산하여 산정됩니다</p>
              </div>
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
          <Button height="18%" active={applyBtn}>
            {
              applyBtn ? 
                <span onClick={() => {
                  starDjIns();
                }}>
                  <img src={`${IMG_SERVER}/starDJ/starDJ_btnName-active.png`} alt=""/>
                </span>
              :         
                <span onClick={() => {
                  starDjInsFail();
                }}>
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
            <li className='noticeList'>지속적인 권고에도 불구하고 방송인으로서의 의무를 다하지 아니할 경우에는 스타DJ 자격을 박탈할 수 있습니다.</li>
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
              데이터 집계 기간 : {moment(eventInfo.condition_start_date?.replace(/\./g,'')).format('MM월 DD일')} ~ {moment(eventInfo.condition_end_date?.replace(/\./g,'')).format('MM월 DD일')}
            </div>
            <div className='score'>
              <p><span>방송 점수 (25%) : </span><span>누적 방송 시간 (팬 방송 제외)</span></p>
              <p><span>시청자 점수 (25%) : </span><span>누적/평균 시청자 수</span></p>
              <p><span>좋아요 점수 (25%) : </span><span>받은 좋아요 수 (유료 부스터포함)</span></p>
              <p><span>선물 점수 (25%) : </span><span>받은 선물 수 (룰렛 포함)</span></p>
            </div>
            <div className='referenceWrap'>
              <span className='referenceTitle'>경고/정지 이력</span>
              <ul className='referenceList'>
                <li>경고 이력 2건부터 -3점 반영</li>
                <li>정지 시 선발 불가</li>
              </ul>
            </div>
            <div className='referenceWrap'>
              <span className='referenceTitle'>타임 랭킹 가산점</span>
              <ul className='referenceList'>
                <li>1위 : 1.5점 / 2위 : 0.5점 / 3위 : 0.3점</li>
              </ul>
              <p className='reference'>※ 최대 10점까지만 반영</p>
            </div>
            <div className='referenceWrap'>
              <span className='referenceTitle'>운영자 평가 가산점</span>
              <ul className='referenceList'>
                <li>데이터 집계 기간 내 진행한 기획방송이나 기본적인 방송 퀄리티를 평가한 운영자 가산점 반영</li>
              </ul>
            </div>
            <div className='referenceWrap'>
              <span className='referenceTitle'>조건 상세 설명</span>
              <ul className='referenceList'>
                <li>누적 방송 시간은 하루 최대 4시간만 반영.</li>
                <li>무료 부스터는 좋아요 점수로 반영되지 않음.</li>
                <li>선물은 방송방 내에서 받은 선물만 반영.</li>
              </ul>
            </div>
          </div>
        </LayerPopup>
      }  
    </div>
  )
}

export default withRouter(StarDj);
