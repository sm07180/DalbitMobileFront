import React, {useContext, useState, useEffect, useRef} from 'react';
import {useHistory} from "react-router-dom";
import {IMG_SERVER} from 'context/config';
import Utility from 'components/lib/utility';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/cntWrapper';
import CntTitle from 'components/ui/cntTitle/CntTitle';
import ListRow from 'components/ui/listRow/ListRow';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
import LayerPop from 'components/ui/layerPopup/LayerPopup';
// components
import Secession from '../../components/popup/Secession';
import Invite from '../../components/popup/Invite';
import Benefits from '../../components/popup/Benefits';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";

import "../../scss/teamDetail.scss";
import Api from "context/api";
import photoCommon from "common/utility/photoCommon";
import {Hybrid, isHybrid} from "context/hybrid";
import qs from 'query-string'
import {setGlobalCtxMessage} from "redux/actions/globalCtx";


let teamMemNoList =[]; // 회원번호 리스트 담기용
const TeamDetail = (props) => {
  const history = useHistory();
  const teamIntroRef = useRef();
  const dispatch = useDispatch();
  const teamNo = props.match.params.teamNo;
  const popup = useSelector(state => state.popup);
  const memberRdx = useSelector((state)=> state.member);
  const {webview} = qs.parse(location.search);

  const [moreShow, setMoreShow] = useState(false);
  const [benefitsPop, setBenefitsPop] = useState(false);
  const [invitePop, setInvitePop] = useState(false);
  const [teamMemList, setTeamMemList]=useState([]); //팀 멤버 리스트
  const [teamInfo, setTeamInfo]=useState({}); // 팀 정보
  const [teamBageList, setTeamBageList]=useState([]); // 배지 리스트
  const [totBadgeCnt, setTotBadgeCnt]=useState(0) // 배지 갯수
  const [teamRequestSel, setTeamRequestSel]=useState([]) // 가입신청 리스트
  const [teamRequestCnt, setTeamRequestCnt]=useState(0) // 가입신청 수
  const [statChk, setStatChk]=useState(""); // 권한 체크용 [m: 마스터 , t: 일반회원 , n: 미가입자]
  const [checkIn,setCheckIn]=useState(""); // 출석 상태 여부
  const [teamInsChk ,setTeamInsChk]=useState(""); // 가입신청 상태 체크
  const [textAreaOpen, setTextAreaOpen]=useState(false); // 팀소개 오픈 체크 용
  const [textAreaOpenBtn, setTextAreaOpenBtn]=useState(false); // 팀소개 버튼 용
  const [btnChk, setBtnChk]=useState(false); // 버튼 액션 감지 용
  const [teamChk , setTeamChk]=useState(false) //팀 가입신청이 가능한지 체크용

  const [slidePopNo, setSlidepopNo] = useState("");


  // 팀정보 호출
  useEffect(()=>{
    if(teamInsChk ===""){
      if(teamNo === undefined || teamNo ==="" || teamNo ===null || memberRdx.memNo ===""){
        history.goBack();
        return false
      }else{
        teamInfoApi();
        teamRequestApi();
        teamCheck();
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

/**팀 가입가능 여부 체크
  *팀을 가입한 생태이거나 만든 상태일땐 신청을 못하도록 체크하기위한 프로시져 호출
 -4:팀가입 되어 있음, -3:재생성 시간 미경과, -2: 이미생성됨, -1: 레벨미달, 0: 에러, 1:정상
 가입 레벨은 5인데 생성 조건은 15렙이라 렙이 미달일경우 가입은 가능하다.
 **/
  const teamCheck = ()=>{
    Api.getTeamInsChk({memNo:memberRdx.memNo}).then((res) => {
      if(res.data === 1 || res.data === -3 || res.data === -1){
        setTeamChk(true)
      }else{
        setTeamChk(false)
      }
    })
  }


// 팀 정보
  const teamInfoApi =()=>{
    Api.getTeamDetailSel({teamNo:teamNo,memNo:memberRdx.memNo,reqSlct:'r'}).then(res =>{
      if(res.code === "00000") {
        setTeamMemList(res.data.teamMemList);
        setTeamInfo(res.data.teamInfo);
        setTeamBageList(res.data.badgeList);
        setTotBadgeCnt(res.data.tot_badge_cnt);
        setStatChk(res.data.statChk);
        setCheckIn(res.data.loginYn);
        setTeamInsChk(res.data.reqInsChk);
      }else {
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: res.message
        }))
      }
    });
  }
  // 팀 가입신청 리스트
  const teamRequestApi=()=>{
    Api.getTeamRequestSel({teamNo:teamNo,pageNo:1,pagePerCnt:100}).then(res =>{
      setTeamRequestCnt(res.data.listCnt)
      setTeamRequestSel(res.data.list);
    });
  }

  //출석체크
  const checkInApi=()=>{
    Api.getTeamAttendanceIns({memNo:memberRdx.memNo}).then(res =>{
      if(res.code === "00000"){
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: '활동배지 출석점수 +1!'
        }))
        setCheckIn('y');
      }else {
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: res.message
        }))
      }
    });
  }

  //가입신청
  const teamMemReqIns=(slct,memNo)=>{
    let param ={
      teamNo:teamNo,
      masterMemNo: teamInfo.master_mem_no,
      teamName: teamInfo.team_name,
      memNo:memNo,
      name: memberRdx.data.nickNm,
      reqSlct:slct//신청구분 [r:가입신청, i:초대]
    };
    Api.getTeamMemReqIns(param).then((res)=>{
      if(res.code === "00000"){
        setTeamInsChk('y');
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: slct==='r' ? "가입신청이 되었습니다." : "초대를 완료했습니다."
        }))
      }else {
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: res.message
        }))
      }
    })
    setBtnChk(true)
  }

  // 초대하기 팝업
  const invitePopup = (e) => {
    const {popType} = e.currentTarget.dataset;
    if (popType === "invite") {
      dispatch(setSlidePopupOpen());
      setSlidepopNo(popType)
    }
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
  const clickSecession = (e,masterNo) => {
    const {popType} = e.currentTarget.dataset;
    if (statChk === 'm' && teamMemList.length > 1) {
      if (popType === "secession") {
        dispatch(setSlidePopupOpen());
        setSlidepopNo(popType)
      }
    } else {
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: `정말 탈퇴 할까요?`,
        remsg: `탈퇴 이후 팀이 랭킹에 오르더라도
        리워드를 받을 수 없으며, 탈퇴 이후 재가입 할 경우
        기여도는 복원되지 않습니다.`,
        buttonText: {
          left: '취소',
          right: '완료'
        },
        callback: () => {
          if (statChk === 'm'){
            let param = {
              teamNo:teamNo,
              masterMemNo:memberRdx.memNo,
              chrgrName:"",
            }
            Api.getTeamDel(param).then(res=>{
              if(res.code === "00000"){
                history.replace(`/mypage`)
              }else {
                dispatch(setGlobalCtxMessage({type:'toast',
                  msg: res.message
                }))
              }
            })

          }else{
            let param = {
              teamNo:teamNo,
              delSclt:"t",
              tmMemNo:memberRdx.memNo,
              masterMemNo:masterNo,
              chrgrName:""
            }
            Api.getTeamMemDel(param).then(res=>{
              if(res.code === "00000"){
                history.replace("/myPage");
              }else {
                dispatch(setGlobalCtxMessage({type:'toast',
                  msg: res.message
                }))
              }
            })
          }
        }
      }));
    }
  };
  const closeSecesstion = () => {
    closePopup(dispatch);
  };

  // 팀 삭제
  const teamDelete = () => {
    dispatch(setGlobalCtxMessage({type:'confirm',
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
          teamName:teamInfo.team_name,
          memNoList:teamMemNoList,
          masterMemNo:memberRdx.memNo,
          chrgrName:"",
        };
        Api.getTeamDel(param).then(res=>{
          if(res.code === "00000"){
            history.push(`/mypage`)
          }else {
            dispatch(setGlobalCtxMessage({type:'toast',
              msg: res.message
            }))
          }
        })
      },
      cancelCallback: () => {},
    }));
  };

  // 가입신청 수락 거절
  const teamConfirm = (e,memNo, memName = '') => {
    const {targetConfirm} = e.currentTarget.dataset;

    if (targetConfirm === 'cancel') {
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: `정말 거절 할까요?`,
        buttonText: {
          left: '취소',
          right: '거절할게요'
        },
        callback: () => {
          let param={
            teamNo:teamNo,
            teamName:teamInfo.team_name,
            memNo:memNo,
            masterMemNo:memberRdx.memNo,
            name: memberRdx.data.nickNm,
            chrgrName:"",
            reqSlct:'r'
          };
          Api.getTeamMemReqDel(param).then((res)=>{
            if(res.code === "00000"){
              setBtnChk(true)
            }else{
              dispatch(setGlobalCtxMessage({type:'toast',
                msg: res.message
              }))
            }
          })
        }
      }));
    } else if (targetConfirm === 'accept') {
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: `수락을 누르면 팀원으로 가입합니다.`,
        buttonText: {
          left: '취소',
          right: '수락할게요!'
        },
        callback: () => {
          let param={
            teamNo:teamNo,
            teamName:teamInfo.team_name,
            memNo:memNo,
            name: memName,
            reqSlct:'r'//신청구분 [r:가입신청, i:초대]
          };
          Api.getTeamMemIns(param).then((res)=>{
            if(res.code === "00000"){
              setBtnChk(true)
            }else{
              dispatch(setGlobalCtxMessage({type:'toast',
                msg: res.message
              }))
            }
          })
        }
      }));
    }
  };
  const goProfile = (memNo) => {
    history.push(`/profile/${memNo}`)
  };
  const getConvertBrTxt=(txt, lastBrYn = 'y')=>{
    if(txt === undefined) return;
    if(txt === null) return;
    return txt.split('\n').map( (line, index) => {
      return (<React.Fragment key={index}>{line}{lastBrYn === 'y' && <br />}</React.Fragment>)
    })
  };

  const textAreaInfo = () => {
    const teamIntroNode = teamIntroRef.current;
    if (teamIntroNode.clientHeight > 36) {
      setTextAreaOpenBtn(true)
    }
  }
  const textAreaOpenFnc = () => {
    setTextAreaOpen(!textAreaOpen)
  }
  useEffect(() => {
    textAreaInfo();
  },[getConvertBrTxt])

  const goBack = () => {
    if(isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      history.goBack();
    }
  };
  // 페이지 시작
  return (
    <div id="teamDetail">
      <Header title="팀" type="back" backEvent={goBack}>
        <div className="buttonGroup">
          {(statChk === 'm' ||statChk === 't') &&
          <div className="moreBtn" onClick={clickMoreBtn}>
            <img src="https://image.dalbitlive.com/common/header/icoMore-b.png" alt="" />
            {moreShow &&
            <div className="isMore">
              <button onClick={clickBenefits}>팀 혜택</button>
              {statChk === 'm' && <button onClick={()=>{history.push(`/team/manager/${teamNo}`)}}>팀 관리</button>}
              <button data-pop-Type="secession" onClick={(e)=>{clickSecession(e,teamInfo.master_mem_no)}}>팀 탈퇴하기</button>
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
              {teamInfo.team_bg_code && <img src={`${IMG_SERVER}/team/parts/B/${teamInfo.team_bg_code}.png`} />}
              {teamInfo.team_edge_code && <img src={`${IMG_SERVER}/team/parts/E/${teamInfo.team_edge_code}.png`} />}
              {teamInfo.team_medal_code && <img src={`${IMG_SERVER}/team/parts/M/${teamInfo.team_medal_code}.png`} />}
            </div>
            <div className="listContent">
              <div className="teamName">{teamInfo.team_name && teamInfo.team_name}</div>
              <div className="listItem">
                <div className="iconPoint"></div>
                <div className="pointEx">이번 주</div>
                <div className="point">
                  {teamInfo.rank_pt > 0 ?
                    Utility.addComma(`${teamInfo.rank_pt}`)
                    : teamInfo.rank_pt === 0 &&
                    `-`
                  }
                </div>
                <div className="pointEx">누적</div>
                <div className="point">
                  {teamInfo.team_tot_score > 0 ?
                    Utility.addComma(`${teamInfo.team_tot_score}`)
                    :
                    `-`
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="teamRank">
            <div className="text">이번 주</div>
            <div className="count">
              <strong>
                {teamInfo.rank_no ?
                  Utility.addComma(`${teamInfo.rank_no}`)
                  :
                  `-`
                }
              </strong>위
            </div>
          </div>
            <div className="teamIntro">
              <span className={`text ${!textAreaOpenBtn ? '' : textAreaOpen ? 'open' : 'close'}`} ref={teamIntroRef}>
              {getConvertBrTxt(teamInfo.team_conts && teamInfo.team_conts)}
              </span>
              {textAreaOpenBtn &&
                <span className="arrow" onClick={textAreaOpenFnc}>
                  <img src={`${IMG_SERVER}/common/arrow/grayArrow-${textAreaOpen ? 'up' : 'down'}.png`} alt="" />
                </span>
              }
            </div>
        </section>

          <div className="cntTitle">
            <h2>활동 배지</h2>
            <span className="count"><strong>{totBadgeCnt}</strong></span>
            <button onClick={()=>{history.push(`/team/badge/${teamNo}`)}}>더보기</button>
          </div>
        <section className="badgeWrap">
          {
            teamBageList.length > 0 ?
              teamBageList.map((badge, idx)=>{
                return(
                  <div className={"badgeList"} key={idx}>
                    <img src={`${badge.bg_color_url}`} alt={badge.bg_name} />
                  </div>
                )
              })
              :
              <div className="badgeNone">아직 획득한 활동배지가 없습니다.</div>
          }
        </section>
        <CntTitle title="전체 멤버">
          <span className="count"><strong>{teamMemList.length}</strong>/5</span>
        </CntTitle>
        <section className="memberList">
          {teamMemList.length >0 &&
            teamMemList.map((data,index)=>{
              let photoUrl = data.tm_image_profile
              let memNoChk= Number(data.tm_mem_no) === Number(memberRdx.memNo)
              if (!teamMemNoList.includes(data.tm_mem_no)) {
                teamMemNoList.push(data.tm_mem_no);
              }

              return(
                <ListRow photo={photoCommon.getPhotoUrl(photoUrl, "120x120")} photoClick={()=>{goProfile(data.tm_mem_no)}} key={index}>
                  <div className="listContent">
                    <div className="listItem">
                      <div className="nick">{data.tm_mem_nick}</div>
                      {data.team_mem_type === 'm' && <img src={`${IMG_SERVER}/team/teamLeader.png`} alt="teamLeader" />}
                    </div>
                    {(statChk === 'm' ||(statChk === 't' && memNoChk)) &&
                    <div className="listItem">
                      <div className="iconPoint"/>
                      <div className="point">{Utility.addComma(`${data.tm_mem_score}`)}</div>
                    </div>
                    }
                  </div>
      {/*            <div className="listBack">
                    <BadgeLive />
                  </div>*/}
                </ListRow>
                )
            })
          }
          {(statChk === 'm' && teamMemList.length <5) &&
          <div className="listRow invite" data-pop-type="invite" onClick={invitePopup}>
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
              let photoUrl = data.tm_image_profile
              return(
                <ListRow photo={photoCommon.getPhotoUrl(photoUrl, "120x120")} photoClick={()=>{goProfile(data.tm_mem_no)}} key={index}>
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
                      <button className="cancel" data-target-confirm="cancel" onClick={(e)=>{teamConfirm(e,data.tm_mem_no)}}>거절</button>
                      <button className="accept" data-target-confirm="accept" onClick={(e)=>{teamConfirm(e,data.tm_mem_no, data.tm_mem_nick)}}>수락</button>
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
        {(teamMemList.length <5 && statChk === 'n' && teamInfo.req_mem_yn === 'y' && teamChk) &&
          <section className="buttonWrap" onClick={()=>{teamMemReqIns('r',memberRdx.memNo)}}>
            <SubmitBtn text={(teamInsChk ===-4 || teamInsChk==='y') ?"가입신청 완료" : "가입신청"} state={(teamInsChk ===-4 || teamInsChk==='y') ? "disabled":"" } />
          </section>
        }

      </CntWrapper>

      {/* 팀장이 탈퇴 시 슬라이드 팝업 */}
      {popup.slidePopup &&
        <PopSlide>
          {slidePopNo === "secession" ?
          <Secession
            closeSlide={closeSecesstion}
            teamMemList={teamMemList}
            memNo={memberRdx.memNo}
            teamNo={teamNo}
            history={history}
          />
          :slidePopNo === "invite" &&
          <Invite closeSlide={closeSecesstion} memNo={memberRdx.memNo} teamNo={teamNo} btnChk={btnChk} teamMemReqIns={teamMemReqIns}/>
          }
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
