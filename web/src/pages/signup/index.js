import React, {useState, useEffect, useContext, useReducer, useRef} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'
import Utility from 'components/lib/utility'
import {PHOTO_SERVER} from 'context/config'
import {Hybrid, isHybrid, isAndroid} from 'context/hybrid'

// global components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/InputItems'
// components
import SignField from './components/signField'
// contents
// css
import './style.scss'

const SignUpPage = () => {
  const context = useContext(Context)
  const [step, setStep] = useState(1);

  const [signForm, setSignForm] = useState({
    phoneNum:"01083490706",
    requestNum:"",
    nickName:"",
    password:"",
    passwordCheck:""
  })
  const phoneNumRef = useRef(null)
  const requestNumRef = useRef(null)


  const smsRequest = (e) => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    const prevElement = e.target.parentNode;

    if (!rgEx.test(signForm.phoneNum)) {
      prevElement.classList.add('error')
      e.target.nextSibling.innerHTML = '휴대폰 번호 형식에 맞게 입력해 주세요.'
    }else{
      prevElement.classList.add('success')
      sendSms().then()
    }
  }

  const sendSms = async () => {

    const {result, data, message, code} = await Api.sms_request({
      data: {phoneNo: signForm.phoneNum, authType: 0}
    })
    console.log(result, data, message, code);
    if (result === 'success') {
      phoneNumRef.current.disabled = true
      requestNumRef.current.disabled = false
      console.log("success")
    } else {
      context.action.alert({msg: message})
    }
  }
  const nextStep = () => {
    console.log(signForm);
    step < 4 ? setStep(step +1) : setStep(1)
  }

  const onChange = (e) => {
    const { value, name } = e.target;
    setSignForm({
      ...signForm,
      [name]: value
    });
  };

  //닉네임 체크
  const validateNickname = (e) => {

    if (signForm.nickName.length < 2 || signForm.nickName.length > 20) {
      const prevElement = e.target.sibling;
      prevElement.classList.add('error')

      console.log(prevElement);
      e.target.nextSibling.innerHTML = '휴대폰 번호 형식에 맞게 입력해 주세요.'

      // return setValidate({name: 'nickNm', check: false, text: '닉네임은 2~20자 이내로 입력해주세요.'})
    } else {
      const {result, code} = Api.nickName_check({params: {nickNm: signForm.nickName}})
      if (result === 'success' && code === '1') {
        // return setValidate({name: 'nickNm', check: true})
      } else if (result === 'fail') {
        if (code === '0') {
          // return setValidate({name: 'nickNm', check: false, text: '닉네임 중복입니다.'})
        } else {
          // return setValidate({name: 'nickNm', check: false, text: '사용 불가능한 닉네임 입니다.'})
        }
      }
    }
  }

  return (
    <div id='signPage'>
      <Header type="back" />
      {step === 1 &&
        <SignField title="번호를 입력해주세요." onClick={nextStep}>
          <InputItems button="인증요청" onClick={smsRequest} logYn={"y"}>
            <input type="tel" name={"phoneNum"} value={signForm.phoneNum} onChange={onChange} placeholder="휴대폰 번호" maxLength={11} autoComplete="off" ref={phoneNumRef}/>
          </InputItems>
          <InputItems>
            <input type="number" name={"requestNum"} value={signForm.requestNum} onChange={onChange} placeholder="인증 번호 6자리" autoComplete="off" ref={requestNumRef} disabled={true} />
          </InputItems>
        </SignField>
      }
      {step === 2 &&
        <SignField title="닉네임을 설정해주세요." onClick={validateNickname}>
          <InputItems logYn={"y"}>
            <input type="text" name={"nickName"} value={signForm.nickName} onChange={onChange} placeholder="2~20자 한글/영문/숫자" autoComplete="off" maxLength={20}/>
          </InputItems>
        </SignField>
      }
      {step === 3 &&
        <SignField title="비밀번호를 설정해주세요." subTitle="닉네임은 언제든지 변경할 수 있어요!" onClick={nextStep}>
          <InputItems>
            <input type="password" name="password" value={signForm.password} onChange={onChange} placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상" autoComplete="off" maxLength={20}/>
          </InputItems>
          <InputItems>
            <input type="password" name="passwordCheck" value={signForm.passwordCheck}  onChange={onChange} placeholder="비밀번호 다시 입력" autoComplete="off" maxLength={20}/>
          </InputItems>
        </SignField>
      }
      {step === 4 &&
        <SignField title={`소셜 로그인 정보를\n입력해주세요.`} onClick={nextStep}>
          <div className="profileUpload">
            <label for="profileImg">
              <div></div>
              <span>클릭 이미지 파일 추가</span>
            </label>
            <input type="file" id="profileImg" accept="image/jpg, image/jpeg, image/png"/>
          </div>
          <InputItems>
              <input type="text" id="nickNm" name="nickNm" placeholder="소셜닉네임" autoComplete="off" maxLength={20}/>
          </InputItems>
        </SignField>
      }
    </div>
  )
}

export default SignUpPage