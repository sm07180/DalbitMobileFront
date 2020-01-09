import React, {useState} from 'react'
import styled from 'styled-components'

export default props => {
  return (
    <>
      <Button
        onClick={() => {
          props.update(true)
        }}>
        {props.text}
      </Button>
    </>
  )
}

const Button = styled.button`
  display: block;
  width: 100%;
  margin-top: 30px;
  border-radius: 5px;
  background: #5a7eff;
  color: #fff;
  line-height: 50px;
`

const SubmitButton = styled(Button)`
  margin-top: 10px;
`
