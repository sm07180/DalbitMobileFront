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
  & input {
    display: block;
    width: 24px !important;
    height: 24px;
    background: url(${CheckOff});
    cursor: pointer;
    &.on {
      background: url(${CheckOn});
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
