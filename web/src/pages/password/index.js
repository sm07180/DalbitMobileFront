import React, {useState, useEffect, useRef} from 'react'

//components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import './style.scss'
import Api from "context/api";
import useDidMountEffect from "common/hook/useDidMountEffect";
import {useHistory} from "react-router-dom";


const PasswordChange = () => {
  const history = useHistory();
  const [btnActive, setBtnActive] = useState("")
  const [passwordInfo, setPasswordInfo] = useState({
    phoneNum:"",
    authNum:"",
    password:"",
    passwordChange:"",
    CMID:""
  })

  const phoneNumRef = useRef(null);
  const requestNumRef = useRef(null);
  const phoneCheckRef = useRef(null);
  const authCheckRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);

  const [checkPasswordValue, setCheckPasswordValue] = useState({
    check:false,
    message:"비밀번호를 다시 확인해주세요"
  });

  useDidMountEffect(() => {
    validatePassword();
  }, [passwordInfo.password]);

  useDidMountEffect(()=>{
    validatePasswordCheck();
  }, [passwordInfo.passwordCheck])


  const phoneNumChange = (e) => {
    setPasswordInfo({
      ...passwordInfo,
      phoneNum: e.target.value
    })
    var text = e.target.value;
    var regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (regPhone.test(text) === true) {
      setBtnActive("active")
    }
  }

  const authNumChange = (e) => {
    setPasswordInfo({
      ...passwordInfo,
      authNum: e.target.value
    })
  }

  const passwordChange = (e) => {
    setPasswordInfo({
      ...passwordInfo,
      password: e.target.value
    })
  }

  const passwordCheckChange = (e) => {
    setPasswordInfo({
      ...passwordInfo,
      passwordChange: e.target.value
    })
  }

  useEffect(() => {
      setBtnActive(true);
  }, [passwordInfo])


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
    if (!rgEx.test(passwordInfo.phoneNum)) {
      document.getElementById('phoneInputItem').classList.add("error");
      phoneCheckRef.current.innerHTML = "휴대폰 번호 형식에 맞게 입력해 주세요.";
    } else {
      sendSms(passwordInfo.phoneNum).then(res=>{
        if(res.result === "success"){
          document.getElementById('phoneInputItem').classList.remove("error");
          document.getElementById('phoneInputItem').classList.add("success");
          phoneCheckRef.current.innerHTML = "";
          phoneNumRef.current.disabled = true;
          requestNumRef.current.disabled = false;
        }else{
          context.action.alert({msg: res.message});
        }
      });
    }
  }

  const sendSms = async (phoneNum) => {
    const {result, message, data} = await Api.sms_request({
      data: {phoneNo: phoneNum, authType: 0}
    })
    if(result === "success") {
      setPasswordInfo({
        ...passwordInfo,
        CMID: data.CMID
      })
    }
    return {result:result, message:message};
  }


  const fetchSmsCheck = async () => {
    const {result, message} = await Api.sms_check({
      data: {
        CMID: passwordInfo.CMID,
        code: Number(passwordInfo.authNum)
      }
    })
    return {result:result, message:message}
  }

  //비밀번호
  const validatePassword = () => {
    const num = passwordInfo.password.search(/[0-9]/g)
    const eng = passwordInfo.password.search(/[a-zA-Z]/gi)
    const spe = passwordInfo.password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

    if (passwordInfo.password.length < 8 || passwordInfo.password.length > 20) {
      document.getElementById('passwordInputItem').classList.add("error");
      document.getElementById('passwordInputItem').classList.remove("success");
      passwordRef.current.innerHTML = "비밀번호는 8~20자 이내로 입력해주세요.";
      setCheckPasswordValue({check:false, message: "비밀번호는 8~20자 이내로 입력해주세요."})
    } else {
      document.getElementById('passwordInputItem').classList.remove("error");
      document.getElementById('passwordInputItem').classList.add("success");
      passwordRef.current.innerHTML = "";

      if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
        document.getElementById('passwordInputItem').classList.add("error");
        document.getElementById('passwordInputItem').classList.remove("success");
        passwordRef.current.innerHTML = "비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합으로 입력해주세요.";
        setCheckPasswordValue({check:false, message: "비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합으로 입력해주세요."})
      } else {
        if(passwordInfo.password !== passwordInfo.passwordCheck){
          document.getElementById('passwordCheckInputItem').classList.add("error");
          document.getElementById('passwordCheckInputItem').classList.remove("success");
          passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
          setCheckPasswordValue({check:false, message: "비밀번호를 다시 확인해주세요."})
        } else if(passwordInfo.password === passwordInfo.passwordCheck) {
          document.getElementById('passwordCheckInputItem').classList.remove("error");
          document.getElementById('passwordCheckInputItem').classList.add("success");
          passwordCheckRef.current.innerHTML = "";
          document.getElementById('passwordInputItem').classList.remove("error");
          document.getElementById('passwordInputItem').classList.add("success");
          passwordRef.current.innerHTML = "";
          setCheckPasswordValue({check:true, message: "비밀번호 설정 완료"})
        }
      }
    }
  }

  const validatePasswordCheck = () => {
    if (passwordInfo.password === passwordInfo.passwordCheck) {
      document.getElementById('passwordCheckInputItem').classList.remove("error");
      document.getElementById('passwordCheckInputItem').classList.add("success");
      passwordCheckRef.current.innerHTML = "";
      setCheckPasswordValue({check:true, message: "비밀번호 설정 완료"})
    } else if(passwordInfo.password !== passwordInfo.passwordCheck) {
      document.getElementById('passwordCheckInputItem').classList.add("error");
      document.getElementById('passwordCheckInputItem').classList.remove("success");
      passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
      setCheckPasswordValue({check:false, message: "비밀번호를 다시 확인해주세요."})
    }
  }

  const changePassword = () =>{
    if (checkPasswordValue.check) {
      history.push("/login/didLogin")
    } else if(passwordInfo.password !== passwordInfo.passwordCheck) {
      document.getElementById('passwordCheckInputItem').classList.add("error");
      document.getElementById('passwordCheckInputItem').classList.remove("success");
      passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
    }else{
      if (passwordInfo.password === "") {
        document.getElementById('passwordInputItem').classList.add("error");
        document.getElementById('passwordInputItem').classList.remove("success");
        passwordRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
      } else if (passwordInfo.passwordCheck === "") {
        document.getElementById('passwordCheckInputItem').classList.add("error");
        document.getElementById('passwordCheckInputItem').classList.remove("success");
        passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
      }
    }
  }

  return (
    <div id='passwordSetting'>
      <Header position={'sticky'} title={'비밀번호 변경'} type={'back'}/>
      <div className='content'>
        <form>

            <div className='inputWrap'>
              <div className="title">휴대폰 번호</div>
              <div className={`inputItems`} id={'phoneInputItem'}>
                <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                  <input type="tel" name={"phoneNum"} value={passwordInfo.phoneNum} onChange={phoneNumChange} placeholder="휴대폰 번호" maxLength={11} autoComplete="off" ref={phoneNumRef} />
                </div>
                <button type="button" className={`inputBtn disable`} onClick={smsRequest}>인증요청</button>
                <p className='textLog' ref={phoneCheckRef}/>
              </div>
            </div>

            <div className='inputWrap'>
              <div className="title">인증번호</div>
              <div className={`inputItems`} id={'authNum'}>
                <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                  <input type="tel" name={"authNum"} value={passwordInfo.authNum} onChange={authNumChange} placeholder="인증 번호" maxLength={6} autoComplete="off" ref={requestNumRef} disabled={true}/>
                </div>
                <button type="button" className={`inputBtn disable`} onClick={fetchSmsCheck}>확인</button>
                <p className='textLog' ref={authCheckRef}/>
              </div>
            </div>

            <div className='inputWrap'>
              <div className="title">비밀번호</div>
              <div className={`inputItems`} id={'passwordInputItem'}>
                <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                  <input type="password" name="password" value={passwordInfo.password} onChange={passwordChange} placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상" autoComplete="off" maxLength={20}/>
                </div>
                <p className='textLog' ref={passwordRef}/>
              </div>
            </div>

            <div className='inputWrap'>
              <div className="title">비밀번호 확인</div>
              <div className={`inputItems`} id={'passwordCheckInputItem'}>
                <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                  <input type="password" name="passwordCheck" value={passwordInfo.passwordChange} onChange={passwordCheckChange} placeholder="비밀번호 다시 입력" autoComplete="off" maxLength={20}/>
                </div>
                <p className='textLog' ref={passwordCheckRef}/>
              </div>
            </div>

          <SubmitBtn state={!btnActive && 'disabled'} onClick={changePassword} text="변경하기"/>
        </form>
      </div>
    </div>
  )
}

export default PasswordChange