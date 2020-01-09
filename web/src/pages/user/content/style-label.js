import React, {useState} from 'react'
import styled from 'styled-components'

export default props => {
  return (
    <>
      <Label before={props.before}>{props.text}</Label>
    </>
  )
}

const Label = styled.label`
  display:block;
  position: relative;
  padding: 10px 0 10px 5px;
  font-size: 14px;
  line-height: 1.2;

  &:before {
    position:absolute;
    left:-3px;
    top:11px;
    color:#ec0000;
    content: '${props => (props.before ? '*' : '')}'; 
  }
`
