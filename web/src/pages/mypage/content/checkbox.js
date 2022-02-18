import React from 'react'
import styled from 'styled-components'
import CheckPurple from '../component/ic_check_purple.svg'
import CheckGray from '../component/ic_check_gray.svg'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
const Checkbox = ({fnClick, fnChange, title = '', checked = false}) => (
  <Wrap>
    <label>
      <input
        onClick={(e) => {
          if (fnClick !== undefined) fnClick(e.target.checked)
        }}
        onChange={(e) => {
          if (fnChange !== undefined) fnChange(e.target.checked)
        }}
        type="checkbox"
        checked={checked}
        className={checked ? 'on' : ''}
      />
      <div className="titlewrap">{title}</div>
    </label>
  </Wrap>
)
export default Checkbox

const Wrap = styled.div`
  margin: 24px 0;
  & label {
    display: flex;
    color: #000;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    transform: skew(-0.03deg);
  }
  & input {
    display: block;
    width: 20px;
    height: 20px;
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

      &::before,
      &::after {
        background-color: #fff;
      }
    }
  }
  & .titlewrap {
    margin-left: 8px;
    letter-spacing: -0.35px;
    @media (max-width: ${WIDTH_MOBILE}) {
      max-width: 90%;
    }
    @media (max-width: ${WIDTH_MOBILE_S}) {
      max-width: 92.22%;
    }
  }
`
