/**
 * @file /components/ui/noResult.js
 * @brief 결과 값 없을때 쓰는 공통 ui
 */

import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import _ from 'lodash'

export default props => {
  const [text, setText] = useState('조회된 결과가 없습니다.')

  useEffect(() => {
    if (_.hasIn(props, 'text')) {
      setText(props.text)
    }
  }, [])
  return (
    <NoResult className={props.className}>
      <span>{text}</span>
    </NoResult>
  )
}

//---------------------------------------------------------------------
//styled

const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100% !important;
  margin-top:30px;
  padding-top:170px;
  background: url('${IMG_SERVER}/images/api/img_noresult.png') no-repeat center top;
  background-size: 208px 158px !important;

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 282px;
    height: 26px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.25;
    letter-spacing: -0.6px;
    color: #616161;
    transform:skew(-0.03deg);
  }

  /* &.mobile{
    margin-top:0;
    padding-top:104px;
    background-size:162px !important;
    & > span{
      margin-top:20px;
      font-size:14px;
      transform:skew(-0.03deg);
    }
  } */
`
