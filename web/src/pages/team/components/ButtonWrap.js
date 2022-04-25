import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
// global components
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import Api from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ButtonWrap = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  // 팀 만들기 버튼
  const makeTeamBtn = () => {
    Api.getTeamInsChk({memNo:props.memNo}).then((res) => {
      if(res.data === 1){
        history.push('/team/make');
      }else{
        dispatch(setGlobalCtxMessage({type:'toast',
          msg: res.message
        }))
      }
    })

  };
  // 페이지 시작
  return (
    <div className="buttonWrap">
        <SubmitBtn text="팀 만들기" onClick={makeTeamBtn} />
    </div>
  )
}

export default ButtonWrap;
