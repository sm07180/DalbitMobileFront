import React from 'react'
import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

export default function AgreeDetail() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  return (
    <div id="agreeDetailWrap">
      <div className="title">개인정보 수집 및 이용에 동의</div>
      <div className="content">
        <span>- 수집 및 이용 항목 : 닉네임, 이메일, 휴대전화번호</span>
        <span>- 수집 및 이용 목적 : 문의에 대한 답변 관련 업무</span>
        <span>- 보유및 이용 기간 : 6개월</span>
        <span>- 회사는 문의에 대한 답변을 위한 목적으로 관계법령에 따라 개인정보 수집 및 이용에 동의를 얻어 수집합니다.</span>
      </div>
      <button onClick={() => {
        dispatch(setGlobalCtxVisible(false))
      }}>확인
      </button>
    </div>
  )
}
