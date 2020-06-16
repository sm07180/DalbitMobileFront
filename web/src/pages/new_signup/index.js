import React, { useState, useEffect, useContext, useReducer } from 'react'
import styled from 'styled-components'

import { Context } from 'context'
import Api from 'context/api'
import { COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P } from 'context/color'

//components
import Layout from 'pages/common/layout/new_layout'

export default props => {
  const context = useContext(Context)

  function reducer(state, action) {
    console.log(action)
    return {
      ...state,
      [action.name]: action.value
    }
  }

  const [changes, dispatch] = useReducer(reducer, {
    memId: '',
    loginPwd: '',
    loginPwdCheck: '',
    nickNm: '',
    birth: '',
    gender: 'n',
    image: '',
    memType: 'p',
    allTerm: 'n',
    term1: 'n',
    term2: 'n',
    term3: 'n',
    term4: 'n',
    auth: '',
    CMID: ''
  })

  function validateReducer(state, validate) {
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
      check: false,
      text: ''
    },
    auth: {
      check: false,
      text: ''
    },
    loginPwd: {
      check: false,
      text: ''
    },
    loginPwdCheck: {
      check: false,
      text: ''
    },
    nickNm: {
      check: false,
      text: ''
    },
    birth: {
      check: false,
      text: ''
    },
    term: {
      check: false,
      text: ''
    },
    time: {
      check: false,
      text: ''
    },
    memIdBtn: {
      check: false,
      text: ''
    },
    authBtn: {
      check: false,
      text: ''
    }
  })

  const [profileImg, setPrifileImg] = useState('')

  const {
    memId,
    loginPwd,
    loginPwdCheck,
    nickNm,
    birth,
    gender,
    image,
    memType,
    allTerm,
    term1,
    term2,
    term3,
    term4,
    auth,
    CMID
  } = changes

  const onChange = e => {
    switch (e.target.name) {
      case 'memId':
        validateID(e.target)
        break

      default:
        dispatch(e.target)
        break
    }
  }

  //------------------------------------------------------------------------------
  //휴대폰 본인인증 관련
  const validateID = target => {
    dispatch({ name: 'memId', value: target.value })
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    const memIdVal = target.value
    if (memIdVal !== undefined) {
      if (memIdVal.length >= 11) {
        if (!rgEx.test(memIdVal)) {
          setValidate({
            name: 'memId',
            check: false,
            text: '올바른 휴대폰 번호가 아닙니다.'
          })
        } else {
          setValidate({
            name: 'memId',
            check: true
          })
        }
      } else if (memIdVal.length < 12) {
        //벨리데이션 통과 후 버튼이 인증요청으로 바뀐다.
        setValidate({
          name: 'memId',
          check: false
        })
      }
    }
  }

  const validateAuth = target => {
    dispatch({ name: 'auth', value: target.value })
    const authVal = target.value
    if (authVal.length === 6) {
      if (CMID) {
        //버튼 활성화 xx
      }
    } else if (authVal.length > 6) {
    }
  }

  async function fetchAuth() {
    const { result, data, message } = await Api.sms_request({
      data: {
        phoneNo: memId,
        authType: 0
      }
    })
    if (result === 'success') {
      dispatch({ name: 'CMID', value: data.CMID })
      setValidate({
        name: 'memId',
        check: true,
        text: '인증번호 요청이 완료되었습니다.'
      })
    } else {
      setValidate({ name: 'memId', check: false, text: message })
      context.action.alert({
        msg: message
      })
    }
  }

  useEffect(() => {}, [])

  return (
    <Layout status="no_gnb" header="회원가입">
      <Content>
        {/* 휴대폰 본인인증 -------------------------------------------------------- */}
        <InputItem button={true} validate={validate.memId.check}>
          <div className="layer">
            <label htmlFor="memId">휴대폰 번호</label>
            <input
              type="tel"
              id="memId"
              name="memId"
              placeholder="휴대폰 번호를 입력해주세요"
              maxLength={11}
              autoComplete="off"
              value={memId}
              onChange={onChange}
            />
            <button disabled={!validate.memId.check} onClick={fetchAuth}>
              인증요청
            </button>
          </div>
          {validate.memId.text && (
            <p className="help-text">{validate.memId.text}</p>
          )}
        </InputItem>
        <InputItem button={true} validate={true}>
          <div className="layer">
            <label htmlFor="auth">인증번호</label>
            <input
              type="number"
              id="auth"
              placeholder="인증번호를 입력해주세요"
            />
            <button disabled={true}>인증확인</button>
          </div>
          <p className="help-text"></p>
        </InputItem>

        {/* 프로필 사진 ---------------------------------------------------------- */}
      </Content>
    </Layout>
  )
}

const Content = styled.section`
  padding: 12px 16px;
`

const InputItem = styled.div`
  & + & {
    margin-top: 4px;
  }
  .layer {
    position: relative;
    padding: 4px;
    border-radius: 12px;
    border: 1px solid;
    border-color: ${props => (props.validate ? '#e0e0e0' : '#ec455f')};
    background: #fff;
    letter-spacing: -0.5px;

    label {
      display: block;
      padding-top: 5px;
      color: #000;
      font-size: 12px;
      line-height: 12px;
      text-indent: 12px;
    }

    input {
      display: block;
      width: 100%;
      padding-left: 12px;
      padding-right: ${props => (props.button ? '90px' : '12px')};
      height: 32px;
      font-size: 16px;
      font-weight: 800;
      line-height: 32px;
    }

    input::placeholder {
      font-size: 14px;
      color: #bdbdbd;
      font-weight: 400;
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
    display: ${props => (props.validate ? 'none' : 'block')};
    margin-top: -17px;
    padding: 23px 12px 7px 12px;
    border-radius: 12px;
    color: #fff;
    font-size: 11px;
    line-height: 14px;
    background: #9e9e9e;
    text-align: center;
  }
`
