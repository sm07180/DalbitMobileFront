import React, {useState, useEffect, useContext, useReducer, useRef} from 'react'
import styled from 'styled-components'

import {Context} from 'context'

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
  const [textLog, setTextLog] = useState('success')  // success, error
  const [step, setStep] = useState(1);

  const temp = (e) => {
    const prevElement = e.target.parentNode;
    if (textLog === 'error') {
      prevElement.classList.add('error')
      e.target.nextSibling.innerHTML = '휴대폰 번호 형식에 맞게 입력해 주세요.'
    }
    if (textLog === 'success') {
      prevElement.classList.add('success')
    }
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(1)
    }
  }

  return (
    <div id='signPage'>
      <Header type="back" />
      {step === 1 &&
        <SignField title="번호를 입력해주세요." onClick={nextStep}>
          <InputItems button="인증요청" onClick={temp}>
            <input
              type="tel"
              id="memId"
              name="memId"
              placeholder="휴대폰 번호"
              maxLength={11}
              autoComplete="off"
            />
          </InputItems>
          <InputItems>
            <input
              type="number"
              id="auth"
              name="auth"
              placeholder="인증 번호 4자리"
              autoComplete="off"
              disabled={true}
            />
          </InputItems>
        </SignField>
      }
      {step === 2 &&
        <SignField title="닉네임을 설정해주세요." onClick={nextStep}>
          <InputItems>
            <input
              type="text"
              id="nickNm"
              name="nickNm"
              placeholder="2~20자 한글/영문/숫자"
              autoComplete="off"
              maxLength={20}
            />
          </InputItems>
        </SignField>
      }
      {step === 3 &&
        <SignField title="비밀번호를 설정해주세요." subTitle="닉네임은 언제든지 변경할 수 있어요!" onClick={nextStep}>
          <InputItems>
            <input
              type="password"
              id="loginPwd"
              name="loginPwd"
              placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상"
              autoComplete="off"
              maxLength={20}
            />
          </InputItems>
          <InputItems>
            <input
              type="password"
              id="loginPwdCheck"
              name="loginPwdCheck"
              placeholder="비밀번호 다시 입력"
              autoComplete="off"
              maxLength={20}
            />
          </InputItems>
        </SignField>
      }
      {step === 4 &&
        <SignField title={`소셜 로그인 정보를\n입력해주세요.`} onClick={nextStep}>
          <div className="profileUpload">
            <label htmlFor="profileImg">
              <div></div>
              <span>클릭 이미지 파일 추가</span>
            </label>
            <input
              type="file"
              id="profileImg"
              accept="image/jpg, image/jpeg, image/png"
            />
          </div>
          <InputItems>
              <input
                type="text"
                id="nickNm"
                name="nickNm"
                placeholder="소셜닉네임"
                autoComplete="off"
                maxLength={20}
              />
          </InputItems>
        </SignField>
      }
    </div>
  )
}

const AgeGuidance = () => {
  return (
    <p className="birthText">
      * 달빛라이브는 만 14세 이상부터 이용 가능한 서비스입니다.
      <br />* 만 14세 미만일 경우 서비스 이용이 제한됩니다.
    </p>
  )
}

export default SignUpPage