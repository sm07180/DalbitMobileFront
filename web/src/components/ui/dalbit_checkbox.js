import React from 'react'
import styled from 'styled-components'

export function DalbitCheckbox(props) {
  const {status, callback, size, bgColor} = props
  return (
    <DalbitCheckboxWrap
      type="checkbox"
      size={size}
      bgColor={bgColor}
      className={`${status === true ? 'on' : 'off'}`}
      onChange={callback}
    />
  )
}

DalbitCheckbox.defaultProps = {
  bgColor: '#FF3C7B',
  size: 20
}

export default DalbitCheckbox

const DalbitCheckboxWrap = styled.input`
  width: ${(props) => (props.size ? `${props.size}px` : '20px')};
  height: ${(props) => (props.size ? `${props.size}px` : '20px')};
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  appearance: none;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #9e9e9e;
  background-color: #ffffff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &.on.on {
    display: inline-block;
  }

  &::before {
    content: '';
    position: absolute;
    width: 13%;
    height: 50%;
    top: 25%;
    left: 57%;
    background-color: #9e9e9e;
    -ms-transform: rotate(45deg); /* IE 9 */
    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
    transform: rotate(45deg);
    border-radius: 10px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 40%;
    height: 13%;
    background-color: #9e9e9e;
    top: 50%;
    left: 17%;
    -ms-transform: rotate(45deg); /* IE 9 */
    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
    transform: rotate(45deg);
    border-radius: 10px;
  }

  &.on {
    border-color: #fff;
    background-color: ${(props) => (props.bgColor ? `${props.bgColor}` : '#FF3C7B')};
    transition: 0.2s all ease 0s;
    border: 1px solid #FF3C7B;

    &::before,
    &::after {
      background-color: #fff;
    }
  }
`
