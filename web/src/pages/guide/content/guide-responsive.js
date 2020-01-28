/**
 * @title 반응형 가이드
 */
import React, {useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from '../store'
import {WIDTH_PC, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'Context/config'

export default () => {
  //---------------------------------------------------------------------
  const store = useContext(Context)
  console.log(store)
  //---------------------------------------------------------------------
  return (
    <Content>
      반응형 가이드 입니다.
      <ResponsiveWrap>
        <p className="pc">WIDTH_PC</p>
        <p className="tab">WIDTH_TABLET</p>
        <p className="mobile">WIDTH_MOBILE</p>
        <p className="mobile-s">WIDTH_MOBILE_S</p>
      </ResponsiveWrap>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div``

const ResponsiveWrap = styled.div`
  width: 100%;
  height: 500px;
  background: #92fff0;

  .tab,
  .mobile,
  .mobile-s {
    display: none;
  }

  @media (max-width: ${WIDTH_TABLET}) {
    background: #a392ff;
    .tab {
      display: block;
    }
    .pc,
    .mobile,
    .mobile-s {
      display: none;
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    background: #ffc992;
    .mobile {
      display: block;
    }
    .pc,
    .tab,
    .mobile-s {
      display: none;
    }
  }

  @media (max-width: ${WIDTH_MOBILE_S}) {
    background: #ff9292;
    .mobile-s {
      display: block;
    }
    .pc,
    .tab,
    .mobile {
      display: none;
    }
  }
`
