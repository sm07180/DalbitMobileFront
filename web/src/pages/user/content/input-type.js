/**
 * @file
 * @todo
 * @props
 * @state
 */

import React, {useState} from 'react'
import styled from 'styled-components'

const makeInput = props => {
  const [nickNameState, setNickNameState] = useState({
    NicknameEntered: '',
    isNameValid: false
  })

  const [nameState, setNameState] = useState({
    nameEntered: '',
    isNameValid: false
  })

  const validateNickName = nameEntered => {
    if (nameEntered.length > 1 && nameEntered.length < 21) {
      setNickNameState({
        isNameValid: true
      })
    } else {
      setNickNameState({
        isNameValid: false
      })
    }
  }

  const validateName = nameEntered => {
    if (nameEntered.length > 1 && nameEntered.length < 11) {
      setNameState({
        isNameValid: true
      })
    } else {
      setNameState({
        isNameValid: false
      })
    }
  }

  const selectInputType = () => {
    switch (props.type) {
      case 'nickname':
        return {
          type: 'text',
          text: '2~20자 한글/영문/숫자를 포함할 수 있습니다.',
          validate: function(targetValue) {
            validateNickName(targetValue)
          },
          isValied: nickNameState.isNameValid
        }
      case 'name':
        return {
          type: 'text',
          text: '2~10자 한글만 사용이 가능 합니다.',
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
      <Label htmlFor={props.type} className={props.required ? 'required' : ''}>
        {props.title}
      </Label>
      <Input
        id={props.type}
        type={selectInputType().type}
        onChange={e => {
          selectInputType().validate(e.target.value)
        }}></Input>
      <HelpText>{selectInputType().text}</HelpText>
      <p>값 유효성 검사 결과 : {selectInputType().isValied ? '통과' : '실패'}</p>
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
  color: #666;
`
