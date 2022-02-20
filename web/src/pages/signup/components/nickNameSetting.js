import React, {useRef, useEffect, useState} from 'react';
import Api from "context/api";
import useDidMountEffect from "common/hook/useDidMountEffect";

const NickNameSetting = (props) => {

  let {signForm, setStep, onChange} = props;
  const nicknameCheckRef = useRef(null);
  const [checkNickNameValue, setCheckNickNameValue] = useState({
    check:false,
    message:"닉네임을 2자이상 입력해주세요."
  });

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.add('focus')
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.remove('focus')
  }

  useDidMountEffect(()=>{
    checkNickName();
  },[signForm.nickName]);

  const checkNickName = () =>{
    Api.nickName_check({params: {nickNm: signForm.nickName}}).then(res=>{
      console.log(res);
      if (res.result === 'success' && res.code === '1') {
        document.getElementById('nickNameInputItem').classList.add("success");
        document.getElementById('nickNameInputItem').classList.remove("error");
        nicknameCheckRef.current.innerHTML = res.message;
        setCheckNickNameValue({check: true, message: res.message});
      } else if (res.result === 'fail') {
        if (res.code === '0') {
          document.getElementById('nickNameInputItem').classList.add("error");
          document.getElementById('nickNameInputItem').classList.remove("success");
          nicknameCheckRef.current.innerHTML = res.message;
          setCheckNickNameValue({check: false, message: res.message});
        }else{
          //fixme 문구수정
          document.getElementById('nickNameInputItem').classList.add("error");
          document.getElementById('nickNameInputItem').classList.remove("success");
          nicknameCheckRef.current.innerHTML = res.message;
          setCheckNickNameValue({check: false, message: res.message});
        }
      }
    });
  }


  //다음
  const nextStep = () => {
    if(checkNickNameValue.check) {
      setStep(3);
    }else{
      document.getElementById('nickNameInputItem').classList.add("error");
      document.getElementById('nickNameInputItem').classList.remove("success");
      nicknameCheckRef.current.innerHTML = checkNickNameValue.message;
    }
  }

  return (
    <section className='signField'>
      <div className='title'>
        <h2>닉네임을 설정해주세요</h2>
        <h3>닉네임은 언제든지 변경할 수 있어요!</h3>
      </div>
      <div className='inputWrap'>
        <div className={`inputItems`} id={'nickNameInputItem'}>
          <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
            <input type="text" name={"nickName"} value={signForm.nickName} onChange={onChange}
                   placeholder="최대 20자까지 입력" autoComplete="off" maxLength={20}/>
          </div>
          <p className='textLog' ref={nicknameCheckRef} />
        </div>
      </div>
      <button type={"button"} className={`submitBtn ${checkNickNameValue.check ? "" : "disabled"}`} onClick={nextStep}>다음</button>
    </section>
  );
};

export default NickNameSetting;