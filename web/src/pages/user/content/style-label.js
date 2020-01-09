/**
 * @file
 * @todo 폼에 들어가는 라벨 태그
 * @state before : true 일시 필수 값 표시 (*)
 */
import React, {useState} from 'react'
import styled from 'styled-components'

export default props => {
  return <Label {...props}>{props.text || '라벨'}</Label>
}

const Label = styled.label`
  display:block;
  position: relative;
  margin-top:20px;
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
