import React from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Utility from 'components/lib/utility'
// static
import CheckOff from './static/check_off.svg'
import CheckOn from './static/check_on.svg'

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
      <div className="titlewrap" dangerouslySetInnerHTML={{__html: Utility.nl2br(title)}}></div>
    </label>
  </Wrap>
)
export default Checkbox

const Wrap = styled.div`
  margin-top: 32px;
  & label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    @media (max-width: ${WIDTH_MOBILE}) {
      font-size: 14px;
    }
    transform: skew(-0.03deg);
  }
  & input[type='checkbox'] {
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
      border: 1px solid #FF3C7B;

      &::before,
      &::after {
        background-color: #fff;
      }
    }
  }

  & .titlewrap {
    width: calc(100% - 28px);
    margin-left: 10px;
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: left;
    color: #000000;
  }
`
