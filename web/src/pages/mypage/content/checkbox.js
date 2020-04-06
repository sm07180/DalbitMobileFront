import React from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
const Checkbox = ({fnClick, fnChange, title = '', checked = false}) => (
  <Wrap>
    <label>
      <input
        onClick={e => {
          if (fnClick !== undefined) fnClick(e.target.checked)
        }}
        onChange={e => {
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
    color: #616161;
    align-items: center;
    cursor: pointer;

    font-size: 16px;
    transform: skew(-0.03deg);
  }
  & input {
    display: block;
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/ico-checkbox-off.png) no-repeat center center/ cover;
    cursor: pointer;
    &.on {
      background: url(${IMG_SERVER}/images/api/ico-checkbox-on.png) no-repeat center center/ cover;
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
