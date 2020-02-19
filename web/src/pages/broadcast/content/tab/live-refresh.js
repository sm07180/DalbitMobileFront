import React, {useState} from 'react'
import {WIDTH_MOBILE} from 'context/config'
import styled from 'styled-components'

export default props => {
  return (
    <>
      <Wrap>
        <button></button>
        <p>새로고침</p>
      </Wrap>
    </>
  )
}
const Wrap = styled.div`
  display: flex;
  width: 33.33%;
  margin-left: 12px;
  align-items: center;
  & button {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url('https://devimage.dalbitcast.com/images/api/ic_refresh.png') no-repeat center center / cover;
  }
  & p {
    margin-left: 6px;
    color: #bdbdbd;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
`
