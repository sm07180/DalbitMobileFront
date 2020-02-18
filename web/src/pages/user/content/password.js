/**
 * @file /user/content/password.js
 * @brief 비밀번호 변경
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Api from 'context/api'

//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//layout
import Layout from 'pages/common/layout'

const User = props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [changes, setChanges] = useState({
    loginID: '',
    loginPwd: '',
    loginPwdCheck: ''
  })
  const [validate, setValidate] = useState({
    // 유효성 체크
    loginID: false,
    loginPwd: false,
    loginPwdCheck: false
  })
  const [validatePass, setValidatePass] = useState(false) // 유효성 모두 통과 여부. 회원가입 버튼 활성시 쓰임
  const [currentPwd, setCurrentPwd] = useState() // 비밀번호 도움 텍스트 값. html에 뿌려줄 state
  const [currentPwdCheck, setCurrentPwdCheck] = useState() // 비밀번호 확인 도움 텍스트 값.

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
        if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
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
    let loginIdVal = idEntered.replace(/[^0-9]/gi, '')
    setChanges({
      ...changes,
      loginID: loginIdVal
    })
    if (loginIdVal.length > 10) {
      setValidate({
        ...validate,
        loginID: true
      })
    }
  }

  //유효성 전부 체크되었을 때 회원가입 완료 버튼 활성화 시키기
  useEffect(() => {
    if (validate.loginID && validate.loginPwd && validate.loginPwdCheck) {
      setValidatePass(true)
    } else {
      setValidatePass(false)
    }
    //console.log(JSON.stringify(validate, null, 1))
  }, [validate])

  //useEffect
  useEffect(() => {
    console.log(JSON.stringify(changes, null, 1))
  }, [changes])

  //---------------------------------------------------------------------
  //fetchData
  async function fetchData() {
    console.log('버튼 클릭 후 props= ' + JSON.stringify(changes))
    const res = await Api.password_modify({
      data: {
        memId: changes.loginID,
        memPwd: changes.loginPwd
      }
    })
    console.log('REST 결과값 = ' + JSON.stringify(res))
    if (res && res.code) {
      if (res.result == 'success') {
        //성공
        alert(res.message)
        props.history.push('/')
      } else {
        //실패
        alert(res.message)
      }
    } //(res && res.code)
  }

  //---------------------------------------------------------------------
  return (
    <Content>
      <Title>비밀번호 변경</Title>
      <FormWrap>
        <PhoneAuth>
          <input type="tel" name="loginID" value={changes.loginID} onChange={onLoginHandleChange} placeholder="휴대폰 번호" className="auth" maxLength="11" />
          <button disabled={!validate.loginID}>인증요청</button>
        </PhoneAuth>
        <PhoneAuth>
          <input type="number" placeholder="인증번호" className="auth" />
          <button disabled={true}>인증확인</button>
        </PhoneAuth>
        <InputWrap>
          <input type="password" name="loginPwd" value={changes.loginPwd} onChange={onLoginHandleChange} placeholder="신규 비밀번호" />
          <span className={validate.loginPwd ? 'off' : 'on'}>8~20자 영문/숫자/특수문자</span>
          {currentPwd && (
            <HelpText state={validate.loginPwd} className={validate.loginPwd ? 'pass' : 'help'}>
              {currentPwd}
            </HelpText>
          )}
          <input type="password" name="loginPwdCheck" defaultValue={changes.loginPwdCheck} onChange={onLoginHandleChange} placeholder="비밀번호 확인" />
          {currentPwdCheck && (
            <HelpText state={validate.loginPwdCheck} className={validate.loginPwdCheck ? 'pass' : 'help'}>
              {currentPwdCheck}
            </HelpText>
          )}
        </InputWrap>
        <Button onClick={() => fetchData()} disabled={!validatePass}>
          확인
        </Button>
      </FormWrap>
    </Content>
  )
}
export default User

const Content = styled.div`
  width: 400px;
  margin: 30px auto 100px auto;

  @media (max-width: ${WIDTH_TABLET}) {
    width: 90%;
  }
`
//---------------------------------------------------------------------
//styled
const Title = styled.h2`
  padding: 20px 0;
  color: ${COLOR_MAIN};
  font-size: 28px;
  text-align: center;
`

//핸드폰 인증 영역
const PhoneAuth = styled.div`
  overflow: hidden;
  button {
    float: left;
    width: 28%;
    background: ${COLOR_MAIN};
    color: #fff;
    font-weight: 600;
    line-height: 50px;
  }
  button:disabled {
    background: #a8a8a8;
  }
  & + & {
    margin-top: 20px;
  }
`
const FormWrap = styled.div`
  margin: 40px 0;
`
const Label = styled.div``

const ValidateText = styled.p`
  margin: 5px 0;
  color: #909090;
  font-size: 12px;
  line-height: 1.5;
  & + input {
    margin-top: 15px;
  }
`

const Button = styled.button`
  width: 100%;
  margin-top: 30px;
  background: ${COLOR_MAIN};
  color: #fff;
  line-height: 50px;

  &:disabled {
    background: #a8a8a8;
  }
`
const InputWrap = styled.div`
  position: relative;
  margin: 32px 0;
  input {
    position: relative;
    margin-top: -1px;
  }
  input + span {
    position: absolute;
    top: 19px;
    right: 12px;
    color: #bdbdbd;
    font-size: 12px;
    transform: skew(-0.03deg);

    &.off {
      display: none;
    }
  }
`
//helptext
const HelpText = styled.div`
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  background: #f8f8f8;
  text-align: center;
  transform: skew(-0.03deg);
  &.help {
    color: #ec455f;
  }
  &.pass {
    color: ${COLOR_MAIN};
  }
`
