/**
 * @file /user/content/password.js
 * @brief 비밀번호 변경
 */
import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import Api from 'context/api'

import PureLayout from 'pages/common/layout/new_layout'

//context
import Utility from 'components/lib/utility'
import { Context } from 'context'
import { COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P } from 'context/color'
import {
  IMG_SERVER,
  WIDTH_PC,
  WIDTH_PC_S,
  WIDTH_TABLET,
  WIDTH_TABLET_S,
  WIDTH_MOBILE,
  WIDTH_MOBILE_S
} from 'context/config'

let inervalId = null
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [changes, setChanges] = useState({
    loginID: '',
    loginPwd: '',
    loginPwdCheck: '',
    auth: '',
    CMID: ''
  })
  const [validate, setValidate] = useState({
    // 유효성 체크
    loginID: false,
    loginPwd: false,
    loginPwdCheck: false,
    auth: false
  })
  const [validatePass, setValidatePass] = useState(false) // 유효성 모두 통과 여부. 회원가입 버튼 활성시 쓰임
  const [currentPwd, setCurrentPwd] = useState() // 비밀번호 도움 텍스트 값. html에 뿌려줄 state
  const [currentPwdCheck, setCurrentPwdCheck] = useState() // 비밀번호 확인 도움 텍스트 값.
  const [currentAuth1, setCurrentAuth1] = useState() // 휴대폰인증1 텍스트값
  const [currentAuth2, setCurrentAuth2] = useState() // 휴대폰인증2 텍스트값
  const [currentAuthBtn, setCurrentAuthBtn] = useState({
    request: true, //버튼 disable true
    check: true
  }) // 인증확인 버튼
  const [thisTimer, setThisTimer] = useState()
  let setTime = 300

  const createAuthTimer = () => {
    let timer = `${Utility.leadingZeros(
      Math.floor(setTime / 60),
      2
    )}:${Utility.leadingZeros(setTime % 60, 2)}`
    document.getElementsByClassName('timer')[0].innerHTML = timer
    setTime--
    if (setTime < 0) {
      clearInterval(inervalId)
      setCurrentAuthBtn({
        request: true,
        check: true
      })
      document.getElementsByName('auth')[0].disabled = true
      setCurrentAuth2('인증시간이 초과되었습니다.')
    }
  }

  //회원가입 input onChange
  const onLoginHandleChange = e => {
    if (e.target.name == 'loginPwd' || e.target.name == 'loginPwdCheck') {
      e.target.value = e.target.value.toLowerCase()
    }
    setChanges({
      ...changes,
      [e.target.name]: e.target.value
    })
    //유효성검사
    if (e.target.name == 'loginPwd') {
      validatePwd(e.target.value)
    } else if (e.target.name == 'loginID') {
      validateID(e.target.value)
    } else if (e.target.name == 'auth') {
      if (e.target.value.length == 6) {
        if (changes.CMID) {
          setCurrentAuthBtn({
            request: currentAuthBtn.request,
            check: false
          })
        }
        e.target.blur()
      } else if (e.target.value.length > 6) {
        setChanges({
          ...changes,
          [e.target.name]: e.target.value.slice(0, -1)
        })
      }
    }
  }

  const validatePwd = pwdEntered => {
    //비밀번호 유효성 체크 로직 (숫자,영문,특수문자 중 2가지 이상 조합, 공백 체크)
    let pw = pwdEntered
    let blank_pattern = pw.search(/[\s]/g)
    let num = pw.search(/[0-9]/g)
    let eng = pw.search(/[a-zA-Z]/gi)
    let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

    if (blank_pattern != -1) {
      var pw2 = pw.substring(0, pw.length - 1)
      setChanges({
        ...changes,
        loginPwd: pw2
      })
    }
    if (pw.length == 0) {
      setValidate({
        ...validate,
        loginPwd: false
      })
      setCurrentPwd('')
    } else {
      if (pw.length > 7 && pw.length < 21) {
        //영문,숫자,특수문자 중 2가지 이상을 혼합 체크 로직
        if (
          (num < 0 && eng < 0) ||
          (eng < 0 && spe < 0) ||
          (spe < 0 && num < 0)
        ) {
          setValidate({
            ...validate,
            loginPwd: false
          })
          setCurrentPwd('2가지 이상 조합으로 입력하세요.')
        } else {
          setValidate({
            ...validate,
            loginPwd: true
          })
          setCurrentPwd('사용 가능한 비밀번호 입니다.')
        }
      } else if (pw.length > 20) {
        setValidate({
          ...validate,
          loginPwd: false
        })
        setCurrentPwd('최대 20자 까지 입력하세요.')
      } else {
        setValidate({
          ...validate,
          loginPwd: false
        })
        setCurrentPwd('최소 8자 이상 입력하세요.')
      }
    }
  }

  //비밀번호 입력때마다 일치 체크
  useEffect(() => {
    if (changes.loginPwdCheck.length == 0) {
      setCurrentPwdCheck('')
      setValidate({
        ...validate,
        loginPwdCheck: false
      })
    } else {
      if (changes.loginPwd == changes.loginPwdCheck) {
        setCurrentPwdCheck('비밀번호가 일치합니다.')
        setValidate({
          ...validate,
          loginPwdCheck: true
        })
      } else {
        setCurrentPwdCheck('비밀번호가 일치하지 않습니다.')
        setValidate({
          ...validate,
          loginPwdCheck: false
        })
      }
    }
  }, [changes.loginPwdCheck, changes.loginPwd])

  const validateID = idEntered => {
    //휴대폰 번호 유효성 검사 오직 숫자만 가능
    //let loginIdVal = idEntered.replace(/[^0-9]/gi, '')
    let rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    const loginIdVal = idEntered
    setChanges({
      ...changes,
      loginID: loginIdVal
    })
    if (!(loginIdVal == undefined)) {
      if (loginIdVal.length >= 11) {
        // setValidate({
        //   ...validate,
        //   loginID: true
        // })
        if (!rgEx.test(loginIdVal)) {
          setCurrentAuth1('올바른 휴대폰 번호가 아닙니다.')
          setCurrentAuthBtn({
            request: true,
            check: true
          })
        } else {
          setCurrentAuthBtn({
            request: false,
            check: true
          })
        }
      } else if (loginIdVal.length < 12) {
        setValidate({
          ...validate,
          loginID: false
        })
        setCurrentAuthBtn({
          request: true,
          check: true
        })
        setCurrentAuth1('')
        document.getElementsByClassName('auth-btn1')[0].innerText = '인증요청'
        clearInterval(inervalId)
        document.getElementsByClassName('timer')[0].innerHTML = ''
      }
    }
  }

  //유효성 전부 체크되었을 때 회원가입 완료 버튼 활성화 시키기
  useEffect(() => {
    if (
      validate.loginID &&
      validate.loginPwd &&
      validate.loginPwdCheck &&
      validate.auth
    ) {
      setValidatePass(true)
    } else {
      setValidatePass(false)
    }
  }, [validate])

  //---------------------------------------------------------------------
  //fetchData
  async function fetchData() {
    const loginID = changes.loginID.replace(/-/g, '')
    const res = await Api.password_modify({
      data: {
        memId: loginID,
        memPwd: changes.loginPwd
      }
    })

    if (res && res.code) {
      if (res.result == 'success') {
        //성공
        context.action.alert({
          callback: () => {
            window.location.href = '/'
          },
          msg: '비밀번호 변경(을) 성공하였습니다.'
        })
      } else {
        //실패
        context.action.alert({
          msg: res.message
        })
      }
    } //(res && res.code)
  }

  async function fetchAuth() {
    const resAuth = await Api.sms_request({
      data: {
        phoneNo: changes.loginID,
        authType: 1
      }
    })
    if (resAuth.result === 'success') {
      setValidate({
        ...validate,
        loginID: true,
        auth: false
      })
      setChanges({ ...changes, CMID: resAuth.data.CMID })

      setCurrentAuth1('인증번호 요청이 완료되었습니다.')
      document.getElementsByName('loginID')[0].disabled = true
      setCurrentAuth2('')

      setCurrentAuthBtn({
        request: true,
        check: true
      })

      inervalId = setInterval(createAuthTimer, 1000)
      setTime = 300
    } else {
      setCurrentAuth1(resAuth.message)
    }
  }

  async function fetchAuthCheck() {
    const resCheck = await Api.sms_check({
      data: {
        CMID: changes.CMID,
        code: Number(changes.auth)
      }
    })
    if (resCheck.result === 'success') {
      setValidate({ ...validate, auth: true })
      setCurrentAuth2(resCheck.message)
      clearInterval(inervalId)
      document.getElementsByClassName('timer')[0].innerHTML = ''
      document.getElementsByName('auth')[0].disabled = true
      setCurrentAuthBtn({
        request: true,
        check: true
      })
    } else {
      setCurrentAuth2('인증번호(가) 일치하지 않습니다.')
    }
  }

  const inputFocus = e => {
    // console.log(e.currentTarget)
  }

  //---------------------------------------------------------------------
  return (
    <PureLayout status={'no_gnb'} header="비밀번호 변경">
      <Content>
        <FormWrap>
          <div className={`input-wrap ${currentAuth1 && 'text-on'}`}>
            <PhoneAuth>
              <div className="box">
                <label
                  className="input-label"
                  htmlFor="loginID"
                  style={{ maginTop: '0px' }}
                >
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  name="loginID"
                  id="loginID"
                  value={changes.loginID}
                  onChange={onLoginHandleChange}
                  placeholder="휴대폰 번호를 입력해주세요"
                  className="auth"
                  maxLength="11"
                  onFocus={inputFocus}
                />
                <button
                  className="auth-btn1"
                  disabled={currentAuthBtn.request}
                  onClick={() => {
                    fetchAuth()
                  }}
                >
                  인증요청
                </button>
              </div>
            </PhoneAuth>
            {currentAuth1 && (
              <HelpText
                state={validate.loginID}
                className={validate.loginID ? 'pass' : 'help'}
              >
                {currentAuth1}
              </HelpText>
            )}
          </div>

          <div className={`input-wrap ${currentAuth2 && 'text-on'}`}>
            <PhoneAuth>
              <div className="box">
                <label className="input-label" htmlFor="auth">
                  인증번호
                </label>
                <input
                  type="number"
                  name="auth"
                  id="auth"
                  placeholder="인증번호를 입력해주세요"
                  className="auth"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  inputMode="decimal"
                  pattern="\d*"
                  value={changes.auth}
                  onChange={onLoginHandleChange}
                />
                <span className="timer"></span>
                <button
                  className="auth-btn2"
                  disabled={currentAuthBtn.check}
                  onClick={() => {
                    fetchAuthCheck()
                  }}
                >
                  인증확인
                </button>
              </div>
            </PhoneAuth>
            {currentAuth2 && (
              <HelpText
                state={validate.auth}
                className={validate.auth ? 'pass' : 'help'}
              >
                {currentAuth2}
              </HelpText>
            )}
          </div>

          <InputWrap>
            <div className={`input-wrap ${currentPwd && 'text-on'}`}>
              <div className="box">
                <label className="input-label" htmlFor="loginPwd">
                  비밀번호
                </label>
                <input
                  type="password"
                  name="loginPwd"
                  id="loginPwd"
                  value={changes.loginPwd}
                  onChange={onLoginHandleChange}
                  placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상 조합"
                  maxLength="20"
                />
              </div>
              {/* <span className={validate.loginPwd ? 'off' : 'on'}>8~20자 영문/숫자/특수문자 중 2가지 이상 조합</span> */}
              {currentPwd && (
                <HelpText
                  state={validate.loginPwd}
                  className={validate.loginPwd ? 'pass' : 'help'}
                >
                  {currentPwd}
                </HelpText>
              )}
            </div>

            <div className={`input-wrap ${currentPwdCheck && 'text-on'}`}>
              <div className="box">
                <label className="input-label" htmlFor="loginPwdCheck">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  name="loginPwdCheck"
                  id="loginPwdCheck"
                  defaultValue={changes.loginPwdCheck}
                  onChange={onLoginHandleChange}
                  placeholder="비밀번호를 다시 확인해주세요"
                  maxLength="20"
                />
              </div>

              {currentPwdCheck && (
                <HelpText
                  state={validate.loginPwdCheck}
                  className={validate.loginPwdCheck ? 'pass' : 'help'}
                >
                  {currentPwdCheck}
                </HelpText>
              )}
            </div>
          </InputWrap>
          <Button onClick={() => fetchData()} disabled={!validatePass}>
            확인
          </Button>
        </FormWrap>
      </Content>
    </PureLayout>
  )
}

