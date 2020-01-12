/**
 * @file input component
 * @brief 각 input에 type 값을 입력하여 매치하는 component
 * @todo
 * @props type 종류
 *        nickname : 닉네임
 *        name : 이름(실명)
 * @state
 */

import React, {useState} from 'react'
import styled from 'styled-components'

const makeInput = props => {
  const [nickNameState, setNickNameState] = useState({
    NicknameEntered: '',
    isNameValid: 0 // 0: 기본, 1: 성공, 2 ~ : 실패
  })

  const [nameState, setNameState] = useState({
    nameEntered: '',
    isNameValid: 0
  })

  const validateNickName = nameEntered => {
    if (nameEntered.length > 1 && nameEntered.length < 21) {
      setNickNameState({
        isNameValid: 1
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

  const selectInputType = () => {
    switch (props.type) {
      case 'nickname':
        return {
          type: 'text', // input 태그 type
          title: '닉네임', // label 태그에 들어갈 text
          required: true, // 폼에 필수 값인지 아닌지 여부
          placeholder: '닉네임을 입력해주세요', // input 태그 placeholder
          text: '2~20자 한글/영문/숫자를 포함할 수 있습니다.', // input 박스 아래에 표시될 안내 텍스트 초기값
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
          // text: '2~10자 한글만 사용이 가능 합니다.',
          text: ['기본', '성공', '실패1'],
          validate: function(targetValue) {
            validateName(targetValue)
          },
          isValied: nameState.isNameValid
        }
      default:
        break
    }
  }

  return (
    <Inputwrap>
      <Label htmlFor={props.type} className={selectInputType().required ? 'required' : ''}>
        {selectInputType().title}
      </Label>
      <Input
        id={props.type}
        type={selectInputType().type}
        onChange={e => {
          selectInputType().validate(e.target.value)
        }}></Input>
      <HelpText className={textColor(selectInputType().isValied)}>{selectInputType().text[nameState.isNameValid]}</HelpText>
    </Inputwrap>
  )
}

export default makeInput

const Inputwrap = styled.div`
  margin: 20px 0;
`

const Label = styled.label`
  font-size: 13px;

  &.required:before {
    content: '*';
  }
`

const Input = styled.input`
  display: block;
  width: 100%;
  border: 1px solid #888;
  line-height: 36px;
  text-indent: 10px;
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
