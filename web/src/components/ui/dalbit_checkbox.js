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
  bgColor: '#632beb',
  size: 24
}

export default DalbitCheckbox

const DalbitCheckboxWrap = styled.input`
  width: ${(props) => (props.size ? `${props.size}px` : '24px')};
  height: ${(props) => (props.size ? `${props.size}px` : '24px')};
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  appearance: none;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::before {
    content: '';
    position: absolute;
    width: 13%;
    height: 50%;
    top: 25%;
    left: 57%;
    background-color: #e0e0e0;
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
    background-color: #e0e0e0;
    top: 50%;
    left: 17%;
    -ms-transform: rotate(45deg); /* IE 9 */
    -webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
    transform: rotate(45deg);
    border-radius: 10px;
  }

  &.on {
    border-color: #fff;
    background-color: ${(props) => (props.bgColor ? `${props.bgColor}` : '#632beb')};
    transition: 0.2s all ease 0s;

    &::before,
    &::after {
      background-color: #fff;
    }
  }
`
