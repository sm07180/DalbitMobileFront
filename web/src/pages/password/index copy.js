import React, {useEffect, useReducer, useRef, useState} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import qs from 'query-string'
import Utility from 'components/lib/utility'
import {COLOR_MAIN} from 'context/color'

//components
import SignField from './components/signField'

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let intervalId = null
let setTime = 300

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {webview, redirect} = qs.parse(location.search)

  const memIdRef = useRef(null)
  const authRef = useRef(null)

  const [timeText, setTimeText] = useState()
  const [btnState, setBtnState] = useState({
    memId: false,
    auth: false
  })

  function reducer(state, action) {
    let {name, value} = action

    //휴대폰번호
    if (name === 'memId' && value.length === 11) {
      setBtnState({
        ...btnState,
        memId: true
      })
    } else {
      setBtnState({
        ...btnState,
        memId: false
      })
    }

    //인증번호
    if (name === 'auth') {
      if (value.length === 6) {
        setBtnState({
          ...btnState,
          auth: true
        })
      } else if (value.length > 6) {
        return {...state}
      } else {
        setBtnState({
          ...btnState,
          auth: false
        })
      }
    }

    if (name === 'loginPwd' || name === 'loginPwdCheck') {
      value = value.toLowerCase()
    }

    return {
      ...state,
      [name]: value
    }
  }

  const [changes, dispatchWithoutAction] = useReducer(reducer, {
    memId: '',
    loginPwd: '',
    loginPwdCheck: '',
    auth: '',
    CMID: ''
  })

  function validateReducer(state, validate) {
    if (validate.name === 'loginPwdCheck') {
      if (validate.check && state.loginPwd.check) passwordFetch()
    }
    return {
      ...state,
      [validate.name]: {
        check: validate.check,
        text: validate.text === undefined ? '' : validate.text
      }
    }
  }

  const [validate, setValidate] = useReducer(validateReducer, {
    memId: {
      check: true,
      text: ''
    },
    auth: {
      check: true,
      text: ''
    },
    loginPwd: {
      check: true,
      text: ''
    },
    loginPwdCheck: {
      check: true,
      text: ''
    }
  })

  const {memId, loginPwd, loginPwdCheck, auth, CMID} = changes

  //------------------------------------------------------------------------------
  //휴대폰 본인인증
  const validateID = (target) => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    const memIdVal = target
    if (memIdVal !== undefined) {
      if (memIdVal.length >= 11) {
        if (!rgEx.test(memIdVal)) {
          setValidate({
            name: 'memId',
            check: false,
            text: '올바른 휴대폰 번호가 아닙니다.'
          })
          return false
        } else {
          setValidate({
            name: 'memId',
            check: true
          })
          return true
        }
      }
    }
  }
  const fetchSmsReq = async () => {
    if (!validateID(memId)) return null
    const {result, data, message} = await Api.sms_request({
      data: {
        phoneNo: memId,
        authType: 1
      }
    })
    if (result === 'success') {
      dispatchWithoutAction({name: 'CMID', value: data.CMID})
      setValidate({
        name: 'memId',
        check: true,
        text: '인증번호 요청이 완료되었습니다.'
      })
      memIdRef.current.disabled = true
      authRef.current.disabled = false
      startAuthTimer()
    } else {
      setValidate({name: 'memId', check: false, text: message})
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }
  const fetchSmsCheck = async () => {
    const {result, message} = await Api.sms_check({
      data: {
        CMID: CMID,
        code: Number(auth)
      }
    })
    if (result === 'success') {
      dispatchWithoutAction({name: 'CMID', value: true})
      setValidate({name: 'auth', check: true, text: message})
      setValidate({name: 'memId', check: true})
      clearInterval(intervalId)
      setTimeText('')
      authRef.current.disabled = true
      setBtnState({memId: false, auth: false})
    } else {
      setValidate({
        name: 'auth',
        check: false,
        text: '인증번호(가) 일치하지 않습니다.'
      })
    }
  }
  const startAuthTimer = () => {
    clearInterval(intervalId)
    setTime = 300
    intervalId = setInterval(() => {
      let timer = `${Utility.leadingZeros(Math.floor(setTime / 60), 2)}:${Utility.leadingZeros(setTime % 60, 2)}`
      setTimeText(timer)
      setTime--
      if (setTime < 0) {
        clearInterval(intervalId)
        setValidate({
          name: 'memId',
          check: false,
          text: '인증시간이 초과되었습니다.'
        })
        authRef.current.disabled = true
        setBtnState({memId: true, auth: true})
      }
    }, 1000)
  }

  //비밀번호
  const validatePwd = () => {
    const num = loginPwd.search(/[0-9]/g)
    const eng = loginPwd.search(/[a-zA-Z]/gi)
    const spe = loginPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)
    if (loginPwd.length < 8 || loginPwd.length > 20) {
      return setValidate({name: 'loginPwd', check: false, text: '비밀번호는 8~20자 이내로 입력해주세요.'})
    } else {
      if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
        return setValidate({
          name: 'loginPwd',
          check: false,
          text: '비밀번호는 영문/숫자/특수문자 중 2가지 이상 조합으로 입력해주세요.'
        })
      } else {
        return setValidate({name: 'loginPwd', check: true})
      }
    }
  }
  const validatePwdCheck = () => {
    if (loginPwd === loginPwdCheck) {
      return setValidate({name: 'loginPwdCheck', check: true})
    } else {
      return setValidate({name: 'loginPwdCheck', check: false, text: '비밀번호를 다시 확인해주세요.'})
    }
  }

  //비밀번호 변경 Data fetch
  async function passwordFetch() {
    const res = await Api.password_modify({
      data: {
        memId: changes.memId,
        memPwd: changes.loginPwd
      }
    })
    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        callback: () => {
          history.push('/')
        },
        msg: '비밀번호 변경(을) 성공하였습니다.'
      }))
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
    }
  }

  //회원가입 완료 버튼
  const passwordModify = () => {
    if (CMID !== true) {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '휴대폰 본인인증을 진행해주세요.'
      }))
    }
    validatePwd()
    validatePwdCheck()
  }
  useEffect(() => {
    const validateKey = Object.keys(validate)
    for (let index = 0; index < validateKey.length; index++) {
      if (validate[validateKey[index]].check === false) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: validate[validateKey[index]].text
        }))
        break
      }
    }
  }, [validate.loginPwdCheck])


  const phoneCertification = () => {
    setStep(step + 1);
  }

  return (
    <div id='passwordSetting'>

      <SignField title={"새로운 비밀번호를\n설정해주세요."} btnFunction={phoneCertification}>
        <InputItem button={false} validate={validate.loginPwd.check}>
          {validate.loginPwd.text && <p className="helpText">{validate.loginPwd.text}</p>}
          <div className="inputRow">
            <input
              type="password"
              id="loginPwd"
              className="inputfield"
              name="loginPwd"
              placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상"
              autoComplete="off"
              maxLength={20}
              value={loginPwd}
              onChange={(e) => dispatchWithoutAction(e.target)}
            />
          </div>
        </InputItem>
        <InputItem button={false} validate={validate.loginPwdCheck.check}>
          {validate.loginPwdCheck.text && <p className="helpText">{validate.loginPwdCheck.text}</p>}
          <div className="inputRow">
            <input
              type="password"
              id="loginPwdCheck"
              className="inputfield"
              name="loginPwdCheck"
              placeholder="비밀번호 다시 입력"
              autoComplete="off"
              maxLength={20}
              value={loginPwdCheck}
              onChange={(e) => dispatchWithoutAction(e.target)}
            />
          </div>
        </InputItem>
      </SignField>
    </div>
    // <Layout status="no_gnb" header="비밀번호 변경">
    //   <input type="password" style={{width: '0px', padding: '0px', position: 'absolute'}} />
    //   <input type="password" style={{width: '0px', padding: '0px', position: 'absolute'}} />
    //   <Content>
    //     {/* 휴대폰 본인인증 -------------------------------------------------------- */}
    //     <InputItem button={true} validate={validate.memId.check}>
    //       <div className="layer">
    //         <label htmlFor="memId">휴대폰 번호</label>
    //         <input
    //           type="tel"
    //           ref={memIdRef}
    //           id="memId"
    //           name="memId"
    //           placeholder="휴대폰 번호를 입력해주세요"
    //           maxLength={11}
    //           autoComplete="off"
    //           value={memId}
    //           onChange={(e) => dispatch(e.target)}
    //         />
    //         <button disabled={!btnState.memId} onClick={fetchSmsReq}>
    //           인증요청
    //         </button>
    //       </div>
    //       {validate.memId.text && <p className="help-text">{validate.memId.text}</p>}
    //     </InputItem>
    //     <InputItem button={true} validate={validate.auth.check}>
    //       <div className="layer">
    //         <label htmlFor="auth">인증번호</label>
    //         <input
    //           type="number"
    //           ref={authRef}
    //           id="auth"
    //           name="auth"
    //           placeholder="인증번호를 입력해주세요"
    //           autoComplete="off"
    //           value={auth}
    //           onChange={(e) => dispatch(e.target)}
    //           disabled={true}
    //         />
    //         <span className="timer">{timeText}</span>
    //         <button disabled={!btnState.auth} onClick={fetchSmsCheck}>
    //           인증확인
    //         </button>
    //       </div>
    //       {validate.auth.text && <p className="help-text">{validate.auth.text}</p>}
    //     </InputItem>

    //     {/* 비밀번호 ---------------------------------------------------------- */}
    //     <InputItem button={false} validate={validate.loginPwd.check}>
    //       <div className="layer">
    //         <label htmlFor="loginPwd">비밀번호</label>
    //         <input
    //           type="password"
    //           id="loginPwd"
    //           name="loginPwd"
    //           placeholder="8~20자 영문/숫자/특수문자 중 2가지 이상 조합"
    //           autoComplete="off"
    //           maxLength={20}
    //           value={loginPwd}
    //           onChange={(e) => dispatch(e.target)}
    //         />
    //       </div>
    //       {validate.loginPwd.text && <p className="help-text">{validate.loginPwd.text}</p>}
    //     </InputItem>
    //     <InputItem button={false} validate={validate.loginPwdCheck.check}>
    //       <div className="layer">
    //         <label htmlFor="loginPwdCheck">비밀번호 확인</label>
    //         <input
    //           type="password"
    //           id="loginPwdCheck"
    //           name="loginPwdCheck"
    //           placeholder="비밀번호를 한번 더 입력해주세요"
    //           autoComplete="off"
    //           maxLength={20}
    //           value={loginPwdCheck}
    //           onChange={(e) => dispatch(e.target)}
    //         />
    //       </div>
    //       {validate.loginPwdCheck.text && <p className="help-text">{validate.loginPwdCheck.text}</p>}
    //     </InputItem>

    //     <button className="submit-btn" onClick={passwordModify}>
    //       비밀번호 변경
    //     </button>
    //   </Content>
    // </Layout>
  )
}

