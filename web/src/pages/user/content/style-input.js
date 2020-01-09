import React, {useState} from 'react'
import styled from 'styled-components'

export default props => {
  return (
    <>
      <Input type={props.type} placeholder={props.placeholder}></Input>
    </>
  )
}

const Input = styled.input.attrs(props => ({}))`
  display: block;
  width: 100%;
  border: 1px solid #dadada;
  border-radius: 5px;
  color: #555;
  line-height: 48px;
  text-indent: 10px;

  & + label {
    margin-top: 20px;
  }
`
