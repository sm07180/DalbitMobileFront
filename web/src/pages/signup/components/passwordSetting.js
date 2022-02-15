import React, {useRef, useEffect, useState} from 'react';
import SignField from "pages/signup/components/signField";
import InputItems from "components/ui/inputItems/InputItems";
import useDidMountEffect from "common/hook/useDidMountEffect";

const PasswordSetting = (props) => {

  let {signForm, onChange, sighUp} = props;
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const [checkPasswordValue, setCheckPasswordValue] = useState({
    check:false,
    message:"비밀번호를 다시 확인해주세요"
  });
  useDidMountEffect(() => {
    validatePassword();
  }, [signForm.password]);

  useDidMountEffect(()=>{
    validatePasswordCheck();
  }, [signForm.passwordCheck])

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.add('focus')
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.remove('focus')
  }

  //비밀번호
  const validatePassword = () => {
    const num = signForm.password.search(/[0-9]/g)
    const eng = signForm.password.search(/[a-zA-Z]/gi)
    const spe = signForm.password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

    if (signForm.password.length < 8 || signForm.password.length > 20) {
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
        if(signForm.password !== signForm.passwordCheck){
          document.getElementById('passwordCheckInputItem').classList.add("error");
          document.getElementById('passwordCheckInputItem').classList.remove("success");
          passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
          setCheckPasswordValue({check:false, message: "비밀번호를 다시 확인해주세요."})
        } else if(signForm.password === signForm.passwordCheck) {
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
    if (signForm.password === signForm.passwordCheck) {
      document.getElementById('passwordCheckInputItem').classList.remove("error");
      document.getElementById('passwordCheckInputItem').classList.add("success");
      passwordCheckRef.current.innerHTML = "";
      setCheckPasswordValue({check:true, message: "비밀번호 설정 완료"})
    } else if(signForm.password !== signForm.passwordCheck) {
      document.getElementById('passwordCheckInputItem').classList.add("error");
      document.getElementById('passwordCheckInputItem').classList.remove("success");
      passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
      setCheckPasswordValue({check:false, message: "비밀번호를 다시 확인해주세요."})
    }
  }

  //다음
  const nextStep = () => {
    if (checkPasswordValue.check) {
      console.log("api call member join", signForm);
      sighUp();
    } else if(signForm.password !== signForm.passwordCheck) {
      document.getElementById('passwordCheckInputItem').classList.add("error");
      document.getElementById('passwordCheckInputItem').classList.remove("success");
      passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
    }else{
      if (signForm.password === "") {
        document.getElementById('passwordInputItem').classList.add("error");
        document.getElementById('passwordInputItem').classList.remove("success");
        passwordRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
      } else if (signForm.passwordCheck === "") {
        document.getElementById('passwordCheckInputItem').classList.add("error");
        document.getElementById('passwordCheckInputItem').classList.remove("success");
        passwordCheckRef.current.innerHTML = "비밀번호를 다시 확인해주세요.";
      }
    }
  }

  return (

    <section className='signField'>
      <div className='title'>
        <h2>비밀번호를 설정해주세요</h2>
      </div>

      <div className='inputWrap'>
        <div className={`inputItems`} id={'passwordInputItem'}>
          <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
            <input type="password" name="password" value={signForm.password} onChange={onChange}
                   placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상" autoComplete="off" maxLength={20}/>
          </div>
          <p className='textLog' ref={passwordRef}/>
        </div>
      </div>

      <div className='inputWrap'>
        <div className={`inputItems`} id={'passwordCheckInputItem'}>
          <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
            <input type="password" name="passwordCheck" value={signForm.passwordCheck} onChange={onChange}
                   placeholder="비밀번호 다시 입력" autoComplete="off" maxLength={20}/>
          </div>
          <p className='textLog' ref={passwordCheckRef}/>
        </div>
      </div>

      <button type={"button"} className={`submitBtn`} onClick={nextStep}>완료</button>
    </section>

  );
};

export default PasswordSetting;