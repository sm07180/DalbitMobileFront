/**
 * @file
 * @todo
 * @state
 */

import React, {useState} from 'react'
import styled from 'styled-components'

//정규식

const makeInput = props => {
  const selectInputType = () => {
    switch (props.type) {
      case 'nickname':
        return {
          type: 'text',
          text: '2~20자 한글/영문/숫자를 포함할 수 있습니다.'
        }
      case 'name':
        return {
          type: 'text',
          text: '2~10자 한글만 사용이 가능 합니다.'
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
      <Input id={props.type} type={selectInputType().type}></Input>
      <HelpText>{selectInputType().text}</HelpText>
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
