import React, {useState,useReducer,useEffect,useContext} from "react";
import {Context} from 'context'

import Header from 'components/ui/header/Header'
import CheckBox from 'components/ui/checkBox/CheckBox'

import "./index.scss";
import {authReq} from "pages/self_auth";
import UseInput from "common/useInput/useInput";
import {parentCertIns} from "common/api";

const periodType = [
  {value: '12', name: '12개월'},
  {value: '9', name: '9개월'},
  {value: '6', name: '6개월'},
  {value: '3', name: '3개월'},
  {value: '1', name: '1개월'},
]

const LegalRepresentative = () => { 
  const context = useContext(Context)

  const [emailValue, setEmailValue] = useState("");
  const [agreePeriod, setAgreePeriod] = useState(periodType[0].value);
  const [agreeCheck, setAgreeCheck] = useState(false);
  const [submitState, setSubmitState] = useState(false);

  const emailValidator = () => {
    let regExp;
    regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if(emailValue === '') {
      context.action.alert({
        msg: '이메일 주소를 입력해주세요.'
      })
      return false;
    }else if (!regExp.test(emailValue)) {
      context.action.alert({
        msg: '올바른 이메일 주소를 입력해주세요.'
      })
      return false;
    }
    return true;
  };

  const agreeCheckHandler = () => {
    if(!agreeCheck) {
      context.action.alert({
        msg: '법정대리인 동의사항에 체크해주세요.'
      })
      return false;
    }
    return true;
  }

  const onChange = (e) => {
    setAgreePeriod(e.currentTarget.value);
  };

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.add('focus')
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.remove('focus')
  }

  const agreeSubmit = () => {
    if(emailValidator() && agreePeriod !== '' && agreeCheckHandler()) {
      const emailInsParam = {
        pMemEmail: emailValue,
        agreementDate: agreePeriod,
      }

      /* 유저의 법정대리인의 email ins */
      parentCertIns(emailInsParam).then(res => {
        if(res.data === 1) {
          return authReq({code: '13', formTagRef: context.authRef, context, pushLink: '/store', authType: '2', agreePeriod});
        }else {
          context.action.alert({
            msg: res.message
          })
        }
      })
    }
  }

  /* 이메일 */
  const emailInputValid = (value) => {
    return value.length <= 50;
  }

  useEffect(() => {
    if(emailValue !== "" && agreePeriod !== "" && agreeCheck) {
      setSubmitState(true);
    } else {
      setSubmitState(false);
    }    
  }, [emailValue, agreePeriod, agreeCheck])

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
                <span className="title necessary">법정대리인 이메일 주소</span>
              </div>
              <div className="contents">
                <label className="inputBox"
                      onFocus={onFocus}
                      onBlur={onBlur}>
                  <UseInput type="email"
                            value={emailValue}
                            setValue={setEmailValue}
                            name="representativeEmail"
                            className="emailForm"
                            placeholder="이메일 주소를 입력해주세요."
                            validator={emailInputValid}
                  />
                </label>                
                <span className="explanation">등록하신 이메일 주소로 회원님이 결제한 내역을 보내드립니다.</span>
              </div>
            </div>
            <div className="section">
              <div className="head">
                <span className="title necessary">동의기간</span>
                <select className="selectBox" onChange={onChange}>
                  {periodType.map((item, index) => {
                    return (
                      <option key={index} value={item.value}>{item.name}</option>
                    )
                  })}
                </select>
              </div>            
              <div className="contents">
                <span className="explanation">동의 철회를 원하시는 경우 1:1문의 혹은 고객센터로 연락 주시기 바랍니다.</span>
              </div>
            </div>

            <div className="bottom">
              <CheckBox name={"agree"} text={"법적대리인 동의"} returnCheck={setAgreeCheck} necessary={true}/> 
              <p className="agreeInfo">본인은 만 19세 미만 이용자의 법정대리인임을 확인하며,  해당 이용자의 서비스 및 유료결제 이용에 동의합니다.</p>
              <div className="btnSection">
                <button className={`btnAgree ${submitState ? "active" : "disable"}`}
                        onClick={agreeSubmit}
                >법정대리인 동의하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default LegalRepresentative