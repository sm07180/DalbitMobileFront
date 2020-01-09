import React, {useState} from 'react'
import styled from 'styled-components'

import Label from './style-label.js'

const JoinAuth = props => {
  return (
    <>
      <JoinText>
        입력하신 번호는 안전하게 보관됩니다. <br />
        휴대폰 번호 인증 후 새로운 비밀번호로 재등록 하셔야 합니다.
      </JoinText>

      <FormWrap>
        <Label>휴대전화</Label>
        <Input type="text" placeholder="휴대폰 번호를 입력해주세요" />
        <Button
          onClick={() => {
            props.update(true)
          }}>
          인증번호 받기
        </Button>
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

const Input = styled.input`
  display: block;
  width: 100%;
  border: 1px solid #dadada;
  border-radius: 5px;
  color: #555;
  line-height: 48px;
  text-indent: 10px;
`

const Button = styled.button`
  display: block;
  width: 100%;
  margin-top: 10px;
  border-radius: 5px;
  background: #5a7eff;
  color: #fff;
  line-height: 50px;
`

const SubmitButton = styled(Button)`
  margin-top: 10px;
`
