import React, {useMemo, useState} from 'react';
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
import {setCommonPopupOpenData} from "redux/actions/common";

import "../../scss/teamMake.scss";

const parts = ['메달','효과','배경'];

const TeamMake = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);

  const [partsName, setPartsName] = useState('');
  const [partsA, setPartsA] = useState('');
  const [partsB, setPartsB] = useState('');
  const [partsC, setPartsC] = useState('');
  const [nextStep, setNextStep] = useState(false);
  const [confirmPop, setConfirmPop] = useState(false);

  const nextStepShow = () => {
    setNextStep(!nextStep);
  };
  
  const openPartsChoice = (e) => {
    const {targetName} = e.currentTarget.dataset;

    setPartsName(targetName);
    dispatch(setCommonPopupOpenData({...popup, commonPopup: true}));
  };

  const clickConfirmPopup = () => {
    setConfirmPop(!confirmPop);
  };

  const partsSelect = (value) => {
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
          <TeamForm nextStep={nextStep} rows={10} />
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
          <PartsPop partsSelect={partsSelect} />
        </PopSlide>
      }
      {confirmPop &&
        <LayerPop setPopup={setConfirmPop} close={false}>
          <Confirm partsA={partsA} partsB={partsB} partsC={partsC} closePopup={clickConfirmPopup} />
        </LayerPop>
      }
    </div>
  )
}

export default TeamMake;
