import React, {useEffect, useMemo, useState} from 'react';
import {useHistory} from "react-router-dom";
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import LayerPop from 'components/ui/layerPopup/LayerPopup'
// components
import TeamForm from '../../components/TeamForm';
import PartsPop from '../../components/parts/PartsPop';
import Confirm from '../../components/popup/Confirm';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";

import "../../scss/teamMake.scss";
import Api from "context/api";

const parts = ['메달','테두리','배경'];

const TeamMake = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);
  const memberRdx = useSelector((state) => state.member);

  const [partsName, setPartsName] = useState('');
  const [partsA, setPartsA] = useState('');  //메달URL
  const [partsB, setPartsB] = useState('');  //테두리URL
  const [partsC, setPartsC] = useState('');  //배경URL
  const [partsAcode, setPartsAcode] = useState('');  //메달Code
  const [partsBcode, setPartsBcode] = useState('');  //테두리Code
  const [partsCcode, setPartsCcode] = useState('');  //배경Code
  const [nextStep, setNextStep] = useState(false);
  const [confirmPop, setConfirmPop] = useState(false);
  const [imsiData ,setImsiData]=useState([]); //심볼 리스트용
  const [teamName,setTeamName]=useState(''); //팀 이름
  const [teamConts,setTeamConts]=useState(''); //팀소개
  const nextStepShow = () => {
    setNextStep(!nextStep);
  };
  
  const openPartsChoice = (e) => {
    const {targetName} = e.currentTarget.dataset;
    setPartsName(targetName);
    dispatch(setSlidePopupOpen({...popup, commonPopup: true}));
  };

  const clickConfirmPopup = () => {
    setConfirmPop(!confirmPop);
  };

  const saveAction=()=>{
    if(teamName === null || teamName === ""){
      return false;
    }
    let param ={
      memNo:memberRdx.memNo,
      teamName:teamName,
      teamConts:teamConts,
      teamMedalCode:partsAcode,
      teamEdgeCode:partsBcode,
      teamBgCode:partsCcode
    }
    Api.getTeamIns(param).then((res) => {
      if (res.message === 'SUCCESS' && res.data.result ===1) {
        history.push(`/team/detail/${res.data.teamNo}`)
      }else{
        console.log("error");
      }
    });
    setConfirmPop(false);
  }
  const partsSelect = (value,code) => {
    if (partsName === parts[0]) {
      setPartsA(value);
      setPartsAcode(code)
    }
    if (partsName === parts[1]) {
      setPartsB(value);
      setPartsBcode(code)
    }
    if (partsName === parts[2]) {
      setPartsC(value);
      setPartsCcode(code)
    }
    closePopup(dispatch);
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

  const editName=(e)=>{
    let text= e.currentTarget.value.trim();
    setTeamName(text);
  }

  const symbolApi=()=>{
    //심볼구분 [b:배경, e:테두리, m:메달]
    let param ={
      symbolSlct:partsName ==="배경" ? 'b': partsName ==="테두리" ? 'e':partsName ==="메달" ? 'm':'',
      ordSlct:"c",
      pageNo:1,
      pagePerCnt:100
    }
    Api.getTeamSymbolList(param).then((res) => {
      if (res.message === 'SUCCESS') {
        setImsiData(res.data.list)
      }
    });
  }

  useEffect(()=>{
    if(partsName ===""){
      Api.getTeamInsChk({memNo:memberRdx.memNo}).then((res) => {
        if(res.data !== 1){
          history.push('/myPage')
        }
      })
    }else if( partsName!==""){
        symbolApi()
    }
  },[partsName])

  // 페이지 시작
  return (
    <div id="teamMake" className={`${nextStep === true ? 'nextStep' : ''}`}>
      <Header title="팀 만들기" type="sub">
        <button className="back" onClick={nextStep ? nextStepShow : () => history.push('/team')} />
      </Header>
      <CntWrapper>
        <section className="teamParts">
          <div className={`parts-C ${partsC !== '' ? 'active' : ''}`}>
            <img src={partsC} />
            <div className={`parts-B ${partsB !== '' ? 'active' : ''}`}>
              <img src={partsB} />
            </div>
            <div className={`parts-A ${partsA !== '' ? 'active' : ''}`}>
              <img src={partsA} />
            </div>
          </div>
          <span className="text">각 파츠를 선택해<br/>
          팀 심볼을 만드세요.</span>
        </section>
        <section className="partsType">
          {parts.map((list,index) => {
            return (
              <div className="typeList" key={index}>
                {index === 0 && partsA !== '' ? 
                  <button
                    className="acitve"
                    data-target-name={list} 
                    onClick={openPartsChoice}>
                    <img src={partsA} alt="" />
                  </button>
                  : index === 1 && partsB !== '' ? 
                  <button
                    className="acitve"
                    data-target-name={list} 
                    onClick={openPartsChoice}>
                    <img src={partsB} alt="" />
                  </button>
                  : index === 2 && partsC !== '' ? 
                  <button
                    className="acitve"
                    data-target-name={list} 
                    onClick={openPartsChoice}>
                    <img src={partsC} alt="" />
                  </button>
                  : 
                  <button
                    data-target-name={list} 
                    onClick={openPartsChoice}>
                    +
                  </button>
                }
                <span>{list}</span>
              </div>
            )
          })}
        </section>
        {nextStep &&
          <TeamForm nextStep={nextStep} rows={10} cols={60} teamConts={teamConts} teamName={teamName}
                    editCnts={editCnts} editName={editName}
          />
        }
        <div className="buttonWrap">
          {nextStep ? 
            <SubmitBtn text="완료" onClick={clickConfirmPopup} />
            :
            <SubmitBtn text="다음" onClick={nextStepShow} state={(partsA && partsB && partsC) !== '' ? '' : 'disabled'} />
          }
        </div>
      </CntWrapper>
      {popup.commonPopup &&
        <PopSlide title={`${partsName} 고르기`}>
          <PartsPop partsSelect={partsSelect} imsiData={imsiData}/>
        </PopSlide>
      }
      {confirmPop &&
        <LayerPop setPopup={setConfirmPop} close={false}>
          <Confirm partsA={partsA} partsB={partsB} partsC={partsC} teamName={teamName}
                   saveAction={saveAction} clickConfirmPopup={clickConfirmPopup}
          />
        </LayerPop>
      }
    </div>
  )
}

export default TeamMake;
