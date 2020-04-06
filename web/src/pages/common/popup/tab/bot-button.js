import React from 'react'
import styled from 'styled-components'

const BotButton = props => {
  return (
    <Button
      background={props.background}
      borderColor={props.borderColor}
      color={props.color}
      onClick={props.clickEvent ? () => props.clickEvent() : console.log()}
      width={props.width}
      heigth={props.heigth}
      disabled={props.disabled}>
      {props.title}
    </Button>
  )
}

const LButton = props => {
  return (
    <LongButton
      background={props.background}
      borderColor={props.borderColor}
      color={props.color}
      onClick={props.clickEvent ? () => props.clickEvent() : console.log()}
      width={props.width}>
      {props.title}
    </LongButton>
  )
}

const Button = styled.button`
  width: ${props => (props.width ? props.width.toString() + 'px' : '48%')};
  height: ${props => (props.height ? props.height.toString() + 'px' : '48px')};
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

const LongButton = styled.button`
  display: flex;
  width: 100%;
  height: 48px;
  background: ${props => (props.background ? props.background : '#bdbdbd')};
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: -0.4px;
  align-items: center;
  justify-content: center;
`
export {BotButton, LButton}
