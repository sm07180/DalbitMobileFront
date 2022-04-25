import React, {useEffect, useState} from 'react';
// global components

import '../../scss/confirm.scss';

const ConfirmPop = (props) => {
  const {partsA, partsB, partsC,clickConfirmPopup,saveAction,teamName} = props;

  // 페이지 시작
  return (
    <>
      <div className="popOverTopImg">
        <div className="teamSymbol">
          <img src={partsC} alt="parts-C" />
          <img src={partsB} alt="parts-B" />
          <img src={partsA} alt="parts-A" />
        </div>
      </div>
      <h2>{teamName}</h2>
      <p className="text1">마지막으로 확인해 주세요.</p>
      <p className="text2">팀 심볼과 이름은 생성 후 72시간 이내에<br/>
      최대 1번만 수정할 수 있어요.</p>
      <div className="buttonGroup">
        <button className="modify" onClick={clickConfirmPopup}>수정</button>
        <button className="complete" onClick={saveAction}>완료</button>
      </div>
    </>
  )
}

export default ConfirmPop;