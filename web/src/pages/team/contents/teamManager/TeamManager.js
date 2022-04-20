import React, {useContext, useState, useEffect} from 'react';
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
import Api from "context/api";

const parts = ['메달','테두리','배경'];

const TeamManager = () => {
  const history = useHistory();
  const context = useContext(Context);
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);
  const memberRdx = useSelector((state) => state.member);
  
  const [partsName, setPartsName] = useState('');
  const [partsA, setPartsA] = useState('');  //메달URL
  const [partsB, setPartsB] = useState('');  //테두리URL
  const [partsC, setPartsC] = useState('');  //배경URL
  const [imsiData ,setImsiData]=useState([]); //심볼 리스트용
  const [confirmPop, setConfirmPop] = useState(false);
  
  const openPartsChoice = (e) => {
    const {targetName} = e.currentTarget.dataset;

    setPartsName(targetName);
    dispatch(setSlidePopupOpen({...popup, commonPopup: true}));
  };

  const clickConfirmPopup = () => {
    setConfirmPop(!confirmPop);
  };
  
  const partsSelect = (value,code) => {
    if (partsName === parts[0]) {
      setPartsA(value);
    }
    if (partsName === parts[1]) {
      setPartsB(value);
    }
    if (partsName === parts[2]) {
      setPartsC(value);
    }
    closePopup(dispatch);
  };
  
  // 강퇴하기
  const teamDelete = () => {
    context.action.confirm({
      msg: `해당 회원님을 정말 강퇴시킬까요?`,
      buttonText: {
        left: '취소',
        right: '강퇴'
      },
      callback: () => {
        console.log('delete');
      }
    });
  };
  
  const symbolApi = () =>{
    //심볼구분 [b:배경, e:테두리, m:메달]
    let param ={
      symbolSlct:partsName ==="배경" ? 'b': partsName ==="테두리" ? 'e':partsName ==="메달" ? 'm':'',
      ordSlct:"c",
      pageNo:1,
      pagePerCnt:100
    }
    console.log(param)
    Api.getTeamSymbolList(param).then((res) => {
      if (res.message === 'SUCCESS') {
        setImsiData(res.data.list)
      }
    });
  };

  useEffect(() => {
    if(partsName ===""){
      Api.getTeamInsChk({memNo:memberRdx.memNo}).then((res) => {
        console.log("res==>",res)
      })
    }
  },[])

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
          <div>팀 심볼과 이름은 생성 후 <strong>72시간 이내 최대 1번</strong>만
          수정할 수 있습니다.<span>남은시간 71시간 59분</span></div>
        </section>
        <section className="teamSymbol">
          <img src={`${partsC}`} />
          <img src={`${partsB}`} />
          <img src={`${partsA}`} />
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
        <TeamForm rows={7} />
        <CntTitle title="맴버">
          <span className="count"><strong>2</strong>/5</span>
        </CntTitle>
        <section className="memberList">
          <ListRow photo="" photoClick={() => photoClick()}>
            <div className="listContent">
              <div className="listItem">
                <div className="nick">일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십</div>
                <img src={`${IMG_SERVER}/team/teamLeader.png`} alt="teamLeader" />
              </div>
              <div className="listItem">
                <div className="iconPoint"></div>
                <div className="point">{Utility.addComma(123456789)}</div>
              </div>
            </div>
            <div className="listBack">
              <button onClick={teamDelete}>강퇴하기</button>
            </div>
          </ListRow>
        </section>
        <div className="switchList">
          <div className="titleWrap">
            <span className="title">가입 신청 허용</span>
            <span className="subTitle">다른 회원이 우리팀에 가입 신청하는 것을 허용합니다.</span>
          </div>
          <label className="inputLabel">
            <input type="checkbox" className="blind" />
            <span className="switchBtn" />
          </label>
        </div>
        <section className="buttonWrap">
          <SubmitBtn text="완료" onClick={clickConfirmPopup} />
        </section>
      </CntWrapper>
      {popup.commonPopup &&
        <PopSlide title={`${partsName} 고르기`}>
          <PartsPop partsSelect={partsSelect} imsiData={imsiData}/>
        </PopSlide>
      }
    </div>
  )
}

export default TeamManager;
