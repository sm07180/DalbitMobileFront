import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';

const ButtonWrap = (props) => {
  const history = useHistory();

  // 팀 만들기 버튼
  const makeTeamBtn = () => {
    history.push('/team/make');
  };
  // 페이지 시작
  return (
    <div className="buttonWrap">
      {true ?
        <SubmitBtn text="팀 만들기" onClick={makeTeamBtn} />
        :
        <SubmitBtn text="레벨 15를 달성하면 만들 수 있어요!" state="disabled" />
      }
    </div>
  )
}

export default ButtonWrap;
