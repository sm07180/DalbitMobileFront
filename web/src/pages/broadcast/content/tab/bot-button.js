import React from 'react'
import styled from 'styled-components'

const BotButton = props => {
  console.log('## props : ', props)
  return (
    <Button
      background={props.background}
      borderColor={props.borderColor}
      color={props.color}
      onClick={props.callback ? () => props.callback() : console.log()}
      width={props.width}
      heigth={props.heigth}>
      {props.title}
    </Button>
  )
}

const Button = styled.button`
  width: ${props => (props.width ? props.width.toString() + 'px' : '48%')};
  height: ${props => (props.height ? props.height.toString() + 'px' : '5vh')};
  background-color: ${props => (props.background ? props.background : '#fff')};
  border-radius: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.borderColor ? props.borderColor : '#fff')};
  color: ${props => (props.color ? props.color : '')};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.13;
  letter-spacing: -0.4px;
`
export {BotButton}
