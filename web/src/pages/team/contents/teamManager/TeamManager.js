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
// components
import TeamForm from '../../components/TeamForm';
import PartsPop from '../../components/parts/PartsPop';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";

import "../../scss/teamManager.scss";
import {NormalTimer} from "pages/broadcast/content/right_content/vote/Timer";
import moment from "moment";
import photoCommon from "common/utility/photoCommon";
import Api from "context/api";

const parts = ['메달','테두리','배경'];

const TeamManager = (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);
  const teamNo = props.match.params.teamNo;
  const memberRdx = useSelector((state)=> state.member);

  const [partsName, setPartsName] = useState('');
  const [partsA, setPartsA] = useState(`${IMG_SERVER}/team/parts/M/${props.data.teamInfo.team_medal_code}.png`);  //메달URL
  const [partsB, setPartsB] = useState(`${IMG_SERVER}/team/parts/E/${props.data.teamInfo.team_edge_code}.png`);  //테두리URL
  const [partsC, setPartsC] = useState(`${IMG_SERVER}/team/parts/B/${props.data.teamInfo.team_bg_code}.png`);  //배경URL
  const [imsiData ,setImsiData]=useState([]); //심볼 리스트용
  const [confirmPop, setConfirmPop] = useState(false);
  const [teamName,setTeamName]=useState(props.data.teamInfo.team_name); //팀 이름
  const [teamConts,setTeamConts]=useState(props.data.teamInfo.team_conts); //팀소개
  const [agree,setAgree]=useState(props.data.teamInfo.req_mem_yn);
  const [medalCode,setMdalCode]=useState(props.data.teamInfo.team_medal_code)
  const [edgeCode,setEdgeCode]=useState(props.data.teamInfo.team_edge_code)
  const [bgCode,setBgCode]=useState(props.data.teamInfo.team_bg_code)
  const timer = NormalTimer(moment(props.data.teamInfo.ins_date).add(3, 'days'));
  const remainHours = (timer.days() * 24) + timer.hours();
  const [defultData , setDefultData]=useState({
    bgCode:props.data.teamInfo.team_bg_code,
    medalCode:props.data.teamInfo.team_medal_code,
    edgeCode:props.data.teamInfo.team_edge_code,
    teamName:props.data.teamInfo.team_name,
  })
  useEffect(()=>{
    // fixme 문대리님 요청해야함 'active 클래스 추가'
    document.getElementsByClassName("blind")[0].checked = agree === 'y';
  }, [agree])

  const updateApi=()=>{

    let equData = {
      bgCode:bgCode,
      medalCode:medalCode,
      edgeCode:edgeCode,
      teamName:teamName
    }
    let param={
      memNo:memberRdx.memNo,
      updSlct:(JSON.stringify(defultData) === JSON.stringify(equData)) ? 'b': 'a',   //-- 수정구분[a:심볼및이름, b:소개수정]
      teamNo:teamNo,
      teamName:teamName,
      teamConts:teamConts,
      teamMedalCode:medalCode,
      teamEdgeCode:edgeCode,
      teamBgCode:bgCode,
      reqMemYn:agree
    }

    Api.getTeamUpd(param).then((res)=>{
      if(res.code==="00000"){
        history.replace(`/team/detail/${teamNo}`)
      }
    })

  }

  const openPartsChoice = (e) => {
    const {targetName} = e.currentTarget.dataset;
    setPartsName(targetName);
    dispatch(setSlidePopupOpen({...popup, commonPopup: true}));
  };

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
    if(e.target.checked) {
      setAgree('y')
    } else {
      setAgree('n');
    }
  }
  const editName=(e)=>{
    let text= e.currentTarget.value.trim();
    setTeamName(text);
  }

  const clickConfirmPopup = () => {
    updateApi()
    setConfirmPop(!confirmPop);
  };

  const partsSelect = (value,code) => {
    //메달
    if (partsName === parts[0]) {
      setPartsA(value);
      setMdalCode(code)
    }
    //테두리
    if (partsName === parts[1]) {
      setPartsB(value);
      setEdgeCode(code)
    }
    //배경
    if (partsName === parts[2]) {
      setPartsC(value);
      setBgCode(code)
    }
    closePopup(dispatch);
  };

  // 강퇴하기
  const teamDelete = (data) => {
    context.action.confirm({
      msg: `해당 회원님을 정말 강퇴시킬까요?`,
      buttonText: {
        left: '취소',
        right: '강퇴'
      },
      callback: () => {
        let param = {
          teamNo: teamNo,
          delSclt: "m",
          tmMemNo: data.tm_mem_no,
          masterMemNo: memberRdx.memNo,
          chrgrName: ""
        }
        Api.getTeamMemDel(param).then(res=>{
          if(res.code==="00000"){
            props.getPageData();
          }
        })
      }
    });
  };

  const symbolApi = () =>{
    //심볼구분 [b:배경, e:테두리, m:메달]
    let param ={
      symbolSlct: partsName === "배경" ? 'b' : partsName === "테두리" ? 'e' : partsName === "메달" ? 'm' : '',
      ordSlct:"c",
      pageNo:1,
      pagePerCnt:100
    }
    Api.getTeamSymbolList(param).then((res) => {
      if (res.message === 'SUCCESS') {
        setImsiData(res.data.list)
      }
    });
  };

  useEffect(() => {
    if( partsName!==""){
      symbolApi()
    }
  },[partsName])

  // 페이지 시작
  return (
    <div id="teamManager">
      <Header title="팀 관리" type="back" />
      <CntWrapper>
        <section className="teamNotice">
          <div>
            팀 심볼과 이름은 생성 후 <strong>72시간 이내 최대 1번</strong>만 수정할 수 있습니다.
            {
              timer.asMilliseconds() > 0 &&
              <span>
                남은시간 {remainHours > 0 && remainHours + '시간'} {timer.minutes() > 0 && timer.minutes() + '분'}
              </span>
            }
          </div>
        </section>

        {/* TODO 심볼 수정 기능　*/}
        <section className="teamSymbol">
          <img src={`${partsC}`} alt={'배경 이미지'}/>
          <img src={`${partsB}`} alt={'테두리 이미지'}/>
          <img src={`${partsA}`} alt={'메달 이미지'}/>
        </section>

        {
          (props.data.editChk && (remainHours > 0 || timer.minutes() > 0)) &&
          <section className="partsType">
            {
              parts.map((list,index) => {
                return (
                  <div className="typeList" key={index}>
                    {index === 0 && partsA !== '' ?
                      <button className="acitve" data-target-name={list} onClick={openPartsChoice}>
                        <img src={partsA} alt="" />
                      </button>
                      : index === 1 && partsB !== '' ?
                        <button className="acitve" data-target-name={list} onClick={openPartsChoice}>
                          <img src={partsB} alt="" />
                        </button>
                        : index === 2 && partsC !== '' ?
                          <button className="acitve" data-target-name={list} onClick={openPartsChoice}>
                            <img src={partsC} alt="" />
                          </button>
                          :
                          <button data-target-name={list} onClick={openPartsChoice}>
                            +
                          </button>
                    }
                    <span>{list}</span>
                  </div>
                )
              })
            }
          </section>
        }

        <TeamForm rows={10} cols={60} teamConts={teamConts || "" } teamName={teamName || ""}
          editCnts={editCnts} editName={editName} editChk={props.data.editChk}
        />
        <CntTitle title="맴버">
          <span className="count"><strong>{props.data.teamMemList.length}</strong>/5</span>
        </CntTitle>
        <section className="memberList">
          {
            props.data.teamMemList.length >0 &&
            props.data.teamMemList.map((data,index)=>{
              const photoUrl = data.tm_image_profile;
              const photoServer = "https://devphoto.dalbitlive.com";
              const photo = photoCommon.getPhotoUrl(photoServer, photoUrl, "120x120");
              return(
                <ListRow photo={photo} key={index}>
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
                  {
                    data.team_mem_type !== 'm' &&
                    <div className="listBack">
                      <button onClick={()=>{
                        teamDelete(data)
                      }}>강퇴하기</button>
                    </div>
                  }
                </ListRow>
              )
            })
          }
        </section>
        <div className="switchWrap">
          <div className="wrapBox">
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
      {
        popup.commonPopup &&
        <PopSlide title={`${partsName} 고르기`}>
          <PartsPop partsSelect={partsSelect} imsiData={imsiData}/>
        </PopSlide>
      }
    </div>
  )
}

export default TeamManager;
