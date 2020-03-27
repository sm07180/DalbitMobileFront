/**
 * @file /user/content/password.js
 * @brief 비밀번호 변경
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Api from 'context/api'

//context
import Utility from 'components/lib/utility'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

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
    let timer = `${Utility.leadingZeros(Math.floor(setTime / 60), 2)}:${Utility.leadingZeros(setTime % 60, 2)}`
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
    //let loginIdVal = idEntered.replace(/[^0-9]/gi, '')
    let rgEx = /(01[0123456789])[-](\d{4}|\d{3})[-]\d{4}$/g
    const loginIdVal = Utility.phoneAddHypen(idEntered)
    setChanges({
      ...changes,
      loginID: loginIdVal
    })
    if (!(loginIdVal == undefined)) {
      if (loginIdVal.length >= 13) {
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
    if (validate.loginID && validate.loginPwd && validate.loginPwdCheck && validate.auth) {
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
            props.history.push('/')
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
      setChanges({...changes, CMID: resAuth.data.CMID})

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
      setValidate({...validate, auth: true})
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

  //---------------------------------------------------------------------
  return (
    <Content>
      <Title>비밀번호 변경</Title>
      <FormWrap>
        <PhoneAuth>
          <input
            type="tel"
            name="loginID"
            value={changes.loginID}
            onChange={onLoginHandleChange}
            placeholder="휴대폰 번호"
            className="auth"
            maxLength="13"
          />
          <button
            className="auth-btn1"
            disabled={currentAuthBtn.request}
            onClick={() => {
              fetchAuth()
            }}>
            인증요청
          </button>
        </PhoneAuth>
        {currentAuth1 && (
          <HelpText state={validate.loginID} className={validate.loginID ? 'pass' : 'help'}>
            {currentAuth1}
          </HelpText>
        )}
        <PhoneAuth>
          <input
            type="number"
            name="auth"
            placeholder="인증번호"
            className="auth"
            value={changes.auth}
            onChange={onLoginHandleChange}
          />
          <span className="timer"></span>
          <button
            className="auth-btn2"
            disabled={currentAuthBtn.check}
            onClick={() => {
              fetchAuthCheck()
            }}>
            인증확인
          </button>
        </PhoneAuth>
        {currentAuth2 && (
          <HelpText state={validate.auth} className={validate.auth ? 'pass' : 'help'}>
            {currentAuth2}
          </HelpText>
        )}
        <InputWrap>
          <input
            type="password"
            name="loginPwd"
            value={changes.loginPwd}
            onChange={onLoginHandleChange}
            placeholder="신규 비밀번호"
            maxLength="20"
          />
          <span className={validate.loginPwd ? 'off' : 'on'}>8~20자 영문/숫자/특수문자 중 2가지 이상 조합</span>
          {currentPwd && (
            <HelpText state={validate.loginPwd} className={validate.loginPwd ? 'pass' : 'help'}>
              {currentPwd}
            </HelpText>
          )}
          <input
            type="password"
            name="loginPwdCheck"
            defaultValue={changes.loginPwdCheck}
            onChange={onLoginHandleChange}
            placeholder="비밀번호 확인"
            maxLength="20"
          />
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

const Content = styled.div`
  width: 400px;
  margin: 30px auto 100px auto;

  @media (max-width: ${WIDTH_TABLET}) {
    width: 100%;
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
  .timer {
    display: block;
    position: absolute;
    right: 31%;
    color: ${COLOR_MAIN};
    font-size: 14px;
    line-height: 50px;
    z-index: 3;
    transform: skew(-0.03deg);
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
