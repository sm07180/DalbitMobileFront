import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import Utility, {addComma} from 'components/lib/utility';
// global components
import Header from 'components/ui/header/Header';
import InputItems from 'components/ui/inputItems/InputItems';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import LayerPop from 'components/ui/layerPopup/LayerPopup'
// components
import PartsPop from '../../components/parts/PartsPop';
import Confirm from '../../components/popup/Confirm';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupOpenData} from "redux/actions/common";

import "../../scss/teamDetail.scss";

const parts = ['메달','효과','배경'];

const TeamDetail = () => {
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

  const openConfirmPopup = () => {
    setConfirmPop(true);
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
    <div id="teamDetail" className={`${nextStep === true ? 'make-2' : ''}`}>
      <Header title="팀" type="back">
        <div className="buttonGroup">
          <button className="more">더보기</button>
        </div>
      </Header>
      <div className="listRow">
        <div className="teamSymbol">
          <div className={`parts-C`}>
            <img src={"https://image.dalbitlive.com/team/parts/C-9.png"} />
            <div className={`parts-B`}>
              <img src={"https://image.dalbitlive.com/team/parts/B-7.png"} />
            </div>
            <div className={`parts-A`}>
              <img src={"https://image.dalbitlive.com/team/parts/A-7.png"} />
            </div>
          </div>
        </div>
        <div className="listContent">
          <div className="teamName">우주최강슈퍼파월</div>
          <div className="listItem">
            <div className="icon"></div>
            <div className="point">123456789</div>
          </div>
        </div>
      </div>
      {nextStep &&
        <div className={`teamMakeForm ${nextStep === true ? 'active' : ''}`}>
          <InputItems title="팀 이름">
            <input type="text" maxLength={10} placeholder="필수입력(최대 10자)" />
          </InputItems>
          <InputItems title="팀 소개" type="textarea">
            <textarea rows="10" maxLength={150} placeholder="팀을 소개해 주세요. (최대 150자)" />
            <p className="count">5/150</p>
          </InputItems>
        </div>
      }
      {nextStep ? 
        <SubmitBtn text="완료" onClick={openConfirmPopup} />
        :
        <SubmitBtn text="다음" onClick={nextStepShow} state={(partsA && partsB && partsC) !== '' ? '' : 'disabled'} />
      }
      {popup.commonPopup &&
        <PopSlide title={`${partsName} 고르기`}>
          <PartsPop partsSelect={partsSelect} />
        </PopSlide>
      }
      {confirmPop &&
        <LayerPop setPopup={setConfirmPop} close={false}>
          <Confirm partsA={partsA} partsB={partsB} partsC={partsC} />
        </LayerPop>
      }
    </div>
  )
}

export default TeamDetail;
