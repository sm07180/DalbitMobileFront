import React, {useState, useEffect} from 'react'

//components
import Header from 'components/ui/header/Header'
import InputItems from '../../components/ui/inputItems/InputItems';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import './style.scss'


const PasswordChange = () => {
  const [btnActive, setBtnActive] = useState("")
  const [phoneNumVal, setPhoneNumVal] = useState("")
  const [pinNumVal, setPinNumVal] = useState("")
  const [passwordVal, setPasswordVal] = useState("")
  const [checkingVal, setCheckingVal] = useState("")

  const phoneNumChange = (e) => {
    setPhoneNumVal(e.target.value);
    var text = e.target.value;
    var regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (regPhone.test(text) === true) {
      setBtnActive("active")
    }
  }

  const pinNumChange = (e) => {
    setPinNumVal(e.target.value);
  }

  const passwordChange = (e) => {
    setPasswordVal(e.target.value);
  }

  const checkingChange = (e) => {
    setCheckingVal(e.target.value);
  }

  useEffect(() => {
    if(phoneNumVal && pinNumVal && passwordVal && checkingVal) {
      setBtnActive(true)
    }
  }, [phoneNumVal, pinNumVal, passwordVal, checkingVal])
  
  return (
    <div id='passwordSetting'>
      <Header position={'sticky'} title={'비밀번호 변경'} type={'back'}/>
      <div className='content'>
        <form>
          <div className='sectionWrap'>
            <div className='section'>
              <InputItems button="인증요청" title={"휴대폰 번호"} btnClass={btnActive}>
                <input
                  type="tel"
                  id="memId"
                  name="memId"
                  placeholder="번호를 입력해주세요."
                  maxLength={11}
                  autoComplete="off"
                  onChange={phoneNumChange}
                />
              </InputItems>
            </div>
            <div className='section'>
              <InputItems button="확인" title={"인증번호"}>
                <input
                  type="tel"
                  id="pinNum"
                  name="pinNum"
                  placeholder="인증번호를 입력해주세요."
                  maxLength={6}
                  autoComplete="off"
                  onChange={pinNumChange}
                />
              </InputItems>
            </div>
            <div className='section'>
              <InputItems title={"비밀번호"}>
                <input
                  type="tel"
                  id="password"
                  name="password"
                  placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상 조합"
                  maxLength={20}
                  autoComplete="off"
                  onChange={passwordChange}
                />
              </InputItems>
            </div>
            <div className='section'>
              <InputItems title={"비밀번호 확인"}>
                <input
                  type="tel"
                  id="passwordCheck"
                  name="passwordCheck"
                  placeholder="비밀번호를 한번 더 입력해주세요."
                  maxLength={20}
                  autoComplete="off"
                  onChange={checkingChange}
                />
              </InputItems>
            </div>
          </div>
          
          <SubmitBtn state={!btnActive && 'disabled'} text="변경하기"/>
        </form>        
      </div>
    </div>    
  )
}

export default PasswordChange