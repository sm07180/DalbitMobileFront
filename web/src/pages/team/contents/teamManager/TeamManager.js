import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from 'context';
import {IMG_SERVER} from 'context/config';
import Utility from 'components/lib/utility';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
import CntTitle from 'components/ui/cntTitle/CntTitle';
import ListRow from 'components/ui/listRow/ListRow';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import LayerPop from 'components/ui/layerPopup/LayerPopup'
// components
import TeamForm from '../../components/TeamForm';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupOpenData} from "redux/actions/common";

import "../../scss/teamManager.scss";
import Api from "context/api";
import {Timer} from "pages/broadcast/content/right_content/vote/Timer";
import moment from "moment";

const TeamManager = (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);
  const teamNo = props.match.params.teamNo;
  const memberRdx = useSelector((state)=> state.member);
  
  const [confirmPop, setConfirmPop] = useState(false);

  const [teamName,setTeamName]=useState(''); //팀 이름
  const [teamConts,setTeamConts]=useState(''); //팀소개
  const [teamMemList, setTeamMemList]=useState([]);
  const [teamInfo, setTeamInfo]=useState({});
  const [updateChk, setUpdateChk]=useState(false);
  const [agree,setAgree]=useState(false);
  const [medalCode,setMdalCode]=useState("")
  const [edgeCode,setEdgeCode]=useState("")
  const [bgCode,setBgCode]=useState("")
  const [t,setT]=useState({
    date: {day: 0, month: 0, year: 0},
    time: {hour: 0, minute: 0, nano: 0, second: 0}
  })
/*  if(t.data.day !==0 )
    const aa = Timer({endDate:t});

  console.log("aa",aa)*/
  useEffect(()=>{
    if(teamNo === undefined || teamNo ==="" || teamNo ===null || memberRdx.memNo ===""){
      history.goBack();
      return false
    }else{
      teamInfoApi();
    }
  },[updateChk])

  useEffect(()=>{
    if(updateChk){
      teamInfoApi();
      setUpdateChk(false)
    }
  },[updateChk])

// 팀 정보
  const teamInfoApi =()=>{
    Api.getTeamDetailSel({teamNo:teamNo,memNo:memberRdx.memNo}).then(res =>{
      if(res.code === "00000") {
        console.log("팀정보", res.data)
        console.log("개설일",res.data.teamInfo.ins_date)
        let aaaa = moment(res.data.teamInfo.ins_date).add(3, 'd')
        const dd = {
          date: {
            day: aaaa.date(),
            month: aaaa.month()+1,
            year: aaaa.year()
          },
          time: {
            hour: aaaa.hour(),
            minute: aaaa.minute(),
            nano: 0,
            second: aaaa.second()
          }
        }
        setT(dd)

        setTeamMemList(res.data.teamMemList);
        setTeamInfo(res.data.teamInfo);
        setTeamName(res.data.teamInfo.team_name);
        setTeamConts(res.data.teamInfo.team_conts);
        setAgree(res.data.teamInfo.req_mem_yn);
        setMdalCode(res.data.teamInfo.team_medal_code);
        setEdgeCode(res.data.teamInfo.team_edge_code);
        setBgCode(res.data.teamInfo.team_bg_code);
        if(res.data.teamInfo.req_mem_yn ==='y'){
          document.getElementsByClassName("blind")[0].checked = true
        }
      }
    });
  }
  const updateApi=()=>{
    let param={
      memNo:memberRdx.memNo,
      updSlct:'b',   //-- 수정구분[a:심볼및이름, b:소개수정]
      teamNo:teamNo,
      teamName:teamName,
      teamConts:teamConts,
      teamMedalCode:medalCode,
      teamEdgeCode:edgeCode,
      teamBgCode:bgCode,
      reqMemYn:agree

    }
    console.log(param)
    Api.getTeamUpd(param).then((res)=>{
      if(res.code==="00000"){
        history.replace(`/team/detail/${teamNo}`)
      }
    })

  }

  const editCnts=(e)=>{
    let text= e.currentTarget.value.replace(/(^\s*)|(\s*$)/, '');
    let rows = text.split('\n').length

    if(rows > 5){
      alert("5줄 까지만 가능합니다.")
      return false
    }
    setTeamConts(text);
  }
  //팀 가입신청 여부
  const onClickAction = (e) => {
    if(e.target.checked) {setAgree('y')}
    else {setAgree('n');}
  }
  const editName=(e)=>{
    let text= e.currentTarget.value.trim();
    setTeamName(text);
  }

  const clickConfirmPopup = () => {
    updateApi()
    setConfirmPop(!confirmPop);
  };
  
  // 강퇴하기
  const teamDelete = (masterNo,memNo) => {
    context.action.confirm({
      msg: `해당 회원님을 정말 강퇴시킬까요?`,
      buttonText: {
        left: '취소',
        right: '강퇴'
      },
      callback: () => {
        let param = {
          teamNo:teamNo,
          delSclt:"m",
          tmMemNo:memNo,
          masterMemNo:memberRdx.memNo,
          chrgrName:""
        }
        Api.getTeamMemDel(param).then(res=>{
          console.log("강퇴",res)
          if(res.code==="00000"){
            setUpdateChk(true)
          }
        })
        console.log('delete');
      }
    });
  };

  // 페이지 시작
  return (
    <div id="teamManager">
      <Header title="팀 관리" type="back" />
      <CntWrapper>
        <section className="teamNotice">
          <div>팀 심볼과 이름은 생성 후 <strong>72시간 이내 최대 1번</strong>만
          수정할 수 있습니다.<span>남은시간 71시간 59분</span></div>
        </section>
        <section className="teamSymbol">
          {teamInfo.team_bg_code && <img src={`${IMG_SERVER}/team/parts/E/${teamInfo.team_bg_code}.png`} />}
          {teamInfo.team_edge_code && <img src={`${IMG_SERVER}/team/parts/B/${teamInfo.team_edge_code}.png`} />}
          {teamInfo.team_medal_code && <img src={`${IMG_SERVER}/team/parts/M/${teamInfo.team_medal_code}.png`} />}
        </section>
        <TeamForm rows={10} cols={60} teamConts={teamConts || "" } teamName={teamName || ""}
                  editCnts={editCnts} editName={editName}
        />
        <CntTitle title="맴버">
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
                {data.team_mem_type !== 'm' &&
                <div className="listBack">
                  <button onClick={()=>teamDelete(data.master_mem_no,data.tm_mem_no)}>강퇴하기</button>
                </div>
                }
              </ListRow>
            )
          })
          }
        </section>
        <div className="switchList">
          <div className="titleWrap">
            <span className="title">가입 신청 허용</span>
            <span className="subTitle">다른 회원이 우리팀에 가입 신청하는 것을 허용합니다.</span>
          </div>
          <label className="inputLabel">
            <input type="checkbox" className="blind" onChange={onClickAction}/>
            <span className="switchBtn" />
          </label>
        </div>
        <section className="buttonWrap" onClick={clickConfirmPopup}>
          <SubmitBtn text="완료"  />
        </section>
      </CntWrapper>
    </div>
  )
}

export default TeamManager;
