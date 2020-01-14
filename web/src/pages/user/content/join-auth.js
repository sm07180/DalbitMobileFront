import React, {useState} from 'react'
import styled from 'styled-components'

//components
import Input from './input-type'

import Button from './style-button'

const JoinAuth = props => {
  return (
    <>
      <Content>
        <Input type="phone" />

        <Button text="인증번호 받기" joinState={props.joinState} update={props.update} />
      </Content>
    </>
  )
}

export default JoinAuth

const Content = styled.div``

const JoinText = styled.p`
  font-size: 14px;
  line-height: 1.5;
`

const FormWrap = styled.div`
  margin: 40px 0;
`
