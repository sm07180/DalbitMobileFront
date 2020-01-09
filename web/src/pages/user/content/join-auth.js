import React, {useState} from 'react'
import styled from 'styled-components'

import Label from './style-label'
import Input from './style-input'
import Button from './style-button'

const JoinAuth = props => {
  return (
    <>
      <JoinText>
        입력하신 번호는 안전하게 보관됩니다. <br />
        휴대폰 번호 인증 후 새로운 비밀번호로 재등록 하셔야 합니다.
      </JoinText>

      <FormWrap>
        <Label text="휴대전화" for="phone" />
        <Input type="text" placeholder="휴대폰 번호를 입력해주세요" id="phone" />
        <Button text="인증번호 받기" joinState={props.joinState} update={props.update} />
      </FormWrap>
    </>
  )
}

export default JoinAuth

const JoinText = styled.p`
  font-size: 14px;
  line-height: 1.5;
`

const FormWrap = styled.div`
  margin: 40px 0;
`