const Content = styled.div`
  width: 400px;
  margin: 0 auto 100px auto;

  .close-btn {
    position: absolute;
    top: 6px;
    left: -2.8%;
  }

  @media (max-width: ${WIDTH_TABLET}) {
    width: 100%;
  }

  .input-label {
    display: block;
    width: 100%;
    color: #424242;
    font-size: 14px;
    line-height: 16px;
    margin-top: 6px;
    margin-bottom: 8px;
    font-weight: bold;

    &.require:after {
      display: inline-block;
      width: 16px;
      height: 16px;
      font-weight: bold;
      background: url(${IMG_SERVER}/images/api/icn_asterisk.svg) no-repeat
        center;
      content: '';
      vertical-align: bottom;
    }

    span {
      font-size: 12px;
    }
  }
`
//---------------------------------------------------------------------
//styled
const Title = styled.h2`
  margin-top: -20px;
  padding: 0 0 0 20px 0;
  color: ${COLOR_MAIN};
  font-size: 28px;
  text-align: center;
`

//핸드폰 인증 영역
const PhoneAuth = styled.div`
  overflow: hidden;
  button {
    position: absolute;
    right: 4px;
    top: 24px;
    width: 70px;
    height: 32px;
    background: ${COLOR_MAIN};
    font-size: 14px;
    color: #fff;
    font-weight: 400;
    line-height: 32px;
    border-radius: 9px !important;
  }
  button:disabled {
    background: #bdbdbd;
  }
  & + & {
    margin-top: 10px;
  }
  .timer {
    display: block;
    position: absolute;
    top: 23px;
    right: 86px;
    color: #ec455f;
    font-size: 14px;
    line-height: 32px;
    z-index: 3;
    transform: skew(-0.03deg);
  }
  input {
    border-radius: 4px 0 0 4px !important;
  }
`
const FormWrap = styled.div`
  padding: 12px 16px;

  .input-wrap {
    position: relative;
    &.text-on {
      margin-bottom: 34px;
    }
    .box {
      position: relative;
      padding: 10px 4px 4px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      background: #fff;
      z-index: 1;

      label {
        margin: 0;
        font-size: 12px;
        line-height: 14px;
        font-weight: 400;
      }

      input {
        width: 100%;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
      }
      input::placeholder {
        color: #9e9e9e;
      }
    }
  }
  .input-wrap + .input-wrap {
    margin-top: 4px;
  }
`

const Button = styled.button`
  display: block;
  width: 100%;
  background: ${COLOR_MAIN};
  color: #fff;
  line-height: 44px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 12px;

  &:disabled {
    background: #a8a8a8;
  }
`
const InputWrap = styled.div`
  position: relative;
  margin: 12px 0 0 0;
  padding-bottom: 32px;
  input {
    position: relative;
    margin-top: -1px;
  }
  input + span {
    position: absolute;
    top: 19px;
    right: 10px;
    color: #bdbdbd;
    font-size: 12px;
    letter-spacing: -0.5px;
    transform: skew(-0.03deg);

    &.off {
      display: none;
    }
  }
`
//helptext
const HelpText = styled.div`
  display: block;
  position: absolute;
  left: 0;
  top: 38px;
  width: 100%;
  padding: 30px 5px 7px 5px;
  background: #9e9e9e;
  text-align: center;
  font-size: 11px;
  line-height: 16px;
  color: #fff;
  transform: skew(-0.03deg);
  border-radius: 12px;
  &.help {
    color: #fff;
  }
  &.pass {
    color: #fff;
  }
`
