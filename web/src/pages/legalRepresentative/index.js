import React, {useState,useReducer,useEffect,useContext,} from "react";
import { useHistory } from "react-router-dom";
import {Context} from 'context'

import Header from 'components/ui/header/Header'
import CheckWrap from 'components/ui/checkbox'

import "./index.scss";

const LegalRepresentative = () => { 
  const history = useHistory();
  const context = useContext(Context)

  const ToggleCheck = () => {
    check ? setCheck(false) : setCheck(true)
  }

  const [checked, setChecked] = useState(false);

  const goBack = () => {
    window.history.back()
  }

  const onBlurHandler = (ele) => {
    let value = ele.value;
    let regExp;
    regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (!regExp.test(value)) {      
      context.action.alert({
        msg: '정확한 Email을 입력해주세요.'
      })
    } 
  };

  return (
      <div id="legalRepresentative">
        <Header position={'sticky'} title={'법정대리인 동의'} type={'back'}/>
        <div className="content">
          <div className="infomation">
            <span className="point">만 19세 미만은 법정대리인 동의가 필요합니다.</span>
            <span>
              만 19세 미만의 미성년자가 유료서비스(달 충전) 이용을
              <br/>
              위한 결제 시 법정대리인의 동의가 필요합니다.
            </span>
          </div>
          <div className="form">
            <div className="section">
              <div className="head">
                <span className="title">법정대리인 이메일 주소</span>
              </div>            
              <div className="contents">
                <input type="email" maxLength={50} onBlur={(e) => {onBlurHandler(e.currentTarget)}} name="representativeEmail" className="emailForm" placeholder="이메일 주소 입력" />
                <span className="explanation">등록하신 이메일 주소로 회원님이 결제한 내역을 보내드립니다.</span>
              </div>
            </div>
            <div className="section">
              <div className="head">
                <span className="title">동의기간</span>
                <select className="selectBox">
                  <option>12개월</option>
                  <option>9개월</option>
                  <option>6개월</option>
                  <option>3개월</option>
                  <option>1개월</option>
                </select>
              </div>            
              <div className="contents">
                <span className="explanation">동의 철회를 원하시는 경우 1:1문의 혹은 고객센터로 연락 주시기 바랍니다.</span>
              </div>
            </div>

            <div className="bottom">
              <div className="checkSection">
                <label className="checkLabel">
                  <CheckWrap>
                    <input type="checkbox" value={checked} onClick={ToggleCheck} className={checked === true ? 'on' : 'off'} />
                  </CheckWrap>
                  <span className="checkText">본인은 만 19세 미만 이용자의 법정대리인임을 확인하며,  해당 이용자의 서비스 및 유료결제 이용에 동의합니다.</span>
                </label>
              </div>
              <div className="btnSection">
                <button className="btnAgree">법정대리인 동의하기</button>
              </div>
            </div>          
          </div>  
        </div>
      </div>
  );
}

export default LegalRepresentative