import React, {useState} from 'react'
import styled from 'styled-components'

import Label from './style-label'
import Input from './style-input'

const JoinForm = () => {
  return (
    <>
      <JoinText>
        입력하신 번호는 안전하게 보관됩니다. <br />
        휴대폰 번호 인증 후 새로운 비밀번호로 재등록 하셔야 합니다.
      </JoinText>

      <FormWrap>
        <Label before={true} text="닉네임" />
        <Input type="text" placeholder="닉네임을 입력해주세요." />
        <Label before={true} text="이름(실명)" />
        <Input type="text" placeholder="." />
        <Label before={true} text="비밀번호" />
      </FormWrap>
    </>
  )
}

export default JoinForm

const JoinText = styled.p`
  font-size: 14px;
  line-height: 1.5;
`

const FormWrap = styled.div`
  margin: 40px 0;
`
