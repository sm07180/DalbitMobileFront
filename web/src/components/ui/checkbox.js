import React, {useState} from 'react'

import styled from 'styled-components'
import {IMG_SERVER} from 'context/config'
export default props => {
  const [check, setCheck] = useState(false)
  const ToggleCheck = () => {
    check ? setCheck(false) : setCheck(true)
  }

  return (
    <>
      <CheckWrap>
        <input type="checkbox" value={check} onClick={ToggleCheck} type="checkbox" className={check === true ? 'on' : 'off'} />
      </CheckWrap>
    </>
  )
}

const CheckWrap = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  & input {
    width: 100%;
    height: 100%;
    appearance: none;
    border: none;
    outline: none;
    cursor: pointer;
    background: #fff url(${IMG_SERVER}/images/api/ico-checkbox-off.png) no-repeat center center / cover;
    &.on {
      background: #8556f6 url(${IMG_SERVER}/images/api/ico-checkbox-on.png) no-repeat center center / cover;
    }
  }
`