const InputItem = styled.div`
  & + & {
    margin-top: 4px;
  }
  .layer {
    position: relative;
    height: 58px;
    letter-spacing: -0.5px;
    z-index: 1;

    label {
      display: block;
      position: relative;
      padding-top: 11px;
      color: #000;
      font-size: 12px;
      line-height: 12px;
      text-indent: 16px;
      z-index: 1;
    }

    input {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: ${(props) => (props.button ? 'calc(100% - 106px)' : 'calc(100% - 28px)')};
      padding: ${(props) => (props.button ? '22px 90px 2px 15px' : '22px 12px 2px 15px')};
      border-radius: 12px;
      border: 1px solid;
      border-color: ${(props) => (props.validate ? '#e0e0e0' : '#ec455f')};
      background: #fff;
      height: 32px;
      font-size: 16px;
      font-weight: 800;
      line-height: 32px;
      box-sizing: content-box;
    }

    input:focus {
      border-color: #000;
    }

    input::placeholder {
      font-size: 14px;
      color: #bdbdbd;
      font-weight: 400;
      letter-spacing: -0.5px;
    }

    input:disabled {
      background: #fff;
      color: #9e9e9e;
      opacity: 1;
    }

    input:focus {
      &::after {
        display: block;
        width: 100%;
        height: 100%;
        border: 1px solid #000;
        border-radius: 12px;
        content: '';
      }
    }

    .timer {
      position: absolute;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      right: 96px;
      top: 22px;
      font-size: 14px;
      font-weight: bold;
      color: #ec455f;
      z-index: 1;
    }

    button {
      display: inline-block;
      position: absolute;
      right: 4px;
      bottom: 4px;
      height: 32px;
      padding: 0 10px;
      border-radius: 9px;
      background: ${COLOR_MAIN};
      color: #fff;
      line-height: 32px;
      letter-spacing: -0.5px;

      :disabled {
        background: #bdbdbd;
      }
    }
  }

  .help-text {
    display: block;
    position: relative;
    margin-top: -17px;
    padding: 23px 12px 7px 12px;
    border-radius: 12px;
    color: #fff;
    font-size: 11px;
    line-height: 14px;
    background: #9e9e9e;
    text-align: center;
    z-index: 0;
  }
`
