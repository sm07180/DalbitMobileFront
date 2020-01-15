/**
 * @file input component
 * @brief 각 input에 type 값을 입력하여 매치하는 component
 * @todo
 * @props type 종류
 *        nickname : 닉네임
 *        name : 이름(실명)
 *        password : 비밀번호
 *        phone : 휴대전화
 * @state
 */

import React, {useState} from 'react'
import styled from 'styled-components'

//material-ui
import {StylesProvider} from '@material-ui/styles'
import TextField from '@material-ui/core/TextField'

const makeInput = props => {
  const [nickNameState, setNickNameState] = useState({
    NicknameEntered: '',
    isNameValid: 0 // 0: 기본, 1: 성공, 2 ~ : 실패
  })

  const [nameState, setNameState] = useState({
    nameEntered: '',
    isNameValid: 0
  })

  const [pwdState, setPwdState] = useState({
    pwdEntered: '',
    isPwdValid: 0
  })

  const [pwdCheckState, setPwdCheckState] = useState({
    pwdCheckEntered: '',
    isPwdCheckValid: 0
  })

  const [phoneState, setPhoneState] = useState({
    phoneEntered: '',
    isPhoneValid: 0
  })

  const validateNickName = nameEntered => {
    if (nameEntered.length > 1 && nameEntered.length < 21) {
      setNickNameState({
        isNameValid: 1
      })
    } else if (nameEntered.length == 0) {
      setNickNameState({
        isNameValid: 0
      })
    } else {
      setNickNameState({
        isNameValid: 2
      })
    }
  }

  const validateName = nameEntered => {
    if (nameEntered.length > 1 && nameEntered.length < 11) {
      setNameState({
        isNameValid: 1
      })
    } else if (nameEntered.length == 0) {
      setNameState({
        isNameValid: 0
      })
    } else {
      setNameState({
        isNameValid: 2
      })
    }
  }

  const validatePwd = pwdEntered => {
    if (pwdEntered.length > 7 && pwdEntered.length < 21) {
      setPwdState({
        isPwdValid: 1
      })
    } else if (pwdEntered.length == 0) {
      setPwdState({
        isPwdValid: 0
      })
    } else {
      setPwdState({
        isPwdValid: 2
      })
    }
  }

  const validatePwdCheck = pwdCheckEntered => {}

  const validatePhone = phoneEntered => {
    const phoneNumberRegExp = /^\d{3}-\d{3,4}-\d{4}$/
    if (phoneEntered.match(phoneNumberRegExp)) {
      setPhoneState({
        isPhoneValid: 1
      })
    } else {
      setPhoneState({
        isPhoneValid: 2
      })
    }
  }

  // input 아래 도움말 텍스트 컬러
  const textColor = vaildState => {
    if (vaildState > 1) {
      return 'red'
    } else if (vaildState === 1) {
      return 'green'
    } else {
      return 'common'
    }
  }

  const addPwdCheck = () => {
    const text = ['', '*비밀번호가 일치합니다.', '*비밀번호가 일치하지 않습니다.']
    if (props.type === 'password') {
      return (
        <>
          <Input
            id={props.type}
            type={selectInputType().type}
            placeholder="비밀번호 확인"
            onChange={e => {
              selectInputType().validate(e.target.value)
            }}></Input>
          <HelpText className={textColor(selectInputType().isValied)}>{selectInputType().text[selectInputType().isValied]}</HelpText>
        </>
      )
    }
  }

  const selectInputType = () => {
    switch (props.type) {
      case 'nickname':
        return {
          type: 'text', // input 태그 type
          title: '닉네임', // label 태그에 들어갈 text
          required: true, // 폼에 필수 값인지 아닌지 여부
          placeholder: '닉네임을 입력해주세요', // input 태그 placeholder
          text: ['*2~20자 한글/영문/숫자를 포함할 수 있습니다.', '*사용 가능한 닉네임입니다.', '실패1'], // input 박스 아래에 표시될 안내 텍스트
          validate: function(targetValue) {
            // 유효성 검사 function
            validateNickName(targetValue)
          },
          isValied: nickNameState.isNameValid // 유효성 체크 결과 state
        }
      case 'name':
        return {
          type: 'text',
          title: '이름(실명)',
          required: true,
          placeholder: '이름을 입력해주세요',
          text: ['*2~10자 한글만 사용이 가능 합니다.', '*사용이 가능한 이름 입니다.', '실패1'],
          validate: function(targetValue) {
            validateName(targetValue)
          },
          isValied: nameState.isNameValid
        }
      case 'password':
        return {
          type: 'password',
          title: '비밀번호',
          required: true,
          placeholder: '비밀번호를 입력해주세요',
          text: ['* 8~20자로 영문/숫자/특수문자 중 2가지 이상 조합으로 입력하세요.(대소문자 구분)', '*사용이 가능한 비밀번호입니다.', '실패1'],
          validate: function(targetValue) {
            validatePwd(targetValue)
          },
          isValied: pwdState.isPwdValid
        }
      case 'phone':
        return {
          type: 'text',
          title: '휴대전화',
          required: true,
          placeholder: '휴대폰 번호를 입력해주세요',
          text: ['기본', '성공', '숫자만 입력이 가능합니다'],
          validate: function(targetValue) {
            validatePhone(targetValue)
          },
          isValied: phoneState.isPhoneValid
        }
      default:
        return {
          type: 'text',
          title: '타이틀',
          required: true,
          placeholder: 'placeholder',
          text: ['', '', '']
        }
    }
  }

  return (
    <StylesProvider injectFirst>
      <Inputwrap>
        <Label htmlFor={props.type} className={selectInputType().required ? 'required' : ''}>
          {selectInputType().title}
        </Label>
        <Input
          id={props.type}
          type={selectInputType().type}
          placeholder={selectInputType().placeholder}
          onChange={e => {
            selectInputType().validate(e.target.value)
          }}></Input>
        <HelpText className={textColor(selectInputType().isValied)}>{selectInputType().text[selectInputType().isValied]}</HelpText>
        {addPwdCheck()}
      </Inputwrap>
    </StylesProvider>
  )
}

export default makeInput

const Input = styled(TextField)`
  display: block;
  width: 100%;
  border: 1px solid #888;
  line-height: 36px;
  text-indent: 10px;
`

// const Input = styled(TextField)({
//   width: '100%',
//   border: '1px solid #888',
//   lineHeight: '36px',
//   textIndent: '10px'
// })

const Inputwrap = styled.div`
  margin: 20px 0;
`

const Label = styled.label`
  font-size: 13px;

  &.required:before {
    content: '*';
  }
`

const HelpText = styled.p`
  font-size: 12px;
  &.common {
    color: #666;
  }
  &.red {
    color: red;
  }
  &.green {
    color: green;
  }
`
