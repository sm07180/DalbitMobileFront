import React, {useContext, useRef, useEffect, useState} from 'react';
import Api from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";


//Step 1. 휴대폰 인증
const PhoneAuth = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  let {signForm, onChange, setStep, setSignForm} = props;
  const [authCheck, setAuthCheck] = useState(false);
  const [authBtnValue,setAuthBtnValue] = useState("인증요청")
  const [nextButton, setNextButton] = useState(false);
  const phoneNumRef = useRef(null);
  const requestNumRef = useRef(null);
  const phoneCheckRef = useRef(null);
  const authCheckRef = useRef(null);

  useEffect(()=>{
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    if(rgEx.test(signForm.phoneNum)){
      setAuthCheck(true);
    }else{
      setAuthCheck(false);
    }
  },[signForm.phoneNum]);


  useEffect(()=>{
    if(signForm.requestNum.length === 6){
      setNextButton(true);
    }else{
      setNextButton(false);
    }
  },[signForm.requestNum]);

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode;
    targetClassName.classList.add('focus');
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode;
    targetClassName.classList.remove('focus');
  }

  const smsRequest = (e) => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    if (!rgEx.test(signForm.phoneNum)) {
      document.getElementById('phoneInputItem').classList.add("error");
      phoneCheckRef.current.innerHTML = "휴대폰 번호 형식에 맞게 입력해 주세요.";
    } else {
      sendSms(signForm.phoneNum).then(res=>{
        if(res.result === "success"){
          document.getElementById('phoneInputItem').classList.remove("error");
          document.getElementById('phoneInputItem').classList.add("success");
          phoneCheckRef.current.innerHTML = "";
          phoneNumRef.current.disabled = true;
          requestNumRef.current.disabled = false;
          setAuthBtnValue("재발송");
        }else{
          dispatch(setGlobalCtxMessage({type: "alert",msg: res.message}));
        }
      });
    }
  }

  const sendSms = async (phoneNum) => {
    const {result, message, data} = await Api.sms_request({
      data: {phoneNo: phoneNum, authType: 0}
    })
    if(result === "success") {
      setSignForm({
        ...signForm,
        CMID: data.CMID
      })
    }
    return {result:result, message:message};
  }


  const fetchSmsCheck = async () => {
    const {result, message} = await Api.sms_check({
      data: {
        CMID: signForm.CMID,
        code: Number(signForm.requestNum)
      }
    })
    return {result:result, message:message}
  }


  const nextStep = () =>{
    fetchSmsCheck().then(res=>{
      if(res.result === 'success'){
        setStep(2);
      }else{
        document.getElementById('requestInputItem').classList.add("error");
        authCheckRef.current.innerHTML = "인증번호가 일치하지 않습니다. 다시 확인 후 입력해주세요.";
      }
    })
  };

  return (
    <section className='signField'>
      <div className='title'>
        <h2>번호를 입력해주세요</h2>
      </div>

      <div className='inputWrap'>
        <div className={`inputItems`} id={'phoneInputItem'}>
          <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
            <input type="tel" name={"phoneNum"} value={signForm.phoneNum} onChange={onChange}
                   placeholder="휴대폰 번호" maxLength={11} autoComplete="off" ref={phoneNumRef}/>
          </div>
          <button type="button" className={`inputBtn ${!authCheck && 'disable'}`}
                  onClick={smsRequest}>{authBtnValue}</button>
          <p className='textLog' ref={phoneCheckRef} />
        </div>
      </div>

      <div className='inputWrap'>
        <div className={`inputItems`} id={'requestInputItem'}>
          <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
            <input type="number" name={"requestNum"} value={signForm.requestNum} onChange={onChange}
                   placeholder="인증 번호 6자리" autoComplete="off" ref={requestNumRef} disabled={true}/>
          </div>
          <p className='textLog' ref={authCheckRef} />
        </div>
      </div>

      <button type={"button"} className={`submitBtn ${nextButton ? "" : "disabled"}`} onClick={nextStep}>다음</button>
    </section>
  );
};

export default PhoneAuth;
