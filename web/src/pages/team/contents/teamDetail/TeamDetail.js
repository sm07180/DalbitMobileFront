import React, {useContext, useState,useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from 'context';
import {IMG_SERVER} from 'context/config';
import Utility from 'components/lib/utility';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
import CntTitle from 'components/ui/cntTitle/CntTitle';
import ListRow from 'components/ui/listRow/ListRow';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
import LayerPop from 'components/ui/layerPopup/LayerPopup';
// components
import BadgeLive from '../../components/BadgeLive';
import Secession from '../../components/popup/Secession';
import Invite from '../../components/popup/Invite';
import Benefits from '../../components/popup/Benefits';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupOpenData, setSlidePopupOpen} from "redux/actions/common";

import "../../scss/inviteList.scss";
import "../../scss/teamDetail.scss";
import Api from "context/api";
import member from "redux/reducers/member";
const TeamDetail = (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const dispatch = useDispatch();
  const teamNo = props.match.params.teamNo;
  const popup = useSelector(state => state.popup);
  const memberRdx = useSelector((state)=> state.member);

  const [moreShow, setMoreShow] = useState(false);
  const [benefitsPop, setBenefitsPop] = useState(false);
  const [invitePop, setInvitePop] = useState(false);
  const [teamMemList, setTeamMemList]=useState([]);
  const [teamInfo, setTeamInfo]=useState({});
  const [teamBageList, setTeamBageList]=useState([]); // 뱃지 리스트
  const [totBadgeCnt, setTotBadgeCnt]=useState(0) // 뱃지 갯수
  const [teamRequestSel, setTeamRequestSel]=useState([]) // 가입신청 리스트
  const [teamRequestCnt, setTeamRequestCnt]=useState(0) // 가입신청 수
  const [statChk, setStatChk]=useState(""); // 권한 체크용 [m: 마스터 , t: 일반회원 , n: 미가입자]
  const [checkIn,setCheckIn]=useState(""); // 출석 상태 여부
  const [teamInsChk ,setTeamInsChk]=useState(""); // 가입신청 상태 체크
  const [btnChk, setBtnChk]=useState(false);


  // 팀정보 호출
  useEffect(()=>{
    if(teamInsChk ===""){
      if(teamNo === undefined || teamNo ==="" || teamNo ===null || memberRdx.memNo ===""){
        history.goBack();
        return false
      }else{
        teamInfoApi();
        teamRequestApi();
      }
    }
  },[])

  useEffect(()=>{
    if(btnChk){
      teamInfoApi();
      teamRequestApi();
      setBtnChk(false)
    }
  },[btnChk,checkIn])




// 팀 정보
  const teamInfoApi =()=>{
    Api.getTeamDetailSel({teamNo:teamNo,memNo:memberRdx.memNo}).then(res =>{
      if(res.code === "00000") {
        console.log("팀정보", res.data)
        setTeamMemList(res.data.teamMemList);
        setTeamInfo(res.data.teamInfo);
        setTeamBageList(res.data.badgeList);
        setTotBadgeCnt(res.data.tot_badge_cnt);
        setStatChk(res.data.statChk);
        setCheckIn(res.data.loginYn);
        setTeamInsChk(res.data.reqInsChk);
      }
    });
  }
  // 팀 가입신청 리스트
  const teamRequestApi=()=>{
    Api.getTeamRequestSel({teamNo:teamNo,pageNo:1,pagePerCnt:100}).then(res =>{
      console.log("초대 리스트",res.data)
      setTeamRequestCnt(res.data.listCnt)
      setTeamRequestSel(res.data.list);
    });
  }

  //출석체크
  const checkInApi=()=>{
    Api.getTeamAttendanceIns({memNo:memberRdx.memNo}).then(res =>{
      console.log(res)
      if(res.code === "00000"){
        setCheckIn('y');
      }
    });
  }

  //가입신청
  const teamMemReqIns=(slct)=>{
    let param ={
      teamNo:teamNo,
      memNo:memberRdx.memNo,
      reqSlct:slct//신청구분 [r:가입신청, i:초대]
    }

    Api.getTeamMemReqIns(param).then((res)=>{
      if(res.code === "00000"){
        setTeamInsChk('y');
      }
    })
    setBtnChk(true)
  }

  // 초대하기 팝업
  const invitePopup = () => {
    setInvitePop(true);
    dispatch(setCommonPopupOpenData({...popup, invitePopup: true}));
  };

  /***  더보기 관련 ***/
  const clickMoreBtn = () => {
    setMoreShow(!moreShow);
  };
  // 혜택 팝업
  const clickBenefits = () => {
    setBenefitsPop(!benefitsPop);
  };
  // 관리 팝업

  // 탈퇴 팝업
  const clickSecession = (masterNo) => {
    if (statChk === 'm') {
      dispatch(setCommonPopupOpenData({...popup, slidePopup: true}));
    } else {
      context.action.confirm({
        msg: `정말 탈퇴 할까요?`,
        remsg: `탈퇴 이후 팀이 랭킹에 오르더라도
        리워드를 받을 수 없으며, 탈퇴 이후 재가입 할 경우
        기여도는 복원되지 않습니다.`,
        buttonText: {
          left: '취소',
          right: '완료'
        },
        callback: () => {
          let param = {
            teamNo:teamNo,
            delSclt:"t",
            tmMemNo:memberRdx.memNo,
            masterMemNo:masterNo,
            chrgrName:""
          }
          Api.getTeamMemDel(param).then(res=>{
            console.log(res)
            history.go(0);
          })
          console.log('secession');
        }
      });
    }
  };
  const closeSecesstion = () => {
    closePopup(dispatch);
  };

  // 팀 삭제
  const teamDelete = () => {
    context.action.confirm({
      msg: `삭제하면 72시간 이후부터
      팀을 만들 수 있습니다.`,
      remsg: `삭제한 이후에는 팀 랭킹 리워드를
      받을 수 없으며 삭제된 정보는 복구되지 않습니다.`,
      buttonText: {
        left: '취소',
        right: '삭제'
      },
      callback: () => {
        let param = {
          teamNo:teamNo,
          masterMemNo:memberRdx.memNo,
          chrgrName:"",
        }
        Api.getTeamDel(param).then(res=>{
          console.log(res)
          history.push(`/mypage`)
        })
      },
      cancelCallback: () => {},
    });
  };

  // 가입신청 수락 거절
  const teamConfirm = (e,memNo) => {
    const {targetConfirm} = e.currentTarget.dataset;

    if (targetConfirm === 'cancel') {
      context.action.confirm({
        msg: `정말 거절 할까요?`,
        buttonText: {
          left: '취소',
          right: '거절할게요'
        },
        callback: () => {
          let param={
            teamNo:teamNo,
            memNo:memNo,
            masterMemNo:memberRdx.memNo,
            chrgrName:""
          }
          Api.getTeamMemReqDel(param).then((res)=>{
            if(res.code === "00000"){
              setBtnChk(true)
              console.log("신청거절",res)
            }
          })
        }
      });
    } else if (targetConfirm === 'accept') {
      context.action.confirm({
        msg: `수락을 누르면 팀원으로 가입합니다.`,
        buttonText: {
          left: '취소',
          right: '수락할게요!'
        },
        callback: () => {
          let param={
            teamNo:teamNo,
            memNo:memNo,
          }
          Api.getTeamMemIns(param).then((res)=>{
            if(res.code === "00000"){
              setBtnChk(true)
              console.log("수락",res)
            }
          })
        }
      });
    }
  };

  const getConvertBrTxt=(txt, lastBrYn = 'y')=>{
    if(txt === undefined) return;
    if(txt === null) return;
    return txt.split('\n').map( (line, index) => {
      return (<React.Fragment key={index}>{line}{lastBrYn === 'y' && <br />}</React.Fragment>)
    })
  }
  // 페이지 시작
  return (
    <div id="teamDetail">
      <Header title="팀" type="back">
        <div className="buttonGroup">
          {(statChk === 'm' ||statChk === 't') &&
          <div className="moreBtn" onClick={clickMoreBtn}>
            <img src="https://image.dalbitlive.com/common/header/icoMore-b.png" alt="" />
            {moreShow &&
            <div className="isMore">
              <button onClick={clickBenefits}>팀 혜택</button>
              {statChk === 'm' && <button onClick={()=>history.push(`/team/manager/${teamNo}`)}>팀 관리</button>}
              <button onClick={()=>clickSecession(teamInfo.master_mem_no)}>팀 탈퇴하기</button>
              {statChk === 'm' && <button className="delete" onClick={teamDelete}>팀 삭제하기</button>}
            </div>
            }
          </div>
          }
          {statChk === 'n'  && <button className="question" onClick={clickBenefits}>?</button>}
        </div>
      </Header>
      <CntWrapper>
        <section className="teamInfo">
          <div className="teamStatus">
            <div className="teamSymbol">
              {teamInfo.team_bg_code && <img src={`${IMG_SERVER}/team/parts/E/${teamInfo.team_bg_code}.png`} />}
              {teamInfo.team_edge_code && <img src={`${IMG_SERVER}/team/parts/B/${teamInfo.team_edge_code}.png`} />}
              {teamInfo.team_medal_code && <img src={`${IMG_SERVER}/team/parts/M/${teamInfo.team_medal_code}.png`} />}
            </div>
            <div className="listContent">
              <div className="teamName">{teamInfo.team_name && teamInfo.team_name}</div>
              <div className="listItem">
                <div className="iconPoint"></div>
                <div className="pointEx">이번주</div>
                {teamInfo.rank_pt && <div className="point">{Utility.addComma(`${teamInfo.rank_pt}`)}</div>}
                <div className="pointEx">누적</div>
                {teamInfo.team_tot_score && <div className="point">{Utility.addComma(`${teamInfo.team_tot_score}`)}</div>}
              </div>
            </div>
          </div>
          <div className="teamRank">
            <div className="text">이번 주</div>
            {teamInfo.rank_no && <div className="count"><strong>{Utility.addComma(`${teamInfo.rank_no}`)}</strong>위</div>}
          </div>
          <div className="teamIntro">
            <span className={`text ${true ? 'open' : 'close'}`}>
             {getConvertBrTxt(teamInfo.team_conts && teamInfo.team_conts)}
            </span>
            <span className="arrow">
              <img src={`${IMG_SERVER}/common/arrow/grayArrow-${true ? 'up' : 'down'}.png`} alt="" />
            </span>
          </div>
        </section>

          <div className="cntTitle">
            <h2>활동 배지</h2>
            <span className="count"><strong>{totBadgeCnt}</strong></span>
            <button onClick={()=>history.push(`/team/badge/${teamNo}`)}>더보기</button>
          </div>
        <section className="badgeList">
        {teamBageList.length > 0 &&
          <>
            <div className="badgeItem">
              <img src={`${IMG_SERVER}/team/badge/a002.png`} alt="" />
            </div>
            <div className="badgeItem">
              <img src={`${IMG_SERVER}/team/badge/a004.png`} alt="" />
            </div>
            <div className="badgeItem">
              <img src={`${IMG_SERVER}/team/badge/a006.png`} alt="" />
            </div>
            <div className="badgeItem">
              <img src={`${IMG_SERVER}/team/badge/a008.png`} alt="" />
            </div>
          </>
        }
        </section>
        <CntTitle title="전체 멤버">
          <span className="count"><strong>{teamMemList.length}</strong>/5</span>
        </CntTitle>
        <section className="memberList">
          {teamMemList.length >0 &&
            teamMemList.map((data,index)=>{
              return(
                <ListRow photo="" photoClick={() => photoClick()} key={index}>
                  <div className="listContent">
                    <div className="listItem">
                      <div className="nick">{data.tm_mem_nick}</div>
                      {data.team_mem_type === 'm' && <img src={`${IMG_SERVER}/team/teamLeader.png`} alt="teamLeader" />}
                    </div>
                    <div className="listItem">
                      <div className="iconPoint"/>
                      <div className="point">{Utility.addComma(`${data.tm_mem_score}`)}</div>
                    </div>
                  </div>
      {/*            <div className="listBack">
                    <BadgeLive />
                  </div>*/}
                </ListRow>
                )
            })
          }
          {(statChk === 'm' && teamMemList.length <5) &&
          <div className="listRow invite" onClick={invitePopup}>
            <div className="photo">+</div>
            <div className="text">초대하기</div>
          </div>
          }
        </section>
        {statChk === 'm' &&
          <>
        <CntTitle title="가입 신청">
          <span className="count"><strong>{teamRequestCnt}</strong></span>
        </CntTitle>
          <section className="joinList">
            {teamRequestSel.length > 0 && teamRequestSel.map((data,index)=>{
              return(
                <ListRow photo="" photoClick={() => photoClick()} key={index}>
                  <div className="listContent">
                    <div className="listItem">
                      <div className="nick">{data.tm_mem_nick}</div>
                    </div>
                    <div className="listItem">
                      <div className="time">{data.ins_date}</div>
                    </div>
                    </div>
                    <div className="listBack">
                      <div className="buttonGroup">
                      <button className="cancel" data-target-confirm="cancel" onClick={(e)=>teamConfirm(e,data.tm_mem_no)}>거절</button>
                      <button className="accept" data-target-confirm="accept" onClick={(e)=>teamConfirm(e,data.tm_mem_no)}>수락</button>
                    </div>
                  </div>
                </ListRow>
              )
            })}
           </section>
          </>
        }


        {(statChk !== 'n' && checkIn=== 'n')  &&
        <section className="buttonWrap" onClick={checkInApi}>
          <SubmitBtn text="출석체크"/>
        </section>
        }
        {(teamMemList.length <5 && statChk === 'n' && teamInfo.req_mem_yn === 'y') &&
          <section className="buttonWrap" onClick={()=>teamMemReqIns('r')}>
            <SubmitBtn text="가입신청" state={(teamInsChk ===-4 || teamInsChk==='y') ? "disabled":"" } />
          </section>
        }

      </CntWrapper>

      {/* 팀장이 탈퇴 시 슬라이드 팝업 */}
      {popup.slidePopup &&
        <PopSlide title="다음 팀장은 누구인가요?">
          <Secession closeSlide={closeSecesstion} teamMemList={teamMemList}/>
        </PopSlide>
      }

      {/* 초대하기 슬라이드 팝업 */}
      {popup.invitePopup &&
        <PopSlide title="팀원 초대">
          <Invite closeSlide={closeSecesstion} />
        </PopSlide>
      }

      {/* 팀 혜택 팝업 */}
      {benefitsPop &&
        <LayerPop setPopup={clickBenefits} close={false}>
          <Benefits closePopup={clickBenefits} />
        </LayerPop>
      }
    </div>
  )
}

export default TeamDetail;
